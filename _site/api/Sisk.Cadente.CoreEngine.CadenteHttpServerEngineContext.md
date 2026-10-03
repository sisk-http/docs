# CadenteHttpServerEngineContext

Kind: Class  
Namespace: `Sisk.Cadente.CoreEngine`  
Assembly: `Sisk.Cadente.CoreEngine.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineContext.html

Represents the context for an HTTP request and response within the Cadente engine.

```csharp
public sealed class CadenteHttpServerEngineContext : HttpServerEngineContext
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
HttpServerEngineContext ← 
[CadenteHttpServerEngineContext](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineContext.md)

#### Inherited Members

HttpServerEngineContext.AcceptWebSocketAsync\(string?\), 
HttpServerEngineContext.Request, 
HttpServerEngineContext.Response, 
HttpServerEngineContext.ContextAbortedToken, 
[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [CadenteHttpServerEngineContext\(CadenteHttpServerEngineRequest, CadenteHttpServerEngineResponse\)](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineContext.-ctor.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineContext__ctor_Sisk_Cadente_CoreEngine_CadenteHttpServerEngineRequest_Sisk_Cadente_CoreEngine_CadenteHttpServerEngineResponse_) |  |

## Properties

| Name | Description |
| --- | --- |
| [ContextAbortedToken](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineContext.ContextAbortedToken.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineContext_ContextAbortedToken) | Gets a value that indicates whether the HTTP connection has been aborted. |
| [ProcessingTask](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineContext.ProcessingTask.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineContext_ProcessingTask) | Gets a task that represents the completion of the processing for this context. |
| [Request](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineContext.Request.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineContext_Request) | Gets the HTTP request associated with the context. |
| [Response](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineContext.Response.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineContext_Response) | Gets the HTTP response associated with the context. |

## Methods

| Name | Description |
| --- | --- |
| [AcceptWebSocketAsync\(string?\)](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineContext.AcceptWebSocketAsync.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineContext_AcceptWebSocketAsync_System_String_) | Accepts a WebSocket connection asynchronously. |
