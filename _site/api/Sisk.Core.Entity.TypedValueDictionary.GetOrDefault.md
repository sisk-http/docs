# TypedValueDictionary.GetOrDefault<T>

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.GetOrDefault.html

## GetOrDefault&lt;T>() {#Sisk_Core_Entity_TypedValueDictionary_GetOrDefault__1}

Gets a singleton previously defined in this context bag via its type `T`.
Returns the default value if the object is not defined.

```csharp
public T? GetOrDefault<T>() where T : notnull
```

### Returns

 T?

The object of type `T` if it exists; otherwise, [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

### Type Parameters

`T` 

The type of the object defined in this context bag.
