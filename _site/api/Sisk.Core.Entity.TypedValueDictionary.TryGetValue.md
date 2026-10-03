# TypedValueDictionary.TryGetValue<TResult>

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.TryGetValue.html

## TryGetValue&lt;TResult>(string, out TResult?) {#Sisk_Core_Entity_TypedValueDictionary_TryGetValue__1_System_String___0__}

Gets the value associated with the specified key and casts it into `TResult`.

```csharp
public bool TryGetValue<TResult>(string key, out TResult? value)
```

### Parameters

`key` [string](https://learn.microsoft.com/dotnet/api/system.string)

The key whose to get.

`value` TResult?

When this method returns, the value associated with the specified key, if the key is found; otherwise, the default value for the type of the value parameter. This parameter is passed uninitialized.

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

true if the object is find with the specified key; otherwise, false.

### Type Parameters

`TResult` 

The type which will be casted into.
