# Router.Rewrite

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.Rewrite.html

## Rewrite(string, string) {#Sisk_Core_Routing_Router_Rewrite_System_String_System_String_}

Maps a rewrite route, which redirects all requests that match the given path to another path,
keeping the body and headers of the original request.

```csharp
public void Rewrite(string rewritePath, string rewriteInto)
```

### Parameters

`rewritePath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The incoming HTTP request path.

`rewriteInto` [string](https://learn.microsoft.com/dotnet/api/system.string)

The rewrited URL.
