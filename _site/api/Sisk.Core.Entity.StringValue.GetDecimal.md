# StringValue.GetDecimal

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.GetDecimal.html

## GetDecimal(IFormatProvider?) {#Sisk_Core_Entity_StringValue_GetDecimal_System_IFormatProvider_}

Parses the value contained in this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) as a [Decimal](https://learn.microsoft.com/dotnet/api/system.decimal). Throws an exception
if the value couldn't be parsed to the target type.

```csharp
public decimal GetDecimal(IFormatProvider? formatProvider = null)
```

### Parameters

`formatProvider` [IFormatProvider](https://learn.microsoft.com/dotnet/api/system.iformatprovider)?

The [IFormatProvider](https://learn.microsoft.com/dotnet/api/system.iformatprovider) to use for parsing. Defaults to [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

### Returns

[decimal](https://learn.microsoft.com/dotnet/api/system.decimal)

The converted [Decimal](https://learn.microsoft.com/dotnet/api/system.decimal).

### Exceptions

[FormatException](https://learn.microsoft.com/dotnet/api/system.formatexception)

Thrown when the value cannot be parsed to a [Decimal](https://learn.microsoft.com/dotnet/api/system.decimal).
