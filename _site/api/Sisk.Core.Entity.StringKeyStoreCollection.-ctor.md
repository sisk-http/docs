# StringKeyStoreCollection constructor

Kind: Constructor  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.-ctor.html

## StringKeyStoreCollection() {#Sisk_Core_Entity_StringKeyStoreCollection__ctor}

Initializes a new instance of the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) class,

```csharp
public StringKeyStoreCollection()
```

## StringKeyStoreCollection(IEqualityComparer&lt;string>) {#Sisk_Core_Entity_StringKeyStoreCollection__ctor_System_Collections_Generic_IEqualityComparer_System_String__}

Initializes a new instance of the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) class with a specified comparer.

```csharp
public StringKeyStoreCollection(IEqualityComparer<string> comparer)
```

### Parameters

`comparer` [IEqualityComparer](https://learn.microsoft.com/dotnet/api/system.collections.generic.iequalitycomparer\-1)<[string](https://learn.microsoft.com/dotnet/api/system.string)\>

The comparer used for key equality.

## StringKeyStoreCollection(IEqualityComparer&lt;string>, IDictionary&lt;string, string[]>?) {#Sisk_Core_Entity_StringKeyStoreCollection__ctor_System_Collections_Generic_IEqualityComparer_System_String__System_Collections_Generic_IDictionary_System_String_System_String____}

Initializes a new instance of the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) class,

```csharp
public StringKeyStoreCollection(IEqualityComparer<string> comparer, IDictionary<string, string[]>? items)
```

### Parameters

`comparer` [IEqualityComparer](https://learn.microsoft.com/dotnet/api/system.collections.generic.iequalitycomparer\-1)<[string](https://learn.microsoft.com/dotnet/api/system.string)\>

The comparer used for key equality.

`items` [IDictionary](https://learn.microsoft.com/dotnet/api/system.collections.generic.idictionary\-2)<[string](https://learn.microsoft.com/dotnet/api/system.string), [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]\>?

The inner collection to add to this instance.
