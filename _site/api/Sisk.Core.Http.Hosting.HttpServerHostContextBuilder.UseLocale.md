# HttpServerHostContextBuilder.UseLocale

Kind: Method  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.UseLocale.html

## UseLocale(CultureInfo) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseLocale_System_Globalization_CultureInfo_}

Changes the default thread current culture through [DefaultThreadCurrentCulture](https://learn.microsoft.com/dotnet/api/system.globalization.cultureinfo.defaultthreadcurrentculture).

```csharp
public HttpServerHostContextBuilder UseLocale(CultureInfo locale)
```

### Parameters

`locale` [CultureInfo](https://learn.microsoft.com/dotnet/api/system.globalization.cultureinfo)

The default [CultureInfo](https://learn.microsoft.com/dotnet/api/system.globalization.cultureinfo) object which the HTTP server will apply to the request handlers and callbacks thread.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)
