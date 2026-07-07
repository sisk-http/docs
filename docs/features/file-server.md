# File Server

Sisk provides the `Sisk.Http.FileSystem` namespace, which contains tools for serving static files, directory listing and file conversion. This feature allows you to serve files from a local directory, with support for range requests (audio/video streaming) and custom file processing.

## Serving static files

The easiest way to serve static files is [Router.MapFileSystem](/api/Sisk.Core.Routing.Router.MapFileSystem). This method maps a URL prefix to a directory on disk.

```cs
using Sisk.Core.Http;
using Sisk.Core.Http.FileSystem;

// maps the root of the server to the current directory
mainRouter.MapFileSystem("/", Directory.GetCurrentDirectory());

// maps /assets to the "public/assets" folder
mainRouter.MapFileSystem(
    "/assets",
    Path.Combine(Directory.GetCurrentDirectory(), "public", "assets"));
```

When a request matches the route prefix, the `HttpFileServerHandler` will look for a file in the specified directory. If found, it will serve the file; otherwise, it will return a 404 response (or 403 if access is denied).

`HttpFileServer.CreateServingRoute` is still available when you need to create a `Route` object explicitly, but `MapFileSystem` is the most direct option for application code.

## HttpFileServerHandler

For more control over how files are served, you can instantiate and configure `HttpFileServerHandler` manually.

```cs
var fileHandler = new HttpFileServerHandler("/var/www/html");

// enable directory listing (disabled by default)
fileHandler.AllowDirectoryListing = true;

// set a custom route prefix (this will be trimmed from the request path)
fileHandler.RoutePrefix = "/public";

// register the handler under /public
mainRouter.MapFileSystem("/public", fileHandler);
```

### Configuration

| Property | Description |
|---|---|
| `RootDirectoryPath` | The absolute or relative path to the root directory from which files are served. |
| `RoutePrefix` | The route prefix that will be trimmed from the request path when resolving files. Default is `/`. |
| `AllowDirectoryListing` | If set to `true`, enables directory listing when a directory is requested and no index file is found. Default is `false`. |
| `FileConverters` | A list of `HttpFileServerFileConverter` used to transform files before serving them. |

## Directory Listing

When `AllowDirectoryListing` is enabled, and the user requests a directory path, Sisk will generate an HTML page listing the contents of that directory.

The directory listing includes:
- Navigation to the parent directory (`..`).
- List of subdirectories.
- List of files with size and last modification date.

## File Converters

File converters allow you to intercept specific file types and handle them differently. For example, you might want to transcode an image, compress a file on the fly, or serve a file using partial content (Range requests).

Sisk includes two built-in converters for media streaming:
- `HttpFileAudioConverter`: Handles `.mp3`, `.ogg`, `.wav`, `.flac`, `.ogv`.
- `HttpFileVideoConverter`: Handles `.webm`, `.avi`, `.mkv`, `.mpg`, `.mpeg`, `.wmv`, `.mov`, `.mp4`.

These converters enable support for **HTTP Range Requests**, allowing clients to seek through audio and video files.

### Creating a custom converter

To create a custom file converter, inherit from `HttpFileServerFileConverter` and implement `CanConvert` and `Convert`.

```cs
using Sisk.Core.Http;
using Sisk.Core.Http.FileSystem;

public class MyTextConverter : HttpFileServerFileConverter
{
    public override bool CanConvert(FileInfo file)
    {
        // apply only to .txt files
        return file.Extension.Equals(".txt", StringComparison.OrdinalIgnoreCase);
    }

    public override HttpResponse Convert(FileInfo file, HttpRequest request)
    {
        string content = File.ReadAllText(file.FullName);
        
        // uppercase all text content
        return new HttpResponse(200)
        {
            Content = new StringContent(content.ToUpper())
        };
    }
}
```

Then, add it to your handler:

```cs
var handler = new HttpFileServerHandler("./files");
handler.FileConverters.Add(new MyTextConverter());
```
