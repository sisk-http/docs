# HttpFileServerHandler

Kind: Class  
Namespace: `Sisk.Core.Http.FileSystem`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.html

Provides HTTP file-serving capabilities for a specified root directory, including optional directory listing and file conversion.

```csharp
public class HttpFileServerHandler
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpFileServerHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.md)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.MemberwiseClone\(\)](https://learn.microsoft.com/dotnet/api/system.object.memberwiseclone), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [HttpFileServerHandler\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.-ctor.md#Sisk_Core_Http_FileSystem_HttpFileServerHandler__ctor_System_String_) | Initializes a new instance of the [HttpFileServerHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.md) class with the specified root directory. |
| [HttpFileServerHandler\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.-ctor.md#Sisk_Core_Http_FileSystem_HttpFileServerHandler__ctor) | Initializes a new instance of the [HttpFileServerHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.md) class using the current working directory as the root. |

## Properties

| Name | Description |
| --- | --- |
| [AllowDirectoryListing](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.AllowDirectoryListing.md#Sisk_Core_Http_FileSystem_HttpFileServerHandler_AllowDirectoryListing) | Gets or sets a value indicating whether directory listing is enabled when an index file is not present. |
| [AllowIndex](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.AllowIndex.md#Sisk_Core_Http_FileSystem_HttpFileServerHandler_AllowIndex) | Gets or sets a value indicating whether an `index.html` file is automatically served when a directory is requested. |
| [FileConverters](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.FileConverters.md#Sisk_Core_Http_FileSystem_HttpFileServerHandler_FileConverters) | Gets the list of converters used to transform files before they are sent to the client. |
| [RootDirectoryPath](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.RootDirectoryPath.md#Sisk_Core_Http_FileSystem_HttpFileServerHandler_RootDirectoryPath) | Gets or sets the absolute or relative path to the root directory from which files are served. |
| [RoutePrefix](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.RoutePrefix.md#Sisk_Core_Http_FileSystem_HttpFileServerHandler_RoutePrefix) | Gets or sets the optional route prefix that must be matched for requests to be handled by this instance. Matched prefix will be trimmed from the request path when resolving files. |

## Methods

| Name | Description |
| --- | --- |
| [ContainsReparsePointBetweenRootAndPath\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.ContainsReparsePointBetweenRootAndPath.md#Sisk_Core_Http_FileSystem_HttpFileServerHandler_ContainsReparsePointBetweenRootAndPath_System_String_) | Checks whether any segment between the configured root and the requested path is a symlink/reparse point. |
| [HandleRequest\(HttpRequest\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.HandleRequest.md#Sisk_Core_Http_FileSystem_HttpFileServerHandler_HandleRequest_Sisk_Core_Http_HttpRequest_) | Processes the incoming HTTP request and returns the appropriate file or directory response. |
| [HasReparsePoint\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.HasReparsePoint.md#Sisk_Core_Http_FileSystem_HttpFileServerHandler_HasReparsePoint_System_String_) | Determines whether a file-system path is a symlink/reparse point. |
| [IsEntryAllowedToListing\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.IsEntryAllowedToListing.md#Sisk_Core_Http_FileSystem_HttpFileServerHandler_IsEntryAllowedToListing_System_String_) | Determines whether the specified file-system entry is allowed to be listed. |
| [IsPathContainedInRoot\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.IsPathContainedInRoot.md#Sisk_Core_Http_FileSystem_HttpFileServerHandler_IsPathContainedInRoot_System_String_) | Determines whether the specified path resolves under the configured root directory. |
| [IsRequestAllowed\(HttpRequest\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.IsRequestAllowed.md#Sisk_Core_Http_FileSystem_HttpFileServerHandler_IsRequestAllowed_Sisk_Core_Http_HttpRequest_) | Determines whether the incoming HTTP request is allowed to proceed. |
| [ResolvePath\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.ResolvePath.md#Sisk_Core_Http_FileSystem_HttpFileServerHandler_ResolvePath_System_String_) | Resolves the specified virtual path to a physical file or directory within the root directory. |
| [ServeDirectoryListing\(DirectoryInfo, HttpRequest\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.ServeDirectoryListing.md#Sisk_Core_Http_FileSystem_HttpFileServerHandler_ServeDirectoryListing_System_IO_DirectoryInfo_Sisk_Core_Http_HttpRequest_) | Generates an HTML directory listing for the specified directory and returns it as an HTTP response. |
| [ServeFile\(FileInfo, HttpRequest\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.ServeFile.md#Sisk_Core_Http_FileSystem_HttpFileServerHandler_ServeFile_System_IO_FileInfo_Sisk_Core_Http_HttpRequest_) | Serves the specified file as an HTTP response, applying the first compatible converter if available. |
