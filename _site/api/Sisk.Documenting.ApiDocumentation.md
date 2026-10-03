# ApiDocumentation

Kind: Class  
Namespace: `Sisk.Documenting`  
Assembly: `Sisk.Documenting.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Documenting.ApiDocumentation.html

Represents the API documentation, including application details and endpoints.

```csharp
public sealed class ApiDocumentation
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[ApiDocumentation](https://docs.sisk-framework.org/api/Sisk.Documenting.ApiDocumentation.md)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Properties

| Name | Description |
| --- | --- |
| [ApiVersion](https://docs.sisk-framework.org/api/Sisk.Documenting.ApiDocumentation.ApiVersion.md#Sisk_Documenting_ApiDocumentation_ApiVersion) | Gets or sets the version of the API. |
| [ApplicationDescription](https://docs.sisk-framework.org/api/Sisk.Documenting.ApiDocumentation.ApplicationDescription.md#Sisk_Documenting_ApiDocumentation_ApplicationDescription) | Gets or sets the description of the application. |
| [ApplicationName](https://docs.sisk-framework.org/api/Sisk.Documenting.ApiDocumentation.ApplicationName.md#Sisk_Documenting_ApiDocumentation_ApplicationName) | Gets or sets the name of the application. |
| [Endpoints](https://docs.sisk-framework.org/api/Sisk.Documenting.ApiDocumentation.Endpoints.md#Sisk_Documenting_ApiDocumentation_Endpoints) | Gets or sets the array of API endpoints. |

## Methods

| Name | Description |
| --- | --- |
| [Generate\(Router, ApiIdentifier\)](https://docs.sisk-framework.org/api/Sisk.Documenting.ApiDocumentation.Generate.md#Sisk_Documenting_ApiDocumentation_Generate_Sisk_Core_Routing_Router_Sisk_Documenting_ApiIdentifier_) | Generates an instance of [ApiDocumentation](https://docs.sisk-framework.org/api/Sisk.Documenting.ApiDocumentation.md) by reading documentation from the specified router and identifier. |
