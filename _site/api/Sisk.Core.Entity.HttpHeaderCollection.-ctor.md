# HttpHeaderCollection constructor

Kind: Constructor  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.-ctor.html

## HttpHeaderCollection() {#Sisk_Core_Entity_HttpHeaderCollection__ctor}

Create an new instance of the [HttpHeaderCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.md) class.

```csharp
public HttpHeaderCollection()
```

## HttpHeaderCollection(IDictionary&lt;string, string[]>) {#Sisk_Core_Entity_HttpHeaderCollection__ctor_System_Collections_Generic_IDictionary_System_String_System_String____}

Create an new instance of the [HttpHeaderCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.md) class with values from another
collection.

```csharp
public HttpHeaderCollection(IDictionary<string, string[]> items)
```

### Parameters

`items` [IDictionary](https://learn.microsoft.com/dotnet/api/system.collections.generic.idictionary\-2)<[string](https://learn.microsoft.com/dotnet/api/system.string), [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]\>

The inner collection to add to this collection.

## HttpHeaderCollection(IDictionary&lt;string, string?>) {#Sisk_Core_Entity_HttpHeaderCollection__ctor_System_Collections_Generic_IDictionary_System_String_System_String__}

Create an new instance of the [HttpHeaderCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.md) class with values from another
collection.

```csharp
public HttpHeaderCollection(IDictionary<string, string?> items)
```

### Parameters

`items` [IDictionary](https://learn.microsoft.com/dotnet/api/system.collections.generic.idictionary\-2)<[string](https://learn.microsoft.com/dotnet/api/system.string), [string](https://learn.microsoft.com/dotnet/api/system.string)?\>

The inner collection to add to this collection.

## HttpHeaderCollection(WebHeaderCollection) {#Sisk_Core_Entity_HttpHeaderCollection__ctor_System_Net_WebHeaderCollection_}

Create an new instance of the [HttpHeaderCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.md) class with values from another
collection.

```csharp
public HttpHeaderCollection(WebHeaderCollection items)
```

### Parameters

`items` [WebHeaderCollection](https://learn.microsoft.com/dotnet/api/system.net.webheadercollection)

The inner collection to add to this collection.
