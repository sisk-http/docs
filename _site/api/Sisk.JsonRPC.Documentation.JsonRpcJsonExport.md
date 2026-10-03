# JsonRpcJsonExport

Kind: Class  
Namespace: `Sisk.JsonRPC.Documentation`  
Assembly: `Sisk.JsonRPC.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.JsonRPC.Documentation.JsonRpcJsonExport.html

Provides an JSON-based [IJsonRpcDocumentationExporter](https://docs.sisk-framework.org/api/Sisk.JsonRPC.Documentation.IJsonRpcDocumentationExporter.md).

```csharp
public sealed class JsonRpcJsonExport : IJsonRpcDocumentationExporter
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[JsonRpcJsonExport](https://docs.sisk-framework.org/api/Sisk.JsonRPC.Documentation.JsonRpcJsonExport.md)

#### Implements

[IJsonRpcDocumentationExporter](https://docs.sisk-framework.org/api/Sisk.JsonRPC.Documentation.IJsonRpcDocumentationExporter.md)

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
| [JsonRpcJsonExport\(\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.Documentation.JsonRpcJsonExport.-ctor.md#Sisk_JsonRPC_Documentation_JsonRpcJsonExport__ctor) | Creates an new [JsonRpcJsonExport](https://docs.sisk-framework.org/api/Sisk.JsonRPC.Documentation.JsonRpcJsonExport.md) instance with default parameters. |
| [JsonRpcJsonExport\(JsonOptions\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.Documentation.JsonRpcJsonExport.-ctor.md#Sisk_JsonRPC_Documentation_JsonRpcJsonExport__ctor_LightJson_JsonOptions_) | Creates an new [JsonRpcJsonExport](https://docs.sisk-framework.org/api/Sisk.JsonRPC.Documentation.JsonRpcJsonExport.md) instance with the provided `JsonOptions` instance. |

## Properties

| Name | Description |
| --- | --- |
| [JsonOptions](https://docs.sisk-framework.org/api/Sisk.JsonRPC.Documentation.JsonRpcJsonExport.JsonOptions.md#Sisk_JsonRPC_Documentation_JsonRpcJsonExport_JsonOptions) | The [JsonOptions](https://docs.sisk-framework.org/api/Sisk.JsonRPC.Documentation.JsonRpcJsonExport.JsonOptions.md) instance used to encode the documentation. |

## Methods

| Name | Description |
| --- | --- |
| [EncodeDocumentation\(JsonRpcDocumentation\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.Documentation.JsonRpcJsonExport.EncodeDocumentation.md#Sisk_JsonRPC_Documentation_JsonRpcJsonExport_EncodeDocumentation_Sisk_JsonRPC_Documentation_JsonRpcDocumentation_) | Encodes the specified documentation into an `JsonValue`. |
| [ExportDocumentBytes\(JsonRpcDocumentation\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.Documentation.JsonRpcJsonExport.ExportDocumentBytes.md#Sisk_JsonRPC_Documentation_JsonRpcJsonExport_ExportDocumentBytes_Sisk_JsonRPC_Documentation_JsonRpcDocumentation_) | Exports the JSON-RPC documentation to a byte array. |
