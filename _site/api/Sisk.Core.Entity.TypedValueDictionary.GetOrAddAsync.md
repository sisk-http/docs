# TypedValueDictionary.GetOrAddAsync<T>

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAddAsync.html

## GetOrAddAsync&lt;T>(Func&lt;Task&lt;T>>) {#Sisk_Core_Entity_TypedValueDictionary_GetOrAddAsync__1_System_Func_System_Threading_Tasks_Task___0___}

Asynchronously gets a singleton previously defined in this context bag via its type `T`.
If it does not exist, it adds the object to the context bag using the provided asynchronous `getter` function.

```csharp
public Task<T> GetOrAddAsync<T>(Func<Task<T>> getter) where T : notnull
```

### Parameters

`getter` [Func](https://learn.microsoft.com/dotnet/api/system.func\-1)<[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<T\>\>

An asynchronous function that provides the object to be added if it does not exist.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<T\>

A task that represents the asynchronous operation. The task result contains the object of type `T` from the context bag.

### Type Parameters

`T` 

The type of the object defined in this context bag.
