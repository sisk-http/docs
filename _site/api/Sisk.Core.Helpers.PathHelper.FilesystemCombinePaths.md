# PathHelper.FilesystemCombinePaths

Kind: Method  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.PathHelper.FilesystemCombinePaths.html

## FilesystemCombinePaths(bool, char, params string[]) {#Sisk_Core_Helpers_PathHelper_FilesystemCombinePaths_System_Boolean_System_Char_System_String___}

Normalizes and combines the specified file-system paths into one.

```csharp
public static string FilesystemCombinePaths(bool allowRelativeReturn, char separator, params string[] paths)
```

### Parameters

`allowRelativeReturn` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

Specifies if relative paths should be merged and ".." returns should be respected.

`separator` [char](https://learn.microsoft.com/dotnet/api/system.char)

Specifies the path separator character.

`paths` [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]

Specifies the array of paths to combine.

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)

## FilesystemCombinePaths(bool, char, ReadOnlySpan&lt;string>) {#Sisk_Core_Helpers_PathHelper_FilesystemCombinePaths_System_Boolean_System_Char_System_ReadOnlySpan_System_String__}

Normalizes and combines the specified file-system paths into one.

```csharp
public static string FilesystemCombinePaths(bool allowRelativeReturn, char separator, ReadOnlySpan<string> paths)
```

### Parameters

`allowRelativeReturn` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

Specifies if relative paths should be merged and ".." returns should be respected.

`separator` [char](https://learn.microsoft.com/dotnet/api/system.char)

Specifies the path separator character.

`paths` [ReadOnlySpan](https://learn.microsoft.com/dotnet/api/system.readonlyspan\-1)<[string](https://learn.microsoft.com/dotnet/api/system.string)\>

Specifies the array of paths to combine.

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)

## FilesystemCombinePaths(params string[]) {#Sisk_Core_Helpers_PathHelper_FilesystemCombinePaths_System_String___}

Normalizes and combines the specified file-system paths into one, using the default environment directory separator char.

```csharp
public static string FilesystemCombinePaths(params string[] paths)
```

### Parameters

`paths` [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]

Specifies the array of paths to combine.

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)
