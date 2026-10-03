# HttpResponseStreamManager

Kind: Class  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpResponseStreamManager.html

Represents a way to manage HTTP requests with their output streams, without relying on synchronous content.

```csharp
public sealed class HttpResponseStreamManager
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpResponseStreamManager](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpResponseStreamManager.md)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Properties

| Name | Description |
| --- | --- |
| [ResponseStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpResponseStreamManager.ResponseStream.md#Sisk_Core_Http_Streams_HttpResponseStreamManager_ResponseStream) | Gets the [Stream](https://learn.microsoft.com/dotnet/api/system.io.stream) that represents the HTTP response output stream. |
| [SendChunked](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpResponseStreamManager.SendChunked.md#Sisk_Core_Http_Streams_HttpResponseStreamManager_SendChunked) | Gets or sets whether this HTTP response stream should use chunked transfer encoding. |

## Methods

| Name | Description |
| --- | --- |
| [Close\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpResponseStreamManager.Close.md#Sisk_Core_Http_Streams_HttpResponseStreamManager_Close) | Closes this HTTP response stream connection between the server and the client and returns an empty [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) to finish the HTTP server context. |
| [GetStreamWriter\(string?, Encoding?, string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpResponseStreamManager.GetStreamWriter.md#Sisk_Core_Http_Streams_HttpResponseStreamManager_GetStreamWriter_System_String_System_Text_Encoding_System_String_) | Returns a [StreamWriter](https://learn.microsoft.com/dotnet/api/system.io.streamwriter) for writing to the response stream, setting the content type and encoding. |
| [SetContentLength\(long\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpResponseStreamManager.SetContentLength.md#Sisk_Core_Http_Streams_HttpResponseStreamManager_SetContentLength_System_Int64_) | Sets the Content-Length header of this response stream. If this response stream is using chunked transfer encoding, this method will do nothing. |
| [SetCookie\(Cookie\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpResponseStreamManager.SetCookie.md#Sisk_Core_Http_Streams_HttpResponseStreamManager_SetCookie_System_Net_Cookie_) | Sets a cookie and sends it in the response to be set by the client. |
| [SetCookie\(string, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpResponseStreamManager.SetCookie.md#Sisk_Core_Http_Streams_HttpResponseStreamManager_SetCookie_System_String_System_String_) | Sets a cookie and sends it in the response to be set by the client. |
| [SetCookie\(string, string, DateTime?, TimeSpan?, string?, string?, bool?, bool?, string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpResponseStreamManager.SetCookie.md#Sisk_Core_Http_Streams_HttpResponseStreamManager_SetCookie_System_String_System_String_System_Nullable_System_DateTime__System_Nullable_System_TimeSpan__System_String_System_String_System_Nullable_System_Boolean__System_Nullable_System_Boolean__System_String_) | Sets a cookie and sends it in the response to be set by the client. |
| [SetHeader\(string, object?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpResponseStreamManager.SetHeader.md#Sisk_Core_Http_Streams_HttpResponseStreamManager_SetHeader_System_String_System_Object_) | Sets the specific HTTP header into this response stream. |
| [SetStatus\(int\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpResponseStreamManager.SetStatus.md#Sisk_Core_Http_Streams_HttpResponseStreamManager_SetStatus_System_Int32_) | Sets the HTTP status code for this response stream. |
| [SetStatus\(HttpStatusCode\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpResponseStreamManager.SetStatus.md#Sisk_Core_Http_Streams_HttpResponseStreamManager_SetStatus_System_Net_HttpStatusCode_) | Sets the HTTP status code for this response stream. |
| [SetStatus\(HttpStatusInformation\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpResponseStreamManager.SetStatus.md#Sisk_Core_Http_Streams_HttpResponseStreamManager_SetStatus_Sisk_Core_Http_HttpStatusInformation_) | Sets the HTTP status code and description for this response stream. |
| [Write\(ReadOnlySpan<byte\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpResponseStreamManager.Write.md#Sisk_Core_Http_Streams_HttpResponseStreamManager_Write_System_ReadOnlySpan_System_Byte__) | Writes an sequence of bytes to the HTTP response stream. |
| [Write\(byte\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpResponseStreamManager.Write.md#Sisk_Core_Http_Streams_HttpResponseStreamManager_Write_System_Byte___) | Writes an sequence of bytes to the HTTP response stream. |
| [Write\(byte\[\], int, int\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpResponseStreamManager.Write.md#Sisk_Core_Http_Streams_HttpResponseStreamManager_Write_System_Byte___System_Int32_System_Int32_) | Writes a range of bytes from a byte array to the HTTP response stream. |
