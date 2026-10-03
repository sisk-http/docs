# HttpEngineException

Kind: Class  
Namespace: `Sisk.Core.Http.Engine`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpEngineException.html

Represents an exception that occurred during the execution of the HTTP engine.

```csharp
public class HttpEngineException : Exception, ISerializable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[Exception](https://learn.microsoft.com/dotnet/api/system.exception) ← 
[HttpEngineException](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpEngineException.md)

#### Implements

[ISerializable](https://learn.microsoft.com/dotnet/api/system.runtime.serialization.iserializable)

#### Inherited Members

[Exception.GetBaseException\(\)](https://learn.microsoft.com/dotnet/api/system.exception.getbaseexception), 
[Exception.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.exception.tostring), 
[Exception.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.exception.gettype), 
[Exception.TargetSite](https://learn.microsoft.com/dotnet/api/system.exception.targetsite), 
[Exception.Message](https://learn.microsoft.com/dotnet/api/system.exception.message), 
[Exception.Data](https://learn.microsoft.com/dotnet/api/system.exception.data), 
[Exception.InnerException](https://learn.microsoft.com/dotnet/api/system.exception.innerexception), 
[Exception.HelpLink](https://learn.microsoft.com/dotnet/api/system.exception.helplink), 
[Exception.Source](https://learn.microsoft.com/dotnet/api/system.exception.source), 
[Exception.HResult](https://learn.microsoft.com/dotnet/api/system.exception.hresult), 
[Exception.StackTrace](https://learn.microsoft.com/dotnet/api/system.exception.stacktrace), 
[Exception.SerializeObjectState](https://learn.microsoft.com/dotnet/api/system.exception.serializeobjectstate), 
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
| [HttpEngineException\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpEngineException.-ctor.md#Sisk_Core_Http_Engine_HttpEngineException__ctor_System_String_) | Initializes a new instance of the [HttpEngineException](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpEngineException.md) class with a specified error message. |
| [HttpEngineException\(Exception\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpEngineException.-ctor.md#Sisk_Core_Http_Engine_HttpEngineException__ctor_System_Exception_) | Initializes a new instance of the [HttpEngineException](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpEngineException.md) class with a specified inner exception. |
