# HttpFileServerFileConverter

Kind: Class  
Namespace: `Sisk.Core.Http.FileSystem`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerFileConverter.html

Base class for implementing custom file converters that transform files before they are served as HTTP responses.

```csharp
public abstract class HttpFileServerFileConverter
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpFileServerFileConverter](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerFileConverter.md)

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
| [HttpFileServerFileConverter\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerFileConverter.-ctor.md#Sisk_Core_Http_FileSystem_HttpFileServerFileConverter__ctor) |  |

## Methods

| Name | Description |
| --- | --- |
| [CanConvert\(FileInfo\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerFileConverter.CanConvert.md#Sisk_Core_Http_FileSystem_HttpFileServerFileConverter_CanConvert_System_IO_FileInfo_) | Determines whether this converter can process the specified file. |
| [Convert\(FileInfo, HttpRequest\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerFileConverter.Convert.md#Sisk_Core_Http_FileSystem_HttpFileServerFileConverter_Convert_System_IO_FileInfo_Sisk_Core_Http_HttpRequest_) | Converts the specified file into an HTTP response. |
