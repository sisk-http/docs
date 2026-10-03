# HttpResponseStreamManager.SetHeader

Kind: Method  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpResponseStreamManager.SetHeader.html

## SetHeader(string, object?) {#Sisk_Core_Http_Streams_HttpResponseStreamManager_SetHeader_System_String_System_Object_}

Sets the specific HTTP header into this response stream.

```csharp
public void SetHeader(string headerName, object? value)
```

### Parameters

`headerName` [string](https://learn.microsoft.com/dotnet/api/system.string)

The HTTP header name.

`value` [object](https://learn.microsoft.com/dotnet/api/system.object)?

The HTTP header value.

### Remarks

Headers are sent immediately, along with the HTTP response code, after starting to send content or closing this stream.
