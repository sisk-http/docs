# HttpServerEngineContextEventLoopMecanism

Kind: Enum  
Namespace: `Sisk.Core.Http.Engine`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextEventLoopMecanism.html

Represents the mechanism used by the HTTP server engine context event loop.

```csharp
public enum HttpServerEngineContextEventLoopMecanism
```

## Fields

| Name | Description |
| --- | --- |
| `EngineManagedContext = 2` | The engine invokes the [HandleContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.HandleContext.md) directly. |
| `InlineAsyncronousGetContext = 1` | The event loop is inline and uses an asynchronous GetContextAsync operation. |
| `UnboundAsyncronousGetContext = 0` | The event loop is unbound and uses both asyncronous BeginGetContext and EndGetContext operations. |
