# HttpListenerAbstractEngine

Kind: Class  
Namespace: `Sisk.Core.Http.Engine`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpListenerAbstractEngine.html

Provides an implementation of [HttpServerEngine](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.md) using [HttpListener](https://learn.microsoft.com/dotnet/api/system.net.httplistener).

```csharp
public sealed class HttpListenerAbstractEngine : HttpServerEngine, IDisposable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpServerEngine](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.md) ← 
[HttpListenerAbstractEngine](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpListenerAbstractEngine.md)

#### Implements

[IDisposable](https://learn.microsoft.com/dotnet/api/system.idisposable)

#### Inherited Members

[HttpServerEngine.SetListeningHosts\(IEnumerable<ListeningHost\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.SetListeningHosts.md#Sisk_Core_Http_Engine_HttpServerEngine_SetListeningHosts_System_Collections_Generic_IEnumerable_Sisk_Core_Http_ListeningHost__), 
[HttpServerEngine.OnConfiguring\(HttpServer, HttpServerConfiguration\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.OnConfiguring.md#Sisk_Core_Http_Engine_HttpServerEngine_OnConfiguring_Sisk_Core_Http_HttpServer_Sisk_Core_Http_HttpServerConfiguration_), 
[HttpServerEngine.StartServer\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.StartServer.md#Sisk_Core_Http_Engine_HttpServerEngine_StartServer), 
[HttpServerEngine.StopServer\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.StopServer.md#Sisk_Core_Http_Engine_HttpServerEngine_StopServer), 
[HttpServerEngine.BeginGetContext\(AsyncCallback?, object?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.BeginGetContext.md#Sisk_Core_Http_Engine_HttpServerEngine_BeginGetContext_System_AsyncCallback_System_Object_), 
[HttpServerEngine.EndGetContext\(IAsyncResult\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.EndGetContext.md#Sisk_Core_Http_Engine_HttpServerEngine_EndGetContext_System_IAsyncResult_), 
[HttpServerEngine.GetContextAsync\(CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.GetContextAsync.md#Sisk_Core_Http_Engine_HttpServerEngine_GetContextAsync_System_Threading_CancellationToken_), 
[HttpServerEngine.Dispose\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.Dispose.md#Sisk_Core_Http_Engine_HttpServerEngine_Dispose), 
[HttpServerEngine.IdleConnectionTimeout](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.IdleConnectionTimeout.md#Sisk_Core_Http_Engine_HttpServerEngine_IdleConnectionTimeout), 
[HttpServerEngine.ListeningPrefixes](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.ListeningPrefixes.md#Sisk_Core_Http_Engine_HttpServerEngine_ListeningPrefixes), 
[HttpServerEngine.EventLoopMecanism](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.EventLoopMecanism.md#Sisk_Core_Http_Engine_HttpServerEngine_EventLoopMecanism), 
[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [HttpListenerAbstractEngine\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpListenerAbstractEngine.-ctor.md#Sisk_Core_Http_Engine_HttpListenerAbstractEngine__ctor) | Initializes a new instance of the [HttpListenerAbstractEngine](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpListenerAbstractEngine.md) class. |

## Properties

| Name | Description |
| --- | --- |
| [EventLoopMecanism](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpListenerAbstractEngine.EventLoopMecanism.md#Sisk_Core_Http_Engine_HttpListenerAbstractEngine_EventLoopMecanism) | Gets the event loop mechanism used by the server. |
| [IdleConnectionTimeout](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpListenerAbstractEngine.IdleConnectionTimeout.md#Sisk_Core_Http_Engine_HttpListenerAbstractEngine_IdleConnectionTimeout) | Gets or sets the timeout for idle connections. |
| [ListeningPrefixes](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpListenerAbstractEngine.ListeningPrefixes.md#Sisk_Core_Http_Engine_HttpListenerAbstractEngine_ListeningPrefixes) | Gets or sets the listening prefixes for the server. |

## Methods

| Name | Description |
| --- | --- |
| [BeginGetContext\(AsyncCallback?, object?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpListenerAbstractEngine.BeginGetContext.md#Sisk_Core_Http_Engine_HttpListenerAbstractEngine_BeginGetContext_System_AsyncCallback_System_Object_) | Begins an asynchronous operation to get an HTTP context. |
| [Dispose\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpListenerAbstractEngine.Dispose.md#Sisk_Core_Http_Engine_HttpListenerAbstractEngine_Dispose) | Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources. |
| [EndGetContext\(IAsyncResult\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpListenerAbstractEngine.EndGetContext.md#Sisk_Core_Http_Engine_HttpListenerAbstractEngine_EndGetContext_System_IAsyncResult_) | Ends an asynchronous operation to get an HTTP context. |
| [GetContextAsync\(CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpListenerAbstractEngine.GetContextAsync.md#Sisk_Core_Http_Engine_HttpListenerAbstractEngine_GetContextAsync_System_Threading_CancellationToken_) | Asynchronously obtains an [HttpServerEngineContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContext.md). |
| [OnConfiguring\(HttpServer, HttpServerConfiguration\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpListenerAbstractEngine.OnConfiguring.md#Sisk_Core_Http_Engine_HttpListenerAbstractEngine_OnConfiguring_Sisk_Core_Http_HttpServer_Sisk_Core_Http_HttpServerConfiguration_) | Called when the server is being configured. |
| [SetListeningHosts\(IEnumerable<ListeningHost\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpListenerAbstractEngine.SetListeningHosts.md#Sisk_Core_Http_Engine_HttpListenerAbstractEngine_SetListeningHosts_System_Collections_Generic_IEnumerable_Sisk_Core_Http_ListeningHost__) | Sets the listening hosts for the server. |
| [StartServer\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpListenerAbstractEngine.StartServer.md#Sisk_Core_Http_Engine_HttpListenerAbstractEngine_StartServer) | Starts the HTTP server. |
| [StopServer\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpListenerAbstractEngine.StopServer.md#Sisk_Core_Http_Engine_HttpListenerAbstractEngine_StopServer) | Stops the HTTP server. |
