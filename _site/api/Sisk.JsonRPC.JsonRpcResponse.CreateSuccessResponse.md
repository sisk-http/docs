# JsonRpcResponse.CreateSuccessResponse

Kind: Method  
Namespace: `Sisk.JsonRPC`  
Assembly: `Sisk.JsonRPC.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcResponse.CreateSuccessResponse.html

## CreateSuccessResponse(JsonValue, JsonValue) {#Sisk_JsonRPC_JsonRpcResponse_CreateSuccessResponse_LightJson_JsonValue_LightJson_JsonValue_}

Creates an new success [JsonRpcResponse](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcResponse.md) with given parameters.

```csharp
public static JsonRpcResponse CreateSuccessResponse(JsonValue id, JsonValue result)
```

### Parameters

`id` JsonValue

The JSON-RPC response id.

`result` JsonValue

The JSON-RPC response object.

### Returns

[JsonRpcResponse](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcResponse.md)
