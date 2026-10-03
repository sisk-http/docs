# StringValue.GetEnum<TEnum>

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.GetEnum.html

## GetEnum&lt;TEnum>() {#Sisk_Core_Entity_StringValue_GetEnum__1}

Gets an [Enum](https://learn.microsoft.com/dotnet/api/system.enum) object representation from this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md), parsing the current string expression into an value of
`TEnum`. This method will throw an [NullReferenceException](https://learn.microsoft.com/dotnet/api/system.nullreferenceexception) if
the value stored in this instance is null.

```csharp
public TEnum GetEnum<TEnum>() where TEnum : struct, Enum
```

### Returns

 TEnum

### Type Parameters

`TEnum` 

The [Enum](https://learn.microsoft.com/dotnet/api/system.enum) type.
