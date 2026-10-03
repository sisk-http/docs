# JsonRpcHtmlExport

Kind: Class  
Namespace: `Sisk.JsonRPC.Documentation`  
Assembly: `Sisk.JsonRPC.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.JsonRPC.Documentation.JsonRpcHtmlExport.html

Provides an HTML-based [IJsonRpcDocumentationExporter](https://docs.sisk-framework.org/api/Sisk.JsonRPC.Documentation.IJsonRpcDocumentationExporter.md).

```csharp
public class JsonRpcHtmlExport : IJsonRpcDocumentationExporter
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[JsonRpcHtmlExport](https://docs.sisk-framework.org/api/Sisk.JsonRPC.Documentation.JsonRpcHtmlExport.md)

#### Implements

[IJsonRpcDocumentationExporter](https://docs.sisk-framework.org/api/Sisk.JsonRPC.Documentation.IJsonRpcDocumentationExporter.md)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.MemberwiseClone\(\)](https://learn.microsoft.com/dotnet/api/system.object.memberwiseclone), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [JsonRpcHtmlExport\(\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.Documentation.JsonRpcHtmlExport.-ctor.md#Sisk_JsonRPC_Documentation_JsonRpcHtmlExport__ctor) |  |

## Properties

| Name | Description |
| --- | --- |
| [ExportMetadata](https://docs.sisk-framework.org/api/Sisk.JsonRPC.Documentation.JsonRpcHtmlExport.ExportMetadata.md#Sisk_JsonRPC_Documentation_JsonRpcHtmlExport_ExportMetadata) | Gets or sets an boolean indicating if the documentation metadata should be exported in the HTML. |
| [ExportSummary](https://docs.sisk-framework.org/api/Sisk.JsonRPC.Documentation.JsonRpcHtmlExport.ExportSummary.md#Sisk_JsonRPC_Documentation_JsonRpcHtmlExport_ExportSummary) | Gets or sets an boolean indicating if an summary should be exported in the HTML. |
| [Header](https://docs.sisk-framework.org/api/Sisk.JsonRPC.Documentation.JsonRpcHtmlExport.Header.md#Sisk_JsonRPC_Documentation_JsonRpcHtmlExport_Header) | Gets or sets an optional object to append to the header of the exported HTML. |
| [Style](https://docs.sisk-framework.org/api/Sisk.JsonRPC.Documentation.JsonRpcHtmlExport.Style.md#Sisk_JsonRPC_Documentation_JsonRpcHtmlExport_Style) | Gets or sets the CSS styles used in the HTML export. |

## Methods

| Name | Description |
| --- | --- |
| [EncodeDocumentationHtml\(JsonRpcDocumentation\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.Documentation.JsonRpcHtmlExport.EncodeDocumentationHtml.md#Sisk_JsonRPC_Documentation_JsonRpcHtmlExport_EncodeDocumentationHtml_Sisk_JsonRPC_Documentation_JsonRpcDocumentation_) | Encodes the specified [JsonRpcDocumentation](https://docs.sisk-framework.org/api/Sisk.JsonRPC.Documentation.JsonRpcDocumentation.md) into a HTML string. |
| [ExportDocumentBytes\(JsonRpcDocumentation\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.Documentation.JsonRpcHtmlExport.ExportDocumentBytes.md#Sisk_JsonRPC_Documentation_JsonRpcHtmlExport_ExportDocumentBytes_Sisk_JsonRPC_Documentation_JsonRpcDocumentation_) | Exports the JSON-RPC documentation to a byte array. |
