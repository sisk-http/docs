# HttpStatusInformation constructor

Kind: Constructor  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpStatusInformation.-ctor.html

## HttpStatusInformation() {#Sisk_Core_Http_HttpStatusInformation__ctor}

Creates an new [HttpStatusInformation](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpStatusInformation.md) with default parameters (200 OK) status.

```csharp
public HttpStatusInformation()
```

## HttpStatusInformation(int) {#Sisk_Core_Http_HttpStatusInformation__ctor_System_Int32_}

Creates an new [HttpStatusInformation](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpStatusInformation.md) instance with given parameters.

```csharp
public HttpStatusInformation(int statusCode)
```

### Parameters

`statusCode` [int](https://learn.microsoft.com/dotnet/api/system.int32)

Sets the numeric HTTP status code of the HTTP message.

## HttpStatusInformation(HttpStatusCode) {#Sisk_Core_Http_HttpStatusInformation__ctor_System_Net_HttpStatusCode_}

Creates an new [HttpStatusInformation](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpStatusInformation.md) instance with given parameters.

```csharp
public HttpStatusInformation(HttpStatusCode statusCode)
```

### Parameters

`statusCode` [HttpStatusCode](https://learn.microsoft.com/dotnet/api/system.net.httpstatuscode)

Sets the numeric HTTP status code of the HTTP message.

## HttpStatusInformation(int, string) {#Sisk_Core_Http_HttpStatusInformation__ctor_System_Int32_System_String_}

Creates an new [HttpStatusInformation](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpStatusInformation.md) instance with given parameters.

```csharp
public HttpStatusInformation(int statusCode, string description)
```

### Parameters

`statusCode` [int](https://learn.microsoft.com/dotnet/api/system.int32)

Sets the numeric HTTP status code of the HTTP message.

`description` [string](https://learn.microsoft.com/dotnet/api/system.string)

Sets the short description of the HTTP message.

### Remarks

Custom status descriptions is only supported for plain HTTP/1.1 and 1.0 transfers.

### Exceptions

[ArgumentNullException](https://learn.microsoft.com/dotnet/api/system.argumentnullexception)
