# CertificateUtil.CreateTrustedDevelopmentCertificate

Kind: Method  
Namespace: `Sisk.Ssl`  
Assembly: `Sisk.SslProxy.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Ssl.CertificateUtil.CreateTrustedDevelopmentCertificate.html

## CreateTrustedDevelopmentCertificate(params string[]) {#Sisk_Ssl_CertificateUtil_CreateTrustedDevelopmentCertificate_System_String___}

Creates a self-signed certificate for the specified DNS names and adds them
to the local user's certificate store.

```csharp
public static X509Certificate2 CreateTrustedDevelopmentCertificate(params string[] dnsNames)
```

### Parameters

`dnsNames` [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]

The certificate DNS names.

### Returns

[X509Certificate2](https://learn.microsoft.com/dotnet/api/system.security.cryptography.x509certificates.x509certificate2)
