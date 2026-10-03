# StringKeyStoreCollection.Set

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Set.html

## Set(KeyValuePair&lt;string, string[]>) {#Sisk_Core_Entity_StringKeyStoreCollection_Set_System_Collections_Generic_KeyValuePair_System_String_System_String____}

Sets the value associated with the specified key, replacing any existing values.

```csharp
public void Set(KeyValuePair<string, string[]> item)
```

### Parameters

`item` [KeyValuePair](https://learn.microsoft.com/dotnet/api/system.collections.generic.keyvaluepair\-2)<[string](https://learn.microsoft.com/dotnet/api/system.string), [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]\>

The key-value pair to add, where the key is associated with an array of values.

## Set(string, string) {#Sisk_Core_Entity_StringKeyStoreCollection_Set_System_String_System_String_}

Sets the value associated with the specified key, replacing any existing values.

```csharp
public void Set(string key, string value)
```

### Parameters

`key` [string](https://learn.microsoft.com/dotnet/api/system.string)

The key for which to set the value.

`value` [string](https://learn.microsoft.com/dotnet/api/system.string)

The value to associate with the key.

## Set(string, IEnumerable&lt;string>) {#Sisk_Core_Entity_StringKeyStoreCollection_Set_System_String_System_Collections_Generic_IEnumerable_System_String__}

Sets the collection of values associated with the specified key, replacing any existing values.

```csharp
public void Set(string key, IEnumerable<string> value)
```

### Parameters

`key` [string](https://learn.microsoft.com/dotnet/api/system.string)

The key for which to set the values.

`value` [IEnumerable](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable\-1)<[string](https://learn.microsoft.com/dotnet/api/system.string)\>

The collection of values to associate with the key.
