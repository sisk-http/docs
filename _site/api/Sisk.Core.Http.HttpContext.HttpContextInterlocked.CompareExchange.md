# HttpContextInterlocked.CompareExchange

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.HttpContextInterlocked.CompareExchange.html

## CompareExchange(string, long, long, long) {#Sisk_Core_Http_HttpContext_HttpContextInterlocked_CompareExchange_System_String_System_Int64_System_Int64_System_Int64_}

Atomically compares the value associated with the specified name and replaces it when equal.

```csharp
public double CompareExchange(string name, long value, long comparand, long notFound = -1)
```

### Parameters

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the value.

`value` [long](https://learn.microsoft.com/dotnet/api/system.int64)

The replacement value.

`comparand` [long](https://learn.microsoft.com/dotnet/api/system.int64)

The value to compare with the stored value.

`notFound` [long](https://learn.microsoft.com/dotnet/api/system.int64)

The value returned when `name` is not present.

### Returns

[double](https://learn.microsoft.com/dotnet/api/system.double)

The original stored value, or `notFound` when the name is not present.

## CompareExchange(string, double, double, double) {#Sisk_Core_Http_HttpContext_HttpContextInterlocked_CompareExchange_System_String_System_Double_System_Double_System_Double_}

Atomically compares the value associated with the specified name and replaces it when equal.

```csharp
public double CompareExchange(string name, double value, double comparand, double notFound = -1)
```

### Parameters

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the value.

`value` [double](https://learn.microsoft.com/dotnet/api/system.double)

The replacement value.

`comparand` [double](https://learn.microsoft.com/dotnet/api/system.double)

The value to compare with the stored value.

`notFound` [double](https://learn.microsoft.com/dotnet/api/system.double)

The value returned when `name` is not present.

### Returns

[double](https://learn.microsoft.com/dotnet/api/system.double)

The original stored value, or `notFound` when the name is not present.

## CompareExchange(string, long, long, long) {#Sisk_Core_Http_HttpContext_HttpContextInterlocked_CompareExchange_System_String_System_Int64_System_Int64_System_Int64_}

Atomically compares the value associated with the specified name and replaces it when equal.

```csharp
public double CompareExchange(string name, long value, long comparand, long notFound = -1)
```

### Parameters

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the value.

`value` [long](https://learn.microsoft.com/dotnet/api/system.int64)

The replacement value.

`comparand` [long](https://learn.microsoft.com/dotnet/api/system.int64)

The value to compare with the stored value.

`notFound` [long](https://learn.microsoft.com/dotnet/api/system.int64)

The value returned when `name` is not present.

### Returns

[double](https://learn.microsoft.com/dotnet/api/system.double)

The original stored value, or `notFound` when the name is not present.

## CompareExchange(string, double, double, double) {#Sisk_Core_Http_HttpContext_HttpContextInterlocked_CompareExchange_System_String_System_Double_System_Double_System_Double_}

Atomically compares the value associated with the specified name and replaces it when equal.

```csharp
public double CompareExchange(string name, double value, double comparand, double notFound = -1)
```

### Parameters

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the value.

`value` [double](https://learn.microsoft.com/dotnet/api/system.double)

The replacement value.

`comparand` [double](https://learn.microsoft.com/dotnet/api/system.double)

The value to compare with the stored value.

`notFound` [double](https://learn.microsoft.com/dotnet/api/system.double)

The value returned when `name` is not present.

### Returns

[double](https://learn.microsoft.com/dotnet/api/system.double)

The original stored value, or `notFound` when the name is not present.
