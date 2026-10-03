# TypedValueDictionary.IsSet<T>

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.IsSet.html

## IsSet&lt;T>() {#Sisk_Core_Entity_TypedValueDictionary_IsSet__1}

Determines whether the specified `T` singleton is defined in this context.

```csharp
public bool IsSet<T>() where T : notnull
```

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

### Type Parameters

`T` 

The singleton type.

## IsSet&lt;T>(out T) {#Sisk_Core_Entity_TypedValueDictionary_IsSet__1___0__}

Determines whether the specified `T` singleton is defined in this context and tries to
output it.

```csharp
public bool IsSet<T>(out T value) where T : notnull
```

### Parameters

`value` T

When this method returns, the value associated with the specified key, if the key is found; otherwise, the default value for the type of the value parameter. This parameter is passed uninitialized.

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

True if the object is find with the specified key; otherwise, false.

### Type Parameters

`T` 

The singleton type.
