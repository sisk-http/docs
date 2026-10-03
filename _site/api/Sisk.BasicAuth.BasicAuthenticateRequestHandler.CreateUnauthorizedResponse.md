# BasicAuthenticateRequestHandler.CreateUnauthorizedResponse

Kind: Method  
Namespace: `Sisk.BasicAuth`  
Assembly: `Sisk.BasicAuth.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.BasicAuth.BasicAuthenticateRequestHandler.CreateUnauthorizedResponse.html

## CreateUnauthorizedResponse(string) {#Sisk_BasicAuth_BasicAuthenticateRequestHandler_CreateUnauthorizedResponse_System_String_}

Creates an empty HTTP response with the WWW-Authenticate header and an custom realm message.

```csharp
public HttpResponse CreateUnauthorizedResponse(string realm)
```

### Parameters

`realm` [string](https://learn.microsoft.com/dotnet/api/system.string)

Defines the realm message to send back to the client.

### Returns

 HttpResponse

## CreateUnauthorizedResponse() {#Sisk_BasicAuth_BasicAuthenticateRequestHandler_CreateUnauthorizedResponse}

Creates an empty HTTP response with the WWW-Authenticate header and with the realm message defined in this class instance.

```csharp
public HttpResponse CreateUnauthorizedResponse()
```

### Returns

 HttpResponse
