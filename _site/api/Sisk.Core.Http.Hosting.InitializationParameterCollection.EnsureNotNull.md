# InitializationParameterCollection.EnsureNotNull

Kind: Method  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.InitializationParameterCollection.EnsureNotNull.html

## EnsureNotNull(string) {#Sisk_Core_Http_Hosting_InitializationParameterCollection_EnsureNotNull_System_String_}

Ensures that the parameter defined by name `parameterName` is present in this collection.

```csharp
public void EnsureNotNull(string parameterName)
```

### Parameters

`parameterName` [string](https://learn.microsoft.com/dotnet/api/system.string)

The parameter name which will be evaluated.

### Remarks

If the parameter doens't meet the above requirements, an [ArgumentNullException](https://learn.microsoft.com/dotnet/api/system.argumentnullexception) exception is thrown.
