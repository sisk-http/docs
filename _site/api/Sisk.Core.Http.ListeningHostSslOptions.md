# ListeningHostSslOptions

Kind: Class  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostSslOptions.html

Represents the options for configuring HTTPS on a [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md).

```csharp
public sealed class ListeningHostSslOptions
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[ListeningHostSslOptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostSslOptions.md)

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
| [ListeningHostSslOptions\(X509Certificate\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostSslOptions.-ctor.md#Sisk_Core_Http_ListeningHostSslOptions__ctor_System_Security_Cryptography_X509Certificates_X509Certificate_) | Initializes a new instance of the [ListeningHostSslOptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostSslOptions.md) class. |

## Properties

| Name | Description |
| --- | --- |
| [AllowedProtocols](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostSslOptions.AllowedProtocols.md#Sisk_Core_Http_ListeningHostSslOptions_AllowedProtocols) | Gets or sets the SSL/HTTPS protocols allowed for connections. |
| [CheckCertificateRevocation](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostSslOptions.CheckCertificateRevocation.md#Sisk_Core_Http_ListeningHostSslOptions_CheckCertificateRevocation) | Gets or sets a value indicating whether to check for certificate revocation. |
| [ClientCertificateRequired](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostSslOptions.ClientCertificateRequired.md#Sisk_Core_Http_ListeningHostSslOptions_ClientCertificateRequired) | Gets or sets a value indicating whether client certificates are required for authentication. |
| [ServerCertificate](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostSslOptions.ServerCertificate.md#Sisk_Core_Http_ListeningHostSslOptions_ServerCertificate) | Gets the SSL certificate used by the proxy server. |
