# IHttpEngineHeaderList.AppendHeader

Kind: Method  
Namespace: `Sisk.Core.Http.Engine`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.IHttpEngineHeaderList.AppendHeader.html

## AppendHeader(string, string) {#Sisk_Core_Http_Engine_IHttpEngineHeaderList_AppendHeader_System_String_System_String_}

Appends a header with the specified name and value to the collection.
If a header with the same name already exists, the new value is added as an additional value for that header.

```csharp
void AppendHeader(string name, string value)
```

### Parameters

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the header to append.

`value` [string](https://learn.microsoft.com/dotnet/api/system.string)

The value of the header to append.
