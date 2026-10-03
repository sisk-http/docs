# StringValue.GetSingle

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.GetSingle.html

## GetSingle(IFormatProvider?) {#Sisk_Core_Entity_StringValue_GetSingle_System_IFormatProvider_}

Parses the value contained in this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) as a [Single](https://learn.microsoft.com/dotnet/api/system.single). Throws an exception
if the value couldn't be parsed to the target type.

```csharp
public float GetSingle(IFormatProvider? formatProvider = null)
```

### Parameters

`formatProvider` [IFormatProvider](https://learn.microsoft.com/dotnet/api/system.iformatprovider)?

The [IFormatProvider](https://learn.microsoft.com/dotnet/api/system.iformatprovider) to use for parsing. Defaults to [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

### Returns

[float](https://learn.microsoft.com/dotnet/api/system.single)

The converted [Single](https://learn.microsoft.com/dotnet/api/system.single).

### Exceptions

[FormatException](https://learn.microsoft.com/dotnet/api/system.formatexception)

Thrown when the value cannot be parsed to a [Single](https://learn.microsoft.com/dotnet/api/system.single).
