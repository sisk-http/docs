# HttpServerHostContextBuilder.UseHandler<THandler>

Kind: Method  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.UseHandler.html

## UseHandler&lt;THandler>() {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseHandler__1}

This method is an shortcut for calling [RegisterHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.RegisterHandler.md).

```csharp
public HttpServerHostContextBuilder UseHandler<THandler>() where THandler : HttpServerHandler, new()
```

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

### Type Parameters

`THandler` 

The handler which implements [HttpServerHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.md).

## UseHandler(HttpServerHandler) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseHandler_Sisk_Core_Http_Handlers_HttpServerHandler_}

This method is an shortcut for calling [RegisterHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.RegisterHandler.md).

```csharp
public HttpServerHostContextBuilder UseHandler(HttpServerHandler handler)
```

### Parameters

`handler` [HttpServerHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.md)

The instance of the server handler.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)
