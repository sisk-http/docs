# MitmproxyHelper

Kind: Class  
Namespace: `Sisk.Helpers.mitmproxy`  
Assembly: `Sisk.Helpers.mitmproxy.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Helpers.mitmproxy.MitmproxyHelper.html

Provides extension methods for configuring an HTTP server to use mitmproxy.

```csharp
public static class MitmproxyHelper
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[MitmproxyHelper](https://docs.sisk-framework.org/api/Sisk.Helpers.mitmproxy.MitmproxyHelper.md)

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
| [UseMitmproxy\(HttpServerHostContextBuilder\)](https://docs.sisk-framework.org/api/Sisk.Helpers.mitmproxy.MitmproxyHelper.UseMitmproxy.md#Sisk_Helpers_mitmproxy_MitmproxyHelper_UseMitmproxy_Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_) | Configures the specified [HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md) to use mitmproxy with a random proxy port. |
| [UseMitmproxy\(HttpServerHostContextBuilder, ushort, bool, Action<ChildProcessStartInfo\>?\)](https://docs.sisk-framework.org/api/Sisk.Helpers.mitmproxy.MitmproxyHelper.UseMitmproxy.md#Sisk_Helpers_mitmproxy_MitmproxyHelper_UseMitmproxy_Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_System_UInt16_System_Boolean_System_Action_Asmichi_ProcessManagement_ChildProcessStartInfo__) | Configures the specified [HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md) to use mitmproxy with the specified options. |
