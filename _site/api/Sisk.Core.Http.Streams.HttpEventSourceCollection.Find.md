# HttpEventSourceCollection.Find

Kind: Method  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.Find.html

## Find(Func&lt;string, bool>) {#Sisk_Core_Http_Streams_HttpEventSourceCollection_Find_System_Func_System_String_System_Boolean__}

Gets all actives [HttpRequestEventSource](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.md) instances that matches their identifier predicate.

```csharp
public HttpRequestEventSource[] Find(Func<string, bool> predicate)
```

### Parameters

`predicate` [Func](https://learn.microsoft.com/dotnet/api/system.func\-2)<[string](https://learn.microsoft.com/dotnet/api/system.string), [bool](https://learn.microsoft.com/dotnet/api/system.boolean)\>

The expression on the an non-empty event source identifier.

### Returns

[HttpRequestEventSource](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.md)\[\]
