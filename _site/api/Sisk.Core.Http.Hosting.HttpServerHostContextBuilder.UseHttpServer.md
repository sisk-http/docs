# HttpServerHostContextBuilder.UseHttpServer

Kind: Method  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.UseHttpServer.html

## UseHttpServer(Action&lt;HttpServer>) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseHttpServer_System_Action_Sisk_Core_Http_HttpServer__}

Calls an action that has the HTTP server instance as an argument.

```csharp
public HttpServerHostContextBuilder UseHttpServer(Action<HttpServer> handler)
```

### Parameters

`handler` [Action](https://learn.microsoft.com/dotnet/api/system.action\-1)<[HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md)\>

An action where the first argument is the main [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md) object.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)
