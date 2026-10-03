# StringValue.GetDateTime

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.GetDateTime.html

## GetDateTime(IFormatProvider?) {#Sisk_Core_Entity_StringValue_GetDateTime_System_IFormatProvider_}

Parses the value contained in this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) as a [DateTime](https://learn.microsoft.com/dotnet/api/system.datetime). Throws an exception
if the value couldn't be parsed to the target type.

```csharp
public DateTime GetDateTime(IFormatProvider? formatProvider = null)
```

### Parameters

`formatProvider` [IFormatProvider](https://learn.microsoft.com/dotnet/api/system.iformatprovider)?

The [IFormatProvider](https://learn.microsoft.com/dotnet/api/system.iformatprovider) to use for parsing. Defaults to [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

### Returns

[DateTime](https://learn.microsoft.com/dotnet/api/system.datetime)

The converted [DateTime](https://learn.microsoft.com/dotnet/api/system.datetime).

### Exceptions

[FormatException](https://learn.microsoft.com/dotnet/api/system.formatexception)

Thrown when the value cannot be parsed to a [DateTime](https://learn.microsoft.com/dotnet/api/system.datetime).
