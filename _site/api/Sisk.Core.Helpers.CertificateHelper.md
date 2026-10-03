# CertificateHelper

Kind: Class  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.CertificateHelper.html

Provides a set of useful functions to issue self-signed development certificates.

```csharp
public static class CertificateHelper
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[CertificateHelper](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.CertificateHelper.md)

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
| [CreateDevelopmentCertificate\(params string\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.CertificateHelper.CreateDevelopmentCertificate.md#Sisk_Core_Helpers_CertificateHelper_CreateDevelopmentCertificate_System_String___) | Creates a self-signed certificate for the specified DNS names. |
| [CreateTrustedDevelopmentCertificate\(params string\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.CertificateHelper.CreateTrustedDevelopmentCertificate.md#Sisk_Core_Helpers_CertificateHelper_CreateTrustedDevelopmentCertificate_System_String___) | Creates a self-signed certificate for the specified DNS names and adds them to the local user's certificate store. |
