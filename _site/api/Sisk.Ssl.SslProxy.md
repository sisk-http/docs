# SslProxy

Kind: Class  
Namespace: `Sisk.Ssl`  
Assembly: `Sisk.SslProxy.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxy.html

Represents a HTTP/1.1 proxy server that forwards traffic over SSL/HTTPS into an insecure HTTP
gateway.

```csharp
public sealed class SslProxy : IDisposable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[SslProxy](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxy.md)

#### Implements

[IDisposable](https://learn.microsoft.com/dotnet/api/system.idisposable)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [SslProxy\(int, X509Certificate, IPEndPoint\)](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxy.-ctor.md#Sisk_Ssl_SslProxy__ctor_System_Int32_System_Security_Cryptography_X509Certificates_X509Certificate_System_Net_IPEndPoint_) | Initializes a new instance of the [SslProxy](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxy.md) class. |

## Properties

| Name | Description |
| --- | --- |
| [AllowedProtocols](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxy.AllowedProtocols.md#Sisk_Ssl_SslProxy_AllowedProtocols) | Gets or sets the SSL/HTTPS protocols allowed for connections. |
| [CheckCertificateRevocation](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxy.CheckCertificateRevocation.md#Sisk_Ssl_SslProxy_CheckCertificateRevocation) | Gets or sets a value indicating whether to check for certificate revocation. |
| [ClientCertificateRequired](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxy.ClientCertificateRequired.md#Sisk_Ssl_SslProxy_ClientCertificateRequired) | Gets or sets a value indicating whether client certificates are required for authentication. |
| [GatewayEndpoint](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxy.GatewayEndpoint.md#Sisk_Ssl_SslProxy_GatewayEndpoint) | Gets the proxy endpoint. |
| [GatewayHostname](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxy.GatewayHostname.md#Sisk_Ssl_SslProxy_GatewayHostname) | Gets or sets an fixed proxy host header value for incoming requests. |
| [GatewayTimeout](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxy.GatewayTimeout.md#Sisk_Ssl_SslProxy_GatewayTimeout) | Gets or sets the maximum time that the gateway should take to respond to a connection or message from the proxy. |
| [ProxyAuthorization](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxy.ProxyAuthorization.md#Sisk_Ssl_SslProxy_ProxyAuthorization) | Gets or sets the Proxy-Authorization header value for creating an trusted gateway between the application and the proxy. |
| [ServerCertificate](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxy.ServerCertificate.md#Sisk_Ssl_SslProxy_ServerCertificate) | Gets the SSL certificate used by the proxy server. |
| [UseGatewayHttps](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxy.UseGatewayHttps.md#Sisk_Ssl_SslProxy_UseGatewayHttps) | Gets or sets whether the [SslProxy](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxy.md) should use HTTPS for the gateway connection or plain HTTP. |

## Methods

| Name | Description |
| --- | --- |
| [Dispose\(\)](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxy.Dispose.md#Sisk_Ssl_SslProxy_Dispose) |  |
| [Start\(\)](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxy.Start.md#Sisk_Ssl_SslProxy_Start) | Starts the [SslProxy](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxy.md) and start routing traffic to the set remote endpoint. |
