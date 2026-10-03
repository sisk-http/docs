# IApiDocumentationExporter.ExportDocumentationContent

Kind: Method  
Namespace: `Sisk.Documenting`  
Assembly: `Sisk.Documenting.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Documenting.IApiDocumentationExporter.ExportDocumentationContent.html

## ExportDocumentationContent(ApiDocumentation) {#Sisk_Documenting_IApiDocumentationExporter_ExportDocumentationContent_Sisk_Documenting_ApiDocumentation_}

Exports the specified API documentation content.

```csharp
HttpContent ExportDocumentationContent(ApiDocumentation documentation)
```

### Parameters

`documentation` [ApiDocumentation](https://docs.sisk-framework.org/api/Sisk.Documenting.ApiDocumentation.md)

The API documentation to export.

### Returns

[HttpContent](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent)

An [HttpContent](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent) representing the exported documentation.
