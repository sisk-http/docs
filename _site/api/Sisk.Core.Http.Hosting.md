# Sisk.Core.Http.Hosting

Kind: Namespace  
Namespace: `Sisk.Core.Http.Hosting`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.html

### Classes

| Name | Description |
| --- | --- |
| [ConfigurationContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.ConfigurationContext.md) | Represents a reading context for a portable configuration file. |
| [HttpServerHostContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.md) | Represents the class that hosts most of the components needed to run a Sisk application. |
| [HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md) | Represents a context constructor for [HttpServerHostContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.md). |
| [InitializationParameterCollection](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.InitializationParameterCollection.md) | Provides a collection of HTTP server initialization variables. |
| [PortableConfigurationBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.PortableConfigurationBuilder.md) | Represents the portable configuration builder for [HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md). |

### Interfaces

| Name | Description |
| --- | --- |
| [IConfigurationReader](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.IConfigurationReader.md) | Represents an interface that reads and applies settings from a settings file. |

### Enums

| Name | Description |
| --- | --- |
| [ConfigurationFileLookupDirectory](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.ConfigurationFileLookupDirectory.md) | Represents the base directory where the [IConfigurationReader](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.IConfigurationReader.md) should search for the configuration file. |
| [InitializationParameterCollection.GetValueOption](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.InitializationParameterCollection.GetValueOption.md) | Represents the option used in the method [GetValueOrThrow](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.InitializationParameterCollection.GetValueOrThrow.md). |
| [InitializationParameterCollection.GetValueOption](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.InitializationParameterCollection.GetValueOption.md) | Represents the option used in the method [GetValueOrThrow](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.InitializationParameterCollection.GetValueOrThrow.md). |
| [HttpServerHostContextBuilderExceptionMode](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilderExceptionMode.md) | Represents how the builder event error message should be displayed. |
