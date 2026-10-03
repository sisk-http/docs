# HttpServerExecutionResult.Response

Kind: Property  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerExecutionResult.Response.html

## Response {#Sisk_Core_Http_HttpServerExecutionResult_Response}

Gets the resulted [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) send by the router, if any. This object can be null if the
server didn't sent any response to the client.

```csharp
public HttpResponse? Response { get; }
```

### Property Value

[HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md)?
