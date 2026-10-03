# ConfigurationContext

Kind: Class  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.ConfigurationContext.html

Represents a reading context for a portable configuration file.

```csharp
public sealed class ConfigurationContext
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[ConfigurationContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.ConfigurationContext.md)

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
| [ConfigurationFile](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.ConfigurationContext.ConfigurationFile.md#Sisk_Core_Http_Hosting_ConfigurationContext_ConfigurationFile) | Gets the absolute path to the configuration file. The file is guaranteed to exist when getting this property value. |
| [Host](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.ConfigurationContext.Host.md#Sisk_Core_Http_Hosting_ConfigurationContext_Host) | Gets the [HttpServerHostContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.md) which are configuring this context. |
| [Parameters](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.ConfigurationContext.Parameters.md#Sisk_Core_Http_Hosting_ConfigurationContext_Parameters) | Gets the [InitializationParameterCollection](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.InitializationParameterCollection.md) collection for defining configuration parameters of the host application. |
| [TargetListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.ConfigurationContext.TargetListeningHost.md#Sisk_Core_Http_Hosting_ConfigurationContext_TargetListeningHost) | Gets the target [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md) which are configuring this context. |
