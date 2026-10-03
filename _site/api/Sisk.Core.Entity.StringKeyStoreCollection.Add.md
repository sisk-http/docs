# StringKeyStoreCollection.Add

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Add.html

## Add(string, string[]) {#Sisk_Core_Entity_StringKeyStoreCollection_Add_System_String_System_String___}

Adds an array of values associated with the specified key.

```csharp
public void Add(string key, string[] value)
```

### Parameters

`key` [string](https://learn.microsoft.com/dotnet/api/system.string)

The key to which the values will be added.

`value` [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]

The array of values to associate with the key.

## Add(string, IEnumerable&lt;string>) {#Sisk_Core_Entity_StringKeyStoreCollection_Add_System_String_System_Collections_Generic_IEnumerable_System_String__}

Adds a collection of values associated with the specified key.

```csharp
public void Add(string key, IEnumerable<string> value)
```

### Parameters

`key` [string](https://learn.microsoft.com/dotnet/api/system.string)

The key to which the values will be added.

`value` [IEnumerable](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable\-1)<[string](https://learn.microsoft.com/dotnet/api/system.string)\>

The collection of values to associate with the key.

## Add(string, string) {#Sisk_Core_Entity_StringKeyStoreCollection_Add_System_String_System_String_}

Adds a single value associated with the specified key.

```csharp
public void Add(string key, string value)
```

### Parameters

`key` [string](https://learn.microsoft.com/dotnet/api/system.string)

The key to which the value will be added.

`value` [string](https://learn.microsoft.com/dotnet/api/system.string)

The value to associate with the key.

## Add(KeyValuePair&lt;string, string[]>) {#Sisk_Core_Entity_StringKeyStoreCollection_Add_System_Collections_Generic_KeyValuePair_System_String_System_String____}

Adds a key-value pair to the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md).

```csharp
public void Add(KeyValuePair<string, string[]> item)
```

### Parameters

`item` [KeyValuePair](https://learn.microsoft.com/dotnet/api/system.collections.generic.keyvaluepair\-2)<[string](https://learn.microsoft.com/dotnet/api/system.string), [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]\>

The key-value pair to add, where the key is associated with an array of values.
