# HttpContext

Kind: Class  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.html

Represents an context that is shared in a entire HTTP session.

```csharp
public sealed class HttpContext : IDisposable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.md)

#### Implements

[IDisposable](https://learn.microsoft.com/dotnet/api/system.idisposable)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Properties

| Name | Description |
| --- | --- |
| [Current](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.Current.md#Sisk_Core_Http_HttpContext_Current) | Gets the current running [HttpContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.md). |
| [ExtraHeaders](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.ExtraHeaders.md#Sisk_Core_Http_HttpContext_ExtraHeaders) | Gets or sets the [HttpHeaderCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.md) indicating HTTP headers which will be added (not overwritten) in the final response. |
| [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.HttpServer.md#Sisk_Core_Http_HttpContext_HttpServer) | Gets the context [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md) instance. |
| [Interlocked](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.Interlocked.md#Sisk_Core_Http_HttpContext_Interlocked) | Gets the atomic numeric operations available for values stored in [RequestBag](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.RequestBag.md). |
| [IsRequestContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.IsRequestContext.md#Sisk_Core_Http_HttpContext_IsRequestContext) | Gets whether the current thread context is running inside an HTTP context. |
| [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.ListeningHost.md#Sisk_Core_Http_HttpContext_ListeningHost) | Gets the [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md) instance of this HTTP context. |
| [LogMode](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.LogMode.md#Sisk_Core_Http_HttpContext_LogMode) | Gets or sets an [LogOutput](https://docs.sisk-framework.org/api/Sisk.Core.Routing.LogOutput.md) mode for this context, which will overwrite the matched route log mode option. |
| [MatchedRoute](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.MatchedRoute.md#Sisk_Core_Http_HttpContext_MatchedRoute) | Gets the matched [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) for this context. |
| [OverrideHeaders](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.OverrideHeaders.md#Sisk_Core_Http_HttpContext_OverrideHeaders) | Gets or sets an [HttpHeaderCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.md) indicating HTTP headers which will overwrite headers set by CORS, router response or request handlers. |
| [Request](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.Request.md#Sisk_Core_Http_HttpContext_Request) | Gets the [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) which is contained in this HTTP context. |
| [RequestBag](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.RequestBag.md#Sisk_Core_Http_HttpContext_RequestBag) | Gets or sets a managed collection for this HTTP context. |
| [Router](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.Router.md#Sisk_Core_Http_HttpContext_Router) | Gets the [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) where this context was created. |
| [RouterResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.RouterResponse.md#Sisk_Core_Http_HttpContext_RouterResponse) | Gets the [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) for this context. This property acessible when a post-executing [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md) was executed for this router context. |

## Methods

| Name | Description |
| --- | --- |
| [EnqueueDeferredAction\(Action\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.EnqueueDeferredAction.md#Sisk_Core_Http_HttpContext_EnqueueDeferredAction_System_Action_) | Enqueues an action that will be executed after the response is sent to the client. This action runs within the same context, with access to all current context properties before disposal. |
| [EnqueueDeferredAction\(Func<Task\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.EnqueueDeferredAction.md#Sisk_Core_Http_HttpContext_EnqueueDeferredAction_System_Func_System_Threading_Tasks_Task__) | Enqueues an asynchronous action that will be executed after the response is sent to the client. This action runs within the same context, with access to all current context properties before disposal. |
| [EnqueueDeferredAction\(Func<CancellationToken, Task\>, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.EnqueueDeferredAction.md#Sisk_Core_Http_HttpContext_EnqueueDeferredAction_System_Func_System_Threading_CancellationToken_System_Threading_Tasks_Task__System_Threading_CancellationToken_) | Enqueues an asynchronous action that will be executed after the response is sent to the client. This action runs within the same context, with access to all current context properties before disposal. |
| [EnqueueDeferredAction\(Func<CancellationToken, Task\>, TimeSpan\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.EnqueueDeferredAction.md#Sisk_Core_Http_HttpContext_EnqueueDeferredAction_System_Func_System_Threading_CancellationToken_System_Threading_Tasks_Task__System_TimeSpan_) | Enqueues an asynchronous action that will be executed after the response is sent to the client, with a timeout after which the action will be cancelled. This action runs within the same context, with access to all current context properties before disposal. |
| [GetCurrentContext\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.GetCurrentContext.md#Sisk_Core_Http_HttpContext_GetCurrentContext) | Gets the current running [HttpContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.md). |
