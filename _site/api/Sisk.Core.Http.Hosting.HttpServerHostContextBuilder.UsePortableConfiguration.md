# HttpServerHostContextBuilder.UsePortableConfiguration

Kind: Method  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.UsePortableConfiguration.html

## UsePortableConfiguration(Action&lt;PortableConfigurationBuilder>) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UsePortableConfiguration_System_Action_Sisk_Core_Http_Hosting_PortableConfigurationBuilder__}

Enables the portable configuration for this application, which imports settings, parameters,
and other information from a JSON settings file.

```csharp
public HttpServerHostContextBuilder UsePortableConfiguration(Action<PortableConfigurationBuilder> portableConfigHandler)
```

### Parameters

`portableConfigHandler` [Action](https://learn.microsoft.com/dotnet/api/system.action\-1)<[PortableConfigurationBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.PortableConfigurationBuilder.md)\>

The handler of [PortableConfigurationBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.PortableConfigurationBuilder.md).

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

### Remarks

This method overrides almost all of your [CreateBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.CreateBuilder.md) configuration. To avoid this,
call this method at the beginning of your builder, as the first immediate method.
