# HttpRequest.Body

Kind: Property  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Body.html

## Body {#Sisk_Core_Http_HttpRequest_Body}

Gets the HTTP request body as string, decoded by the request content encoding.

```csharp
public string Body { get; }
```

### Property Value

[string](https://learn.microsoft.com/dotnet/api/system.string)

### Remarks

When calling this property, the entire content of the request is read into memory and stored in [RawBody](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RawBody.md).
