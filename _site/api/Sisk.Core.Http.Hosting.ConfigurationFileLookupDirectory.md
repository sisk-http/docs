# ConfigurationFileLookupDirectory

Kind: Enum  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.ConfigurationFileLookupDirectory.html

Represents the base directory where the [IConfigurationReader](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.IConfigurationReader.md) should search for the configuration
file.

```csharp
[Flags]
public enum ConfigurationFileLookupDirectory
```

## Fields

| Name | Description |
| --- | --- |
| `All = 6` | Represents all possible directories. |
| `AppDirectory = 4` | The [IConfigurationReader](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.IConfigurationReader.md) should search in the executable base directory. |
| `CurrentDirectory = 2` | The [IConfigurationReader](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.IConfigurationReader.md) should search in the process current/base directory. |
