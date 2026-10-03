# BasicAuthenticateRequestHandler

Kind: Class  
Namespace: `Sisk.BasicAuth`  
Assembly: `Sisk.BasicAuth.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.BasicAuth.BasicAuthenticateRequestHandler.html

Gets a [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md) that serves as an authenticator for the Basic Authentication scheme, which can validate a user id and password.

```csharp
public class BasicAuthenticateRequestHandler : IRequestHandler
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[BasicAuthenticateRequestHandler](https://docs.sisk-framework.org/api/Sisk.BasicAuth.BasicAuthenticateRequestHandler.md)

#### Implements

IRequestHandler

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.MemberwiseClone\(\)](https://learn.microsoft.com/dotnet/api/system.object.memberwiseclone), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [BasicAuthenticateRequestHandler\(\)](https://docs.sisk-framework.org/api/Sisk.BasicAuth.BasicAuthenticateRequestHandler.-ctor.md#Sisk_BasicAuth_BasicAuthenticateRequestHandler__ctor) |  |

## Properties

| Name | Description |
| --- | --- |
| [ExecutionMode](https://docs.sisk-framework.org/api/Sisk.BasicAuth.BasicAuthenticateRequestHandler.ExecutionMode.md#Sisk_BasicAuth_BasicAuthenticateRequestHandler_ExecutionMode) | Gets or sets when this RequestHandler should run. |
| [Realm](https://docs.sisk-framework.org/api/Sisk.BasicAuth.BasicAuthenticateRequestHandler.Realm.md#Sisk_BasicAuth_BasicAuthenticateRequestHandler_Realm) | Gets or sets a message to show the client which protection scope it needs to authenticate to. |

## Methods

| Name | Description |
| --- | --- |
| [CreateUnauthorizedResponse\(string\)](https://docs.sisk-framework.org/api/Sisk.BasicAuth.BasicAuthenticateRequestHandler.CreateUnauthorizedResponse.md#Sisk_BasicAuth_BasicAuthenticateRequestHandler_CreateUnauthorizedResponse_System_String_) | Creates an empty HTTP response with the WWW-Authenticate header and an custom realm message. |
| [CreateUnauthorizedResponse\(\)](https://docs.sisk-framework.org/api/Sisk.BasicAuth.BasicAuthenticateRequestHandler.CreateUnauthorizedResponse.md#Sisk_BasicAuth_BasicAuthenticateRequestHandler_CreateUnauthorizedResponse) | Creates an empty HTTP response with the WWW-Authenticate header and with the realm message defined in this class instance. |
| [Execute\(HttpRequest, HttpContext\)](https://docs.sisk-framework.org/api/Sisk.BasicAuth.BasicAuthenticateRequestHandler.Execute.md#Sisk_BasicAuth_BasicAuthenticateRequestHandler_Execute_Sisk_Core_Http_HttpRequest_Sisk_Core_Http_HttpContext_) | This method is called by the [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) before executing a request when the [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) instantiates an object that implements this interface. If it returns a [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) object, the route callback is not called and all execution of the route is stopped. If it returns "null", the execution is continued. |
| [OnValidating\(BasicAuthenticationCredentials, HttpContext\)](https://docs.sisk-framework.org/api/Sisk.BasicAuth.BasicAuthenticateRequestHandler.OnValidating.md#Sisk_BasicAuth_BasicAuthenticateRequestHandler_OnValidating_Sisk_BasicAuth_BasicAuthenticationCredentials_Sisk_Core_Http_HttpContext_) | Indicates the method that is called to validate a request with client credentials. When returning an [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md), it will be sent immediately to the client and the rest of the stack will not be executed. If the return is null, it is interpretable that the authentication was successful and the execution should continue. |
