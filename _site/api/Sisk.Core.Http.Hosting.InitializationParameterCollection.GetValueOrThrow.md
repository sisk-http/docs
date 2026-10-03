# InitializationParameterCollection.GetValueOrThrow

Kind: Method  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.InitializationParameterCollection.GetValueOrThrow.html

## GetValueOrThrow(string, GetValueOption) {#Sisk_Core_Http_Hosting_InitializationParameterCollection_GetValueOrThrow_System_String_Sisk_Core_Http_Hosting_InitializationParameterCollection_GetValueOption_}

Gets the specified value if present in this parameter collection, or throw an exception
if the value is not present.

```csharp
public string GetValueOrThrow(string parameterName, InitializationParameterCollection.GetValueOption option = GetValueOption.NotNullOrEmpty)
```

### Parameters

`parameterName` [string](https://learn.microsoft.com/dotnet/api/system.string)

The parameter name.

`option` [InitializationParameterCollection](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.InitializationParameterCollection.md).[GetValueOption](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.InitializationParameterCollection.GetValueOption.md)

Specifies the [GetValueOption](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.InitializationParameterCollection.GetValueOption.md) used for getting the value.

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)
