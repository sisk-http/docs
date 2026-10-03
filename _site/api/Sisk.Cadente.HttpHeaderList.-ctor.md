# HttpHeaderList constructor

Kind: Constructor  
Namespace: `Sisk.Cadente`  
Assembly: `Sisk.Cadente.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.-ctor.html

## HttpHeaderList() {#Sisk_Cadente_HttpHeaderList__ctor}

Initializes a new instance of the [HttpHeaderList](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.md) class.

```csharp
public HttpHeaderList()
```

## HttpHeaderList(int) {#Sisk_Cadente_HttpHeaderList__ctor_System_Int32_}

Initializes a new instance of the [HttpHeaderList](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.md) class with the specified initial capacity.

```csharp
public HttpHeaderList(int capacity)
```

### Parameters

`capacity` [int](https://learn.microsoft.com/dotnet/api/system.int32)

The number of elements that the new list can initially store.

## HttpHeaderList(IEnumerable&lt;HttpHeader>) {#Sisk_Cadente_HttpHeaderList__ctor_System_Collections_Generic_IEnumerable_Sisk_Cadente_HttpHeader__}

Initializes a new instance of the [HttpHeaderList](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.md) class that contains elements copied from the specified collection.

```csharp
public HttpHeaderList(IEnumerable<HttpHeader> headers)
```

### Parameters

`headers` [IEnumerable](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable\-1)<[HttpHeader](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.md)\>

The collection whose elements are copied to the new list.

## HttpHeaderList(IEnumerable&lt;HttpHeader>, bool) {#Sisk_Cadente_HttpHeaderList__ctor_System_Collections_Generic_IEnumerable_Sisk_Cadente_HttpHeader__System_Boolean_}

Initializes a new instance of the [HttpHeaderList](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.md) class that contains elements copied from the specified collection.

```csharp
public HttpHeaderList(IEnumerable<HttpHeader> headers, bool readOnly = false)
```

### Parameters

`headers` [IEnumerable](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable\-1)<[HttpHeader](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.md)\>

The collection whose elements are copied to the new list.

`readOnly` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) to make the list read-only; otherwise, [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).
