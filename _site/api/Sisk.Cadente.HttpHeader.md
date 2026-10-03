# HttpHeader

Kind: Struct  
Namespace: `Sisk.Cadente`  
Assembly: `Sisk.Cadente.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.html

Represents an HTTP header, consisting of a name and a value.

```csharp
public readonly struct HttpHeader : IEquatable<HttpHeader>
```

#### Implements

[IEquatable<HttpHeader\>](https://learn.microsoft.com/dotnet/api/system.iequatable\-1)

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
| [HttpHeader\(in ReadOnlyMemory<byte\>, in ReadOnlyMemory<byte\>\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.-ctor.md#Sisk_Cadente_HttpHeader__ctor_System_ReadOnlyMemory_System_Byte___System_ReadOnlyMemory_System_Byte___) | Initializes a new instance of the [HttpHeader](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.md) struct with the specified name and value as byte arrays. |
| [HttpHeader\(string, string\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.-ctor.md#Sisk_Cadente_HttpHeader__ctor_System_String_System_String_) | Initializes a new instance of the [HttpHeader](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.md) struct with the specified name and value as strings. |

## Properties

| Name | Description |
| --- | --- |
| [IsEmpty](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.IsEmpty.md#Sisk_Cadente_HttpHeader_IsEmpty) | Gets a value indicating whether this [HttpHeader](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.md) has a empty name. |
| [Name](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.Name.md#Sisk_Cadente_HttpHeader_Name) | Gets the name of the header as a string. |
| [Value](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.Value.md#Sisk_Cadente_HttpHeader_Value) | Gets the value of the header as a string. |

## Methods

| Name | Description |
| --- | --- |
| [Equals\(object?\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.Equals.md#Sisk_Cadente_HttpHeader_Equals_System_Object_) |  |
| [Equals\(HttpHeader\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.Equals.md#Sisk_Cadente_HttpHeader_Equals_Sisk_Cadente_HttpHeader_) |  |
| [GetHashCode\(\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.GetHashCode.md#Sisk_Cadente_HttpHeader_GetHashCode) |  |
| [ToString\(\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.ToString.md#Sisk_Cadente_HttpHeader_ToString) | Gets the string representation of this [HttpHeader](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.md). |
