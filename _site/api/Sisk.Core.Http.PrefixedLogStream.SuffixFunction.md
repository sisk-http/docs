# PrefixedLogStream.SuffixFunction

Kind: Property  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.PrefixedLogStream.SuffixFunction.html

## SuffixFunction {#Sisk_Core_Http_PrefixedLogStream_SuffixFunction}

Gets or sets the function that provides a suffix string value.

```csharp
public Func<string?> SuffixFunction { get; set; }
```

### Property Value

[Func](https://learn.microsoft.com/dotnet/api/system.func\-1)<[string](https://learn.microsoft.com/dotnet/api/system.string)?\>

### Remarks

The assigned function should return the desired suffix as a string. If the function returns
            null, it is treated as an empty string in most scenarios.
