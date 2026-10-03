# MitmproxyProvider constructor

Kind: Constructor  
Namespace: `Sisk.Helpers.Mitmproxy`  
Assembly: `Sisk.Helpers.mitmproxy.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Helpers.Mitmproxy.MitmproxyProvider.-ctor.html

## MitmproxyProvider() {#Sisk_Helpers_Mitmproxy_MitmproxyProvider__ctor}

Initializes a new instance of the [MitmproxyProvider](https://docs.sisk-framework.org/api/Sisk.Helpers.Mitmproxy.MitmproxyProvider.md) class.

```csharp
public MitmproxyProvider()
```

## MitmproxyProvider(ushort, Action&lt;ChildProcessStartInfo>?) {#Sisk_Helpers_Mitmproxy_MitmproxyProvider__ctor_System_UInt16_System_Action_Asmichi_ProcessManagement_ChildProcessStartInfo__}

Initializes a new instance of the [MitmproxyProvider](https://docs.sisk-framework.org/api/Sisk.Helpers.Mitmproxy.MitmproxyProvider.md) class with a specified proxy port and optional process setup action.

```csharp
public MitmproxyProvider(ushort proxyPort, Action<ChildProcessStartInfo>? processSetupAction = null)
```

### Parameters

`proxyPort` [ushort](https://learn.microsoft.com/dotnet/api/system.uint16)

The port on which the mitmproxy will listen.

`processSetupAction` [Action](https://learn.microsoft.com/dotnet/api/system.action\-1)<ChildProcessStartInfo\>?

Optional. An action to configure the child process start information.
