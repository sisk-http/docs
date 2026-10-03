# PathHelper.NormalizePath

Kind: Method  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.PathHelper.NormalizePath.html

## NormalizePath(string, char, bool) {#Sisk_Core_Helpers_PathHelper_NormalizePath_System_String_System_Char_System_Boolean_}

Normalize the given path to use the specified directory separator, trim the last separator and
remove empty entries.

```csharp
public static string NormalizePath(string path, char directorySeparator = '/', bool surroundWithDelimiters = false)
```

### Parameters

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)

The path to normalize.

`directorySeparator` [char](https://learn.microsoft.com/dotnet/api/system.char)

The directory separator.

`surroundWithDelimiters` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) to ensure the result starts and ends with `directorySeparator`;
otherwise, [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool). Defaults to [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)
