# HttpRequestException constructor

Kind: Constructor  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequestException.-ctor.html

## HttpRequestException(string) {#Sisk_Core_Http_HttpRequestException__ctor_System_String_}

Initializes a new instance of the [HttpRequestException](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequestException.md) class with a specified error message.

```csharp
public HttpRequestException(string message)
```

### Parameters

`message` [string](https://learn.microsoft.com/dotnet/api/system.string)

The message that describes the error.

## HttpRequestException(string, Exception?) {#Sisk_Core_Http_HttpRequestException__ctor_System_String_System_Exception_}

Initializes a new instance of the [HttpRequestException](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequestException.md) class with a specified error message and a reference to the inner exception that is the cause of this exception.

```csharp
public HttpRequestException(string message, Exception? innerException)
```

### Parameters

`message` [string](https://learn.microsoft.com/dotnet/api/system.string)

The message that describes the error.

`innerException` [Exception](https://learn.microsoft.com/dotnet/api/system.exception)?

The exception that is the cause of the current exception, or [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null) if no inner exception is specified.
