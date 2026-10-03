# StringValue.GetLong

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.GetLong.html

## GetLong(IFormatProvider?) {#Sisk_Core_Entity_StringValue_GetLong_System_IFormatProvider_}

Parses the value contained in this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) as a [Int64](https://learn.microsoft.com/dotnet/api/system.int64). Throws an exception
if the value couldn't be parsed to the target type.

```csharp
public long GetLong(IFormatProvider? formatProvider = null)
```

### Parameters

`formatProvider` [IFormatProvider](https://learn.microsoft.com/dotnet/api/system.iformatprovider)?

The [IFormatProvider](https://learn.microsoft.com/dotnet/api/system.iformatprovider) to use for parsing. Defaults to [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

### Returns

[long](https://learn.microsoft.com/dotnet/api/system.int64)

The converted [Int64](https://learn.microsoft.com/dotnet/api/system.int64).

### Exceptions

[FormatException](https://learn.microsoft.com/dotnet/api/system.formatexception)

Thrown when the value cannot be parsed to a [Int64](https://learn.microsoft.com/dotnet/api/system.int64).
