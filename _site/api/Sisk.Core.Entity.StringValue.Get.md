# StringValue.Get<T>

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.Get.html

## Get&lt;T>(IFormatProvider?) {#Sisk_Core_Entity_StringValue_Get__1_System_IFormatProvider_}

Parses the value contained in this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) as a type `T` that implements [IParsable](https://learn.microsoft.com/dotnet/api/system.iparsable).
Throws an exception if the value couldn't be parsed to the target type.

```csharp
public T Get<T>(IFormatProvider? formatProvider = null) where T : IParsable<T>
```

### Parameters

`formatProvider` [IFormatProvider](https://learn.microsoft.com/dotnet/api/system.iformatprovider)?

The [IFormatProvider](https://learn.microsoft.com/dotnet/api/system.iformatprovider) to use for parsing. Defaults to [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

### Returns

 T

The converted value of type `T`.

### Type Parameters

`T` 

The type to parse the value to.

### Exceptions

[FormatException](https://learn.microsoft.com/dotnet/api/system.formatexception)

Thrown when the value cannot be parsed to type `T`.
