# Sisk.Core.Http.Engine

Kind: Namespace  
Namespace: `Sisk.Core.Http.Engine`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.html

### Classes

| Name | Description |
| --- | --- |
| [HttpEngineException](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpEngineException.md) | Represents an exception that occurred during the execution of the HTTP engine. |
| [HttpListenerAbstractEngine](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpListenerAbstractEngine.md) | Provides an implementation of [HttpServerEngine](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.md) using [HttpListener](https://learn.microsoft.com/dotnet/api/system.net.httplistener). |
| [HttpServerEngine](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.md) | Provides an abstract base class for HTTP server engines. |
| [HttpServerEngineContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContext.md) | Provides an abstract base class for HTTP contexts. |
| [HttpServerEngineContextRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextRequest.md) | Provides an abstract base class for HTTP requests. |
| [HttpServerEngineContextResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextResponse.md) | Provides an abstract base class for HTTP responses. |
| [HttpServerEngineWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineWebSocket.md) | Provides an abstract base class for WebSocket contexts. |

### Interfaces

| Name | Description |
| --- | --- |
| [IHttpEngineHeaderList](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.IHttpEngineHeaderList.md) | Represents a collection of HTTP headers. |

### Enums

| Name | Description |
| --- | --- |
| [HttpServerEngineContextEventLoopMecanism](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextEventLoopMecanism.md) | Represents the mechanism used by the HTTP server engine context event loop. |
