# JsonRpcResponse

Kind: Class  
Namespace: `Sisk.JsonRPC`  
Assembly: `Sisk.JsonRPC.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcResponse.html

Represents an JSON-RPC response message.

```csharp
public sealed class JsonRpcResponse
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[JsonRpcResponse](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcResponse.md)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Properties

| Name | Description |
| --- | --- |
| [Error](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcResponse.Error.md#Sisk_JsonRPC_JsonRpcResponse_Error) | Gets the JSON-RPC response error. |
| [Id](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcResponse.Id.md#Sisk_JsonRPC_JsonRpcResponse_Id) | Gets the JSON-RPC response id. |
| [Result](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcResponse.Result.md#Sisk_JsonRPC_JsonRpcResponse_Result) | Gets the JSON-RPC response result. |
| [Version](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcResponse.Version.md#Sisk_JsonRPC_JsonRpcResponse_Version) | Gets the JSON-RPC response version. This property will always return "2.0". |

## Methods

| Name | Description |
| --- | --- |
| [CreateErrorResponse\(JsonValue, JsonRpcError\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcResponse.CreateErrorResponse.md#Sisk_JsonRPC_JsonRpcResponse_CreateErrorResponse_LightJson_JsonValue_Sisk_JsonRPC_JsonRpcError_) | Creates an new error [JsonRpcResponse](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcResponse.md) with given parameters. |
| [CreateSuccessResponse\(JsonValue, JsonValue\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcResponse.CreateSuccessResponse.md#Sisk_JsonRPC_JsonRpcResponse_CreateSuccessResponse_LightJson_JsonValue_LightJson_JsonValue_) | Creates an new success [JsonRpcResponse](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcResponse.md) with given parameters. |
