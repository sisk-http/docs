# FileContent

Kind: Class  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.FileContent.html

Provides HTTP content based on a file.

```csharp
public sealed class FileContent : HttpContent, IDisposable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpContent](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent) ← 
[FileContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileContent.md)

#### Implements

[IDisposable](https://learn.microsoft.com/dotnet/api/system.idisposable)

#### Inherited Members

[HttpContent.ReadAsStringAsync\(\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.readasstringasync\#system\-net\-http\-httpcontent\-readasstringasync), 
[HttpContent.ReadAsStringAsync\(CancellationToken\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.readasstringasync\#system\-net\-http\-httpcontent\-readasstringasync\(system\-threading\-cancellationtoken\)), 
[HttpContent.ReadAsByteArrayAsync\(\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.readasbytearrayasync\#system\-net\-http\-httpcontent\-readasbytearrayasync), 
[HttpContent.ReadAsByteArrayAsync\(CancellationToken\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.readasbytearrayasync\#system\-net\-http\-httpcontent\-readasbytearrayasync\(system\-threading\-cancellationtoken\)), 
[HttpContent.ReadAsStream\(\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.readasstream\#system\-net\-http\-httpcontent\-readasstream), 
[HttpContent.ReadAsStream\(CancellationToken\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.readasstream\#system\-net\-http\-httpcontent\-readasstream\(system\-threading\-cancellationtoken\)), 
[HttpContent.ReadAsStreamAsync\(\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.readasstreamasync\#system\-net\-http\-httpcontent\-readasstreamasync), 
[HttpContent.ReadAsStreamAsync\(CancellationToken\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.readasstreamasync\#system\-net\-http\-httpcontent\-readasstreamasync\(system\-threading\-cancellationtoken\)), 
[HttpContent.CopyTo\(Stream, TransportContext?, CancellationToken\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.copyto), 
[HttpContent.CopyToAsync\(Stream\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.copytoasync\#system\-net\-http\-httpcontent\-copytoasync\(system\-io\-stream\)), 
[HttpContent.CopyToAsync\(Stream, CancellationToken\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.copytoasync\#system\-net\-http\-httpcontent\-copytoasync\(system\-io\-stream\-system\-threading\-cancellationtoken\)), 
[HttpContent.CopyToAsync\(Stream, TransportContext?\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.copytoasync\#system\-net\-http\-httpcontent\-copytoasync\(system\-io\-stream\-system\-net\-transportcontext\)), 
[HttpContent.CopyToAsync\(Stream, TransportContext?, CancellationToken\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.copytoasync\#system\-net\-http\-httpcontent\-copytoasync\(system\-io\-stream\-system\-net\-transportcontext\-system\-threading\-cancellationtoken\)), 
[HttpContent.LoadIntoBufferAsync\(\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.loadintobufferasync\#system\-net\-http\-httpcontent\-loadintobufferasync), 
[HttpContent.LoadIntoBufferAsync\(long\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.loadintobufferasync\#system\-net\-http\-httpcontent\-loadintobufferasync\(system\-int64\)), 
[HttpContent.LoadIntoBufferAsync\(CancellationToken\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.loadintobufferasync\#system\-net\-http\-httpcontent\-loadintobufferasync\(system\-threading\-cancellationtoken\)), 
[HttpContent.LoadIntoBufferAsync\(long, CancellationToken\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.loadintobufferasync\#system\-net\-http\-httpcontent\-loadintobufferasync\(system\-int64\-system\-threading\-cancellationtoken\)), 
[HttpContent.Dispose\(\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.dispose\#system\-net\-http\-httpcontent\-dispose), 
[HttpContent.Headers](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.headers), 
[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [FileContent\(FileInfo\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileContent.-ctor.md#Sisk_Core_Http_FileContent__ctor_System_IO_FileInfo_) | Initializes a new instance of the [FileContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileContent.md) class with the specified file. |
| [FileContent\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileContent.-ctor.md#Sisk_Core_Http_FileContent__ctor_System_String_) | Initializes a new instance of the [FileContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileContent.md) class with the specified file path. |

## Properties

| Name | Description |
| --- | --- |
| [File](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileContent.File.md#Sisk_Core_Http_FileContent_File) | Gets the file information for the content. |

## Methods

| Name | Description |
| --- | --- |
| [CreateContentReadStream\(CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileContent.CreateContentReadStream.md#Sisk_Core_Http_FileContent_CreateContentReadStream_System_Threading_CancellationToken_) |  |
| [CreateContentReadStreamAsync\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileContent.CreateContentReadStreamAsync.md#Sisk_Core_Http_FileContent_CreateContentReadStreamAsync) |  |
| [CreateContentReadStreamAsync\(CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileContent.CreateContentReadStreamAsync.md#Sisk_Core_Http_FileContent_CreateContentReadStreamAsync_System_Threading_CancellationToken_) |  |
| [SerializeToStream\(Stream, TransportContext?, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileContent.SerializeToStream.md#Sisk_Core_Http_FileContent_SerializeToStream_System_IO_Stream_System_Net_TransportContext_System_Threading_CancellationToken_) |  |
| [SerializeToStreamAsync\(Stream, TransportContext?, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileContent.SerializeToStreamAsync.md#Sisk_Core_Http_FileContent_SerializeToStreamAsync_System_IO_Stream_System_Net_TransportContext_System_Threading_CancellationToken_) |  |
| [SerializeToStreamAsync\(Stream, TransportContext?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileContent.SerializeToStreamAsync.md#Sisk_Core_Http_FileContent_SerializeToStreamAsync_System_IO_Stream_System_Net_TransportContext_) |  |
| [TryComputeLength\(out long\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileContent.TryComputeLength.md#Sisk_Core_Http_FileContent_TryComputeLength_System_Int64__) |  |
