# MimeHelper.IsBrowserKnownInlineMimeType

Kind: Method  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.MimeHelper.IsBrowserKnownInlineMimeType.html

## IsBrowserKnownInlineMimeType(string) {#Sisk_Core_Helpers_MimeHelper_IsBrowserKnownInlineMimeType_System_String_}

Determines whether the specified mime-type is considered an inline content type 
that can be displayed directly in most browsers.

```csharp
public static bool IsBrowserKnownInlineMimeType(string mimeType)
```

### Parameters

`mimeType` [string](https://learn.microsoft.com/dotnet/api/system.string)

The mime-type to evaluate.

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if the content type is an inline content type; otherwise, [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).
