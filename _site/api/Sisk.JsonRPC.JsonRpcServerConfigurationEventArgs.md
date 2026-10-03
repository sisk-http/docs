# JsonRpcServerConfigurationEventArgs

Kind: Class  
Namespace: `Sisk.JsonRPC`  
Assembly: `Sisk.JsonRPC.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcServerConfigurationEventArgs.html

Represents the class which contains event data for the JSON-RPC configuration event.

```csharp
public sealed class JsonRpcServerConfigurationEventArgs : EventArgs
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[EventArgs](https://learn.microsoft.com/dotnet/api/system.eventargs) ← 
[JsonRpcServerConfigurationEventArgs](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcServerConfigurationEventArgs.md)

#### Inherited Members

[EventArgs.Empty](https://learn.microsoft.com/dotnet/api/system.eventargs.empty), 
[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Properties

| Name | Description |
| --- | --- |
| [Handler](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcServerConfigurationEventArgs.Handler.md#Sisk_JsonRPC_JsonRpcServerConfigurationEventArgs_Handler) | Gets the configuring [JsonRpcHandler](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcHandler.md). |
| [Router](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcServerConfigurationEventArgs.Router.md#Sisk_JsonRPC_JsonRpcServerConfigurationEventArgs_Router) | Gets the target [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) which are being configured. |
