# JsonRpcMethodCollection

Kind: Class  
Namespace: `Sisk.JsonRPC`  
Assembly: `Sisk.JsonRPC.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcMethodCollection.html

Represents a collection of JSON-RPC methods, allowing for dynamic addition and removal of methods.

```csharp
public sealed class JsonRpcMethodCollection
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[JsonRpcMethodCollection](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcMethodCollection.md)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [JsonRpcMethodCollection\(\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcMethodCollection.-ctor.md#Sisk_JsonRPC_JsonRpcMethodCollection__ctor) |  |

## Methods

| Name | Description |
| --- | --- |
| [AddMethod\(string, Delegate\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcMethodCollection.AddMethod.md#Sisk_JsonRPC_JsonRpcMethodCollection_AddMethod_System_String_System_Delegate_) | Adds a method to the collection with the specified name. |
| [AddMethodsFromType<T\>\(T, bool\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcMethodCollection.AddMethodsFromType.md#Sisk_JsonRPC_JsonRpcMethodCollection_AddMethodsFromType__1___0_System_Boolean_) | Adds methods from the specified type to the collection, optionally prefixing method names with the type name. |
| [AddMethodsFromType\(Type, object?, bool\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcMethodCollection.AddMethodsFromType.md#Sisk_JsonRPC_JsonRpcMethodCollection_AddMethodsFromType_System_Type_System_Object_System_Boolean_) | Adds methods from the specified type to the collection, optionally prefixing method names with the type name. |
| [AddMethodsFromType\(Type, object?\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcMethodCollection.AddMethodsFromType.md#Sisk_JsonRPC_JsonRpcMethodCollection_AddMethodsFromType_System_Type_System_Object_) | Adds methods from the specified type to the collection without prefixing method names. |
| [AddMethodsFromType\(Type\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcMethodCollection.AddMethodsFromType.md#Sisk_JsonRPC_JsonRpcMethodCollection_AddMethodsFromType_System_Type_) | Adds methods from the specified type to the collection without prefixing method names. |
| [RemoveMethod\(string\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcMethodCollection.RemoveMethod.md#Sisk_JsonRPC_JsonRpcMethodCollection_RemoveMethod_System_String_) | Removes a method from the collection by its name. |
