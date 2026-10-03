# HttpServerHostContextBuilder.UseSsl

Kind: Method  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.UseSsl.html

## UseSsl(ListeningHostSslOptions) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseSsl_Sisk_Core_Http_ListeningHostSslOptions_}

Configures SSL for the listening host using the specified options.

```csharp
public HttpServerHostContextBuilder UseSsl(ListeningHostSslOptions sslOptions)
```

### Parameters

`sslOptions` [ListeningHostSslOptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostSslOptions.md)

The SSL options to apply to the listening host.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

The current [HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md) instance.

## UseSsl(X509Certificate2) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseSsl_System_Security_Cryptography_X509Certificates_X509Certificate2_}

Configures SSL for the listening host using the specified certificate.

```csharp
public HttpServerHostContextBuilder UseSsl(X509Certificate2 certificate)
```

### Parameters

`certificate` [X509Certificate2](https://learn.microsoft.com/dotnet/api/system.security.cryptography.x509certificates.x509certificate2)

The X509 certificate to use for SSL.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

The current [HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md) instance.

## UseSsl() {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseSsl}

Configures SSL for the listening host using a trusted development certificate for localhost and 127.0.0.1.

```csharp
public HttpServerHostContextBuilder UseSsl()
```

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

The current [HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md) instance.
