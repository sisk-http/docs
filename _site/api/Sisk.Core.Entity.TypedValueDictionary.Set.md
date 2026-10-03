# TypedValueDictionary.Set<T>

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.Set.html

## Set&lt;T>() {#Sisk_Core_Entity_TypedValueDictionary_Set__1}

Creates and adds an singleton of `T` in this context bag.

```csharp
public T Set<T>() where T : notnull, new()
```

### Returns

 T

### Type Parameters

`T` 

The object that will be defined in this context bag.

## Set&lt;T>(T) {#Sisk_Core_Entity_TypedValueDictionary_Set__1___0_}

Adds an singleton of `T` in this context bag.

```csharp
public T Set<T>(T value) where T : notnull
```

### Parameters

`value` T

The instance of `T` which will be defined in this context bag.

### Returns

 T

### Type Parameters

`T` 

The object that will be defined in this context bag.
