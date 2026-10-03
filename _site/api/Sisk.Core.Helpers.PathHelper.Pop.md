# PathHelper.Pop

Kind: Method  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.PathHelper.Pop.html

## Pop(string) {#Sisk_Core_Helpers_PathHelper_Pop_System_String_}

Removes the last segment from the specified path.

```csharp
public static string Pop(string path)
```

### Parameters

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)

The path to process.

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)

The path without its final segment, or [Empty](https://learn.microsoft.com/dotnet/api/system.string.empty) if no segments remain.
