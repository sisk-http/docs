# StringValue.GetInteger

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.GetInteger.html

## GetInteger(IFormatProvider?) {#Sisk_Core_Entity_StringValue_GetInteger_System_IFormatProvider_}

Parses the value contained in this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) as an [Int32](https://learn.microsoft.com/dotnet/api/system.int32). Throws an exception
if the value couldn't be parsed to the target type.

```csharp
public int GetInteger(IFormatProvider? formatProvider = null)
```

### Parameters

`formatProvider` [IFormatProvider](https://learn.microsoft.com/dotnet/api/system.iformatprovider)?

The [IFormatProvider](https://learn.microsoft.com/dotnet/api/system.iformatprovider) to use for parsing. Defaults to [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

### Returns

[int](https://learn.microsoft.com/dotnet/api/system.int32)

The converted [Int32](https://learn.microsoft.com/dotnet/api/system.int32).

### Exceptions

[FormatException](https://learn.microsoft.com/dotnet/api/system.formatexception)

Thrown when the value cannot be parsed to an [Int32](https://learn.microsoft.com/dotnet/api/system.int32).
