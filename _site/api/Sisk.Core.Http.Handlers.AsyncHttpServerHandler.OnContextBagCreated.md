# AsyncHttpServerHandler.OnContextBagCreated

Kind: Method  
Namespace: `Sisk.Core.Http.Handlers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.AsyncHttpServerHandler.OnContextBagCreated.html

## OnContextBagCreated(TypedValueDictionary) {#Sisk_Core_Http_Handlers_AsyncHttpServerHandler_OnContextBagCreated_Sisk_Core_Entity_TypedValueDictionary_}

Event that is called when an HTTP context is created within an
[HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) object.

```csharp
protected override sealed void OnContextBagCreated(TypedValueDictionary contextBag)
```

### Parameters

`contextBag` [TypedValueDictionary](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.md)

The creating context bag.
