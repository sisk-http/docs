# CadenteHttpServerEngine

Kind: Class  
Namespace: `Sisk.Cadente.CoreEngine`  
Assembly: `Sisk.Cadente.CoreEngine.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngine.html

Represents an HTTP server engine based on the Cadente host.
This class implements [HttpServerEngine](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.md) and [IDisposable](https://learn.microsoft.com/dotnet/api/system.idisposable)
to manage the lifecycle of the HTTP server.

```csharp
public sealed class CadenteHttpServerEngine : HttpServerEngine, IDisposable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
HttpServerEngine ← 
[CadenteHttpServerEngine](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngine.md)

#### Implements

[IDisposable](https://learn.microsoft.com/dotnet/api/system.idisposable)

#### Inherited Members

HttpServerEngine.SetListeningHosts\(IEnumerable<ListeningHost\>\), 
HttpServerEngine.OnConfiguring\(HttpServer, HttpServerConfiguration\), 
HttpServerEngine.StartServer\(\), 
HttpServerEngine.StopServer\(\), 
HttpServerEngine.BeginGetContext\(AsyncCallback?, object?\), 
HttpServerEngine.EndGetContext\(IAsyncResult\), 
HttpServerEngine.GetContextAsync\(CancellationToken\), 
HttpServerEngine.Dispose\(\), 
HttpServerEngine.IdleConnectionTimeout, 
HttpServerEngine.ListeningPrefixes, 
HttpServerEngine.EventLoopMecanism, 
[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [CadenteHttpServerEngine\(\)](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngine.-ctor.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngine__ctor) | Initializes a new instance of the [CadenteHttpServerEngine](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngine.md) class. |
| [CadenteHttpServerEngine\(Action<HttpHost\>\)](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngine.-ctor.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngine__ctor_System_Action_Sisk_Cadente_HttpHost__) | Initializes a new instance of the [CadenteHttpServerEngine](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngine.md) class with a specified action to set up each HTTP host. |

## Properties

| Name | Description |
| --- | --- |
| [EventLoopMecanism](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngine.EventLoopMecanism.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngine_EventLoopMecanism) | Gets the event loop mechanism used by the server. |
| [IdleConnectionTimeout](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngine.IdleConnectionTimeout.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngine_IdleConnectionTimeout) | Gets or sets the timeout for idle connections. |
| [ListeningPrefixes](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngine.ListeningPrefixes.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngine_ListeningPrefixes) | Gets or sets the listening prefixes for the server. |

## Methods

| Name | Description |
| --- | --- |
| [BeginGetContext\(AsyncCallback?, object?\)](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngine.BeginGetContext.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngine_BeginGetContext_System_AsyncCallback_System_Object_) | Begins an asynchronous operation to get an HTTP context. |
| [Dispose\(\)](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngine.Dispose.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngine_Dispose) | Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources. |
| [EndGetContext\(IAsyncResult\)](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngine.EndGetContext.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngine_EndGetContext_System_IAsyncResult_) | Ends an asynchronous operation to get an HTTP context. |
| [GetContextAsync\(CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngine.GetContextAsync.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngine_GetContextAsync_System_Threading_CancellationToken_) | Asynchronously obtains an [HttpServerEngineContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContext.md). |
| [OnConfiguring\(HttpServer, HttpServerConfiguration\)](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngine.OnConfiguring.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngine_OnConfiguring_Sisk_Core_Http_HttpServer_Sisk_Core_Http_HttpServerConfiguration_) | Called when the server is being configured. |
| [SetListeningHosts\(IEnumerable<ListeningHost\>\)](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngine.SetListeningHosts.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngine_SetListeningHosts_System_Collections_Generic_IEnumerable_Sisk_Core_Http_ListeningHost__) | Sets the listening hosts for the server. |
| [StartServer\(\)](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngine.StartServer.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngine_StartServer) | Starts the HTTP server. |
| [StopServer\(\)](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngine.StopServer.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngine_StopServer) | Stops the HTTP server. |
