# HttpHeaderList.Remove

Kind: Method  
Namespace: `Sisk.Cadente`  
Assembly: `Sisk.Cadente.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.Remove.html

## Remove(HttpHeader) {#Sisk_Cadente_HttpHeaderList_Remove_Sisk_Cadente_HttpHeader_}

Removes all [HttpHeader](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.md) instances that match the specified header.

```csharp
public bool Remove(HttpHeader item)
```

### Parameters

`item` [HttpHeader](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.md)

The header to remove.

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if one or more headers were removed; otherwise, [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).

## Remove(string) {#Sisk_Cadente_HttpHeaderList_Remove_System_String_}

Removes all [HttpHeader](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.md) instances that match the specified header name.

```csharp
public bool Remove(string name)
```

### Parameters

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the header to remove.

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if one or more headers were removed; otherwise, [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).
