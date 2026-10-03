#!/usr/bin/env bun

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');

const ROOT = __dirname;
const CONTENT_DIR = path.join(ROOT, 'content');
const SOURCE_LANG = 'en';
const SOURCE_DIR = path.join(CONTENT_DIR, SOURCE_LANG);
const API_RAW_DIR = path.join(ROOT, '_api');
const API_CONTENT_DIR = path.join(SOURCE_DIR, 'api');
const API_DATA_FILE = path.join(ROOT, 'data', 'api.json');
const SITE_DIR = path.join(ROOT, '_site');
const PACK_DIR = path.join(ROOT, '_pack');
const CONFIG_FILE = path.join(ROOT, 'config.json');

const LANGUAGES = {
    'pt-br': 'Brazilian Portuguese',
    'es': 'Spanish',
    'de': 'German',
    'ru': 'Russian',
    'zh-cn': 'Chinese Simplified',
    'ja': 'Japanese'
};

const DEFAULT_TRANSLATION = {
    apiUrl: 'https://api.groq.com/openai/v1/chat/completions',
    apiKeyEnv: 'GROQ_API_KEY',
    model: 'openai/gpt-oss-120b',
    temperature: 0,
    maxTokens: 65536,
    concurrency: 3,
    maxRetries: 5
};

// Legacy DocFX language folders, kept so old translated URLs keep redirecting.
const LEGACY_FOLDERS = { 'zh-cn': 'cn', ja: 'jp' };

const API_GROUPS = {
    namespace: ['Namespaces', 'Classes', 'Structs', 'Interfaces', 'Enums', 'Delegates'],
    type: ['Constructors', 'Fields', 'Properties', 'Methods', 'Events', 'Operators']
};

const colors = { reset: '\x1b[0m', dim: '\x1b[2m', red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', cyan: '\x1b[36m' };

const log = {
    step: message => console.log(`\n${colors.cyan}==> ${message}${colors.reset}`),
    info: message => console.log(`    ${message}`),
    detail: message => console.log(`    ${colors.dim}${message}${colors.reset}`),
    success: message => console.log(`${colors.green}[OK]${colors.reset} ${message}`),
    warn: message => console.log(`${colors.yellow}[WARN]${colors.reset} ${message}`),
    error: message => console.error(`${colors.red}[ERROR]${colors.reset} ${message}`)
};

function run(command, args) {
    log.detail(`$ ${command} ${args.join(' ')}`);

    return new Promise((resolve, reject) => {
        const child = spawn(command, args, { cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32' });
        child.on('error', reject);
        child.on('close', code => code === 0 ? resolve() : reject(new Error(`${command} exited with code ${code}`)));
    });
}

function walk(dir, filter = () => true) {
    if (!fs.existsSync(dir)) return [];

    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return walk(full, filter);
        return filter(full) ? [full] : [];
    });
}

function toPosix(file) {
    return file.split(path.sep).join('/');
}

function parseFrontMatter(text) {
    const match = text.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!match) return { data: {}, body: text };
    return { data: Bun.YAML.parse(match[1]) || {}, body: match[2] };
}

function stringifyFrontMatter(data, body) {
    const lines = Object.entries(data)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .flatMap(([key, value]) => Array.isArray(value)
            ? [`${key}:`, ...value.map(item => `  - ${JSON.stringify(item)}`)]
            : [`${key}: ${typeof value === 'number' ? value : JSON.stringify(value)}`]);

    return `---\n${lines.join('\n')}\n---\n${body ? '\n' + body.trim() + '\n' : ''}`;
}

function sourcePages() {
    return walk(SOURCE_DIR, file => file.endsWith('.md'))
        .filter(file => !toPosix(path.relative(SOURCE_DIR, file)).startsWith('api/'))
        .map(file => toPosix(path.relative(SOURCE_DIR, file)));
}

function decodeHref(href) {
    return href.replace(/\\(.)/g, '$1');
}

function apiPathFromFile(file) {
    return decodeHref(file).replace(/\.md(#.*)?$/, '');
}

function convertXref(text, pages) {
    return text.replace(/<xref href="([^"]+)"[^>]*><\/xref>/g, (_, uid) => {
        const name = decodeURIComponent(uid).replace(/\(.*$/, '').replace(/`+\d*/g, '').replace(/\{.*$/, '');
        const target = name.replace(/\.#ctor$/, '.-ctor');
        const parent = target.split('.').slice(0, -1).join('.');
        const label = name.endsWith('.#ctor') ? name.split('.').slice(-2, -1)[0] : name.split('.').pop();

        if (pages.has(target)) return `[${label}](/api/${target})`;
        if (pages.has(parent)) return `[${label}](/api/${parent})`;
        if (/^(System|Microsoft)\./.test(target)) return `[${label}](https://learn.microsoft.com/dotnet/api/${target.toLowerCase()})`;
        return '`' + label + '`';
    });
}

function convertApiHtml(text) {
    return text
        .replace(/<pre>\s*<pre>(<code[^>]*>[\s\S]*?<\/code>)<\/pre><\/pre>/g, '<pre>$1</pre>')
        .replace(/<pre><code(?: class="lang-(\w+)")?>([\s\S]*?)<\/code><\/pre>/g, (_, lang, code) =>
            '\n```' + (lang || '') + '\n' + code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim() + '\n```\n')
        .replace(/<code class="(?:paramref|typeparamref)">([^<]*)<\/code>/g, '`$1`')
        .replace(/<code>([^<]*)<\/code>/g, '`$1`')
        .replace(/<a href="([^"]+)">([^<]*)<\/a>/g, '[`$2`]($1)')
        .replace(/<\/?p>/g, '\n')
        .replace(/\n{3,}/g, '\n\n');
}

// Turns DocFX member listings ("[Name](link)" or "`Field = 1`" followed by a
// description paragraph) into Markdown tables. Sections containing code are kept as-is.
function membersToTables(body) {
    const listHeading = /^#{2,3} (Namespaces|Classes|Structs|Interfaces|Enums|Delegates|Constructors|Fields|Properties|Methods|Events|Operators)$/;

    return body.split(/^(?=#{1,4} )/m).map(section => {
        const [heading, ...rest] = section.split('\n');
        if (!listHeading.test(heading.trim())) return section;

        const blocks = rest.join('\n').split(/\n\s*\n/).map(block => block.trim()).filter(Boolean);
        if (blocks.some(block => block.startsWith('```') || block.startsWith('|'))) return section;

        const rows = [];
        for (const block of blocks) {
            if (/^(\[[^\n]*\]\([^)\s]*\)|`[^`\n]+`)$/.test(block)) rows.push([block, '']);
            else if (rows.length) rows.at(-1)[1] += (rows.at(-1)[1] ? ' ' : '') + block.replace(/\s*\n\s*/g, ' ');
            else return section;
        }

        const cell = text => text.replace(/\|/g, '\\|');
        const table = rows.map(([name, description]) => `| ${cell(name)} | ${cell(description)} |`).join('\n');
        return `${heading}\n\n| Name | Description |\n| --- | --- |\n${table}\n\n`;
    }).join('');
}

function convertApiFile(file, typeIndex, pages) {
    const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    const heading = text.match(/^# <a id="[^"]*"><\/a> (\S+) (.+)$/m);
    if (!heading) throw new Error(`Unexpected API page format: ${file}`);

    const [, kind, rawName] = heading;
    const apiPath = path.basename(file, '.md');
    const name = decodeHref(rawName);
    const namespace = text.match(/^Namespace: \[([^\]]+)\]/m)?.[1] || (kind === 'Namespace' ? name : null);
    const assembly = text.match(/^Assembly: (.+?)\s*$/m)?.[1];

    let body = text
        .replace(/^# .*\n+/, '')
        .replace(/^Namespace: .*\n/m, '')
        .replace(/^Assembly: .*\n/m, '')
        .replace(/^(#+) <a id="([^"]*)"><\/a> (.*)$/gm, (_, level, id, text) =>
            `${level} ${text.replace(/\\([()[\]<>*_`#-])/g, '$1').replace(/</g, '&lt;')} {#${id}}`)
        .replace(/^ \[/gm, '[')
        .replace(/\]\(([^)\s]+?\.md)(\\?#[^)\s]*)?\)/g, (match, href, fragment) => /^[a-z]+:/i.test(href)
            ? match
            : `](/api/${apiPathFromFile(href)}${fragment ? decodeHref(fragment) : ''})`);

    body = membersToTables(convertApiHtml(convertXref(body, pages))).trim();

    const type = kind === 'Namespace'
        ? null
        : typeIndex.has(apiPath) ? apiPath : [...typeIndex].filter(t => apiPath.startsWith(t + '.')).sort((a, b) => b.length - a.length)[0] || null;

    const typeName = type?.split('.').pop();
    const title = !type || type === apiPath
        ? name
        : kind === 'Constructor' ? `${typeName} constructor` : `${typeName}.${name}`;

    const data = {
        title,
        linkTitle: title !== name ? name : undefined,
        description: body.match(/^(?!```|#|\[|`)[^\n]{20,}$/m)?.[0]?.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[`*]/g, '').slice(0, 200),
        apiKind: kind,
        apiPath,
        apiNamespace: kind === 'Namespace' ? apiPath : namespace,
        apiType: type,
        apiAssembly: assembly
    };

    return { kind, name, apiPath, text: stringifyFrontMatter(data, body) };
}

// DocFX's toc.yml lists, under each node, label-only items ("Classes", "Methods"...)
// followed by the pages of that group. Nested namespaces appear without a label.
function groupTocItems(items, labels, mapItem) {
    const groups = [];

    for (const item of items || []) {
        if (!item.href) {
            groups.push({ label: item.name, items: [] });
        } else if (groups.length && labels.includes(groups.at(-1).label)) {
            groups.at(-1).items.push(mapItem(item));
        }
    }

    return groups.filter(group => labels.includes(group.label) && group.items.length);
}

function buildApiTree(tocFile, kinds) {
    const namespaces = [];
    const member = item => ({ name: item.name, path: apiPathFromFile(item.href) });
    const type = item => ({ ...member(item), groups: groupTocItems(item.items, API_GROUPS.type, member) });

    const visit = items => {
        for (const item of items || []) {
            if (!item.href || kinds.get(apiPathFromFile(item.href)) !== 'Namespace') continue;

            const groups = groupTocItems(item.items, API_GROUPS.namespace, type);
            if (groups.length) namespaces.push({ name: apiPathFromFile(item.href), path: apiPathFromFile(item.href), groups });

            visit(item.items);
        }
    };

    visit(Bun.YAML.parse(fs.readFileSync(tocFile, 'utf8')));
    return { namespaces: namespaces.sort((a, b) => a.name.localeCompare(b.name)) };
}

async function generateApi() {
    log.step('Generating API reference (DLL -> Markdown)');

    if (!walk(path.join(ROOT, 'ref'), file => file.endsWith('.dll')).length) {
        throw new Error('No assemblies found in ref/. Copy the Sisk .dll and .xml files there first.');
    }

    fs.rmSync(API_RAW_DIR, { recursive: true, force: true });
    await run('docfx', ['metadata', 'docfx.json']);

    const files = walk(API_RAW_DIR, file => file.endsWith('.md'));
    const kinds = new Map(files.map(file => [
        path.basename(file, '.md'),
        fs.readFileSync(file, 'utf8').match(/^# <a id="[^"]*"><\/a> (\S+)/)?.[1]
    ]));
    const typeIndex = new Set([...kinds]
        .filter(([, kind]) => ['Class', 'Struct', 'Interface', 'Enum', 'Delegate'].includes(kind))
        .map(([apiPath]) => apiPath));

    fs.rmSync(API_CONTENT_DIR, { recursive: true, force: true });
    fs.mkdirSync(API_CONTENT_DIR, { recursive: true });

    const pages = new Set(kinds.keys());

    for (const file of files) {
        const page = convertApiFile(file, typeIndex, pages);
        fs.writeFileSync(path.join(API_CONTENT_DIR, page.apiPath + '.md'), page.text, 'utf8');
    }

    fs.writeFileSync(path.join(API_CONTENT_DIR, '_index.md'), stringifyFrontMatter({
        title: 'API reference',
        linkTitle: 'API',
        description: 'Complete reference of the public types in the Sisk packages.'
    }), 'utf8');

    const tree = buildApiTree(path.join(API_RAW_DIR, 'toc.yml'), kinds);
    fs.mkdirSync(path.dirname(API_DATA_FILE), { recursive: true });
    fs.writeFileSync(API_DATA_FILE, JSON.stringify(tree, null, 2) + '\n', 'utf8');

    log.success(`API reference: ${files.length} pages, ${tree.namespaces.length} namespaces`);
}

function translationPrompt(language, file, text) {
    return `You are translating a page of the Sisk Framework documentation (an open-source .NET web framework written in C#) to ${language}.

Rules:
- Translate prose, headings, table text and code comments.
- Do not translate code, identifiers, type or member names, package names, CLI commands, file names or URLs.
- Keep the Markdown structure identical: same headings, lists, tables, code fences and code fence attributes (for example {title="Program.cs"}).
- Keep alert markers such as > [!NOTE], > [!TIP], > [!IMPORTANT], > [!WARNING] and > [!CAUTION] exactly as they are.
- Keep every link target unchanged, including absolute paths such as /docs/... and /api/... and anchors after #.
- The input starts with YAML front matter between --- lines. Translate only the values of "title", "linkTitle" and "description". Copy every other key and value exactly.
- Reply only with the translated document, without comments or code fences around it.

File: ${file}

<document>
${text}
</document>`;
}

async function runInference(config, prompt) {
    const apiKey = process.env[config.apiKeyEnv];
    if (!apiKey) throw new Error(`Environment variable ${config.apiKeyEnv} is not set`);

    for (let attempt = 1; ; attempt++) {
        const response = await fetch(config.apiUrl, {
            method: 'POST',
            headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: config.model,
                messages: [{ role: 'user', content: prompt }],
                temperature: config.temperature,
                max_completion_tokens: config.maxTokens,
                stream: false
            })
        });

        if (response.ok) {
            const data = await response.json();
            return data.choices[0].message.content;
        }

        const retryable = response.status === 429 || response.status >= 500;
        if (!retryable || attempt >= config.maxRetries) {
            throw new Error(`HTTP ${response.status}: ${(await response.text()).slice(0, 300)}`);
        }

        const wait = Number(response.headers.get('retry-after')) || 5 * attempt;
        log.warn(`HTTP ${response.status}, retrying in ${wait}s (attempt ${attempt}/${config.maxRetries})`);
        await Bun.sleep(wait * 1000);
    }
}

function translationJobs(languages) {
    const jobs = [];

    for (const rel of sourcePages()) {
        const sourceText = fs.readFileSync(path.join(SOURCE_DIR, rel), 'utf8');
        const hash = crypto.createHash('sha256').update(sourceText.replace(/\r\n/g, '\n')).digest('hex').slice(0, 16);

        for (const lang of languages) {
            const target = path.join(CONTENT_DIR, lang, rel);
            const existing = fs.existsSync(target) ? parseFrontMatter(fs.readFileSync(target, 'utf8')).data : null;
            const state = !existing ? 'missing' : existing.sourceHash !== hash ? 'outdated' : 'current';
            jobs.push({ rel, lang, target, hash, sourceText, state });
        }
    }

    return jobs;
}

function resolveLanguages(option) {
    if (!option) return Object.keys(LANGUAGES);
    if (!LANGUAGES[option]) throw new Error(`Unknown language "${option}". Available: ${Object.keys(LANGUAGES).join(', ')}`);
    return [option];
}

function translationStatus(option) {
    log.step('Translation status');

    const languages = resolveLanguages(option);
    const jobs = translationJobs(languages);

    for (const lang of languages) {
        const own = jobs.filter(job => job.lang === lang);
        const summary = ['current', 'outdated', 'missing'].map(state => `${state}: ${own.filter(job => job.state === state).length}`).join(', ');
        log.info(`${lang.padEnd(6)} ${summary}`);
        own.filter(job => job.state !== 'current').forEach(job => log.detail(`${job.state.padEnd(8)} ${job.rel}`));
    }

    const sources = new Set(sourcePages());

    languages
        .flatMap(lang => walk(path.join(CONTENT_DIR, lang), file => file.endsWith('.md'))
            .filter(file => !sources.has(toPosix(path.relative(path.join(CONTENT_DIR, lang), file)))))
        .forEach(file => log.warn(`Orphan translation (no English source): ${toPosix(path.relative(ROOT, file))}`));
}

async function translate(option, { force = false } = {}) {
    log.step('Translating documentation');

    const userConfig = fs.existsSync(CONFIG_FILE) ? JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')).translation : {};
    const config = { ...DEFAULT_TRANSLATION, ...userConfig };
    const languages = resolveLanguages(option);
    const pending = translationJobs(languages).filter(job => force || job.state !== 'current');

    if (!pending.length) {
        log.success('All translations are up to date');
        return;
    }

    const errorsFile = path.join(ROOT, 'translate.errors.txt');
    const errors = [];
    const started = Date.now();
    let done = 0;
    let cursor = 0;

    log.info(`${pending.length} page(s) to translate with ${config.model} (concurrency ${config.concurrency})`);

    const worker = async () => {
        while (cursor < pending.length) {
            const job = pending[cursor++];

            try {
                const output = await runInference(config, translationPrompt(LANGUAGES[job.lang], job.rel, job.sourceText));
                const cleaned = output.trim().replace(/^```(?:markdown|md)?\n([\s\S]*)\n```$/, '$1');
                const { data, body } = parseFrontMatter(cleaned);
                const source = parseFrontMatter(job.sourceText);

                for (const [label, regex] of [['code fences', /^\s*```/gm], ['headings', /^#{1,6} /gm], ['alerts', /^\s*> \[!\w+\]/gm]]) {
                    const expected = (source.body.match(regex) || []).length;
                    const actual = (body.match(regex) || []).length;
                    if (expected !== actual) throw new Error(`structure mismatch (${label}: ${expected} != ${actual})`);
                }

                const merged = {
                    ...source.data,
                    title: data.title || source.data.title,
                    linkTitle: source.data.linkTitle ? data.linkTitle || source.data.linkTitle : undefined,
                    description: source.data.description ? data.description || source.data.description : undefined,
                    aliases: source.data.aliases?.map(alias => alias.replace(/^\/docs\//, `/docs/${LEGACY_FOLDERS[job.lang] || job.lang}/`)),
                    sourceHash: job.hash
                };

                fs.mkdirSync(path.dirname(job.target), { recursive: true });
                fs.writeFileSync(job.target, stringifyFrontMatter(merged, body), 'utf8');
            } catch (error) {
                errors.push(`${job.lang}|${job.rel}|${error.message}`);
                log.error(`${job.lang} ${job.rel}: ${error.message}`);
            }

            done++;
            const elapsed = (Date.now() - started) / 1000;
            const eta = Math.round((elapsed / done) * (pending.length - done) / 60);
            log.info(`Translated ${done}/${pending.length} (${Math.round(done / pending.length * 100)}%), errors: ${errors.length}, ETA: ${eta}min - ${job.lang} ${job.rel}`);
        }
    };

    await Promise.all(Array.from({ length: Math.min(config.concurrency, pending.length) }, worker));

    if (errors.length) {
        fs.writeFileSync(errorsFile, errors.join('\n') + '\n', 'utf8');
        throw new Error(`${errors.length} translation(s) failed. See ${path.basename(errorsFile)}`);
    }

    fs.rmSync(errorsFile, { force: true });
    log.success(`Translated ${done} page(s)`);
}

async function buildSearchIndex() {
    log.step('Building search indexes (Pagefind)');

    const pagefind = await import('pagefind');

    try {
        const docs = (await pagefind.createIndex({ excludeSelectors: ['.heading-anchor', '.code-header'] })).index;
        const docsResult = await docs.addDirectory({ path: SITE_DIR, glob: '{index.html,docs/**/*.html,*/index.html,*/docs/**/*.html}' });
        await docs.writeFiles({ outputPath: path.join(SITE_DIR, 'pagefind') });
        log.info(`Documentation index: ${docsResult.page_count} pages`);

        const api = (await pagefind.createIndex({ forceLanguage: 'en', includeCharacters: '.<>', excludeSelectors: ['.heading-anchor', '.code-header'] })).index;
        const apiResult = await api.addDirectory({ path: SITE_DIR, glob: 'api/**/*.html' });
        await api.writeFiles({ outputPath: path.join(SITE_DIR, 'pagefind-api') });
        log.info(`API index: ${apiResult.page_count} pages`);
    } finally {
        await pagefind.close();
    }

    log.success('Search indexes written');
}

function pack() {
    log.step('Packing documentation to JSONL');

    fs.mkdirSync(PACK_DIR, { recursive: true });

    const docLines = sourcePages().flatMap(rel => {
        const { data, body } = parseFrontMatter(fs.readFileSync(path.join(SOURCE_DIR, rel), 'utf8'));
        const text = `# ${data.title}\n\n${body}`;
        return text.split(/^(?=#{1,3} )/m).map(part => part.trim()).filter(Boolean).map((section, index) => JSON.stringify({ docid: `${rel}:${index}`, text: section, __ref: rel, __tags: rel.split('/') }));
    });

    const apiLines = walk(API_CONTENT_DIR, file => file.endsWith('.md') && !file.endsWith('_index.md')).map(file => {
        const { data, body } = parseFrontMatter(fs.readFileSync(file, 'utf8'));
        const rel = toPosix(path.relative(SOURCE_DIR, file));
        return JSON.stringify({ docid: rel, text: `# ${data.apiKind} ${data.title}\n\n${body}`, __ref: null, __tags: [data.apiNamespace, data.apiKind].filter(Boolean) });
    });

    fs.writeFileSync(path.join(PACK_DIR, 'docs.jsonl'), docLines.join('\n'), 'utf8');
    fs.writeFileSync(path.join(PACK_DIR, 'api.jsonl'), apiLines.join('\n'), 'utf8');
    log.success(`docs.jsonl: ${docLines.length} sections, api.jsonl: ${apiLines.length} pages`);
}

async function buildSite() {
    log.step('Building static site (Hugo)');

    if (!fs.existsSync(API_DATA_FILE)) {
        throw new Error('API reference not generated. Run "bun build.js api" first.');
    }

    fs.rmSync(SITE_DIR, { recursive: true, force: true });
    await run('hugo', ['--gc', '--minify']);
    await buildSearchIndex();
    pack();

    log.success(`Static site ready at ${toPosix(path.relative(process.cwd(), SITE_DIR)) || '.'}`);
}

const HELP = `
Sisk documentation build system (Hugo)

Usage:
  bun build.js <command> [options]

Commands:
  api                    Generate the API reference from ref/*.dll + ref/*.xml
                         (DocFX metadata -> content/en/api and data/api.json)
  translate [lang]       Translate missing or outdated pages (all languages or one)
      --force            Retranslate every page, even when it is up to date
  status [lang]          Show missing, outdated and orphan translations
  build                  Build the static site into _site/ (Hugo + Pagefind + JSONL pack)
  serve                  Start the Hugo development server (search requires "build" once)
  all                    api + translate + build
  help                   Show this help

Languages:
  ${Object.entries(LANGUAGES).map(([code, name]) => `${code.padEnd(6)} ${name}`).join('\n  ')}

Translation:
  English pages under content/en are the source of truth. Each translated page
  stores the "sourceHash" of the English page it was generated from, so only
  missing or outdated pages are sent to the model. Settings are read from
  config.json (see config.json.example); the API key comes from the environment
  variable named by "apiKeyEnv" (default GROQ_API_KEY).

Requirements:
  Hugo (extended not required), DocFX (only for "api"), Bun.
`;

async function main() {
    const [command, ...rest] = process.argv.slice(2);
    const force = rest.includes('--force');
    const option = rest.find(arg => !arg.startsWith('--'));

    switch (command) {
        case 'api':
            await generateApi();
            break;
        case 'translate':
            await translate(option, { force });
            break;
        case 'status':
            translationStatus(option);
            break;
        case 'build':
            await buildSite();
            break;
        case 'serve':
            await run('hugo', ['server', '--disableFastRender']);
            break;
        case 'all':
            await generateApi();
            await translate();
            await buildSite();
            break;
        default:
            console.log(HELP);
    }
}

main().catch(error => {
    log.error(error.message);
    process.exit(1);
});
