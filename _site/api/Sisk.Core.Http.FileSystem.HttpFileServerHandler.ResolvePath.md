# HttpFileServerHandler.ResolvePath

Kind: Method  
Namespace: `Sisk.Core.Http.FileSystem`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.ResolvePath.html

## ResolvePath(string) {#Sisk_Core_Http_FileSystem_HttpFileServerHandler_ResolvePath_System_String_}

Resolves the specified virtual path to a physical file or directory within the root directory.

```csharp
protected virtual FileSystemInfo? ResolvePath(string path)
```

### Parameters

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)

The virtual path to resolve.

### Returns

[FileSystemInfo](https://learn.microsoft.com/dotnet/api/system.io.filesysteminfo)?

A [FileSystemInfo](https://learn.microsoft.com/dotnet/api/system.io.filesysteminfo) instance for the resolved file or directory, or [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null) if the path does not exist.
