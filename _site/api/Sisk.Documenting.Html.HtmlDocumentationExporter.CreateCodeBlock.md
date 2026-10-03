# HtmlDocumentationExporter.CreateCodeBlock

Kind: Method  
Namespace: `Sisk.Documenting.Html`  
Assembly: `Sisk.Documenting.Html.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.CreateCodeBlock.html

## CreateCodeBlock(string, string?) {#Sisk_Documenting_Html_HtmlDocumentationExporter_CreateCodeBlock_System_String_System_String_}

Creates an HTML code block element from the provided code and language.

```csharp
protected virtual HtmlElement? CreateCodeBlock(string code, string? language)
```

### Parameters

`code` [string](https://learn.microsoft.com/dotnet/api/system.string)

The code to display in the code block.

`language` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The programming language of the code, or null for no language highlighting.

### Returns

 HtmlElement?

The HTML element representing the code block, or null if no code is provided.
