# IHttpEngineHeaderList

Kind: Interface  
Namespace: `Sisk.Core.Http.Engine`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.IHttpEngineHeaderList.html

Represents a collection of HTTP headers.

```csharp
public interface IHttpEngineHeaderList
```

## Properties

| Name | Description |
| --- | --- |
| [Count](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.IHttpEngineHeaderList.Count.md#Sisk_Core_Http_Engine_IHttpEngineHeaderList_Count) | Gets the number of headers in the collection. |
| [DefinedHeaderNames](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.IHttpEngineHeaderList.DefinedHeaderNames.md#Sisk_Core_Http_Engine_IHttpEngineHeaderList_DefinedHeaderNames) | Gets an array of strings representing the names of all defined headers in the collection. |

## Methods

| Name | Description |
| --- | --- |
| [AppendHeader\(string, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.IHttpEngineHeaderList.AppendHeader.md#Sisk_Core_Http_Engine_IHttpEngineHeaderList_AppendHeader_System_String_System_String_) | Appends a header with the specified name and value to the collection. If a header with the same name already exists, the new value is added as an additional value for that header. |
| [Clear\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.IHttpEngineHeaderList.Clear.md#Sisk_Core_Http_Engine_IHttpEngineHeaderList_Clear) | Removes all headers from the collection. |
| [Contains\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.IHttpEngineHeaderList.Contains.md#Sisk_Core_Http_Engine_IHttpEngineHeaderList_Contains_System_String_) | Determines whether the collection contains a header with the specified name. |
| [GetHeader\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.IHttpEngineHeaderList.GetHeader.md#Sisk_Core_Http_Engine_IHttpEngineHeaderList_GetHeader_System_String_) | Gets all values associated with the header with the specified name. |
| [SetHeader\(string, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.IHttpEngineHeaderList.SetHeader.md#Sisk_Core_Http_Engine_IHttpEngineHeaderList_SetHeader_System_String_System_String_) | Sets a header with the specified name and value in the collection. If a header with the same name already exists, its existing values are replaced with the new value. |
