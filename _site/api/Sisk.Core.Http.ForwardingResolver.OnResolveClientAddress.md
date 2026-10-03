# ForwardingResolver.OnResolveClientAddress

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.ForwardingResolver.OnResolveClientAddress.html

## OnResolveClientAddress(HttpRequest, IPEndPoint) {#Sisk_Core_Http_ForwardingResolver_OnResolveClientAddress_Sisk_Core_Http_HttpRequest_System_Net_IPEndPoint_}

Method that is called when resolving the IP address of the client in the request.

```csharp
public virtual IPAddress OnResolveClientAddress(HttpRequest request, IPEndPoint connectingEndpoint)
```

### Parameters

`request` [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md)

The [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) object which contains parameters of the request.

`connectingEndpoint` [IPEndPoint](https://learn.microsoft.com/dotnet/api/system.net.ipendpoint)

The original connecting endpoint.

### Returns

[IPAddress](https://learn.microsoft.com/dotnet/api/system.net.ipaddress)
