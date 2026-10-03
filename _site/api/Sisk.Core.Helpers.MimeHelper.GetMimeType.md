# MimeHelper.GetMimeType

Kind: Method  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.MimeHelper.GetMimeType.html

## GetMimeType(string, string?) {#Sisk_Core_Helpers_MimeHelper_GetMimeType_System_String_System_String_}

Gets the content mime-type from the specified file extension.

```csharp
public static string GetMimeType(string fileExtension, string? fallback = null)
```

### Parameters

`fileExtension` [string](https://learn.microsoft.com/dotnet/api/system.string)

The file extension, file path or the extension, with or without the dot.

`fallback` [string](https://learn.microsoft.com/dotnet/api/system.string)?

Optional. The default mime-type when the file best mime-type is not found. If this argument is null, [DefaultMimeType](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.MimeHelper.DefaultMimeType.md) is used.

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)

The best matched mime-type, or the default if no mime-type was matched with the specified extension.
