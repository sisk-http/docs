# PrefixedLogStream.PrefixFunction

Kind: Property  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.PrefixedLogStream.PrefixFunction.html

## PrefixFunction {#Sisk_Core_Http_PrefixedLogStream_PrefixFunction}

Gets or sets a function that returns the prefix to be added to log messages.

```csharp
public Func<string?> PrefixFunction { get; set; }
```

### Property Value

[Func](https://learn.microsoft.com/dotnet/api/system.func\-1)<[string](https://learn.microsoft.com/dotnet/api/system.string)?\>

### Remarks

The assigned function should return the desired prefix as a string. If the function returns
            null, it is treated as an empty string in most scenarios.
