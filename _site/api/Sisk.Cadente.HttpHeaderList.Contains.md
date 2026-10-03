# HttpHeaderList.Contains

Kind: Method  
Namespace: `Sisk.Cadente`  
Assembly: `Sisk.Cadente.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.Contains.html

## Contains(HttpHeader) {#Sisk_Cadente_HttpHeaderList_Contains_Sisk_Cadente_HttpHeader_}

```csharp
public bool Contains(HttpHeader item)
```

### Parameters

`item` [HttpHeader](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.md)

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

## Contains(string) {#Sisk_Cadente_HttpHeaderList_Contains_System_String_}

Determines whether the collection contains a header with the specified name.

```csharp
public bool Contains(string name)
```

### Parameters

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the header to locate.

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if a header with the specified name is found; otherwise, [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).
