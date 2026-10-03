# CompressedContent

Kind: Class  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.CompressedContent.html

Represents a base class for HTTP contents served over an compressing stream.

```csharp
public abstract class CompressedContent : HttpContent, IDisposable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpContent](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent) ← 
[CompressedContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.CompressedContent.md)

#### Derived

[BrotliContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.BrotliContent.md), 
[DeflateContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.DeflateContent.md), 
[GZipContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.GZipContent.md)

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
[HttpContent.SerializeToStreamAsync\(Stream, TransportContext?\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.serializetostreamasync\#system\-net\-http\-httpcontent\-serializetostreamasync\(system\-io\-stream\-system\-net\-transportcontext\)), 
[HttpContent.SerializeToStream\(Stream, TransportContext?, CancellationToken\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.serializetostream), 
[HttpContent.SerializeToStreamAsync\(Stream, TransportContext?, CancellationToken\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.serializetostreamasync\#system\-net\-http\-httpcontent\-serializetostreamasync\(system\-io\-stream\-system\-net\-transportcontext\-system\-threading\-cancellationtoken\)), 
[HttpContent.CopyTo\(Stream, TransportContext?, CancellationToken\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.copyto), 
[HttpContent.CopyToAsync\(Stream\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.copytoasync\#system\-net\-http\-httpcontent\-copytoasync\(system\-io\-stream\)), 
[HttpContent.CopyToAsync\(Stream, CancellationToken\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.copytoasync\#system\-net\-http\-httpcontent\-copytoasync\(system\-io\-stream\-system\-threading\-cancellationtoken\)), 
[HttpContent.CopyToAsync\(Stream, TransportContext?\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.copytoasync\#system\-net\-http\-httpcontent\-copytoasync\(system\-io\-stream\-system\-net\-transportcontext\)), 
[HttpContent.CopyToAsync\(Stream, TransportContext?, CancellationToken\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.copytoasync\#system\-net\-http\-httpcontent\-copytoasync\(system\-io\-stream\-system\-net\-transportcontext\-system\-threading\-cancellationtoken\)), 
[HttpContent.LoadIntoBufferAsync\(\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.loadintobufferasync\#system\-net\-http\-httpcontent\-loadintobufferasync), 
[HttpContent.LoadIntoBufferAsync\(long\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.loadintobufferasync\#system\-net\-http\-httpcontent\-loadintobufferasync\(system\-int64\)), 
[HttpContent.LoadIntoBufferAsync\(CancellationToken\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.loadintobufferasync\#system\-net\-http\-httpcontent\-loadintobufferasync\(system\-threading\-cancellationtoken\)), 
[HttpContent.LoadIntoBufferAsync\(long, CancellationToken\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.loadintobufferasync\#system\-net\-http\-httpcontent\-loadintobufferasync\(system\-int64\-system\-threading\-cancellationtoken\)), 
[HttpContent.CreateContentReadStream\(CancellationToken\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.createcontentreadstream), 
[HttpContent.CreateContentReadStreamAsync\(\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.createcontentreadstreamasync\#system\-net\-http\-httpcontent\-createcontentreadstreamasync), 
[HttpContent.CreateContentReadStreamAsync\(CancellationToken\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.createcontentreadstreamasync\#system\-net\-http\-httpcontent\-createcontentreadstreamasync\(system\-threading\-cancellationtoken\)), 
[HttpContent.TryComputeLength\(out long\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.trycomputelength), 
[HttpContent.Dispose\(bool\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.dispose\#system\-net\-http\-httpcontent\-dispose\(system\-boolean\)), 
[HttpContent.Dispose\(\)](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.dispose\#system\-net\-http\-httpcontent\-dispose), 
[HttpContent.Headers](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent.headers), 
[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.MemberwiseClone\(\)](https://learn.microsoft.com/dotnet/api/system.object.memberwiseclone), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [CompressedContent\(HttpContent\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.CompressedContent.-ctor.md#Sisk_Core_Http_CompressedContent__ctor_System_Net_Http_HttpContent_) | Initializes a new instance of compressing stream with the specified inner HTTP content. |
| [CompressedContent\(byte\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.CompressedContent.-ctor.md#Sisk_Core_Http_CompressedContent__ctor_System_Byte___) | Initializes a new instance of compressing stream with the specified byte array content. |
| [CompressedContent\(Stream\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.CompressedContent.-ctor.md#Sisk_Core_Http_CompressedContent__ctor_System_IO_Stream_) | Initializes a new instance of compressing stream with the specified stream content. |

## Properties

| Name | Description |
| --- | --- |
| [InnerContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.CompressedContent.InnerContent.md#Sisk_Core_Http_CompressedContent_InnerContent) | Gets the inner HTTP content. |

## Methods

| Name | Description |
| --- | --- |
| [Dispose\(bool\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.CompressedContent.Dispose.md#Sisk_Core_Http_CompressedContent_Dispose_System_Boolean_) |  |
| [GetCompressingStream\(Stream\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.CompressedContent.GetCompressingStream.md#Sisk_Core_Http_CompressedContent_GetCompressingStream_System_IO_Stream_) | Gets a stream that compresses the output stream. |
| [SerializeToStream\(Stream, TransportContext?, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.CompressedContent.SerializeToStream.md#Sisk_Core_Http_CompressedContent_SerializeToStream_System_IO_Stream_System_Net_TransportContext_System_Threading_CancellationToken_) |  |
| [SerializeToStreamAsync\(Stream, TransportContext?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.CompressedContent.SerializeToStreamAsync.md#Sisk_Core_Http_CompressedContent_SerializeToStreamAsync_System_IO_Stream_System_Net_TransportContext_) |  |
| [SerializeToStreamAsync\(Stream, TransportContext?, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.CompressedContent.SerializeToStreamAsync.md#Sisk_Core_Http_CompressedContent_SerializeToStreamAsync_System_IO_Stream_System_Net_TransportContext_System_Threading_CancellationToken_) |  |
| [Setup\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.CompressedContent.Setup.md#Sisk_Core_Http_CompressedContent_Setup) | Represents the method that is invoked once within the constructor to setup this compressor. This method is indeeded to add the missing Content-Encoding headers used by this compressor. |
| [TryComputeLength\(out long\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.CompressedContent.TryComputeLength.md#Sisk_Core_Http_CompressedContent_TryComputeLength_System_Int64__) |  |
