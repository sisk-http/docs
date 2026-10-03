# HttpServerEngineContext

Kind: Class  
Namespace: `Sisk.Core.Http.Engine`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContext.html

Provides an abstract base class for HTTP contexts.

```csharp
public abstract class HttpServerEngineContext
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpServerEngineContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContext.md)

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
| [HttpServerEngineContext\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContext.-ctor.md#Sisk_Core_Http_Engine_HttpServerEngineContext__ctor) |  |

## Properties

| Name | Description |
| --- | --- |
| [ContextAbortedToken](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContext.ContextAbortedToken.md#Sisk_Core_Http_Engine_HttpServerEngineContext_ContextAbortedToken) | Gets a value that indicates whether the HTTP connection has been aborted. |
| [Request](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContext.Request.md#Sisk_Core_Http_Engine_HttpServerEngineContext_Request) | Gets the HTTP request associated with the context. |
| [Response](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContext.Response.md#Sisk_Core_Http_Engine_HttpServerEngineContext_Response) | Gets the HTTP response associated with the context. |

## Methods

| Name | Description |
| --- | --- |
| [AcceptWebSocketAsync\(string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContext.AcceptWebSocketAsync.md#Sisk_Core_Http_Engine_HttpServerEngineContext_AcceptWebSocketAsync_System_String_) | Accepts a WebSocket connection asynchronously. |
