# JsonRpcMethodCollection.AddMethodsFromType<T>

Kind: Method  
Namespace: `Sisk.JsonRPC`  
Assembly: `Sisk.JsonRPC.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcMethodCollection.AddMethodsFromType.html

## AddMethodsFromType&lt;T>(T, bool) {#Sisk_JsonRPC_JsonRpcMethodCollection_AddMethodsFromType__1___0_System_Boolean_}

Adds methods from the specified type to the collection, optionally prefixing method names with the type name.

```csharp
public void AddMethodsFromType<T>(T target, bool prefixTypes = false) where T : notnull
```

### Parameters

`target` T

The target object instance containing the methods.

`prefixTypes` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

Indicates whether to prefix method names with the type name.

### Type Parameters

`T` 

The type from which to scan and add methods.

## AddMethodsFromType(Type, object?, bool) {#Sisk_JsonRPC_JsonRpcMethodCollection_AddMethodsFromType_System_Type_System_Object_System_Boolean_}

Adds methods from the specified type to the collection, optionally prefixing method names with the type name.

```csharp
public void AddMethodsFromType(Type type, object? target, bool prefixTypes)
```

### Parameters

`type` [Type](https://learn.microsoft.com/dotnet/api/system.type)

The type from which to scan and add methods.

`target` [object](https://learn.microsoft.com/dotnet/api/system.object)?

The target object instance containing the methods.

`prefixTypes` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

Indicates whether to prefix method names with the type name.

## AddMethodsFromType(Type, object?) {#Sisk_JsonRPC_JsonRpcMethodCollection_AddMethodsFromType_System_Type_System_Object_}

Adds methods from the specified type to the collection without prefixing method names.

```csharp
public void AddMethodsFromType(Type type, object? target)
```

### Parameters

`type` [Type](https://learn.microsoft.com/dotnet/api/system.type)

The type from which to scan and add methods.

`target` [object](https://learn.microsoft.com/dotnet/api/system.object)?

The target object instance containing the methods.

## AddMethodsFromType(Type) {#Sisk_JsonRPC_JsonRpcMethodCollection_AddMethodsFromType_System_Type_}

Adds methods from the specified type to the collection without prefixing method names.

```csharp
public void AddMethodsFromType(Type type)
```

### Parameters

`type` [Type](https://learn.microsoft.com/dotnet/api/system.type)

The type from which to scan and add methods.
