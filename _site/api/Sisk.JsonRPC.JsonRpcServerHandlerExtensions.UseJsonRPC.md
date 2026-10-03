# JsonRpcServerHandlerExtensions.UseJsonRPC

Kind: Method  
Namespace: `Sisk.JsonRPC`  
Assembly: `Sisk.JsonRPC.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcServerHandlerExtensions.UseJsonRPC.html

## UseJsonRPC(HttpServerHostContextBuilder, EventHandler&lt;JsonRpcServerConfigurationEventArgs>) {#Sisk_JsonRPC_JsonRpcServerHandlerExtensions_UseJsonRPC_Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_System_EventHandler_Sisk_JsonRPC_JsonRpcServerConfigurationEventArgs__}

Enables JSON-RPC in this HTTP server.

```csharp
public static HttpServerHostContextBuilder UseJsonRPC(this HttpServerHostContextBuilder builder, EventHandler<JsonRpcServerConfigurationEventArgs> configure)
```

### Parameters

`builder` HttpServerHostContextBuilder

The self [HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md) for fluent chaining.

`configure` [EventHandler](https://learn.microsoft.com/dotnet/api/system.eventhandler\-1)<[JsonRpcServerConfigurationEventArgs](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcServerConfigurationEventArgs.md)\>

The event handler callback that is called to configure routes and web methods for the JSON-RPC.

### Returns

 HttpServerHostContextBuilder
