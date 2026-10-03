# JsonRpcException constructor

Kind: Constructor  
Namespace: `Sisk.JsonRPC`  
Assembly: `Sisk.JsonRPC.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcException.-ctor.html

## JsonRpcException(string) {#Sisk_JsonRPC_JsonRpcException__ctor_System_String_}

Initializes a new instance of the [JsonRpcException](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcException.md) class
with a specified error message.

```csharp
public JsonRpcException(string message)
```

### Parameters

`message` [string](https://learn.microsoft.com/dotnet/api/system.string)

The error message that explains the reason for the exception.

## JsonRpcException(string, int, object?) {#Sisk_JsonRPC_JsonRpcException__ctor_System_String_System_Int32_System_Object_}

Initializes a new instance of the [JsonRpcException](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcException.md) class
with a specified error message, error code, and additional data.

```csharp
public JsonRpcException(string message, int code, object? data)
```

### Parameters

`message` [string](https://learn.microsoft.com/dotnet/api/system.string)

The error message that explains the reason for the exception.

`code` [int](https://learn.microsoft.com/dotnet/api/system.int32)

The error code associated with the JSON-RPC error.

`data` [object](https://learn.microsoft.com/dotnet/api/system.object)?

Additional data associated with the error.
