# ForwardingResolver

Kind: Class  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.ForwardingResolver.html

Provides HTTP forwarding resolving methods that can be used to resolving the client remote
address, host and protocol of a proxy, load balancer or CDN, through the HTTP request.

```csharp
public abstract class ForwardingResolver
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[ForwardingResolver](https://docs.sisk-framework.org/api/Sisk.Core.Http.ForwardingResolver.md)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.MemberwiseClone\(\)](https://learn.microsoft.com/dotnet/api/system.object.memberwiseclone), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [ForwardingResolver\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ForwardingResolver.-ctor.md#Sisk_Core_Http_ForwardingResolver__ctor) |  |

## Methods

| Name | Description |
| --- | --- |
| [OnResolveClientAddress\(HttpRequest, IPEndPoint\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ForwardingResolver.OnResolveClientAddress.md#Sisk_Core_Http_ForwardingResolver_OnResolveClientAddress_Sisk_Core_Http_HttpRequest_System_Net_IPEndPoint_) | Method that is called when resolving the IP address of the client in the request. |
| [OnResolveRequestHost\(HttpRequest, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ForwardingResolver.OnResolveRequestHost.md#Sisk_Core_Http_ForwardingResolver_OnResolveRequestHost_Sisk_Core_Http_HttpRequest_System_String_) | Method that is called when resolving the client request host. |
| [OnResolveSecureConnection\(HttpRequest, bool\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ForwardingResolver.OnResolveSecureConnection.md#Sisk_Core_Http_ForwardingResolver_OnResolveSecureConnection_Sisk_Core_Http_HttpRequest_System_Boolean_) | Method that is called when resolving whether the HTTP request is using HTTPS or HTTP. |
