# AsyncHttpServerHandler.OnContextBagCreatedAsync

Kind: Method  
Namespace: `Sisk.Core.Http.Handlers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.AsyncHttpServerHandler.OnContextBagCreatedAsync.html

## OnContextBagCreatedAsync(TypedValueDictionary) {#Sisk_Core_Http_Handlers_AsyncHttpServerHandler_OnContextBagCreatedAsync_Sisk_Core_Entity_TypedValueDictionary_}

Method that is called when an HTTP context is created within an
[HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) object.

```csharp
protected virtual Task OnContextBagCreatedAsync(TypedValueDictionary contextBag)
```

### Parameters

`contextBag` [TypedValueDictionary](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.md)

The creating context bag.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)
