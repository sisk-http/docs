# HttpEngineException constructor

Kind: Constructor  
Namespace: `Sisk.Core.Http.Engine`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpEngineException.-ctor.html

## HttpEngineException(string) {#Sisk_Core_Http_Engine_HttpEngineException__ctor_System_String_}

Initializes a new instance of the [HttpEngineException](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpEngineException.md) class with a specified error message.

```csharp
public HttpEngineException(string message)
```

### Parameters

`message` [string](https://learn.microsoft.com/dotnet/api/system.string)

The message that describes the error.

## HttpEngineException(Exception) {#Sisk_Core_Http_Engine_HttpEngineException__ctor_System_Exception_}

Initializes a new instance of the [HttpEngineException](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpEngineException.md) class with a specified inner exception.

```csharp
public HttpEngineException(Exception inner)
```

### Parameters

`inner` [Exception](https://learn.microsoft.com/dotnet/api/system.exception)

The exception that is the cause of the current exception.
