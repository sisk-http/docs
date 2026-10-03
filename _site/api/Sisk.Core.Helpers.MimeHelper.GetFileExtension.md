# MimeHelper.GetFileExtension

Kind: Method  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.MimeHelper.GetFileExtension.html

## GetFileExtension(string, string?) {#Sisk_Core_Helpers_MimeHelper_GetFileExtension_System_String_System_String_}

Gets the file extension for the specified MIME type.

```csharp
public static string? GetFileExtension(string mimeType, string? fallback = null)
```

### Parameters

`mimeType` [string](https://learn.microsoft.com/dotnet/api/system.string)

The MIME type, optionally including parameters such as `; charset=utf-8`.

`fallback` [string](https://learn.microsoft.com/dotnet/api/system.string)?

Optional. The default extension when no match is found.

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)?

The file extension without the leading dot (e.g. `html`), or `fallback` if the MIME type is not recognized.
