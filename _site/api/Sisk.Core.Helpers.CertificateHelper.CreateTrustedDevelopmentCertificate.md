# CertificateHelper.CreateTrustedDevelopmentCertificate

Kind: Method  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.CertificateHelper.CreateTrustedDevelopmentCertificate.html

## CreateTrustedDevelopmentCertificate(params string[]) {#Sisk_Core_Helpers_CertificateHelper_CreateTrustedDevelopmentCertificate_System_String___}

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
