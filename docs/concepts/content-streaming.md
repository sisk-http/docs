# Streaming Content

The Sisk supports reading and sending streams of content to and from the client. This feature is useful for removing memory overhead for serializing and deserializing content during the lifetime of a request.

## Request content stream

Small contents are automatically loaded into the HTTP connection buffer memory, quickly loading this content to [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body) and [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.RawBody). For larger contents, the [HttpRequest.GetRequestStream](/api/Sisk.Core.Http.HttpRequest.GetRequestStream) method can be used to obtain the request content read stream.

It is worth noting that the [HttpRequest.GetMultipartFormContent](/api/Sisk.Core.Http.HttpRequest.GetMultipartFormContent) method reads the entire request content into memory, so it may not be useful for reading large contents.

Consider the following example:

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
        // request does not have content
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
        Content = JsonContent.Create ( new { message = "File sent successfully." } )
    };
}
```

In the example above, the `UploadDocument` method reads the request content and saves the content to a file. No additional memory allocation is made except for the read buffer used by `Stream.CopyToAsync`. The example above removes the pressure of memory allocation for a very large file, which can optimize application performance.

A good practice is to always use a [CancellationToken](https://learn.microsoft.com/pt-br/dotnet/api/system.threading.cancellationtoken) in an operation that can be time-consuming, such as sending files, as it depends on the network speed between the client and the server.

The adjustment with a CancellationToken can be made in the following way:

<div class="script-header">
    <span>
        Controller/UploadDocument.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
// the cancellation token below will throw an exception if the 30-second timeout is reached.
CancellationTokenSource copyCancellation = new CancellationTokenSource ( delay: TimeSpan.FromSeconds ( 30 ) );

try {
    using (var fs = File.Create ( outputFileName )) {
        await contentStream.CopyToAsync ( fs, copyCancellation.Token );
    }
}
catch (OperationCanceledException) {
    return new HttpResponse ( HttpStatusInformation.BadRequest ) {
        Content = JsonContent.Create ( new { Error = "The upload exceeded the maximum upload time (30 seconds)." } )
    };
}
```

## Response content stream
Sending response content is also possible. Currently, there are two ways to do this: through the [HttpRequest.GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream) method and using a content of type [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent?view=net-9.0).

Consider a scenario where we need to serve an image file. To do this, we can use the following code:

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

    // example method to obtain a profile picture
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

The method above makes a memory allocation every time it reads the image content. If the image is large, this can cause a performance problem, and in peak situations, even a memory overload and crash the server. In these situations, caching can be useful, but it will not eliminate the problem, since memory will still be reserved for that file. Caching will alleviate the pressure of having to allocate memory for every request, but for large files, it will not be enough.

Sending the image through a stream can be a solution to the problem. Instead of reading the entire image content, a read stream is created on the file and copied to the client using a tiny buffer.

#### Sending through the GetResponseStream method

The [HttpRequest.GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream) method creates an object that allows sending chunks of the HTTP response as the content flow is prepared. This method is more manual, requiring you to define the status, headers, and content size before sending the content.

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

    // in this form of sending, the status and header must be defined
    // before the content is sent
    var requestStreamManager = request.GetResponseStream ();

    requestStreamManager.SetStatus ( System.Net.HttpStatusCode.OK );
    requestStreamManager.SetHeader ( HttpKnownHeaderNames.ContentType, "image/jpeg" );
    requestStreamManager.SetHeader ( HttpKnownHeaderNames.ContentDisposition, $"inline; filename={profilePictureFilename}" );

    using (var fs = File.OpenRead ( profilePictureFilename )) {

        // in this form of sending, it is also necessary to define the content size
        // before sending it.
        requestStreamManager.SetContentLength ( fs.Length );

        // if you don't know the content size, you can use chunked-encoding
        // to send the content
        requestStreamManager.SendChunked = true;

        // and then, write to the output stream
        await fs.CopyToAsync ( requestStreamManager.ResponseStream );
    }
}
```

#### Sending content through a StreamContent

The [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent?view=net-9.0) class allows sending content from a data source as a byte stream. This form of sending is easier, removing the previous requirements, and even allowing the use of [compression encoding](/docs/fundamentals/responses#gzip-deflate-and-brotli-compression) to reduce the content size.

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
> In this type of content, do not encapsulate the stream in a `using` block. The content will be automatically discarded by the HTTP server when the content flow is finalized, with or without errors.