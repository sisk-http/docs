# Sisk Documentation

This repository contains the source code of the [Sisk Documentation website](https://docs.sisk-framework.org/).

## Building

### Prerequisites

1. **Bun** - [Download](https://bun.com/)
2. **DocFX** (v2.76.0 recommended) - See installation warning below
4. **.NET SDK** - [Download](https://dotnet.microsoft.com/en-us/download)

### Quick Start

1. Clone this repository
2. Build the [Sisk Framework project](https://github.com/sisk-http/core) and put the .DLL binaries and XML documentation file at the `ref/` directory
3. Run the unified build script:

```bash
# Restore package
bun install

# Full build (clean, translate, build)
bun pack
```

4. Serve the documentation: `docfx serve`

Then you're ready to go and you'll have the static website files at `/_site`.

## Contributing

Contributions are always welcome. Contribute with spelling corrections, fixing broken links and more.

Please, only edit **english** documentation files. Documentation files for another languages are AI-generated from english files through.

> [!NOTE]
> Please do not edit API specification files (XML). These files are generated. If you want to edit any API documentation, edit it in the repository where the code is hosted.