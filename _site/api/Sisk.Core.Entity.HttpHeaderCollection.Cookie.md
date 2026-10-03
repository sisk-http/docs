# HttpHeaderCollection.Cookie

Kind: Property  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.Cookie.html

## Cookie {#Sisk_Core_Entity_HttpHeaderCollection_Cookie}

Gets the value of the HTTP Cookie header.

Contains stored HTTP cookies previously sent by the server, allowing the server to identify the client on subsequent requests.

```csharp
public string? Cookie { get; }
```

### Property Value

[string](https://learn.microsoft.com/dotnet/api/system.string)?

### Remarks

Tip: use [Cookies](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Cookies.md) property to getting cookies values from requests and
[SetCookie](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.SetCookie.md) on [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) to set cookies.
