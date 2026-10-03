# HttpServer.RegisterHandler<T>

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.RegisterHandler.html

## RegisterHandler&lt;T>() {#Sisk_Core_Http_HttpServer_RegisterHandler__1}

Associate an [HttpServerHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.md) in this HttpServer to handle functions such as requests, routers and contexts.

```csharp
public void RegisterHandler<T>() where T : HttpServerHandler, new()
```

### Type Parameters

`T` 

The handler which implements [HttpServerHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.md).

## RegisterHandler(HttpServerHandler) {#Sisk_Core_Http_HttpServer_RegisterHandler_Sisk_Core_Http_Handlers_HttpServerHandler_}

Associate an [HttpServerHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.md) in this HttpServer to handle functions such as requests, routers and contexts.

```csharp
public void RegisterHandler(HttpServerHandler obj)
```

### Parameters

`obj` [HttpServerHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.md)

The instance of the server handler.
