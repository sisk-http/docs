# MitmproxyProvider

Kind: Class  
Namespace: `Sisk.Helpers.Mitmproxy`  
Assembly: `Sisk.Helpers.mitmproxy.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Helpers.Mitmproxy.MitmproxyProvider.html

Provides a MITM proxy server handler.

```csharp
public sealed class MitmproxyProvider : HttpServerHandler
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
HttpServerHandler ← 
[MitmproxyProvider](https://docs.sisk-framework.org/api/Sisk.Helpers.Mitmproxy.MitmproxyProvider.md)

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
| [MitmproxyProvider\(\)](https://docs.sisk-framework.org/api/Sisk.Helpers.Mitmproxy.MitmproxyProvider.-ctor.md#Sisk_Helpers_Mitmproxy_MitmproxyProvider__ctor) | Initializes a new instance of the [MitmproxyProvider](https://docs.sisk-framework.org/api/Sisk.Helpers.Mitmproxy.MitmproxyProvider.md) class. |
| [MitmproxyProvider\(ushort, Action<ChildProcessStartInfo\>?\)](https://docs.sisk-framework.org/api/Sisk.Helpers.Mitmproxy.MitmproxyProvider.-ctor.md#Sisk_Helpers_Mitmproxy_MitmproxyProvider__ctor_System_UInt16_System_Action_Asmichi_ProcessManagement_ChildProcessStartInfo__) | Initializes a new instance of the [MitmproxyProvider](https://docs.sisk-framework.org/api/Sisk.Helpers.Mitmproxy.MitmproxyProvider.md) class with a specified proxy port and optional process setup action. |

## Properties

| Name | Description |
| --- | --- |
| [MitmdumpProcess](https://docs.sisk-framework.org/api/Sisk.Helpers.Mitmproxy.MitmproxyProvider.MitmdumpProcess.md#Sisk_Helpers_Mitmproxy_MitmproxyProvider_MitmdumpProcess) | Gets the mitmdump process. |
| [ProxyPort](https://docs.sisk-framework.org/api/Sisk.Helpers.Mitmproxy.MitmproxyProvider.ProxyPort.md#Sisk_Helpers_Mitmproxy_MitmproxyProvider_ProxyPort) | Gets or sets the proxy port. |
| [Silent](https://docs.sisk-framework.org/api/Sisk.Helpers.Mitmproxy.MitmproxyProvider.Silent.md#Sisk_Helpers_Mitmproxy_MitmproxyProvider_Silent) | Gets or sets a value indicating whether to run the mitmdump process silently. |

## Methods

| Name | Description |
| --- | --- |
| [OnServerStarted\(HttpServer\)](https://docs.sisk-framework.org/api/Sisk.Helpers.Mitmproxy.MitmproxyProvider.OnServerStarted.md#Sisk_Helpers_Mitmproxy_MitmproxyProvider_OnServerStarted_Sisk_Core_Http_HttpServer_) | Event that is called immediately after starting the [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md), when it's ready and listening. |
| [OnServerStarting\(HttpServer\)](https://docs.sisk-framework.org/api/Sisk.Helpers.Mitmproxy.MitmproxyProvider.OnServerStarting.md#Sisk_Helpers_Mitmproxy_MitmproxyProvider_OnServerStarting_Sisk_Core_Http_HttpServer_) | Event that is called immediately before starting the [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md). |
| [OnServerStopped\(HttpServer\)](https://docs.sisk-framework.org/api/Sisk.Helpers.Mitmproxy.MitmproxyProvider.OnServerStopped.md#Sisk_Helpers_Mitmproxy_MitmproxyProvider_OnServerStopped_Sisk_Core_Http_HttpServer_) | Event that is called after the [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md) is stopped, meaning it has stopped from listening to requests. |
| [OnServerStopping\(HttpServer\)](https://docs.sisk-framework.org/api/Sisk.Helpers.Mitmproxy.MitmproxyProvider.OnServerStopping.md#Sisk_Helpers_Mitmproxy_MitmproxyProvider_OnServerStopping_Sisk_Core_Http_HttpServer_) | Event that is called before the [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md) stop, when it is stopping from listening requests. |
