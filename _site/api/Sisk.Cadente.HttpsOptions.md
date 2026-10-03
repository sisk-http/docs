# HttpsOptions

Kind: Class  
Namespace: `Sisk.Cadente`  
Assembly: `Sisk.Cadente.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.HttpsOptions.html

Represents the options for configuring an HTTPS server.

```csharp
public sealed class HttpsOptions
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpsOptions](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpsOptions.md)

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
| [HttpsOptions\(X509Certificate\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpsOptions.-ctor.md#Sisk_Cadente_HttpsOptions__ctor_System_Security_Cryptography_X509Certificates_X509Certificate_) | Initializes a new instance of the [HttpsOptions](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpsOptions.md) class. |

## Properties

| Name | Description |
| --- | --- |
| [AllowedProtocols](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpsOptions.AllowedProtocols.md#Sisk_Cadente_HttpsOptions_AllowedProtocols) | Gets or sets the SSL/HTTPS protocols allowed for connections. |
| [CheckCertificateRevocation](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpsOptions.CheckCertificateRevocation.md#Sisk_Cadente_HttpsOptions_CheckCertificateRevocation) | Gets or sets a value indicating whether to check for certificate revocation. |
| [ClientCertificateRequired](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpsOptions.ClientCertificateRequired.md#Sisk_Cadente_HttpsOptions_ClientCertificateRequired) | Gets or sets a value indicating whether client certificates are required for authentication. |
| [ServerCertificate](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpsOptions.ServerCertificate.md#Sisk_Cadente_HttpsOptions_ServerCertificate) | Gets the SSL certificate used by the proxy server. |
