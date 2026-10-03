# ForwardingResolver.OnResolveSecureConnection

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.ForwardingResolver.OnResolveSecureConnection.html

## OnResolveSecureConnection(HttpRequest, bool) {#Sisk_Core_Http_ForwardingResolver_OnResolveSecureConnection_Sisk_Core_Http_HttpRequest_System_Boolean_}

Method that is called when resolving whether the HTTP request is using HTTPS or HTTP.

```csharp
public virtual bool OnResolveSecureConnection(HttpRequest request, bool isSecure)
```

### Parameters

`request` [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md)

The [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) object which contains parameters of the request.

`isSecure` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

The original security state of the request.

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)
