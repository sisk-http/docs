# LogStream.PeekEntries

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.PeekEntries.html

## PeekEntries() {#Sisk_Core_Http_LogStream_PeekEntries}

Retrieves all buffered log entries as an array of strings.

```csharp
public string[] PeekEntries()
```

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)\[\]

An array of log entries, with the most recent entry first.

### Exceptions

[InvalidOperationException](https://learn.microsoft.com/dotnet/api/system.invalidoperationexception)

Thrown when this LogStream is not buffering.
