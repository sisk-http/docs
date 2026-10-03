# CertificateUtil

Kind: Class  
Namespace: `Sisk.Ssl`  
Assembly: `Sisk.SslProxy.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Ssl.CertificateUtil.html

Provides a set of useful functions to issue development certificates for the [SslProxy](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxy.md).

```csharp
public static class CertificateUtil
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[CertificateUtil](https://docs.sisk-framework.org/api/Sisk.Ssl.CertificateUtil.md)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.MemberwiseClone\(\)](https://learn.microsoft.com/dotnet/api/system.object.memberwiseclone), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Methods

| Name | Description |
| --- | --- |
| [CreateDevelopmentCertificate\(params string\[\]\)](https://docs.sisk-framework.org/api/Sisk.Ssl.CertificateUtil.CreateDevelopmentCertificate.md#Sisk_Ssl_CertificateUtil_CreateDevelopmentCertificate_System_String___) | Creates a self-signed certificate for the specified DNS names. |
| [CreateTrustedDevelopmentCertificate\(params string\[\]\)](https://docs.sisk-framework.org/api/Sisk.Ssl.CertificateUtil.CreateTrustedDevelopmentCertificate.md#Sisk_Ssl_CertificateUtil_CreateTrustedDevelopmentCertificate_System_String___) | Creates a self-signed certificate for the specified DNS names and adds them to the local user's certificate store. |
