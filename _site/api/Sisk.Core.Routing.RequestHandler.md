# RequestHandler

Kind: Class  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.RequestHandler.html

Represents an abstract class which implements [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md).

```csharp
public abstract class RequestHandler : IRequestHandler
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[RequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RequestHandler.md)

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
| [RequestHandler\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RequestHandler.-ctor.md#Sisk_Core_Routing_RequestHandler__ctor) |  |

## Methods

| Name | Description |
| --- | --- |
| [Create\(Func<HttpRequest, HttpContext, HttpResponse?\>, RequestHandlerExecutionMode\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RequestHandler.Create.md#Sisk_Core_Routing_RequestHandler_Create_System_Func_Sisk_Core_Http_HttpRequest_Sisk_Core_Http_HttpContext_Sisk_Core_Http_HttpResponse__Sisk_Core_Routing_RequestHandlerExecutionMode_) | Gets an inline [RequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RequestHandler.md) that resolves to the specified function. |
| [Next\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RequestHandler.Next.md#Sisk_Core_Routing_RequestHandler_Next) | Returns an null [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) reference, which points to the next request handler or route action. |
