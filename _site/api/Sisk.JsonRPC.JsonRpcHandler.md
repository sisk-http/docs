# JsonRpcHandler

Kind: Class  
Namespace: `Sisk.JsonRPC`  
Assembly: `Sisk.JsonRPC.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcHandler.html

Represents a handler for JSON-RPC requests.

```csharp
public sealed class JsonRpcHandler
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[JsonRpcHandler](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcHandler.md)

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
| [JsonRpcHandler\(HttpServer\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcHandler.-ctor.md#Sisk_JsonRPC_JsonRpcHandler__ctor_Sisk_Core_Http_HttpServer_) | Initializes a new instance of the [JsonRpcHandler](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcHandler.md) class. |

## Properties

| Name | Description |
| --- | --- |
| [JsonSerializerOptions](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcHandler.JsonSerializerOptions.md#Sisk_JsonRPC_JsonRpcHandler_JsonSerializerOptions) | Gets the JSON serializer options used for serialization and deserialization. |
| [Methods](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcHandler.Methods.md#Sisk_JsonRPC_JsonRpcHandler_Methods) | Gets the collection of JSON-RPC methods available in this handler. |
| [Transport](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcHandler.Transport.md#Sisk_JsonRPC_JsonRpcHandler_Transport) | Gets the transport layer used for communication. |

## Methods

| Name | Description |
| --- | --- |
| [GetDocumentation\(\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcHandler.GetDocumentation.md#Sisk_JsonRPC_JsonRpcHandler_GetDocumentation) | Gets the documentation for this JSON-RPC handler. |
| [GetDocumentation\(JsonRpcDocumentationMetadata\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcHandler.GetDocumentation.md#Sisk_JsonRPC_JsonRpcHandler_GetDocumentation_Sisk_JsonRPC_Documentation_JsonRpcDocumentationMetadata_) | Gets the documentation for this JSON-RPC handler. |
