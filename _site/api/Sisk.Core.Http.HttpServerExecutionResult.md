# HttpServerExecutionResult

Kind: Class  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerExecutionResult.html

Represents the results of an request execution on the HTTP server.

```csharp
public sealed class HttpServerExecutionResult
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpServerExecutionResult](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerExecutionResult.md)

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
| [Context](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerExecutionResult.Context.md#Sisk_Core_Http_HttpServerExecutionResult_Context) | Gets the [HttpContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.md) of this execution result. |
| [Elapsed](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerExecutionResult.Elapsed.md#Sisk_Core_Http_HttpServerExecutionResult_Elapsed) | Gets the total processing time of the HTTP session. |
| [IsSuccessStatus](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerExecutionResult.IsSuccessStatus.md#Sisk_Core_Http_HttpServerExecutionResult_IsSuccessStatus) | Gets an boolean indicating if this execution status is an success status. |
| [Request](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerExecutionResult.Request.md#Sisk_Core_Http_HttpServerExecutionResult_Request) | Gets the [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) received in this diagnosis. |
| [RequestSize](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerExecutionResult.RequestSize.md#Sisk_Core_Http_HttpServerExecutionResult_RequestSize) | Gets the estimated request size in bytes. |
| [Response](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerExecutionResult.Response.md#Sisk_Core_Http_HttpServerExecutionResult_Response) | Gets the resulted [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) send by the router, if any. This object can be null if the server didn't sent any response to the client. |
| [ResponseSize](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerExecutionResult.ResponseSize.md#Sisk_Core_Http_HttpServerExecutionResult_ResponseSize) | Gets the estimated response size in bytes, if any. |
| [ServerException](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerExecutionResult.ServerException.md#Sisk_Core_Http_HttpServerExecutionResult_ServerException) | Gets the exception that was thrown when executing the route, if any. |
| [Status](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerExecutionResult.Status.md#Sisk_Core_Http_HttpServerExecutionResult_Status) | Gets the status of server operation. |
