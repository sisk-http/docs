# StringValue.GetDouble

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.GetDouble.html

## GetDouble(IFormatProvider?) {#Sisk_Core_Entity_StringValue_GetDouble_System_IFormatProvider_}

Parses the value contained in this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) as a [Double](https://learn.microsoft.com/dotnet/api/system.double). Throws an exception
if the value couldn't be parsed to the target type.

```csharp
public double GetDouble(IFormatProvider? formatProvider = null)
```

### Parameters

`formatProvider` [IFormatProvider](https://learn.microsoft.com/dotnet/api/system.iformatprovider)?

The [IFormatProvider](https://learn.microsoft.com/dotnet/api/system.iformatprovider) to use for parsing. Defaults to [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

### Returns

[double](https://learn.microsoft.com/dotnet/api/system.double)

The converted [Double](https://learn.microsoft.com/dotnet/api/system.double).

### Exceptions

[FormatException](https://learn.microsoft.com/dotnet/api/system.formatexception)

Thrown when the value cannot be parsed to a [Double](https://learn.microsoft.com/dotnet/api/system.double).
