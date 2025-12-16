# 流式内容

Sisk 支持读取和发送流式内容到和从客户端。这一功能对于在请求的生命周期中序列化和反序列化内容的内存开销非常有用。

## 请求内容流

小内容会自动加载到 HTTP 连接缓冲区内存中，快速加载到 [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body) 和 [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.RawBody)。对于较大的内容，可以使用 [HttpRequest.GetRequestStream](/api/Sisk.Core.Http.HttpRequest.GetRequestStream) 方法来获取请求内容读取流。

值得注意的是，[HttpRequest.GetMultipartFormContent](/api/Sisk.Core.Http.HttpRequest.GetMultipartFormContent) 方法会将整个请求内容读入内存，因此对于读取大内容可能不太有用。

考虑以下示例：

<div class="script-header">
    <span>
        Controller/UploadDocument.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RoutePost ( "/api/upload-document/<filename>" )]
public async Task<HttpResponse> UploadDocument ( HttpRequest request ) {

    var fileName = request.RouteParameters [ "filename" ].GetString ();

    if (!request.HasContents) {
        // 请求没有内容
        return new HttpResponse ( HttpStatusInformation.BadRequest );
    }

    var contentStream = request.GetRequestStream ();
    var outputFileName = Path.Combine (
        AppDomain.CurrentDomain.BaseDirectory,
        "uploads",
        fileName );

    using (var fs = File.Create ( outputFileName )) {
        await contentStream.CopyToAsync ( fs );
    }

    return new HttpResponse () {
        Content = JsonContent.Create ( new { message = "文件发送成功。" } )
    };
}
```

在上面的示例中，`UploadDocument` 方法读取请求内容并将内容保存到文件中。除了 `Stream.CopyToAsync` 使用的读取缓冲区外，不会进行任何额外的内存分配。上面的示例消除了对非常大文件的内存分配压力，可以优化应用程序性能。

一个良好的做法是在可能耗时的操作中始终使用 [CancellationToken](https://learn.microsoft.com/pt-br/dotnet/api/system.threading.cancellationtoken)，例如发送文件，因为它取决于客户端和服务器之间的网络速度。

可以通过以下方式调整 `CancellationToken`：

<div class="script-header">
    <span>
        Controller/UploadDocument.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
// 下面的取消令牌将在 30 秒超时时抛出异常。
CancellationTokenSource copyCancellation = new CancellationTokenSource ( delay: TimeSpan.FromSeconds ( 30 ) );

try {
    using (var fs = File.Create ( outputFileName )) {
        await contentStream.CopyToAsync ( fs, copyCancellation.Token );
    }
}
catch (OperationCanceledException) {
    return new HttpResponse ( HttpStatusInformation.BadRequest ) {
        Content = JsonContent.Create ( new { Error = "上传超出了最大上传时间（30 秒）。" } )
    };
}
```

## 响应内容流
发送响应内容也是可能的。目前，有两种方法可以做到这一点：通过 [HttpRequest.GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream) 方法和使用 [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent?view=net-9.0) 类型的内容。

考虑一个需要提供图像文件的场景。可以使用以下代码：

<div class="script-header">
    <span>
        Controller/ImageController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RouteGet ( "/api/profile-picture" )]
public async Task<HttpResponse> UploadDocument ( HttpRequest request ) {

    // 示例方法来获取个人资料图片
    var profilePictureFilename = "profile-picture.jpg";
    byte[] profilePicture = await File.ReadAllBytesAsync ( profilePictureFilename );

    return new HttpResponse () {
        Content = new ByteArrayContent ( profilePicture ),
        Headers = new () {
            ContentType = "image/jpeg",
            ContentDisposition = $"inline; filename={profilePictureFilename}"
        }
    };
}
```

上面的方法每次读取图像内容时都会进行内存分配。如果图像很大，这可能会导致性能问题，并且在峰值情况下，甚至可能导致内存过载和服务器崩溃。在这些情况下，缓存可能会有所帮助，但它不会消除问题，因为仍然需要为该文件保留内存。缓存可以缓解每次请求都需要分配内存的压力，但对于大文件来说，它是不够的。

通过流式传输发送图像可以解决这个问题。与其读取整个图像内容，不如创建一个文件的读取流，并使用一个小缓冲区将其复制到客户端。

#### 通过 GetResponseStream 方法发送

[HttpRequest.GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream) 方法创建一个对象，允许将 HTTP 响应的块作为内容流准备好时发送。这种方法更为手动，需要在发送内容之前定义状态、头部和内容大小。

<div class="script-header">
    <span>
        Controller/ImageController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RouteGet ( "/api/profile-picture" )]
public async Task<HttpResponse> UploadDocument ( HttpRequest request ) {

    var profilePictureFilename = "profile-picture.jpg";

    // 以这种形式发送，状态和头部必须在发送内容之前定义
    var requestStreamManager = request.GetResponseStream ();

    requestStreamManager.SetStatus ( System.Net.HttpStatusCode.OK );
    requestStreamManager.SetHeader ( HttpKnownHeaderNames.ContentType, "image/jpeg" );
    requestStreamManager.SetHeader ( HttpKnownHeaderNames.ContentDisposition, $"inline; filename={profilePictureFilename}" );

    using (var fs = File.OpenRead ( profilePictureFilename )) {

        // 以这种形式发送，内容大小也必须在发送之前定义
        requestStreamManager.SetContentLength ( fs.Length );

        // 如果不知道内容大小，可以使用分块编码来发送内容
        requestStreamManager.SendChunked = true;

        // 然后，将内容写入输出流
        await fs.CopyToAsync ( requestStreamManager.ResponseStream );
    }
}
```

#### 通过 StreamContent 发送内容

[StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent?view=net-9.0) 类允许将数据源作为字节流发送内容。这种发送方式更容易，消除了之前的要求，甚至允许使用 [压缩编码](/docs/cn/fundamentals/responses#gzip-deflate-and-brotli-compression) 来减少内容大小。

<div class="script-header">
    <span>
        Controller/ImageController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RouteGet ( "/api/profile-picture" )]
public HttpResponse UploadDocument ( HttpRequest request ) {

    var profilePictureFilename = "profile-picture.jpg";

    return new HttpResponse () {
        Content = new StreamContent ( File.OpenRead ( profilePictureFilename ) ),
        Headers = new () {
            ContentType = "image/jpeg",
            ContentDisposition = $"inline; filename=\"{profilePictureFilename}\""
        }
    };
}
```

> [!IMPORTANT]
>
> 在这种类型的内容中，不要将流封装在 `using` 块中。内容将由 HTTP 服务器在内容流完成时自动丢弃，无论是否有错误。