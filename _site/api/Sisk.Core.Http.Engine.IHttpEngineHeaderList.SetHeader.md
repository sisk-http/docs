# IHttpEngineHeaderList.SetHeader

Kind: Method  
Namespace: `Sisk.Core.Http.Engine`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.IHttpEngineHeaderList.SetHeader.html

## SetHeader(string, string) {#Sisk_Core_Http_Engine_IHttpEngineHeaderList_SetHeader_System_String_System_String_}

Sets a header with the specified name and value in the collection.
If a header with the same name already exists, its existing values are replaced with the new value.

```csharp
void SetHeader(string name, string value)
```

### Parameters

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the header to set.

`value` [string](https://learn.microsoft.com/dotnet/api/system.string)

The value of the header to set.
