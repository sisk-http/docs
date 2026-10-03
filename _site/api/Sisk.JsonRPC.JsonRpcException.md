# JsonRpcException

Kind: Class  
Namespace: `Sisk.JsonRPC`  
Assembly: `Sisk.JsonRPC.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcException.html

Represents an error that occur during the JSON-RPC application
execution.

```csharp
public class JsonRpcException : Exception, ISerializable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[Exception](https://learn.microsoft.com/dotnet/api/system.exception) ← 
[JsonRpcException](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcException.md)

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
| [JsonRpcException\(string\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcException.-ctor.md#Sisk_JsonRPC_JsonRpcException__ctor_System_String_) | Initializes a new instance of the [JsonRpcException](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcException.md) class with a specified error message. |
| [JsonRpcException\(string, int, object?\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcException.-ctor.md#Sisk_JsonRPC_JsonRpcException__ctor_System_String_System_Int32_System_Object_) | Initializes a new instance of the [JsonRpcException](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcException.md) class with a specified error message, error code, and additional data. |

## Properties

| Name | Description |
| --- | --- |
| [Code](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcException.Code.md#Sisk_JsonRPC_JsonRpcException_Code) | Gets the error code associated with the JSON-RPC error. |
| [Data](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcException.Data.md#Sisk_JsonRPC_JsonRpcException_Data) | Gets additional data associated with the error, if any. |

## Methods

| Name | Description |
| --- | --- |
| [AsRpcError\(\)](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcException.AsRpcError.md#Sisk_JsonRPC_JsonRpcException_AsRpcError) | Converts the current [JsonRpcException](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcException.md) into a [JsonRpcError](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcError.md). |
