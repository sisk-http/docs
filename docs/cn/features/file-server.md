# 文件服务器

Sisk 提供了 `Sisk.Http.FileSystem` 命名空间，包含了服务静态文件、目录列表和文件转换的工具。这个功能允许你从本地目录中提供文件，支持范围请求（音频/视频流媒体）和自定义文件处理。

## 提供静态文件

提供静态文件的最简单方法是使用 `HttpFileServer.CreateServingRoute`。这个方法创建一个路由，将 URL 前缀映射到磁盘上的一个目录。

```cs
using Sisk.Core.Http;
using Sisk.Core.Http.FileSystem;

// 将服务器根目录映射到当前目录
mainRouter.SetRoute(HttpFileServer.CreateServingRoute("/", Directory.GetCurrentDirectory()));

// 将 /assets 映射到 "public/assets" 文件夹
mainRouter.SetRoute(HttpFileServer.CreateServingRoute("/assets", Path.Combine(Directory.GetCurrentDirectory(), "public", "assets")));
```

当请求匹配路由前缀时，`HttpFileServerHandler` 将在指定目录中查找文件。如果找到，则提供文件；否则，将返回 404 响应（或 403 如果访问被拒绝）。

## HttpFileServerHandler

为了更好地控制文件的提供方式，你可以手动实例化和配置 `HttpFileServerHandler`。

```cs
var fileHandler = new HttpFileServerHandler("/var/www/html");

// 启用目录列表（默认禁用）
fileHandler.AllowDirectoryListing = true;

// 设置自定义路由前缀（这将从请求路径中剪裁）
fileHandler.RoutePrefix = "/public";

// 注册处理器操作
mainRouter.SetRoute(RouteMethod.Get, "/public/.*", fileHandler.HandleRequest);
```

### 配置

| 属性 | 描述 |
|---|---|
| `RootDirectoryPath` | 文件被提供的根目录的绝对或相对路径。 |
| `RoutePrefix` | 将从请求路径中剪裁的路由前缀。默认为 `/`。 |
| `AllowDirectoryListing` | 如果设置为 `true`，则在请求目录且没有索引文件时启用目录列表。默认为 `false`。 |
| `FileConverters` | 用于在提供文件之前转换文件的 `HttpFileServerFileConverter` 列表。 |

## 目录列表

当 `AllowDirectoryListing` 启用时，且用户请求一个目录路径，Sisk 将生成一个 HTML 页面，列出该目录的内容。

目录列表包括：
- 导航到父目录 (`..`)。
- 子目录列表。
- 文件列表，包括大小和最后修改日期。

## 文件转换器

文件转换器允许你拦截特定文件类型并以不同的方式处理它们。例如，你可能想要转码一个图像，实时压缩一个文件，或使用部分内容（范围请求）提供一个文件。

Sisk 包括两个内置转换器用于媒体流：
- `HttpFileAudioConverter`：处理 `.mp3`、`.ogg`、`.wav`、`.flac`、`.ogv`。
- `HttpFileVideoConverter`：处理 `.webm`、`.avi`、`.mkv`、`.mpg`、`.mpeg`、`.wmv`、`.mov`、`.mp4`。

这些转换器启用了对 **HTTP 范围请求** 的支持，允许客户端在音频和视频文件中寻找。

### 创建自定义转换器

要创建自定义文件转换器，继承 `HttpFileServerFileConverter` 并实现 `CanConvert` 和 `Convert`。

```cs
using Sisk.Core.Http;
using Sisk.Core.Http.FileSystem;

public class MyTextConverter : HttpFileServerFileConverter
{
    public override bool CanConvert(FileInfo file)
    {
        // 只应用于 .txt 文件
        return file.Extension.Equals(".txt", StringComparison.OrdinalIgnoreCase);
    }

    public override HttpResponse Convert(FileInfo file, HttpRequest request)
    {
        string content = File.ReadAllText(file.FullName);
        
        // 将所有文本内容转换为大写
        return new HttpResponse(200)
        {
            Content = new StringContent(content.ToUpper())
        };
    }
}
```

然后，将其添加到你的处理器中：

```cs
var handler = new HttpFileServerHandler("./files");
handler.FileConverters.Add(new MyTextConverter());
```