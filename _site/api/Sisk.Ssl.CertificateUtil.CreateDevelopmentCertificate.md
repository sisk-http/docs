# CertificateUtil.CreateDevelopmentCertificate

Kind: Method  
Namespace: `Sisk.Ssl`  
Assembly: `Sisk.SslProxy.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Ssl.CertificateUtil.CreateDevelopmentCertificate.html

## CreateDevelopmentCertificate(params string[]) {#Sisk_Ssl_CertificateUtil_CreateDevelopmentCertificate_System_String___}

Creates a self-signed certificate for the specified DNS names.

```csharp
public static X509Certificate2 CreateDevelopmentCertificate(params string[] dnsNames)
```

### Parameters

`dnsNames` [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]

The certificate DNS names.

### Returns

[X509Certificate2](https://learn.microsoft.com/dotnet/api/system.security.cryptography.x509certificates.x509certificate2)
