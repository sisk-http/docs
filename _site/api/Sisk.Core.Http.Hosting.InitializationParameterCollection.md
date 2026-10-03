# InitializationParameterCollection

Kind: Class  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.InitializationParameterCollection.html

Provides a collection of HTTP server initialization variables.

```csharp
public sealed class InitializationParameterCollection : IDictionary<string, string?>, ICollection<KeyValuePair<string, string?>>, IEnumerable<KeyValuePair<string, string?>>, IEnumerable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[InitializationParameterCollection](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.InitializationParameterCollection.md)

#### Implements

[IDictionary<string, string?\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.idictionary\-2), 
[ICollection<KeyValuePair<string, string?\>\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.icollection\-1), 
[IEnumerable<KeyValuePair<string, string?\>\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable\-1), 
[IEnumerable](https://learn.microsoft.com/dotnet/api/system.collections.ienumerable)

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
| [InitializationParameterCollection\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.InitializationParameterCollection.-ctor.md#Sisk_Core_Http_Hosting_InitializationParameterCollection__ctor) |  |

## Methods

| Name | Description |
| --- | --- |
| [AsNameValueCollection\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.InitializationParameterCollection.AsNameValueCollection.md#Sisk_Core_Http_Hosting_InitializationParameterCollection_AsNameValueCollection) | Gets an instance of [NameValueCollection](https://learn.microsoft.com/dotnet/api/system.collections.specialized.namevaluecollection) with the values of this class. |
| [EnsureNotNull\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.InitializationParameterCollection.EnsureNotNull.md#Sisk_Core_Http_Hosting_InitializationParameterCollection_EnsureNotNull_System_String_) | Ensures that the parameter defined by name `parameterName` is present in this collection. |
| [EnsureNotNullOrEmpty\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.InitializationParameterCollection.EnsureNotNullOrEmpty.md#Sisk_Core_Http_Hosting_InitializationParameterCollection_EnsureNotNullOrEmpty_System_String_) | Ensures that the parameter defined by name `parameterName` is present and not empty in this collection. |
| [GetStringValue\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.InitializationParameterCollection.GetStringValue.md#Sisk_Core_Http_Hosting_InitializationParameterCollection_GetStringValue_System_String_) | Retrieves a [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) instance representing the specified parameter. |
| [GetValueOrThrow\(string, GetValueOption\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.InitializationParameterCollection.GetValueOrThrow.md#Sisk_Core_Http_Hosting_InitializationParameterCollection_GetValueOrThrow_System_String_Sisk_Core_Http_Hosting_InitializationParameterCollection_GetValueOption_) | Gets the specified value if present in this parameter collection, or throw an exception if the value is not present. |
