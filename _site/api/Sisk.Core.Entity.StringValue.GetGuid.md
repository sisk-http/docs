# StringValue.GetGuid

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.GetGuid.html

## GetGuid(IFormatProvider?) {#Sisk_Core_Entity_StringValue_GetGuid_System_IFormatProvider_}

Parses the value contained in this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) as a [Guid](https://learn.microsoft.com/dotnet/api/system.guid). Throws an exception
if the value couldn't be parsed to the target type.

```csharp
public Guid GetGuid(IFormatProvider? formatProvider = null)
```

### Parameters

`formatProvider` [IFormatProvider](https://learn.microsoft.com/dotnet/api/system.iformatprovider)?

The [IFormatProvider](https://learn.microsoft.com/dotnet/api/system.iformatprovider) to use for parsing. Defaults to [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

### Returns

[Guid](https://learn.microsoft.com/dotnet/api/system.guid)

The converted [Guid](https://learn.microsoft.com/dotnet/api/system.guid).

### Exceptions

[FormatException](https://learn.microsoft.com/dotnet/api/system.formatexception)

Thrown when the value cannot be parsed to a [Guid](https://learn.microsoft.com/dotnet/api/system.guid).
