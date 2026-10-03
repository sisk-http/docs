# TransferEncoding

Kind: Enum  
Namespace: `Sisk.Cadente`  
Assembly: `Sisk.Cadente.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.TransferEncoding.html

Represents an HTTP transfer-encoding algorithm.

```csharp
[Flags]
public enum TransferEncoding
```

## Fields

| Name | Description |
| --- | --- |
| `Chunked = 2` | Indicates that the response is sent in a series of chunks. |
| `Deflate = 8` | Indicates that the response is compressed using Deflate encoding. |
| `GZip = 4` | Indicates that the response is compressed using GZip encoding. |
