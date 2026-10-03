# HttpFileServerHandler.ContainsReparsePointBetweenRootAndPath

Kind: Method  
Namespace: `Sisk.Core.Http.FileSystem`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.ContainsReparsePointBetweenRootAndPath.html

## ContainsReparsePointBetweenRootAndPath(string) {#Sisk_Core_Http_FileSystem_HttpFileServerHandler_ContainsReparsePointBetweenRootAndPath_System_String_}

Checks whether any segment between the configured root and the requested path is a symlink/reparse point.

```csharp
protected virtual bool ContainsReparsePointBetweenRootAndPath(string path)
```

### Parameters

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)
