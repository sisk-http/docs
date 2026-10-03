# HttpFileServerHandler.IsEntryAllowedToListing

Kind: Method  
Namespace: `Sisk.Core.Http.FileSystem`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.IsEntryAllowedToListing.html

## IsEntryAllowedToListing(string) {#Sisk_Core_Http_FileSystem_HttpFileServerHandler_IsEntryAllowedToListing_System_String_}

Determines whether the specified file-system entry is allowed to be listed.

```csharp
protected virtual bool IsEntryAllowedToListing(string entryPath)
```

### Parameters

`entryPath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The absolute or relative path of the entry to check.

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if the entry is inside the configured root directory; otherwise, [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).
