# RotatingLogPolicyCompressor

Kind: Class  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.RotatingLogPolicyCompressor.html

Provides a base class for implementing log compression policies.

```csharp
public abstract class RotatingLogPolicyCompressor
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[RotatingLogPolicyCompressor](https://docs.sisk-framework.org/api/Sisk.Core.Http.RotatingLogPolicyCompressor.md)

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
| [RotatingLogPolicyCompressor\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.RotatingLogPolicyCompressor.-ctor.md#Sisk_Core_Http_RotatingLogPolicyCompressor__ctor) |  |

## Methods

| Name | Description |
| --- | --- |
| [GetCompressedFileName\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.RotatingLogPolicyCompressor.GetCompressedFileName.md#Sisk_Core_Http_RotatingLogPolicyCompressor_GetCompressedFileName_System_String_) | Gets the compressed file name based on the provided pre-formatted name. |
| [GetCompressingStream\(Stream\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.RotatingLogPolicyCompressor.GetCompressingStream.md#Sisk_Core_Http_RotatingLogPolicyCompressor_GetCompressingStream_System_IO_Stream_) | Gets a stream for compressing the log file. |
