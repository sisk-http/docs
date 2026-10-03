# TypedValueDictionary.GetOrAdd<T>

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAdd.html

## GetOrAdd&lt;T>(Func&lt;T>) {#Sisk_Core_Entity_TypedValueDictionary_GetOrAdd__1_System_Func___0__}

Gets a singleton previously defined in this context bag via its type `T`.
If it does not exist, it adds the object to the context bag using the provided `getter` function.

```csharp
public T GetOrAdd<T>(Func<T> getter) where T : notnull
```

### Parameters

`getter` [Func](https://learn.microsoft.com/dotnet/api/system.func\-1)<T\>

A function that provides the object to be added if it does not exist.

### Returns

 T

The object of type `T` from the context bag.

### Type Parameters

`T` 

The type of the object defined in this context bag.

## GetOrAdd&lt;T>() {#Sisk_Core_Entity_TypedValueDictionary_GetOrAdd__1}

Gets a singleton previously defined in this context bag via its type `T`.
If it does not exist, it adds the object to the context bag by creating a new instance of `T`.

```csharp
public T GetOrAdd<T>() where T : notnull, new()
```

### Returns

 T

The object of type `T` from the context bag.

### Type Parameters

`T` 

The type of the object defined in this context bag. It must have a public parameterless constructor.
