# EventSourceUnregistrationHandler

Kind: Delegate  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.EventSourceUnregistrationHandler.html

Represents an function that is called when an [HttpEventSourceCollection](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.md) is removed and had their connection closed.

```csharp
public delegate void EventSourceUnregistrationHandler(object sender, HttpRequestEventSource eventSource)
```

#### Parameters

`sender` [object](https://learn.microsoft.com/dotnet/api/system.object)

Represents the caller [HttpEventSourceCollection](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.md) object.

`eventSource` [HttpRequestEventSource](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.md)

Represents the closed [HttpRequestEventSource](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.md) event source connection.
