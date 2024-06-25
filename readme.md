# Sisk Documentation

This repository contains the source code of the [Sisk Documentation website](https://docs.sisk-framework.org/).

## Building

1. Firstly, make sure you have [docfx](https://dotnet.github.io/docfx/) installed in your machine. You'll need [.NET SDK](https://dotnet.microsoft.com/en-us/download) to install it.
2. Clone this repository.
3. Build the [Sisk Framework project](https://github.com/sisk-http/core) and put the .DLL binaries and XML documentation file at the `ref/` directory, on the repository root.
4. Run `docfx`, then `docfx serve`.

Then you're ready to go and you'll have the static website files at `/_site`.

## Contributing

Contributions are always welcome. Contribute with spelling corrections, fixing broken links and more.

> [!NOTE]
> Please do not edit API specification files (XML). These files are generated. If you want to edit any API documentation, edit it in the repository where the code is hosted.