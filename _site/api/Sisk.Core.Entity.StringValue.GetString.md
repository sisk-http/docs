# StringValue.GetString

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.GetString.html

## GetString() {#Sisk_Core_Entity_StringValue_GetString}

Gets a non-null string from this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md). This method will throw an [NullReferenceException](https://learn.microsoft.com/dotnet/api/system.nullreferenceexception) if
the value stored in this instance is null.

```csharp
public string GetString()
```

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)

An non-null string value.

### Exceptions

[NullReferenceException](https://learn.microsoft.com/dotnet/api/system.nullreferenceexception)

Thrown when the value stored in this instance is null.
