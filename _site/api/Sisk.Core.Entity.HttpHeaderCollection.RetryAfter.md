# HttpHeaderCollection.RetryAfter

Kind: Property  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.RetryAfter.html

## RetryAfter {#Sisk_Core_Entity_HttpHeaderCollection_RetryAfter}

Gets or sets the value of the HTTP Retry-After header.

Indicates how long the client should wait before making a follow-up request, often used in rate limiting scenarios.

```csharp
public string? RetryAfter { get; set; }
```

### Property Value

[string](https://learn.microsoft.com/dotnet/api/system.string)?
