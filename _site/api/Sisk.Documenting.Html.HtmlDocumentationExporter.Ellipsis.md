# HtmlDocumentationExporter.Ellipsis

Kind: Method  
Namespace: `Sisk.Documenting.Html`  
Assembly: `Sisk.Documenting.Html.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.Ellipsis.html

## Ellipsis(string?, int) {#Sisk_Documenting_Html_HtmlDocumentationExporter_Ellipsis_System_String_System_Int32_}

Truncates a string to the specified size, appending an ellipsis if necessary.

```csharp
protected string? Ellipsis(string? s, int size)
```

### Parameters

`s` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The string to truncate, or null for no truncation.

`size` [int](https://learn.microsoft.com/dotnet/api/system.int32)

The maximum length of the string, including the ellipsis.

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)?

The truncated string, or the original string if it is already within the size limit, or null if the input string is null.
