# ForwardingResolver.OnResolveRequestHost

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.ForwardingResolver.OnResolveRequestHost.html

## OnResolveRequestHost(HttpRequest, string) {#Sisk_Core_Http_ForwardingResolver_OnResolveRequestHost_Sisk_Core_Http_HttpRequest_System_String_}

Method that is called when resolving the client request host.

```csharp
public virtual string OnResolveRequestHost(HttpRequest request, string requestedHost)
```

### Parameters

`request` [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md)

The [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) object which contains parameters of the request.

`requestedHost` [string](https://learn.microsoft.com/dotnet/api/system.string)

The original requested host.

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)
