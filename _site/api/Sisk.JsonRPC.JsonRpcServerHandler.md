# JsonRpcServerHandler

Kind: Class  
Namespace: `Sisk.JsonRPC`  
Assembly: `Sisk.JsonRPC.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcServerHandler.html

Provides an [HttpServerHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.md) for configuring the JSON-RPC handler
for the HTTP server.

```csharp
public sealed class JsonRpcServerHandler : HttpServerHandler
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
HttpServerHandler ← 
[JsonRpcServerHandler](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcServerHandler.md)

#### Inherited Members

HttpServerHandler.Priority, 
[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [JsonRpcServerHandler\(\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcServerHandler.-ctor.md#Sisk_JsonRPC_JsonRpcServerHandler__ctor) | Creates an new instance of the [JsonRpcServerHandler](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcServerHandler.md) class. |

## Methods

| Name | Description |
| --- | --- |
| [OnServerStarting\(HttpServer\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcServerHandler.OnServerStarting.md#Sisk_JsonRPC_JsonRpcServerHandler_OnServerStarting_Sisk_Core_Http_HttpServer_) | Event that is called immediately before starting the [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md). |
| [OnSetupRouter\(Router\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcServerHandler.OnSetupRouter.md#Sisk_JsonRPC_JsonRpcServerHandler_OnSetupRouter_Sisk_Core_Routing_Router_) | Event that is called when an [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) is binded to the HTTP server. |
| [ConfigureAction](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcServerHandler.ConfigureAction.md#Sisk_JsonRPC_JsonRpcServerHandler_ConfigureAction) | Gets or sets the action which will be called in the configuring [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) with this handler. |
