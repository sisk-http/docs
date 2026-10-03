# PathHelper.EnsureFileDirectoryExistance

Kind: Method  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.PathHelper.EnsureFileDirectoryExistance.html

## EnsureFileDirectoryExistance(string) {#Sisk_Core_Helpers_PathHelper_EnsureFileDirectoryExistance_System_String_}

Ensures that the directory for the specified file path exists, creating it if necessary.

```csharp
public static bool EnsureFileDirectoryExistance(string filePath)
```

### Parameters

`filePath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The file path whose parent directory should exist.

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if the directory already existed;
[`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if the directory was created.

### Exceptions

[ArgumentNullException](https://learn.microsoft.com/dotnet/api/system.argumentnullexception)

Thrown when `filePath` is [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null) or empty.
