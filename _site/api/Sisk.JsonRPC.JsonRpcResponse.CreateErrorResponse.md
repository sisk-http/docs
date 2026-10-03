# JsonRpcResponse.CreateErrorResponse

Kind: Method  
Namespace: `Sisk.JsonRPC`  
Assembly: `Sisk.JsonRPC.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcResponse.CreateErrorResponse.html

## CreateErrorResponse(JsonValue, JsonRpcError) {#Sisk_JsonRPC_JsonRpcResponse_CreateErrorResponse_LightJson_JsonValue_Sisk_JsonRPC_JsonRpcError_}

Creates an new error [JsonRpcResponse](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcResponse.md) with given parameters.

```csharp
public static JsonRpcResponse CreateErrorResponse(JsonValue id, JsonRpcError error)
```

### Parameters

`id` JsonValue

The JSON-RPC response id.

`error` [JsonRpcError](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcError.md)

The JSON-RPC response error.

### Returns

[JsonRpcResponse](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcResponse.md)
