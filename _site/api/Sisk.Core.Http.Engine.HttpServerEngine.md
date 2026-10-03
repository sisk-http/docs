# HttpServerEngine

Kind: Class  
Namespace: `Sisk.Core.Http.Engine`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.html

Provides an abstract base class for HTTP server engines.

```csharp
public abstract class HttpServerEngine : IDisposable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpServerEngine](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.md)

#### Derived

[HttpListenerAbstractEngine](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpListenerAbstractEngine.md)

#### Implements

[IDisposable](https://learn.microsoft.com/dotnet/api/system.idisposable)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.MemberwiseClone\(\)](https://learn.microsoft.com/dotnet/api/system.object.memberwiseclone), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [HttpServerEngine\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.-ctor.md#Sisk_Core_Http_Engine_HttpServerEngine__ctor) |  |

## Properties

| Name | Description |
| --- | --- |
| [EventLoopMecanism](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.EventLoopMecanism.md#Sisk_Core_Http_Engine_HttpServerEngine_EventLoopMecanism) | Gets the event loop mechanism used by the server. |
| [IdleConnectionTimeout](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.IdleConnectionTimeout.md#Sisk_Core_Http_Engine_HttpServerEngine_IdleConnectionTimeout) | Gets or sets the timeout for idle connections. |
| [ListeningPrefixes](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.ListeningPrefixes.md#Sisk_Core_Http_Engine_HttpServerEngine_ListeningPrefixes) | Gets or sets the listening prefixes for the server. |

## Methods

| Name | Description |
| --- | --- |
| [BeginGetContext\(AsyncCallback?, object?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.BeginGetContext.md#Sisk_Core_Http_Engine_HttpServerEngine_BeginGetContext_System_AsyncCallback_System_Object_) | Begins an asynchronous operation to get an HTTP context. |
| [Dispose\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.Dispose.md#Sisk_Core_Http_Engine_HttpServerEngine_Dispose) | Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources. |
| [EndGetContext\(IAsyncResult\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.EndGetContext.md#Sisk_Core_Http_Engine_HttpServerEngine_EndGetContext_System_IAsyncResult_) | Ends an asynchronous operation to get an HTTP context. |
| [GetContextAsync\(CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.GetContextAsync.md#Sisk_Core_Http_Engine_HttpServerEngine_GetContextAsync_System_Threading_CancellationToken_) | Asynchronously obtains an [HttpServerEngineContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContext.md). |
| [OnConfiguring\(HttpServer, HttpServerConfiguration\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.OnConfiguring.md#Sisk_Core_Http_Engine_HttpServerEngine_OnConfiguring_Sisk_Core_Http_HttpServer_Sisk_Core_Http_HttpServerConfiguration_) | Called when the server is being configured. |
| [SetListeningHosts\(IEnumerable<ListeningHost\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.SetListeningHosts.md#Sisk_Core_Http_Engine_HttpServerEngine_SetListeningHosts_System_Collections_Generic_IEnumerable_Sisk_Core_Http_ListeningHost__) | Sets the listening hosts for the server. |
| [StartServer\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.StartServer.md#Sisk_Core_Http_Engine_HttpServerEngine_StartServer) | Starts the HTTP server. |
| [StopServer\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.StopServer.md#Sisk_Core_Http_Engine_HttpServerEngine_StopServer) | Stops the HTTP server. |
