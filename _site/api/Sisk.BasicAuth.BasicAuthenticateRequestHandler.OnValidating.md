# BasicAuthenticateRequestHandler.OnValidating

Kind: Method  
Namespace: `Sisk.BasicAuth`  
Assembly: `Sisk.BasicAuth.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.BasicAuth.BasicAuthenticateRequestHandler.OnValidating.html

## OnValidating(BasicAuthenticationCredentials, HttpContext) {#Sisk_BasicAuth_BasicAuthenticateRequestHandler_OnValidating_Sisk_BasicAuth_BasicAuthenticationCredentials_Sisk_Core_Http_HttpContext_}

Indicates the method that is called to validate a request with client credentials. When returning an [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md),
it will be sent immediately to the client and the rest of the stack will not be executed. If the return is null, it
is interpretable that the authentication was successful and the execution should continue.

```csharp
public virtual HttpResponse? OnValidating(BasicAuthenticationCredentials credentials, HttpContext context)
```

### Parameters

`credentials` [BasicAuthenticationCredentials](https://docs.sisk-framework.org/api/Sisk.BasicAuth.BasicAuthenticationCredentials.md)

Represents the credentials sent by the client, already decoded and ready for use.

`context` HttpContext

Represents the Http context.

### Returns

 HttpResponse?
