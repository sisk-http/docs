# HttpHeaderCollection.SetCookie

Kind: Property  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.SetCookie.html

## SetCookie {#Sisk_Core_Entity_HttpHeaderCollection_SetCookie}

Gets or sets the value of the HTTP Set-Cookie header.

Used to send cookies from the server to the client, allowing the server to store state information on the client.

```csharp
public string? SetCookie { get; set; }
```

### Property Value

[string](https://learn.microsoft.com/dotnet/api/system.string)?

### Remarks

Note: setting this property, it will override all previous Set-Cookie headers. Use the [Add](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Add.md) method
to add more than one Set-Cookie header or use the [SetCookie](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.SetCookie.md) method.
