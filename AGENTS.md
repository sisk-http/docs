# Sisk Documentation (Hugo)

- This workspace builds the static Sisk documentation site with Hugo, Pagefind, DocFX (metadata only) and the Bun script `build.js`.
- English pages under `content/en/docs` are the source of truth. Do not edit `content/<lang>/` for other languages by hand; they are produced by `bun build.js translate`, which tracks the English page through the `sourceHash` front matter key.
- Do not edit generated output: `content/en/api/**`, `data/api.json`, `_api/**`, `_site/**`, `_pack/**` and `resources/_gen/**`. API text comes from the XML docs of the framework; fix it upstream, copy the new `.dll` and `.xml` files to `ref/` and run `bun build.js api`.
- Page order comes from the `weight` front matter key (steps of 10). Section groups are the `_index.md` files under `content/en/docs/<section>/`.
- Link to other pages with absolute paths such as `/docs/fundamentals/routing` and `/api/Sisk.Core.Routing.Router`. The `render-link` hook resolves them and warns about unresolved targets during the build.
- Use `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]` and `> [!CAUTION]` for callouts, and ```` ```cs {title="Program.cs"} ```` for titled code blocks.
- Validate changes with `bun build.js build` and serve `_site` statically (for example `php -S localhost:8080` inside `_site`).
- Do not run `translate` or `all` unless the user asks: they call a paid model API and may rewrite many localized files. Use `status` to inspect translations.
- Keep `build.js` in plain CommonJS JavaScript with direct Node/Bun APIs, and the front end in vanilla JavaScript and plain CSS.
