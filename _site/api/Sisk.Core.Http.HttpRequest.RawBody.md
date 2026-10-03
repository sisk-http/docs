# HttpRequest.RawBody

Kind: Property  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RawBody.html

## RawBody {#Sisk_Core_Http_HttpRequest_RawBody}

Gets the HTTP request body as a byte array.

```csharp
public byte[] RawBody { get; }
```

### Property Value

[byte](https://learn.microsoft.com/dotnet/api/system.byte)\[\]

### Remarks

When calling this property, the entire content of the request is read into memory.
