# SizeHelper.Parse

Kind: Method  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.SizeHelper.Parse.html

## Parse(string) {#Sisk_Core_Helpers_SizeHelper_Parse_System_String_}

Parses a human-readable size string (e.g., "10 KB", "2.5 MB") into a long representing the number of bytes.

```csharp
public static long Parse(string humanReadableSize)
```

### Parameters

`humanReadableSize` [string](https://learn.microsoft.com/dotnet/api/system.string)

The human-readable size string to parse.

### Returns

[long](https://learn.microsoft.com/dotnet/api/system.int64)

The size in bytes, represented as a long.

### Exceptions

[ArgumentNullException](https://learn.microsoft.com/dotnet/api/system.argumentnullexception)

Thrown if `humanReadableSize` is null or whitespace.

[ArgumentException](https://learn.microsoft.com/dotnet/api/system.argumentexception)

Thrown if `humanReadableSize` is not in a valid format.
