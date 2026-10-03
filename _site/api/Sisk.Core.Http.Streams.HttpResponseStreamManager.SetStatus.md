# HttpResponseStreamManager.SetStatus

Kind: Method  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpResponseStreamManager.SetStatus.html

## SetStatus(int) {#Sisk_Core_Http_Streams_HttpResponseStreamManager_SetStatus_System_Int32_}

Sets the HTTP status code for this response stream.

```csharp
public void SetStatus(int httpStatusCode)
```

### Parameters

`httpStatusCode` [int](https://learn.microsoft.com/dotnet/api/system.int32)

The HTTP status code.

## SetStatus(HttpStatusCode) {#Sisk_Core_Http_Streams_HttpResponseStreamManager_SetStatus_System_Net_HttpStatusCode_}

Sets the HTTP status code for this response stream.

```csharp
public void SetStatus(HttpStatusCode statusCode)
```

### Parameters

`statusCode` [HttpStatusCode](https://learn.microsoft.com/dotnet/api/system.net.httpstatuscode)

The HTTP status code.

## SetStatus(HttpStatusInformation) {#Sisk_Core_Http_Streams_HttpResponseStreamManager_SetStatus_Sisk_Core_Http_HttpStatusInformation_}

Sets the HTTP status code and description for this response stream.

```csharp
public void SetStatus(HttpStatusInformation statusCode)
```

### Parameters

`statusCode` [HttpStatusInformation](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpStatusInformation.md)

The custom HTTP status code information.
