# HttpRequest.Abort

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Abort.html

## Abort() {#Sisk_Core_Http_HttpRequest_Abort}

Immediately closes the connection with the client and does not send any response.

```csharp
public HttpResponse Abort()
```

### Returns

[HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md)

### Remarks

This method returns an [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) indicated to exit outside the scope of the request
context. However, when calling this method, the connection is interrupted instantly.
