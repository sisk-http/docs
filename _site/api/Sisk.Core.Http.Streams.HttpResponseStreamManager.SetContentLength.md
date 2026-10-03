# HttpResponseStreamManager.SetContentLength

Kind: Method  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpResponseStreamManager.SetContentLength.html

## SetContentLength(long) {#Sisk_Core_Http_Streams_HttpResponseStreamManager_SetContentLength_System_Int64_}

Sets the Content-Length header of this response stream. If this response stream is using chunked transfer encoding, this method
will do nothing.

```csharp
public void SetContentLength(long contentLength)
```

### Parameters

`contentLength` [long](https://learn.microsoft.com/dotnet/api/system.int64)

The length in bytes of the content stream.
