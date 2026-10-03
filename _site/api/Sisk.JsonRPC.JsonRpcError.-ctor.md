# JsonRpcError constructor

Kind: Constructor  
Namespace: `Sisk.JsonRPC`  
Assembly: `Sisk.JsonRPC.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcError.-ctor.html

## JsonRpcError() {#Sisk_JsonRPC_JsonRpcError__ctor}

Creates an new instance of the [JsonRpcError](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcError.md) structure.

```csharp
public JsonRpcError()
```

## JsonRpcError(int, string) {#Sisk_JsonRPC_JsonRpcError__ctor_System_Int32_System_String_}

Creates an new instance of the [JsonRpcError](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcError.md) structure with given
parameters.

```csharp
public JsonRpcError(int code, string message)
```

### Parameters

`code` [int](https://learn.microsoft.com/dotnet/api/system.int32)

The JSON-RPC error code.

`message` [string](https://learn.microsoft.com/dotnet/api/system.string)

The JSON-RPC error message.

## JsonRpcError(int, string, JsonValue) {#Sisk_JsonRPC_JsonRpcError__ctor_System_Int32_System_String_LightJson_JsonValue_}

Creates an new instance of the [JsonRpcError](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcError.md) structure with given
parameters.

```csharp
public JsonRpcError(int code, string message, JsonValue data)
```

### Parameters

`code` [int](https://learn.microsoft.com/dotnet/api/system.int32)

The JSON-RPC error code.

`message` [string](https://learn.microsoft.com/dotnet/api/system.string)

The JSON-RPC error message.

`data` JsonValue

The JSON-RPC error additional data.
