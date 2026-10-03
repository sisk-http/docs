# HttpWebSocketConnectionCollection.Find

Kind: Method  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocketConnectionCollection.Find.html

## Find(Func&lt;string, bool>) {#Sisk_Core_Http_Streams_HttpWebSocketConnectionCollection_Find_System_Func_System_String_System_Boolean__}

Gets all actives [HttpWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.md) instances that matches their identifier predicate.

```csharp
public HttpWebSocket[] Find(Func<string, bool> predicate)
```

### Parameters

`predicate` [Func](https://learn.microsoft.com/dotnet/api/system.func\-2)<[string](https://learn.microsoft.com/dotnet/api/system.string), [bool](https://learn.microsoft.com/dotnet/api/system.boolean)\>

The expression on the an non-empty Web Socket identifier.

### Returns

[HttpWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.md)\[\]
