# LogStream.Peek

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.Peek.html

## Peek() {#Sisk_Core_Http_LogStream_Peek}

Reads the output buffer. To use this method, it's required to set this
[LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md) buffering with [StartBuffering](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.StartBuffering.md).

```csharp
public string Peek()
```

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)

### Exceptions

[InvalidOperationException](https://learn.microsoft.com/dotnet/api/system.invalidoperationexception)

Thrown when this LogStream is not buffering.
