# StringValue.GetBoolean

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.GetBoolean.html

## GetBoolean() {#Sisk_Core_Entity_StringValue_GetBoolean}

Parses the value contained in this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) as a [Boolean](https://learn.microsoft.com/dotnet/api/system.boolean). Throws an exception
if the value couldn't be parsed to the target type.

```csharp
public bool GetBoolean()
```

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

The converted [Boolean](https://learn.microsoft.com/dotnet/api/system.boolean).

### Exceptions

[FormatException](https://learn.microsoft.com/dotnet/api/system.formatexception)

Thrown when the value cannot be parsed to a [Boolean](https://learn.microsoft.com/dotnet/api/system.boolean).
