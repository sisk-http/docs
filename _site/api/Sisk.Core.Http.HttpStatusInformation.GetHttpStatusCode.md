# HttpStatusInformation.GetHttpStatusCode

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpStatusInformation.GetHttpStatusCode.html

## GetHttpStatusCode() {#Sisk_Core_Http_HttpStatusInformation_GetHttpStatusCode}

Gets an [HttpStatusCode](https://learn.microsoft.com/dotnet/api/system.net.httpstatuscode) corresponding to this instance, or null if the HTTP status does not match any value.

```csharp
public HttpStatusCode? GetHttpStatusCode()
```

### Returns

[HttpStatusCode](https://learn.microsoft.com/dotnet/api/system.net.httpstatuscode)?

An [HttpStatusCode](https://learn.microsoft.com/dotnet/api/system.net.httpstatuscode) or null if the HTTP status matches no entry on it.
