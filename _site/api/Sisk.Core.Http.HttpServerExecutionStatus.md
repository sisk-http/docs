# HttpServerExecutionStatus

Kind: Enum  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerExecutionStatus.html

Represents the status of an execution of a request on an [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md).

```csharp
public enum HttpServerExecutionStatus
```

## Fields

| Name | Description |
| --- | --- |
| `ConnectionClosed = 3` | Represents that the connection stream was closed by the client. |
| `ContentServedOnIllegalMethod = 1` | Represents that the request has sent an request body with an with a HTTP method that is not indicated for receiving request contents. |
| `ContentTooLarge = 2` | Represents that the content of the request is too large than what was configured on the server, or it's bigger than the max supported size (2GB). |
| `DnsFailed = 5` | Represents that the client did not correctly specify a host in the request. |
| `DnsUnknownHost = 6` | Represents that the client requested an host that's not been set up on this server. |
| `ExceptionThrown = 7` | Indicates that the server encountered an exception while processing the request. |
| `Executed = 0` | Represents that the request was closed by the HTTP server and executed by a router and its response was succesfully delivered. |
| `ListeningHostNotReady = 9` | Indicates that the DNS was successful, however the matched [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md) does not have an valid initialized router. |
| `MalformedRequest = 10` | Indicates that the server cannot or will not process the request due to something that is perceived to be a client error. |
| `NoResponse = 4` | Represents that the router did not deliver a response to the received request. |
| `RemoteRequestDropped = 11` | Indicates that the HTTP server closed an unwanted remote connection. |
| `UncaughtExceptionThrown = 8` | Indicates that the router encontered an uncaught exception while calling it's action function. |
