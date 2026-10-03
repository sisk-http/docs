# HttpRequest.GetRequestStream

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetRequestStream.html

## GetRequestStream() {#Sisk_Core_Http_HttpRequest_GetRequestStream}

Gets the HTTP request content stream. This property is only available while the
content has not been imported by the HTTP server and will invalidate the body content 
cached in this object.

```csharp
public Stream GetRequestStream()
```

### Returns

[Stream](https://learn.microsoft.com/dotnet/api/system.io.stream)
