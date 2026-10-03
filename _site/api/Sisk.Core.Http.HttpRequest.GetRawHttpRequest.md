# HttpRequest.GetRawHttpRequest

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetRawHttpRequest.html

## GetRawHttpRequest(bool, bool) {#Sisk_Core_Http_HttpRequest_GetRawHttpRequest_System_Boolean_System_Boolean_}

Gets a visual representation of this request.

```csharp
public string GetRawHttpRequest(bool includeBody = true, bool appendExtraInfo = false)
```

### Parameters

`includeBody` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

Optional. Defines if the body should be included in the output.

`appendExtraInfo` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

Optional. Appends extra information, such as request id and date into the output.

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)
