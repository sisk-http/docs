# JsonRpcError

Kind: Struct  
Namespace: `Sisk.JsonRPC`  
Assembly: `Sisk.JsonRPC.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcError.html

Represents an JSON-RPC error.

```csharp
public readonly struct JsonRpcError
```

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [JsonRpcError\(\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcError.-ctor.md#Sisk_JsonRPC_JsonRpcError__ctor) | Creates an new instance of the [JsonRpcError](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcError.md) structure. |
| [JsonRpcError\(int, string\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcError.-ctor.md#Sisk_JsonRPC_JsonRpcError__ctor_System_Int32_System_String_) | Creates an new instance of the [JsonRpcError](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcError.md) structure with given parameters. |
| [JsonRpcError\(int, string, JsonValue\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcError.-ctor.md#Sisk_JsonRPC_JsonRpcError__ctor_System_Int32_System_String_LightJson_JsonValue_) | Creates an new instance of the [JsonRpcError](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcError.md) structure with given parameters. |

## Properties

| Name | Description |
| --- | --- |
| [Code](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcError.Code.md#Sisk_JsonRPC_JsonRpcError_Code) | Gets the JSON-RPC error code. |
| [Data](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcError.Data.md#Sisk_JsonRPC_JsonRpcError_Data) | Gets the JSON-RPC error additional data. |
| [Message](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcError.Message.md#Sisk_JsonRPC_JsonRpcError_Message) | Gets the JSON-RPC error message. |
