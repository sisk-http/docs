# TypedValueDictionary.Get<T>

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.Get.html

## Get&lt;T>() {#Sisk_Core_Entity_TypedValueDictionary_Get__1}

Gets a singleton previously defined in this context bag via it's type `T`.

```csharp
public T Get<T>() where T : notnull
```

### Returns

 T

### Type Parameters

`T` 

The type of the object defined in this context bag.
