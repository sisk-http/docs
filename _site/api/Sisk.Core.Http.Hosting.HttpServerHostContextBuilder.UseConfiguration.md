# HttpServerHostContextBuilder.UseConfiguration

Kind: Method  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.UseConfiguration.html

## UseConfiguration(Action&lt;HttpServerConfiguration>) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseConfiguration_System_Action_Sisk_Core_Http_HttpServerConfiguration__}

Calls an action that has the HTTP server configuration as an argument.

```csharp
public HttpServerHostContextBuilder UseConfiguration(Action<HttpServerConfiguration> handler)
```

### Parameters

`handler` [Action](https://learn.microsoft.com/dotnet/api/system.action\-1)<[HttpServerConfiguration](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.md)\>

An action where the first argument is an [HttpServerConfiguration](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.md).

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)
