# IHttpEngineHeaderList.GetHeader

Kind: Method  
Namespace: `Sisk.Core.Http.Engine`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.IHttpEngineHeaderList.GetHeader.html

## GetHeader(string) {#Sisk_Core_Http_Engine_IHttpEngineHeaderList_GetHeader_System_String_}

Gets all values associated with the header with the specified name.

```csharp
string[] GetHeader(string name)
```

### Parameters

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the header to retrieve.

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)\[\]

An array of strings representing the values of the header. Returns an empty array if the header is not found.
