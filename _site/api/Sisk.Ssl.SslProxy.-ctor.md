# SslProxy constructor

Kind: Constructor  
Namespace: `Sisk.Ssl`  
Assembly: `Sisk.SslProxy.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxy.-ctor.html

## SslProxy(int, X509Certificate, IPEndPoint) {#Sisk_Ssl_SslProxy__ctor_System_Int32_System_Security_Cryptography_X509Certificates_X509Certificate_System_Net_IPEndPoint_}

Initializes a new instance of the [SslProxy](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxy.md) class.

```csharp
public SslProxy(int sslListeningPort, X509Certificate certificate, IPEndPoint remoteEndpoint)
```

### Parameters

`sslListeningPort` [int](https://learn.microsoft.com/dotnet/api/system.int32)

The port number on which the proxy server listens for incoming connections.

`certificate` [X509Certificate](https://learn.microsoft.com/dotnet/api/system.security.cryptography.x509certificates.x509certificate)

The SSL/TLS certificate used by the proxy server.

`remoteEndpoint` [IPEndPoint](https://learn.microsoft.com/dotnet/api/system.net.ipendpoint)

The remote endpoint to which the proxy server forwards traffic.
