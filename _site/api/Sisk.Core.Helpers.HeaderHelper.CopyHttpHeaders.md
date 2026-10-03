# HeaderHelper.CopyHttpHeaders

Kind: Method  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.HeaderHelper.CopyHttpHeaders.html

## CopyHttpHeaders(HttpContentHeaders, HttpContentHeaders, bool) {#Sisk_Core_Helpers_HeaderHelper_CopyHttpHeaders_System_Net_Http_Headers_HttpContentHeaders_System_Net_Http_Headers_HttpContentHeaders_System_Boolean_}

Copies HTTP headers from one [HttpContentHeaders](https://learn.microsoft.com/dotnet/api/system.net.http.headers.httpcontentheaders) instance to another.

```csharp
public static void CopyHttpHeaders(HttpContentHeaders from, HttpContentHeaders to, bool safe = true)
```

### Parameters

`from` [HttpContentHeaders](https://learn.microsoft.com/dotnet/api/system.net.http.headers.httpcontentheaders)

The source [HttpContentHeaders](https://learn.microsoft.com/dotnet/api/system.net.http.headers.httpcontentheaders) instance.

`to` [HttpContentHeaders](https://learn.microsoft.com/dotnet/api/system.net.http.headers.httpcontentheaders)

The target [HttpContentHeaders](https://learn.microsoft.com/dotnet/api/system.net.http.headers.httpcontentheaders) instance.

`safe` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

If set to [`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool), headers that are added will be validated (an exception can be throw if an header is invalid). If [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool), invalid headers could be discarded, but no exception is thrown.
