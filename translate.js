const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'docs');
const skipPattern = /\b(ru|pt-br)\b/;

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isDirectory(filePath) {
    return fs.statSync(filePath).isDirectory();
}

function enumerateMdFiles(dir) {
    const files = fs.readdirSync(dir);
    let mdFiles = [];

    const excludePattern = /[\\\/](ru|cn|pt-br)[\\\/]/i;

    for (const file of files) {
        const filePath = path.join(dir, file);

        if (isDirectory(filePath)) {
            if (skipPattern.test(file)) {
                continue;
            }

            mdFiles = mdFiles.concat(enumerateMdFiles(filePath));
        } else if (file.endsWith('.md') || file.endsWith('.yml')) {

            if (!excludePattern.test(filePath))
                mdFiles.push(filePath);
        }
    }

    return mdFiles;
}

async function translate(text, prompt) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        console.error("GROQ_API_KEY environment variable is not set.");
        process.exit(1);
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-specdec',
            messages: [{
                role: 'system',
                content: prompt.trim()
            }, {
                role: 'user',
                content: text
            }],
            temperature: 0.1,
            top_p: 0.75,
            max_tokens: 8192
        })
    });

    if (!response.ok) {
        console.error("Failed to translate the markdown file.");
        console.error(await response.text());
        process.exit(1);
    }

    const data = await response.json();

    return data.choices[0].message.content;
}

const mdFiles = enumerateMdFiles(targetDir);

if (process.argv.length < 4) {
    console.error("Usage: node translate.js <language> <dest>");
    console.error("Also, make sure to have your groq api key at your GROQ_API_KEY environment variable.");
    process.exit(1);
}

const toLanguage = process.argv[2];
const dest = process.argv[3];
const prompt = `
    You're an translator AI helper. Your goal is to translate the given markdown code language into another language. You're translating a piece of documentation of the Sisk Framework, an .NET web-server written in C#.

    You must translate the user input to Brazilan Portuguese.

    <translate_code>
    - You should translate texts, code comments, but not code symbols,
    variables or constants names.
    - You should NOT translate markdown warning boxes tags, such as [!TIP] or [!WARNING].
    - You MUST keep the same file structure, maintaining links targets, headers, codes and page title.
    - You MUST keep link targets.
    - You MUST NOT translate script-header file names or language names.
    </translate_code>

    <output>
    - You MUST reply ONLY with the translated text, no greetings or advices.
    - The translated text must follow the original input structure.
    </output>
`;

(async () => {
    var translatedCount = 0;
    for (const mdFile of mdFiles) {
        const fileContents = fs.readFileSync(mdFile, 'utf8');

        const fileName = mdFile.replace(targetDir, '');
        const translationPath = path.join(targetDir, dest, fileName);
        const translationDir = path.dirname(translationPath);

        if (fs.existsSync(translationPath)) {
            continue;
        }

        const translated = await translate(fileContents, prompt);
        fs.mkdirSync(translationDir, { recursive: true });
        fs.writeFileSync(translationPath, translated);

        console.log("Translated: ", fileName);

        // wait 5s (rate-limit)
        await sleep(10_000);
        translatedCount++;

        if (translatedCount % 5 === 0) {
            await sleep(30_000);
        }
    }

    if (translatedCount == 0) {
        console.log("No files to translate.");
    } else {
        console.log(`${translatedCount} files translated.`);
    }

})().then(console.log);