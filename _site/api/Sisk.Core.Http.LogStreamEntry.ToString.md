# LogStreamEntry.ToString

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.ToString.html

## ToString() {#Sisk_Core_Http_LogStreamEntry_ToString}

Returns a string representation of the log entry in the default format.

```csharp
public override string ToString()
```

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)

A string containing the moment, level, and message.

## ToString(string?, IFormatProvider?) {#Sisk_Core_Http_LogStreamEntry_ToString_System_String_System_IFormatProvider_}

Returns a string representation of the log entry using the specified format string and format provider.

```csharp
public string ToString(string? format, IFormatProvider? formatProvider)
```

### Parameters

`format` [string](https://learn.microsoft.com/dotnet/api/system.string)?

A format string containing placeholders (%moment, %level, %message).

`formatProvider` [IFormatProvider](https://learn.microsoft.com/dotnet/api/system.iformatprovider)?

An object that supplies culture-specific formatting information.

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)

A formatted string representation of the log entry.
