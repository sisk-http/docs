# HtmlDocumentationExporter.TransformId

Kind: Method  
Namespace: `Sisk.Documenting.Html`  
Assembly: `Sisk.Documenting.Html.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.TransformId.html

## TransformId(string) {#Sisk_Documenting_Html_HtmlDocumentationExporter_TransformId_System_String_}

Transforms an unsafe ID into a safe and valid HTML ID.

```csharp
protected string TransformId(string unsafeId)
```

### Parameters

`unsafeId` [string](https://learn.microsoft.com/dotnet/api/system.string)

The ID to transform, which may contain invalid characters.

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)

The transformed ID, which is safe for use in HTML.
