# HtmlContent

Kind: Class  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HtmlContent.html

Provides HTTP content based on HTML contents.

```csharp
public class HtmlContent : StringContent, IDisposable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpContent](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent) ← 
[ByteArrayContent](https://learn.microsoft.com/dotnet/api/system.net.http.bytearraycontent) ← 
[StringContent](https://learn.microsoft.com/dotnet/api/system.net.http.stringcontent) ← 
[HtmlContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.HtmlContent.md)

#### Implements

[IDisposable](https://learn.microsoft.com/dotnet/api/system.idisposable)

#### Inherited Members

[StringContent.SerializeToStreamAsync\(Stream, TransportContext?, CancellationToken\)](https://learn.microsoft.com/dotnet/api/system.net.http.stringcontent.serializetostreamasync), 
[ByteArrayContent.SerializeToStream\(Stream, TransportContext?, CancellationToken\)](https://learn.microsoft.com/dotnet/api/system.net.http.bytearraycontent.serializetostream), 
[ByteArrayContent.SerializeToStreamAsync\(Stream, TransportContext?\)](https://learn.microsoft.com/dotnet/api/system.net.http.bytearraycontent.serializetostreamasync\#system\-net\-http\-bytearraycontent\-serializetostreamasync\(system\-io\-stream\-system\-net\-transportcontext\)), 
[ByteArrayContent.SerializeToStreamAsync\(Stream, TransportContext?, CancellationToken\)](https://learn.microsoft.com/dotnet/api/system.net.http.bytearraycontent.serializetostreamasync\#system\-net\-http\-bytearraycontent\-serializetostreamasync\(system\-io\-stream\-system\-net\-transportcontext\-system\-threading\-cancellationtoken\)), 
[ByteArrayContent.TryComputeLength\(out long\)](https://learn.microsoft.com/dotnet/api/system.net.http.bytearraycontent.trycomputelength), 
[ByteArrayContent.CreateContentReadStream\(CancellationToken\)](https://learn.microsoft.com/dotnet/api/system.net.http.bytearraycontent.createcontentreadstream), 
[ByteArrayContent.CreateContentReadStreamAsync\(\)](https://learn.microsoft.com/dotnet/api/system.net.http.bytearraycontent.createcontentreadstreamasync), 
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
| [HtmlContent\(string, Encoding\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HtmlContent.-ctor.md#Sisk_Core_Http_HtmlContent__ctor_System_String_System_Text_Encoding_) | Creates an new [HtmlContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.HtmlContent.md) class with given HTML content and encoding. |
| [HtmlContent\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HtmlContent.-ctor.md#Sisk_Core_Http_HtmlContent__ctor_System_String_) | Creates an new [HtmlContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.HtmlContent.md) class with given HTML content, using the environment default encoding. |
| [HtmlContent\(ReadOnlySpan<byte\>, Encoding\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HtmlContent.-ctor.md#Sisk_Core_Http_HtmlContent__ctor_System_ReadOnlySpan_System_Byte__System_Text_Encoding_) | Creates a new [HtmlContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.HtmlContent.md) class with given HTML content as a byte span and encoding. |
| [HtmlContent\(ReadOnlySpan<byte\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HtmlContent.-ctor.md#Sisk_Core_Http_HtmlContent__ctor_System_ReadOnlySpan_System_Byte__) | Creates a new [HtmlContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.HtmlContent.md) class with given HTML content as a UTF-8 encoded byte span. |
