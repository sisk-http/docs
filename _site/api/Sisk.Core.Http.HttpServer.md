# HttpServer

Kind: Class  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.html

Provides an lightweight HTTP server powered by Sisk.

```csharp
public sealed class HttpServer : IDisposable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md)

#### Implements

[IDisposable](https://learn.microsoft.com/dotnet/api/system.idisposable)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [HttpServer\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.-ctor.md#Sisk_Core_Http_HttpServer__ctor) | Creates an new [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md) instance with no predefined configuration. |
| [HttpServer\(HttpServerConfiguration\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.-ctor.md#Sisk_Core_Http_HttpServer__ctor_Sisk_Core_Http_HttpServerConfiguration_) | Creates a new default configuration [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md) instance with the given Route and server configuration. |

## Properties

| Name | Description |
| --- | --- |
| [EventSources](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.EventSources.md#Sisk_Core_Http_HttpServer_EventSources) | Gets an [HttpEventSourceCollection](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.md) with active event source connections in this HTTP server. |
| [IsDynamicCodeSupported](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.IsDynamicCodeSupported.md#Sisk_Core_Http_HttpServer_IsDynamicCodeSupported) | Gets an [Boolean](https://learn.microsoft.com/dotnet/api/system.boolean) indicating if the current environment supports dynamic code or it's running in an AOT assembly. |
| [IsListening](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.IsListening.md#Sisk_Core_Http_HttpServer_IsListening) | Gets an boolean indicating if this HTTP server is running and listening. |
| [IsSupported](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.IsSupported.md#Sisk_Core_Http_HttpServer_IsSupported) | Gets an [Boolean](https://learn.microsoft.com/dotnet/api/system.boolean) indicating if Sisk can be used with the current environment. |
| [ListeningPrefixes](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.ListeningPrefixes.md#Sisk_Core_Http_HttpServer_ListeningPrefixes) | Gets an string array containing all URL prefixes which this HTTP server is listening to. |
| [PoweredBy](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.PoweredBy.md#Sisk_Core_Http_HttpServer_PoweredBy) | Gets the X-Powered-By Sisk header value. |
| [ServerConfiguration](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.ServerConfiguration.md#Sisk_Core_Http_HttpServer_ServerConfiguration) | Gets or sets the Server Configuration object. |
| [SiskVersion](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.SiskVersion.md#Sisk_Core_Http_HttpServer_SiskVersion) | Gets the current Sisk version. |
| [WebSockets](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.WebSockets.md#Sisk_Core_Http_HttpServer_WebSockets) | Gets an [HttpWebSocketConnectionCollection](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocketConnectionCollection.md) with active Web Sockets connections in this HTTP server. |

## Methods

| Name | Description |
| --- | --- |
| [CreateBuilder\(Action<HttpServerHostContextBuilder\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.CreateBuilder.md#Sisk_Core_Http_HttpServer_CreateBuilder_System_Action_Sisk_Core_Http_Hosting_HttpServerHostContextBuilder__) | Builds an [HttpServerHostContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.md) context invoking the handler on it. |
| [CreateBuilder\(ushort\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.CreateBuilder.md#Sisk_Core_Http_HttpServer_CreateBuilder_System_UInt16_) | Builds an empty [HttpServerHostContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.md) context with predefined listening port. |
| [CreateBuilder\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.CreateBuilder.md#Sisk_Core_Http_HttpServer_CreateBuilder_System_String_) | Builds an empty [HttpServerHostContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.md) context with predefined listening host string. |
| [CreateBuilder\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.CreateBuilder.md#Sisk_Core_Http_HttpServer_CreateBuilder) | Builds an empty [HttpServerHostContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.md) context. |
| [CreateListener\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.CreateListener.md#Sisk_Core_Http_HttpServer_CreateListener) | Gets an listening and running HTTP server in an random port. |
| [CreateListener\(ushort\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.CreateListener.md#Sisk_Core_Http_HttpServer_CreateListener_System_UInt16_) | Gets an listening and running HTTP server in the specified port. |
| [CreateListener\(ushort, out HttpServerConfiguration, out ListeningHost, out Router\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.CreateListener.md#Sisk_Core_Http_HttpServer_CreateListener_System_UInt16_Sisk_Core_Http_HttpServerConfiguration__Sisk_Core_Http_ListeningHost__Sisk_Core_Routing_Router__) | Gets an listening and running HTTP server in the specified port. |
| [Dispose\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.Dispose.md#Sisk_Core_Http_HttpServer_Dispose) | Invalidates this class and releases the resources used by it, and permanently closes the HTTP server. |
| [Emit\(ushort, out HttpServerConfiguration, out ListeningHost, out Router\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.Emit.md#Sisk_Core_Http_HttpServer_Emit_System_UInt16_Sisk_Core_Http_HttpServerConfiguration__Sisk_Core_Http_ListeningHost__Sisk_Core_Routing_Router__) | Gets an non-listening HTTP server with configuration, listening host, and router. |
| [HandleContext\(HttpServerEngineContext\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.HandleContext.md#Sisk_Core_Http_HttpServer_HandleContext_Sisk_Core_Http_Engine_HttpServerEngineContext_) | Handles a single [HttpServerEngineContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContext.md) request. |
| [RegisterHandler<T\>\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.RegisterHandler.md#Sisk_Core_Http_HttpServer_RegisterHandler__1) | Associate an [HttpServerHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.md) in this HttpServer to handle functions such as requests, routers and contexts. |
| [RegisterHandler\(HttpServerHandler\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.RegisterHandler.md#Sisk_Core_Http_HttpServer_RegisterHandler_Sisk_Core_Http_Handlers_HttpServerHandler_) | Associate an [HttpServerHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.md) in this HttpServer to handle functions such as requests, routers and contexts. |
| [Restart\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.Restart.md#Sisk_Core_Http_HttpServer_Restart) | Restarts this HTTP server, sending all processing responses and starting them again, reading the listening ports again. |
| [Start\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.Start.md#Sisk_Core_Http_HttpServer_Start) | Starts listening to the set port and handling requests on this server. |
| [Stop\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.Stop.md#Sisk_Core_Http_HttpServer_Stop) | Stops the server from listening and stops the request handler. |
| [WaitNext\(TimeSpan\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.WaitNext.md#Sisk_Core_Http_HttpServer_WaitNext_System_TimeSpan_) | Waits for the next HTTP request to be processed, with a specified timeout. |
| [WaitNext\(CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.WaitNext.md#Sisk_Core_Http_HttpServer_WaitNext_System_Threading_CancellationToken_) | Waits for the next HTTP request to be processed, with a specified cancellation token. |
| [WaitNextAsync\(TimeSpan\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.WaitNextAsync.md#Sisk_Core_Http_HttpServer_WaitNextAsync_System_TimeSpan_) | Asynchronously waits for the next HTTP request to be processed, with a specified timeout. |
| [WaitNextAsync\(CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.WaitNextAsync.md#Sisk_Core_Http_HttpServer_WaitNextAsync_System_Threading_CancellationToken_) | Asynchronously waits for the next HTTP request to be processed, with a specified cancellation token. |
