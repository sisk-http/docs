# TypedValueDictionary

Kind: Class  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.html

Represents the base class for storing and retriving data by their type.

```csharp
public class TypedValueDictionary : IDictionary<string, object?>, ICollection<KeyValuePair<string, object?>>, IEnumerable<KeyValuePair<string, object?>>, IEnumerable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[TypedValueDictionary](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.md)

#### Implements

[IDictionary<string, object?\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.idictionary\-2), 
[ICollection<KeyValuePair<string, object?\>\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.icollection\-1), 
[IEnumerable<KeyValuePair<string, object?\>\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable\-1), 
[IEnumerable](https://learn.microsoft.com/dotnet/api/system.collections.ienumerable)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.MemberwiseClone\(\)](https://learn.microsoft.com/dotnet/api/system.object.memberwiseclone), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [TypedValueDictionary\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.-ctor.md#Sisk_Core_Entity_TypedValueDictionary__ctor) | Creates an new [TypedValueDictionary](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.md) instance with default parameters. |
| [TypedValueDictionary\(StringComparer\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.-ctor.md#Sisk_Core_Entity_TypedValueDictionary__ctor_System_StringComparer_) | Creates an new [TypedValueDictionary](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.md) instance with default parameters with the specified [StringComparer](https://learn.microsoft.com/dotnet/api/system.stringcomparer). |

## Methods

| Name | Description |
| --- | --- |
| [Get<T\>\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.Get.md#Sisk_Core_Entity_TypedValueDictionary_Get__1) | Gets a singleton previously defined in this context bag via it's type `T`. |
| [GetOrAdd<T\>\(Func<T\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAdd.md#Sisk_Core_Entity_TypedValueDictionary_GetOrAdd__1_System_Func___0__) | Gets a singleton previously defined in this context bag via its type `T`. If it does not exist, it adds the object to the context bag using the provided `getter` function. |
| [GetOrAdd<T\>\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAdd.md#Sisk_Core_Entity_TypedValueDictionary_GetOrAdd__1) | Gets a singleton previously defined in this context bag via its type `T`. If it does not exist, it adds the object to the context bag by creating a new instance of `T`. |
| [GetOrAddAsync<T\>\(Func<Task<T\>\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAddAsync.md#Sisk_Core_Entity_TypedValueDictionary_GetOrAddAsync__1_System_Func_System_Threading_Tasks_Task___0___) | Asynchronously gets a singleton previously defined in this context bag via its type `T`. If it does not exist, it adds the object to the context bag using the provided asynchronous `getter` function. |
| [GetOrDefault<T\>\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.GetOrDefault.md#Sisk_Core_Entity_TypedValueDictionary_GetOrDefault__1) | Gets a singleton previously defined in this context bag via its type `T`. Returns the default value if the object is not defined. |
| [GetTypeKeyName\(Type\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.GetTypeKeyName.md#Sisk_Core_Entity_TypedValueDictionary_GetTypeKeyName_System_Type_) | Gets the Type full qualified key name. |
| [GetValue\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.GetValue.md#Sisk_Core_Entity_TypedValueDictionary_GetValue_System_String_) | Gets the value associated with the specified key. |
| [GetValue<T\>\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.GetValue.md#Sisk_Core_Entity_TypedValueDictionary_GetValue__1_System_String_) | Gets the value associated with the specified key, and converts it to the specified type. |
| [IsSet<T\>\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.IsSet.md#Sisk_Core_Entity_TypedValueDictionary_IsSet__1) | Determines whether the specified `T` singleton is defined in this context. |
| [IsSet<T\>\(out T\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.IsSet.md#Sisk_Core_Entity_TypedValueDictionary_IsSet__1___0__) | Determines whether the specified `T` singleton is defined in this context and tries to output it. |
| [Set<T\>\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.Set.md#Sisk_Core_Entity_TypedValueDictionary_Set__1) | Creates and adds an singleton of `T` in this context bag. |
| [Set<T\>\(T\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.Set.md#Sisk_Core_Entity_TypedValueDictionary_Set__1___0_) | Adds an singleton of `T` in this context bag. |
| [SetValue\(string, object?\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.SetValue.md#Sisk_Core_Entity_TypedValueDictionary_SetValue_System_String_System_Object_) | Sets the value associated with the specified key. |
| [TryGetValue<TResult\>\(string, out TResult?\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.TryGetValue.md#Sisk_Core_Entity_TypedValueDictionary_TryGetValue__1_System_String___0__) | Gets the value associated with the specified key and casts it into `TResult`. |
| [Unset<T\>\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.Unset.md#Sisk_Core_Entity_TypedValueDictionary_Unset__1) | Removes an singleton object from it's type `T`. |
