# PathHelper.IsPathAllowed

Kind: Method  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.PathHelper.IsPathAllowed.html

## IsPathAllowed(string) {#Sisk_Core_Helpers_PathHelper_IsPathAllowed_System_String_}

Determines whether the specified path contains only valid path and file-name characters.

```csharp
public static bool IsPathAllowed(string path)
```

### Parameters

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)

The path to validate.

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if `path` contains no invalid path or file-name characters;
otherwise, [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).
