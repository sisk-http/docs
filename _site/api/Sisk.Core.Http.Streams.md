# Sisk.Core.Http.Streams

Kind: Namespace  
Namespace: `Sisk.Core.Http.Streams`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.html

### Classes

| Name | Description |
| --- | --- |
| [HttpEventSourceCollection](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.md) | Provides a managed object to manage [HttpRequestEventSource](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.md) connections. |
| [HttpRequestEventSource](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.md) | An [HttpRequestEventSource](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.md) instance opens a persistent connection to the request, which sends events in text/event-stream format. |
| [HttpResponseStreamManager](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpResponseStreamManager.md) | Represents a way to manage HTTP requests with their output streams, without relying on synchronous content. |
| [HttpStreamPingPolicy](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpStreamPingPolicy.md) | Provides an automatic ping sender for HTTP Event Source connections. |
| [HttpWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.md) | Provides an persistent bi-directional socket between the client and the HTTP server. |
| [HttpWebSocketConnectionCollection](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocketConnectionCollection.md) | Provides a managed object to manage [HttpWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.md) connections. |
| [WebSocketMessage](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.WebSocketMessage.md) | Represents an websocket request message received by an websocket server. |

### Delegates

| Name | Description |
| --- | --- |
| [EventSourceRegistrationHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.EventSourceRegistrationHandler.md) | Represents an function that is called when an [HttpEventSourceCollection](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.md) registers an new event source connection. |
| [EventSourceUnregistrationHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.EventSourceUnregistrationHandler.md) | Represents an function that is called when an [HttpEventSourceCollection](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.md) is removed and had their connection closed. |
| [WebSocketRegistrationHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.WebSocketRegistrationHandler.md) | Represents an function that is called when an [HttpWebSocketConnectionCollection](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocketConnectionCollection.md) registers an new web socket connection. |
| [WebSocketUnregistrationHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.WebSocketUnregistrationHandler.md) | Represents an function that is called when an [HttpWebSocketConnectionCollection](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocketConnectionCollection.md) is removed and had it's connection closed. |
