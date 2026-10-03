# HttpServerHandler

Kind: Class  
Namespace: `Sisk.Core.Http.Handlers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.html

Represents an event handler for the [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md), router, and related events.

```csharp
public abstract class HttpServerHandler
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpServerHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.md)

#### Derived

[AsyncHttpServerHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.AsyncHttpServerHandler.md)

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
| [HttpServerHandler\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.-ctor.md#Sisk_Core_Http_Handlers_HttpServerHandler__ctor) |  |

## Properties

| Name | Description |
| --- | --- |
| [Priority](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.Priority.md#Sisk_Core_Http_Handlers_HttpServerHandler_Priority) | Gets the priority value that determines the order in which handlers are executed. Lower values are executed first. |

## Methods

| Name | Description |
| --- | --- |
| [OnContextBagCreated\(TypedValueDictionary\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.OnContextBagCreated.md#Sisk_Core_Http_Handlers_HttpServerHandler_OnContextBagCreated_Sisk_Core_Entity_TypedValueDictionary_) | Event that is called when an HTTP context is created within an [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) object. |
| [OnException\(Exception\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.OnException.md#Sisk_Core_Http_Handlers_HttpServerHandler_OnException_System_Exception_) | Event that is called when an exception is caught in the HTTP server. This method is called regardless of whether [ThrowExceptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions.md) is enabled or not. |
| [OnHttpRequestClose\(HttpServerExecutionResult\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.OnHttpRequestClose.md#Sisk_Core_Http_Handlers_HttpServerHandler_OnHttpRequestClose_Sisk_Core_Http_HttpServerExecutionResult_) | Event that is called when an [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) is closed in the HTTP server. |
| [OnHttpRequestOpen\(HttpRequest\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.OnHttpRequestOpen.md#Sisk_Core_Http_Handlers_HttpServerHandler_OnHttpRequestOpen_Sisk_Core_Http_HttpRequest_) | Event that is called when an [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) is received in the HTTP server. |
| [OnServerStarted\(HttpServer\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.OnServerStarted.md#Sisk_Core_Http_Handlers_HttpServerHandler_OnServerStarted_Sisk_Core_Http_HttpServer_) | Event that is called immediately after starting the [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md), when it's ready and listening. |
| [OnServerStarting\(HttpServer\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.OnServerStarting.md#Sisk_Core_Http_Handlers_HttpServerHandler_OnServerStarting_Sisk_Core_Http_HttpServer_) | Event that is called immediately before starting the [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md). |
| [OnServerStopped\(HttpServer\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.OnServerStopped.md#Sisk_Core_Http_Handlers_HttpServerHandler_OnServerStopped_Sisk_Core_Http_HttpServer_) | Event that is called after the [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md) is stopped, meaning it has stopped from listening to requests. |
| [OnServerStopping\(HttpServer\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.OnServerStopping.md#Sisk_Core_Http_Handlers_HttpServerHandler_OnServerStopping_Sisk_Core_Http_HttpServer_) | Event that is called before the [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md) stop, when it is stopping from listening requests. |
| [OnSetupRouter\(Router\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.OnSetupRouter.md#Sisk_Core_Http_Handlers_HttpServerHandler_OnSetupRouter_Sisk_Core_Routing_Router_) | Event that is called when an [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) is binded to the HTTP server. |
