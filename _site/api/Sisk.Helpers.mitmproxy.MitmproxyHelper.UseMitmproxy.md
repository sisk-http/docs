# MitmproxyHelper.UseMitmproxy

Kind: Method  
Namespace: `Sisk.Helpers.mitmproxy`  
Assembly: `Sisk.Helpers.mitmproxy.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Helpers.mitmproxy.MitmproxyHelper.UseMitmproxy.html

## UseMitmproxy(HttpServerHostContextBuilder) {#Sisk_Helpers_mitmproxy_MitmproxyHelper_UseMitmproxy_Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_}

Configures the specified [HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md) to use mitmproxy with a random proxy port.

```csharp
public static HttpServerHostContextBuilder UseMitmproxy(this HttpServerHostContextBuilder builder)
```

### Parameters

`builder` HttpServerHostContextBuilder

The [HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md) instance to configure.

### Returns

 HttpServerHostContextBuilder

The updated [HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md) instance.

## UseMitmproxy(HttpServerHostContextBuilder, ushort, bool, Action&lt;ChildProcessStartInfo>?) {#Sisk_Helpers_mitmproxy_MitmproxyHelper_UseMitmproxy_Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_System_UInt16_System_Boolean_System_Action_Asmichi_ProcessManagement_ChildProcessStartInfo__}

Configures the specified [HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md) to use mitmproxy with the specified options.

```csharp
public static HttpServerHostContextBuilder UseMitmproxy(this HttpServerHostContextBuilder builder, ushort proxyPort = 0, bool silent = false, Action<ChildProcessStartInfo>? setupAction = null)
```

### Parameters

`builder` HttpServerHostContextBuilder

The [HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md) instance to configure.

`proxyPort` [ushort](https://learn.microsoft.com/dotnet/api/system.uint16)

The port on which the mitmproxy will listen.

`silent` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

Indicates whether the mitmproxy should run in silent mode. Default is false.

`setupAction` [Action](https://learn.microsoft.com/dotnet/api/system.action\-1)<ChildProcessStartInfo\>?

An optional action to configure the child process start information.

### Returns

 HttpServerHostContextBuilder

The updated [HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md) instance.
