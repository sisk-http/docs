# PortableConfigurationBuilder.WithConfigFile

Kind: Method  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.PortableConfigurationBuilder.WithConfigFile.html

## WithConfigFile(string, bool, ConfigurationFileLookupDirectory) {#Sisk_Core_Http_Hosting_PortableConfigurationBuilder_WithConfigFile_System_String_System_Boolean_Sisk_Core_Http_Hosting_ConfigurationFileLookupDirectory_}

Specifies the name of the server configuration file.

```csharp
public PortableConfigurationBuilder WithConfigFile(string filename, bool createIfDontExists = false, ConfigurationFileLookupDirectory lookupDirectories = ConfigurationFileLookupDirectory.CurrentDirectory)
```

### Parameters

`filename` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the JSON configuration file.

`createIfDontExists` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

Optional. Determines if the configuration file should be created if it doens't exists.

`lookupDirectories` [ConfigurationFileLookupDirectory](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.ConfigurationFileLookupDirectory.md)

Optional. Specifies the directories which the [IConfigurationReader](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.IConfigurationReader.md) should search for the configuration file.

### Returns

[PortableConfigurationBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.PortableConfigurationBuilder.md)
