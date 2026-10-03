# HttpHeaderList.Get

Kind: Method  
Namespace: `Sisk.Cadente`  
Assembly: `Sisk.Cadente.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.Get.html

## Get(string) {#Sisk_Cadente_HttpHeaderList_Get_System_String_}

Gets the values of all headers that match the specified name.

```csharp
public string[] Get(string name)
```

### Parameters

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the header to retrieve.

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)\[\]

An array of header values that match the specified name. If no headers match, an empty array is returned.
