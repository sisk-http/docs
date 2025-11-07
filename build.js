#!/usr/bin/env node

/**
 * Sisk Documentation Build System
 * 
 * Unified build script that handles:
 * - Translation cleanup
 * - Documentation translation
 * - CSS compilation
 * - DocFX build and metadata generation
 * 
 * Usage:
 *   node build.js [command] [options]
 * 
 * Commands:
 *   clean              Clean modified translation files
 *   translate [lang]   Translate documentation (all or specific language)
 *   build              Build CSS and DocFX documentation
 *   all                Run everything (clean, translate, build) - default
 * 
 * Examples:
 *   node build.js                    # Run all tasks
 *   node build.js clean              # Clean translations only
 *   node build.js translate          # Translate all languages
 *   node build.js translate pt-br    # Translate Portuguese only
 *   node build.js build              # Build only
 */

const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// ============================================================================
// Configuration
// ============================================================================

const CONFIG = {
    targetDir: path.join(__dirname, 'docs'),

    translations: {
        "Russian": "ru",
        "Brazilian Portuguese": "pt-br",
        "Chinese Simplified": "cn",
        "Spanish": "es",
        "German": "de",
        "Japanese": "jp"
    },

    groqConfig: {
        apiUrl: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'openai/gpt-oss-20b',
        temperature: 0.1,
        topP: 0.75,
        maxTokens: 65536,
        rateLimitDelay: 500, // ms between requests
        retryMultiplier: 3
    }
};

// Create exclusion regex from translation codes
const exclusionRegex = new RegExp(
    `[\\\\/](${Object.values(CONFIG.translations).join('|')})[\\\\/]`,
    'i'
);

// ============================================================================
// Utilities
// ============================================================================

class Logger {
    static colors = {
        reset: '\x1b[0m',
        bright: '\x1b[1m',
        dim: '\x1b[2m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m'
    };

    static info(message) {
        console.log(`${this.colors.blue}[INFO]${this.colors.reset} ${message}`);
    }

    static success(message) {
        console.log(`${this.colors.green}[SUCCESS]${this.colors.reset} ${message}`);
    }

    static warning(message) {
        console.log(`${this.colors.yellow}[WARNING]${this.colors.reset} ${message}`);
    }

    static error(message) {
        console.error(`${this.colors.red}[ERROR]${this.colors.reset} ${message}`);
    }

    static step(message) {
        console.log(`\n${this.colors.cyan}${this.colors.bright}==> ${message}${this.colors.reset}`);
    }

    static detail(message) {
        console.log(`    ${this.colors.dim}${message}${this.colors.reset}`);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isDirectory(filePath) {
    try {
        return fs.statSync(filePath).isDirectory();
    } catch {
        return false;
    }
}

function enumerateMdFiles(dir) {
    const files = fs.readdirSync(dir);
    let mdFiles = [];

    for (const file of files) {
        const filePath = path.join(dir, file);

        if (isDirectory(filePath)) {
            mdFiles = mdFiles.concat(enumerateMdFiles(filePath));
        } else if (file.endsWith('.md') || file.endsWith('.yml')) {
            if (!exclusionRegex.test(filePath)) {
                mdFiles.push(filePath);
            }
        }
    }

    return mdFiles;
}

function splitMarkdownSections(content) {
    // Split by markdown headers (#, ##, ###)
    const headerRegex = /^(#{1,3})\s+.+$/gm;
    const sections = [];
    let lastIndex = 0;
    let match;

    // Find all header positions
    const matches = [];
    while ((match = headerRegex.exec(content)) !== null) {
        matches.push(match.index);
    }

    // If no headers found, return the entire content as one section
    if (matches.length === 0) {
        return [content];
    }

    // Split content at each header position
    for (let i = 0; i < matches.length; i++) {
        const start = matches[i];
        const end = i < matches.length - 1 ? matches[i + 1] : content.length;
        const section = content.substring(start, end);
        sections.push(section);
    }

    // Add any content before the first header as the first section
    if (matches[0] > 0) {
        const preContent = content.substring(0, matches[0]);
        sections.unshift(preContent);
    }

    return sections;
}

async function runCommand(command, description) {
    Logger.detail(`Running: ${command}`);

    return new Promise((resolve, reject) => {
        const child = spawn(command, [], {
            shell: true,
            stdio: 'inherit',
            cwd: __dirname
        });

        child.on('error', (error) => {
            Logger.error(`Failed to execute ${description}: ${error.message}`);
            reject(error);
        });

        child.on('close', (code) => {
            if (code === 0) {
                Logger.success(`${description} completed`);
                resolve();
            } else {
                Logger.error(`${description} failed with exit code ${code}`);
                reject(new Error(`Command failed with exit code ${code}`));
            }
        });
    });
}

// ============================================================================
// Translation Cleanup
// ============================================================================

async function getModifiedFiles() {
    try {
        const { stdout } = await execAsync('git ls-files -m');

        const modifiedFiles = stdout
            .trim()
            .split('\n')
            .filter(line => line.trim() !== '')
            .filter(line => !exclusionRegex.test(line))
            .filter(line => line.startsWith('docs/'))
            .filter(line => line.endsWith('.md') || line.endsWith('.yml'));

        return modifiedFiles;
    } catch (error) {
        Logger.warning('Could not get modified files from git. Skipping cleanup.');
        return [];
    }
}

async function cleanTranslations() {
    Logger.step('Cleaning Modified Translation Files');

    const modifiedFiles = await getModifiedFiles();

    if (modifiedFiles.length === 0) {
        Logger.info('No modified files to clean');
        return;
    }

    let cleanedCount = 0;
    const availableTranslations = Object.values(CONFIG.translations);

    for (const modifiedFile of modifiedFiles) {
        for (const translationCode of availableTranslations) {
            const translationPath = modifiedFile.replace('docs/', `docs/${translationCode}/`);

            if (fs.existsSync(translationPath)) {
                fs.unlinkSync(translationPath);
                Logger.detail(`Removed: ${translationPath}`);
                cleanedCount++;
            }
        }
    }

    Logger.success(`Cleaned ${cleanedCount} translation file(s)`);
}

// ============================================================================
// Translation System
// ============================================================================

function getTranslationPrompt(toLanguage, fileName, text) {
    return `You're translating a piece of documentation of the Sisk Framework, an .NET web-server written in C#. Translate the translation input text to ${toLanguage}.

Rules:
- You SHOULD translate texts, code comments, but not code symbols, variables or constants names.
- You MUST NOT translate script-header file names or language names.
- You MUST keep the same file structure, maintaining links targets, headers, codes and page title.
- You SHOULD NOT translate HTML tag names inside Markdown.
- You SHOULD NOT translate markdown warning boxes tags, such as [!TIP] or [!WARNING].
- You MUST keep absolute link targets (eg. links which points to "/spec" or starts with "https://...").
- You SHOULD ONLY translate YAML values, NOT the keys.
- You MUST NOT translate YAML keys.
- You MUST NOT alter the YAML file structure.
- You MUST reply ONLY with the translated text, no greetings, advices or comments.
- The translated text must follow the original input structure.

File name: ${fileName}
        
<translation-input>
${text}
</translation-input>`;
}

async function runInference(text) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        Logger.error('GROQ_API_KEY environment variable is not set');
        process.exit(1);
    }

    const response = await fetch(CONFIG.groqConfig.apiUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: CONFIG.groqConfig.model,
            messages: [{
                role: 'user',
                content: text
            }],
            stream: false,
            temperature: CONFIG.groqConfig.temperature,
            top_p: CONFIG.groqConfig.topP,
            reasoning_effort: 'low',
            max_completion_tokens: CONFIG.groqConfig.maxTokens,
        })
    });

    if (!response.ok) {
        const resJson = await response.json();

        if (resJson.error?.code === 'rate_limit_exceeded') {
            const retryAfter = (response.headers.get('Retry-After') || 10) * CONFIG.groqConfig.retryMultiplier;
            Logger.warning(`Rate limit exceeded! Retrying in ${retryAfter} seconds...`);
            await sleep(retryAfter * 1000);
            return await runInference(text);
        } else {
            Logger.error('Failed to translate the markdown file');
            console.error(resJson);
            throw new Error('Translation API error');
        }
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function translateDocumentation(targetLanguageCode = null) {
    Logger.step('Translating Documentation');

    const mdFiles = enumerateMdFiles(CONFIG.targetDir);
    Logger.info(`Found ${mdFiles.length} file(s) to process`);

    let translationsToProcess = CONFIG.translations;

    // Filter to specific language if requested
    if (targetLanguageCode) {
        const entry = Object.entries(CONFIG.translations).find(
            ([_, code]) => code === targetLanguageCode
        );

        if (!entry) {
            Logger.error(`Unknown language code: ${targetLanguageCode}`);
            Logger.info(`Available codes: ${Object.values(CONFIG.translations).join(', ')}`);
            process.exit(1);
        }

        translationsToProcess = { [entry[0]]: entry[1] };
        Logger.info(`Translating to: ${entry[0]} (${entry[1]})`);
    }

    let translatedCount = 0;

    for (const mdFile of mdFiles) {
        const fileContents = fs.readFileSync(mdFile, 'utf8');
        const fileName = mdFile.replace(CONFIG.targetDir, '');

        for (const [langName, langCode] of Object.entries(translationsToProcess)) {
            const translationPath = path.join(CONFIG.targetDir, langCode, fileName);
            const translationDir = path.dirname(translationPath);

            // Skip if translation already exists
            if (fs.existsSync(translationPath)) {
                continue;
            }

            try {
                const prompt = getTranslationPrompt(langName, fileName, fileContents);
                const translated = (await runInference(prompt))
                    .replaceAll('/docs/', `/docs/${langCode}/`);

                fs.mkdirSync(translationDir, { recursive: true });
                fs.writeFileSync(translationPath, translated, 'utf8');

                Logger.detail(`Translated: ${path.relative(__dirname, translationPath)}`);
                translatedCount++;

                // Rate limiting delay
                await sleep(CONFIG.groqConfig.rateLimitDelay);
            } catch (error) {
                Logger.error(`Failed to translate ${fileName} to ${langName}: ${error.message}`);
                throw error;
            }
        }
    }

    if (translatedCount === 0) {
        Logger.info('No files needed translation (all up to date)');
    } else {
        Logger.success(`Translated ${translatedCount} file(s)`);
    }
}

// ============================================================================
// Build System
// ============================================================================

async function buildCss() {
    Logger.step('Building CSS with Cascadium');
    await runCommand('cascadium build', 'CSS build');
}

async function buildDocFx() {
    Logger.step('Building DocFX Documentation');
    await runCommand('docfx --maxParallelism 1', 'DocFX build');
}

async function buildMetadata() {
    Logger.step('Generating DocFX Metadata');
    await runCommand('docfx metadata --outputFormat markdown --output _md', 'Metadata generation');
}

async function packJsonl() {
    Logger.step('Packing Documentation to JSONL');

    const packDir = path.join(__dirname, '_pack');

    // Create _pack directory if it doesn't exist
    if (!fs.existsSync(packDir)) {
        fs.mkdirSync(packDir, { recursive: true });
    }

    // Pack API documentation from _md
    const mdDir = path.join(__dirname, '_md');
    if (fs.existsSync(mdDir)) {

        const apiFiles = enumerateMdFiles(mdDir).filter(filePath => filePath.endsWith('.md'));
        const apiJsonlPath = path.join(packDir, 'api.jsonl');
        const apiLines = [];

        for (const filePath of apiFiles) {
            const content = fs.readFileSync(filePath, 'utf8');
            const relativePath = path.relative(mdDir, filePath).replace(/\\/g, '/');
            const tags = relativePath.split('/').filter(tag => !!tag);

            const jsonLine = JSON.stringify({
                docid: relativePath,
                text: content,
                __ref: null,
                __tags: tags
            });

            apiLines.push(jsonLine);
        }

        fs.writeFileSync(apiJsonlPath, apiLines.join('\n'), 'utf8');
        Logger.detail(`Created: api.jsonl with ${apiFiles.length} document(s)`);
    } else {
        Logger.warning('_md directory not found, skipping api.jsonl');
    }

    // Pack English documentation from docs
    const docsDir = path.join(__dirname, 'docs');
    if (fs.existsSync(docsDir)) {
        const allDocsFiles = enumerateMdFiles(docsDir);

        // Filter only English files (not in language subdirectories)
        const availableTranslationCodes = Object.values(CONFIG.translations);
        const englishFiles = allDocsFiles.filter(filePath => {
            const relativePath = path.relative(docsDir, filePath);
            const firstDir = relativePath.split(path.sep)[0];

            // Exclude if first directory is a translation code
            return !availableTranslationCodes.includes(firstDir);
        }).filter(filePath => filePath.endsWith('.md'));

        const docsJsonlPath = path.join(packDir, 'docs.jsonl');
        const docsLines = [];

        for (const filePath of englishFiles) {
            const content = fs.readFileSync(filePath, 'utf8');
            const relativePath = path.relative(docsDir, filePath).replace(/\\/g, '/');
            const tags = relativePath.split('/').filter(tag => !!tag);

            // Split content by markdown sections (headers #, ##, ###)
            const sections = splitMarkdownSections(content);

            // Create a JSONL entry for each non-empty section
            sections.forEach((section, index) => {
                if (section.trim()) {
                    const jsonLine = JSON.stringify({
                        docid: `${relativePath}:${index}`,
                        text: section,
                        __ref: relativePath,
                        __tags: tags
                    });

                    docsLines.push(jsonLine);
                }
            });
        }

        fs.writeFileSync(docsJsonlPath, docsLines.join('\n'), 'utf8');
        Logger.detail(`Created: docs.jsonl with ${docsLines.length} section(s) from ${englishFiles.length} file(s)`);
    } else {
        Logger.warning('docs directory not found, skipping docs.jsonl');
    }

    Logger.success('JSONL packing completed');
}

async function buildAll() {
    await buildCss();
    await buildDocFx();
    await buildMetadata();
    await packJsonl();
}

// ============================================================================
// Main Entry Point
// ============================================================================

async function showHelp() {
    console.log(`
Sisk Documentation Build System

Usage:
  node build.js [command] [options]

Commands:
  clean              Clean modified translation files
  translate [lang]   Translate documentation (all languages or specific)
  build              Build CSS and DocFX documentation
  pack-jsonl         Pack documentation to JSONL format
  all                Run everything (clean, translate, build) - default
  help               Show this help message

Language Codes:
  ${Object.entries(CONFIG.translations).map(([name, code]) => `${code.padEnd(6)} - ${name}`).join('\n  ')}

Examples:
  node build.js                    # Run all tasks
  node build.js clean              # Clean translations only
  node build.js translate          # Translate all languages
  node build.js translate pt-br    # Translate Brazilian Portuguese only
  node build.js build              # Build only
  node build.js pack-jsonl         # Pack documentation to JSONL

Environment Variables:
  GROQ_API_KEY    Required for translation - Groq API key for LLM inference
`);
}

async function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'all';
    const option = args[1];

    try {
        switch (command) {
            case 'clean':
                await cleanTranslations();
                break;

            case 'translate':
                await translateDocumentation(option);
                break;

            case 'build':
                await buildAll();
                break;

            case 'pack-jsonl':
                await packJsonl();
                break;

            case 'all':
                await cleanTranslations();
                await translateDocumentation();
                await buildAll();
                Logger.success('\n🎉 All tasks completed successfully!');
                break;

            case 'help':
            case '--help':
            case '-h':
                showHelp();
                break;

            default:
                Logger.error(`Unknown command: ${command}`);
                Logger.info('Run "node build.js help" for usage information');
                process.exit(1);
        }
    } catch (error) {
        Logger.error(`Build failed: ${error.message}`);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main();
}

// Export for use as module
module.exports = {
    cleanTranslations,
    translateDocumentation,
    buildCss,
    buildDocFx,
    buildMetadata,
    buildAll,
    packJsonl
};
