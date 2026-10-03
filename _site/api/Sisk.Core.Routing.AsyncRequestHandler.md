# AsyncRequestHandler

Kind: Class  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.AsyncRequestHandler.html

Represents a class that implements [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md) and its execution method is asynchronous.

```csharp
public abstract class AsyncRequestHandler : IRequestHandler
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[AsyncRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.AsyncRequestHandler.md)

#### Implements

[IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md)

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
| [AsyncRequestHandler\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.AsyncRequestHandler.-ctor.md#Sisk_Core_Routing_AsyncRequestHandler__ctor) |  |

## Properties

| Name | Description |
| --- | --- |
| [ExecutionMode](https://docs.sisk-framework.org/api/Sisk.Core.Routing.AsyncRequestHandler.ExecutionMode.md#Sisk_Core_Routing_AsyncRequestHandler_ExecutionMode) | Gets or sets when this [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md) should run. |

## Methods

| Name | Description |
| --- | --- |
| [Create\(Func<HttpRequest, HttpContext, Task<HttpResponse?\>\>, RequestHandlerExecutionMode\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.AsyncRequestHandler.Create.md#Sisk_Core_Routing_AsyncRequestHandler_Create_System_Func_Sisk_Core_Http_HttpRequest_Sisk_Core_Http_HttpContext_System_Threading_Tasks_Task_Sisk_Core_Http_HttpResponse___Sisk_Core_Routing_RequestHandlerExecutionMode_) | Gets an inline [AsyncRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.AsyncRequestHandler.md) that resolves to the specified function. |
| [ExecuteAsync\(HttpRequest, HttpContext\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.AsyncRequestHandler.ExecuteAsync.md#Sisk_Core_Routing_AsyncRequestHandler_ExecuteAsync_Sisk_Core_Http_HttpRequest_Sisk_Core_Http_HttpContext_) | This method is called by the [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) before executing a request when the [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) instantiates an object that implements this interface. If it returns a [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) object, the route action is not called and all execution of the route is stopped. If it returns "null", the execution is continued. |
| [Next\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.AsyncRequestHandler.Next.md#Sisk_Core_Routing_AsyncRequestHandler_Next) | Returns an null [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) reference, which points to the next request handler or route action. |
