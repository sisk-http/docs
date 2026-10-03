# PathHelper.EnsureDirectoryExistance

Kind: Method  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.PathHelper.EnsureDirectoryExistance.html

## EnsureDirectoryExistance(string) {#Sisk_Core_Helpers_PathHelper_EnsureDirectoryExistance_System_String_}

Ensures that the specified directory exists, creating it if necessary.

```csharp
public static bool EnsureDirectoryExistance(string directoryPath)
```

### Parameters

`directoryPath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The directory path that should exist.

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if the directory already existed;
[`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if the directory was created.

### Exceptions

[ArgumentNullException](https://learn.microsoft.com/dotnet/api/system.argumentnullexception)

Thrown when `directoryPath` is [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null) or empty.
