---
title: "文件服务器"
weight: 80
aliases:
  - "/docs/cn/features/file-server.html"
sourceHash: "ecb5bc7dc9bb5964"
---

Sisk 提供 `Sisk.Http.FileSystem` 命名空间，其中包含用于提供静态文件、目录列表和文件转换的工具。此功能允许您从本地目录提供文件，支持范围请求（音频/视频流）和自定义文件处理。

## 提供静态文件

提供静态文件的最简方式是使用 [Router.MapFileSystem](/api/Sisk.Core.Routing.Router.MapFileSystem)。此方法将 URL 前缀映射到磁盘上的目录。

```cs
using Sisk.Core.Http;
using Sisk.Core.Http.FileSystem;

// 将服务器根目录映射到当前目录
mainRouter.MapFileSystem("/", Directory.GetCurrentDirectory());

// 将 /assets 映射到 "public/assets" 文件夹
mainRouter.MapFileSystem(
    "/assets",
    Path.Combine(Directory.GetCurrentDirectory(), "public", "assets"));
```

当请求匹配路由前缀时，`HttpFileServerHandler` 会在指定目录中查找文件。若找到，则提供该文件；否则返回 404 响应（若访问被拒绝则返回 403）。

在需要显式创建 `Route` 对象时，仍可使用 `HttpFileServer.CreateServingRoute`，但对应用代码而言，`MapFileSystem` 是最直接的选项。

## HttpFileServerHandler

若需更细粒度地控制文件的提供方式，可以手动实例化并配置 `HttpFileServerHandler`。

```cs
var fileHandler = new HttpFileServerHandler("/var/www/html");

// 启用目录列表（默认禁用）
fileHandler.AllowDirectoryListing = true;

// 设置自定义路由前缀（此前缀将在请求路径中被裁剪）
fileHandler.RoutePrefix = "/public";

// 在 /public 下注册处理器
mainRouter.MapFileSystem("/public", fileHandler);
```

### 配置

| Property | Description |
|---|---|
| `RootDirectoryPath` | 用于提供文件的根目录的绝对路径或相对路径。 |
| `RoutePrefix` | 解析文件时会从请求路径中裁剪的路由前缀。默认是 `/`。 |
| `AllowDirectoryListing` | 若设为 `true`，在请求目录且未找到索引文件时启用目录列表。默认是 `false`。 |
| `FileConverters` | 用于在提供文件前转换文件的 `HttpFileServerFileConverter` 列表。 |

## 目录列表

当 `AllowDirectoryListing` 启用且用户请求目录路径时，Sisk 将生成一个 HTML 页面列出该目录的内容。

目录列表包括：
- 指向父目录的导航（`..`）。
- 子目录列表。
- 带有大小和最后修改日期的文件列表。

## 文件转换器

文件转换器允许拦截特定文件类型并以不同方式处理。例如，您可能想对图像进行转码、即时压缩文件，或使用部分内容（Range 请求）提供文件。

Sisk 包含两个用于媒体流的内置转换器：
- `HttpFileAudioConverter`：处理 `.mp3`、`.ogg`、`.wav`、`.flac`、`.ogv`。
- `HttpFileVideoConverter`：处理 `.webm`、`.avi`、`.mkv`、`.mpg`、`.mpeg`、`.wmv`、`.mov`、`.mp4`。

这些转换器支持 **HTTP Range Requests**，允许客户端在音频和视频文件中进行定位播放。

### 创建自定义转换器

要创建自定义文件转换器，继承 `HttpFileServerFileConverter` 并实现 `CanConvert` 与 `Convert`。

```cs
using Sisk.Core.Http;
using Sisk.Core.Http.FileSystem;

public class MyTextConverter : HttpFileServerFileConverter
{
    public override bool CanConvert(FileInfo file)
    {
        // 仅适用于 .txt 文件
        return file.Extension.Equals(".txt", StringComparison.OrdinalIgnoreCase);
    }

    public override HttpResponse Convert(FileInfo file, HttpRequest request)
    {
        string content = File.ReadAllText(file.FullName);
        
        // 将所有文本内容转为大写
        return new HttpResponse(200)
        {
            Content = new StringContent(content.ToUpper())
        };
    }
}
```

然后，将其添加到处理器中：

```cs
var handler = new HttpFileServerHandler("./files");
handler.FileConverters.Add(new MyTextConverter());
```
