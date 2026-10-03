# SslProxyServerHandler

Kind: Class  
Namespace: `Sisk.Ssl`  
Assembly: `Sisk.SslProxy.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxyServerHandler.html

Provides event handlers and hooks for [SslProxy](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxy.md).

```csharp
public sealed class SslProxyServerHandler : HttpServerHandler
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
HttpServerHandler ← 
[SslProxyServerHandler](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxyServerHandler.md)

#### Inherited Members

HttpServerHandler.Priority, 
[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [SslProxyServerHandler\(SslProxy\)](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxyServerHandler.-ctor.md#Sisk_Ssl_SslProxyServerHandler__ctor_Sisk_Ssl_SslProxy_) | Creates an new [SslProxyServerHandler](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxyServerHandler.md) instance with the specified [SslProxy](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxy.md) instance. |

## Properties

| Name | Description |
| --- | --- |
| [SecureProxy](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxyServerHandler.SecureProxy.md#Sisk_Ssl_SslProxyServerHandler_SecureProxy) | Gets the [SslProxy](https://docs.sisk-framework.org/api/Sisk.Ssl.SslProxy.md) instance used in this server handler. |
