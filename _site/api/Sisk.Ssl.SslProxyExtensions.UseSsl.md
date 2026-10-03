# SslProxyExtensions.UseSsl

Kind: Method  
Namespace: `Sisk.Ssl`  
Assembly: `Sisk.SslProxy.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxyExtensions.UseSsl.html

## UseSsl(HttpServerHostContextBuilder, short, X509Certificate?, SslProtocols, bool, object?, bool) {#Sisk_Ssl_SslProxyExtensions_UseSsl_Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_System_Int16_System_Security_Cryptography_X509Certificates_X509Certificate_System_Security_Authentication_SslProtocols_System_Boolean_System_Object_System_Boolean_}

Configures the [HttpServerHostContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.md) to use [SslProxy](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxy.md) with the specified parameters.

```csharp
public static HttpServerHostContextBuilder UseSsl(this HttpServerHostContextBuilder builder, short sslListeningPort, X509Certificate? certificate = null, SslProtocols allowedProtocols = SslProtocols.Tls12 | SslProtocols.Tls13, bool clientCertificateRequired = false, object? proxyAuthorization = null, bool onlyUseIPv4 = false)
```

### Parameters

`builder` HttpServerHostContextBuilder

The [HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md) instance to configure.

`sslListeningPort` [short](https://learn.microsoft.com/dotnet/api/system.int16)

The port number on which the server will listen for SSL/HTTPS connections.

`certificate` [X509Certificate](https://learn.microsoft.com/dotnet/api/system.security.cryptography.x509certificates.x509certificate)?

Optional. The SSL/HTTPS certificate to use for encrypting communications.

`allowedProtocols` [SslProtocols](https://learn.microsoft.com/dotnet/api/system.security.authentication.sslprotocols)

Optional. The SSL/HTTPS protocols allowed for the connection. Defaults to [Tls12](https://learn.microsoft.com/dotnet/api/system.security.authentication.sslprotocols.tls12) and [Tls13](https://learn.microsoft.com/dotnet/api/system.security.authentication.sslprotocols.tls13).

`clientCertificateRequired` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

Optional. Specifies whether a client certificate is required for authentication. Defaults to `false`.

`proxyAuthorization` [object](https://learn.microsoft.com/dotnet/api/system.object)?

Optional. Specifies the Proxy-Authorization header value for creating an trusted gateway between
            the application and the proxy.

`onlyUseIPv4` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

Optional. Specifies whether DNS Resolve may also use IPv6 addresses or should only use IPv4 addresses

### Returns

 HttpServerHostContextBuilder

The configured [HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md) instance.
