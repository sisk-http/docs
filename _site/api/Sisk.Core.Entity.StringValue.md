# StringValue

Kind: Struct  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.html

Represents an option/monad item that wraps an string value and allows conversion to most common types.

```csharp
public readonly struct StringValue : ICloneable, IEquatable<StringValue>, IComparable<StringValue>
```

#### Implements

[ICloneable](https://learn.microsoft.com/dotnet/api/system.icloneable), 
[IEquatable<StringValue\>](https://learn.microsoft.com/dotnet/api/system.iequatable\-1), 
[IComparable<StringValue\>](https://learn.microsoft.com/dotnet/api/system.icomparable\-1)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [StringValue\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.-ctor.md#Sisk_Core_Entity_StringValue__ctor_System_String_) | Creates an new empty value of the [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) with no predefined value. |
| [StringValue\(string, string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.-ctor.md#Sisk_Core_Entity_StringValue__ctor_System_String_System_String_) | Creates an new value of the [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md). |

## Properties

| Name | Description |
| --- | --- |
| [IsNull](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.IsNull.md#Sisk_Core_Entity_StringValue_IsNull) | Gets an boolean indicating if this object value is null. |
| [IsNullOrEmpty](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.IsNullOrEmpty.md#Sisk_Core_Entity_StringValue_IsNullOrEmpty) | Gets an boolean indicating if this object value is null or an empty string. |
| [Name](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.Name.md#Sisk_Core_Entity_StringValue_Name) | Gets the name of the property that hosts this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md). |
| [Value](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.Value.md#Sisk_Core_Entity_StringValue_Value) | Gets the value of the current [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) string if it has been assigned a valid underlying value. |

## Methods

| Name | Description |
| --- | --- |
| [Clone\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.Clone.md#Sisk_Core_Entity_StringValue_Clone) |  |
| [CompareTo\(StringValue, in StringComparison\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.CompareTo.md#Sisk_Core_Entity_StringValue_CompareTo_Sisk_Core_Entity_StringValue_System_StringComparison__) | Compares the current object with another object of the same type, using the specified string comparison. |
| [Create\(string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.Create.md#Sisk_Core_Entity_StringValue_Create_System_String_) | Creates an new [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) from the specified string. |
| [Get<T\>\(IFormatProvider?\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.Get.md#Sisk_Core_Entity_StringValue_Get__1_System_IFormatProvider_) | Parses the value contained in this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) as a type `T` that implements [IParsable](https://learn.microsoft.com/dotnet/api/system.iparsable). Throws an exception if the value couldn't be parsed to the target type. |
| [GetBoolean\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.GetBoolean.md#Sisk_Core_Entity_StringValue_GetBoolean) | Parses the value contained in this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) as a [Boolean](https://learn.microsoft.com/dotnet/api/system.boolean). Throws an exception if the value couldn't be parsed to the target type. |
| [GetByte\(IFormatProvider?\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.GetByte.md#Sisk_Core_Entity_StringValue_GetByte_System_IFormatProvider_) | Parses the value contained in this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) as a [Byte](https://learn.microsoft.com/dotnet/api/system.byte). Throws an exception if the value couldn't be parsed to the target type. |
| [GetChar\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.GetChar.md#Sisk_Core_Entity_StringValue_GetChar) | Parses the value contained in this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) as a [Char](https://learn.microsoft.com/dotnet/api/system.char). Throws an exception if the value couldn't be parsed to the target type. |
| [GetDateTime\(IFormatProvider?\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.GetDateTime.md#Sisk_Core_Entity_StringValue_GetDateTime_System_IFormatProvider_) | Parses the value contained in this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) as a [DateTime](https://learn.microsoft.com/dotnet/api/system.datetime). Throws an exception if the value couldn't be parsed to the target type. |
| [GetDecimal\(IFormatProvider?\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.GetDecimal.md#Sisk_Core_Entity_StringValue_GetDecimal_System_IFormatProvider_) | Parses the value contained in this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) as a [Decimal](https://learn.microsoft.com/dotnet/api/system.decimal). Throws an exception if the value couldn't be parsed to the target type. |
| [GetDouble\(IFormatProvider?\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.GetDouble.md#Sisk_Core_Entity_StringValue_GetDouble_System_IFormatProvider_) | Parses the value contained in this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) as a [Double](https://learn.microsoft.com/dotnet/api/system.double). Throws an exception if the value couldn't be parsed to the target type. |
| [GetEnum<TEnum\>\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.GetEnum.md#Sisk_Core_Entity_StringValue_GetEnum__1) | Gets an [Enum](https://learn.microsoft.com/dotnet/api/system.enum) object representation from this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md), parsing the current string expression into an value of `TEnum`. This method will throw an [NullReferenceException](https://learn.microsoft.com/dotnet/api/system.nullreferenceexception) if the value stored in this instance is null. |
| [GetGuid\(IFormatProvider?\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.GetGuid.md#Sisk_Core_Entity_StringValue_GetGuid_System_IFormatProvider_) | Parses the value contained in this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) as a [Guid](https://learn.microsoft.com/dotnet/api/system.guid). Throws an exception if the value couldn't be parsed to the target type. |
| [GetInteger\(IFormatProvider?\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.GetInteger.md#Sisk_Core_Entity_StringValue_GetInteger_System_IFormatProvider_) | Parses the value contained in this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) as an [Int32](https://learn.microsoft.com/dotnet/api/system.int32). Throws an exception if the value couldn't be parsed to the target type. |
| [GetLong\(IFormatProvider?\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.GetLong.md#Sisk_Core_Entity_StringValue_GetLong_System_IFormatProvider_) | Parses the value contained in this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) as a [Int64](https://learn.microsoft.com/dotnet/api/system.int64). Throws an exception if the value couldn't be parsed to the target type. |
| [GetShort\(IFormatProvider?\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.GetShort.md#Sisk_Core_Entity_StringValue_GetShort_System_IFormatProvider_) | Parses the value contained in this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) as a [Int16](https://learn.microsoft.com/dotnet/api/system.int16). Throws an exception if the value couldn't be parsed to the target type. |
| [GetSingle\(IFormatProvider?\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.GetSingle.md#Sisk_Core_Entity_StringValue_GetSingle_System_IFormatProvider_) | Parses the value contained in this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) as a [Single](https://learn.microsoft.com/dotnet/api/system.single). Throws an exception if the value couldn't be parsed to the target type. |
| [GetString\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.GetString.md#Sisk_Core_Entity_StringValue_GetString) | Gets a non-null string from this [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md). This method will throw an [NullReferenceException](https://learn.microsoft.com/dotnet/api/system.nullreferenceexception) if the value stored in this instance is null. |
| [MaybeNull\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.MaybeNull.md#Sisk_Core_Entity_StringValue_MaybeNull) | Returns a self-reference to this object when it's value is not null. |
| [MaybeNullOrEmpty\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.MaybeNullOrEmpty.md#Sisk_Core_Entity_StringValue_MaybeNullOrEmpty) | Returns a self-reference to this object when it's value is not null or an empty string. |
