# ListeningPort.TryParse

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.TryParse.html

## TryParse(string?, IFormatProvider?, out ListeningPort) {#Sisk_Core_Http_ListeningPort_TryParse_System_String_System_IFormatProvider_Sisk_Core_Http_ListeningPort__}

Tries to parse a string into a [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md).

```csharp
static bool TryParse(string? s, IFormatProvider? provider, out ListeningPort result)
```

### Parameters

`s` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The string to parse.

`provider` [IFormatProvider](https://learn.microsoft.com/dotnet/api/system.iformatprovider)?

An object that provides culture-specific formatting information about s.

`result` [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md)

When this method returns, contains the result of successfully parsing s or an undefined value on failure.

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)
