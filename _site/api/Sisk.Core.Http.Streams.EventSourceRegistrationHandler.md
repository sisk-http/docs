# EventSourceRegistrationHandler

Kind: Delegate  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.EventSourceRegistrationHandler.html

Represents an function that is called when an [HttpEventSourceCollection](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.md) registers an new event source connection.

```csharp
public delegate void EventSourceRegistrationHandler(object sender, HttpRequestEventSource eventSource)
```

#### Parameters

`sender` [object](https://learn.microsoft.com/dotnet/api/system.object)

Represents the caller [HttpEventSourceCollection](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.md) object.

`eventSource` [HttpRequestEventSource](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.md)

Represents the registered [HttpRequestEventSource](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.md) event source connection.
