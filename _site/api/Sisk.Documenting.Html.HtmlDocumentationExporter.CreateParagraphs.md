# HtmlDocumentationExporter.CreateParagraphs

Kind: Method  
Namespace: `Sisk.Documenting.Html`  
Assembly: `Sisk.Documenting.Html.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.CreateParagraphs.html

## CreateParagraphs(string?) {#Sisk_Documenting_Html_HtmlDocumentationExporter_CreateParagraphs_System_String_}

Creates one or more HTML paragraph elements from the provided text.

```csharp
protected virtual object? CreateParagraphs(string? text)
```

### Parameters

`text` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The text to display in the paragraphs, or null for no paragraphs.

### Returns

[object](https://learn.microsoft.com/dotnet/api/system.object)?

The HTML element representing the paragraphs, or null if no text is provided.
