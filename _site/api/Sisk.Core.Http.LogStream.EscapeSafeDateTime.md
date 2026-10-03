# LogStream.EscapeSafeDateTime

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.EscapeSafeDateTime.html

## EscapeSafeDateTime(DateTime, IFormatProvider?) {#Sisk_Core_Http_LogStream_EscapeSafeDateTime_System_DateTime_System_IFormatProvider_}

Converts the specified [DateTime](https://learn.microsoft.com/dotnet/api/system.datetime) to a file-name-safe string representation
formatted as "yyyy-MM-dd_HH-mm-ss".

```csharp
public static string EscapeSafeDateTime(DateTime dt, IFormatProvider? provider = null)
```

### Parameters

`dt` [DateTime](https://learn.microsoft.com/dotnet/api/system.datetime)

The date and time to convert.

`provider` [IFormatProvider](https://learn.microsoft.com/dotnet/api/system.iformatprovider)?

An object that supplies culture-specific formatting information. Can be [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)

A string that is safe for use in file names.
