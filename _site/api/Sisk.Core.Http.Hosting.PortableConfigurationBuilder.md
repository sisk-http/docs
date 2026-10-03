# PortableConfigurationBuilder

Kind: Class  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.PortableConfigurationBuilder.html

Represents the portable configuration builder for [HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md).

```csharp
public sealed class PortableConfigurationBuilder
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[PortableConfigurationBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.PortableConfigurationBuilder.md)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Methods

| Name | Description |
| --- | --- |
| [WithConfigFile\(string, bool, ConfigurationFileLookupDirectory\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.PortableConfigurationBuilder.WithConfigFile.md#Sisk_Core_Http_Hosting_PortableConfigurationBuilder_WithConfigFile_System_String_System_Boolean_Sisk_Core_Http_Hosting_ConfigurationFileLookupDirectory_) | Specifies the name of the server configuration file. |
| [WithConfigReader\(IConfigurationReader\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.PortableConfigurationBuilder.WithConfigReader.md#Sisk_Core_Http_Hosting_PortableConfigurationBuilder_WithConfigReader_Sisk_Core_Http_Hosting_IConfigurationReader_) | Defines an custom [IConfigurationReader](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.IConfigurationReader.md) configuration pipeline to the builder. |
| [WithConfigReader<TReader\>\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.PortableConfigurationBuilder.WithConfigReader.md#Sisk_Core_Http_Hosting_PortableConfigurationBuilder_WithConfigReader__1) | Defines an custom [IConfigurationReader](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.IConfigurationReader.md) configuration pipeline to the builder. |
| [WithParameters\(Action<InitializationParameterCollection\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.PortableConfigurationBuilder.WithParameters.md#Sisk_Core_Http_Hosting_PortableConfigurationBuilder_WithParameters_System_Action_Sisk_Core_Http_Hosting_InitializationParameterCollection__) | Invokes a method on the initialization parameter collection. |
