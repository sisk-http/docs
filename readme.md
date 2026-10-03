# Sisk documentation

Source of [docs.sisk-framework.org](https://docs.sisk-framework.org/), built as a static site with [Hugo](https://gohugo.io/) and searched with [Pagefind](https://pagefind.app/).

## Requirements

- [Bun](https://bun.sh/)
- [Hugo](https://gohugo.io/installation/) 0.154 or newer
- [DocFX](https://dotnet.github.io/docfx/) (only to generate the API reference)

## Building

```sh
bun install
bun build.js api      # ref/*.dll + ref/*.xml -> content/en/api and data/api.json
bun build.js build    # Hugo + Pagefind + JSONL pack -> _site/ and _pack/
```

Serve `_site` with any static server, for example `php -S localhost:8080` inside `_site`. `bun build.js serve` starts the Hugo development server, but search only works after a full `build`.

Run `bun build.js help` for every command.

## API reference

Build the [Sisk Framework](https://github.com/sisk-http/core) and its extensions in Release, then copy each `.dll` with its XML documentation file to `ref/`. `bun build.js api` uses `docfx metadata` to extract Markdown and converts it into Hugo pages. The API reference is published in English only.

## Translations

English pages under `content/en` are the only ones edited by hand. Other languages are generated:

```sh
bun build.js status          # missing, outdated and orphan translations
bun build.js translate       # all languages
bun build.js translate pt-br # one language
```

Each translated page stores the `sourceHash` of the English page it came from, so only missing or outdated pages are sent to the model. Copy `config.json.example` to `config.json` to change the endpoint (any OpenAI-compatible chat completions API), model or concurrency, and set the API key in the variable named by `apiKeyEnv` (default `GROQ_API_KEY`). Failed pages are listed in `translate.errors.txt`.

## For AI agents

Every page is also published as Markdown (replace `.html` with `.md`), and each language has an `llms.txt` index and an `llms-full.txt` file with the whole documentation.
