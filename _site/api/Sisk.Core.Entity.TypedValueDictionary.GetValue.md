# TypedValueDictionary.GetValue

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.GetValue.html

## GetValue(string) {#Sisk_Core_Entity_TypedValueDictionary_GetValue_System_String_}

Gets the value associated with the specified key.

```csharp
public object? GetValue(string key)
```

### Parameters

`key` [string](https://learn.microsoft.com/dotnet/api/system.string)

The key of the value to get.

### Returns

[object](https://learn.microsoft.com/dotnet/api/system.object)?

The value associated with the specified key, or [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null) if the key is not found.

## GetValue&lt;T>(string) {#Sisk_Core_Entity_TypedValueDictionary_GetValue__1_System_String_}

Gets the value associated with the specified key, and converts it to the specified type.

```csharp
public T? GetValue<T>(string key)
```

### Parameters

`key` [string](https://learn.microsoft.com/dotnet/api/system.string)

The key of the value to get.

### Returns

 T?

The value associated with the specified key, converted to the specified type, or the default value for the type if the key is not found.

### Type Parameters

`T` 

The type to convert the value to.
