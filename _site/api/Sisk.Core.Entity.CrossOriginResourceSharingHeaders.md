# CrossOriginResourceSharingHeaders

Kind: Class  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.html

Provides a class to provide Cross Origin response headers for when communicating with a browser.

```csharp
public sealed class CrossOriginResourceSharingHeaders
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[CrossOriginResourceSharingHeaders](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.md)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [CrossOriginResourceSharingHeaders\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.-ctor.md#Sisk_Core_Entity_CrossOriginResourceSharingHeaders__ctor) | Creates an empty [CrossOriginResourceSharingHeaders](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.md) instance with no predefined CORS headers. |
| [CrossOriginResourceSharingHeaders\(string?, string\[\]?, string\[\]?, string\[\]?, string\[\]?, TimeSpan?, bool\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.-ctor.md#Sisk_Core_Entity_CrossOriginResourceSharingHeaders__ctor_System_String_System_String___System_String___System_String___System_String___System_Nullable_System_TimeSpan__System_Boolean_) | Initializes a new instance of the [CrossOriginResourceSharingHeaders](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.md) class with the specified CORS headers. |

## Fields

| Name | Description |
| --- | --- |
| [AutoAllowOrigin](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoAllowOrigin.md#Sisk_Core_Entity_CrossOriginResourceSharingHeaders_AutoAllowOrigin) | When applied to the [AllowOrigin](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin.md) property, the HTTP server automatically applies the incoming request Origin header value to the Access-Control-Allow-Origin header. |
| [AutoFromRequestHeaders](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoFromRequestHeaders.md#Sisk_Core_Entity_CrossOriginResourceSharingHeaders_AutoFromRequestHeaders) | When applied to the [AllowHeaders](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowHeaders.md) property, the HTTP server automatically applies the incoming request headers to the Access-Control-Allow-Origin header. |
| [AutoFromRequestMethod](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoFromRequestMethod.md#Sisk_Core_Entity_CrossOriginResourceSharingHeaders_AutoFromRequestMethod) | When applied to the [AllowMethods](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowMethods.md) property, the HTTP server automatically applies the incoming request method to the Access-Control-Allow-Origin header. |

## Properties

| Name | Description |
| --- | --- |
| [AllowCredentials](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowCredentials.md#Sisk_Core_Entity_CrossOriginResourceSharingHeaders_AllowCredentials) | Gets or sets the Access-Control-Allow-Credentials header indicates whether or not the response to the request can be exposed when the credentials flag is true. When used as part of a response to a preflight request, this indicates whether or not the actual request can be made using credentials. |
| [AllowHeaders](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowHeaders.md#Sisk_Core_Entity_CrossOriginResourceSharingHeaders_AllowHeaders) | Gets or sets the Access-Control-Allow-Headers header is used in response to a preflight request to indicate which HTTP headers can be used when making the actual request. |
| [AllowMethods](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowMethods.md#Sisk_Core_Entity_CrossOriginResourceSharingHeaders_AllowMethods) | Gets or sets the Access-Control-Allow-Methods header specifies the method or methods allowed when accessing the resource. |
| [AllowOrigin](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin.md#Sisk_Core_Entity_CrossOriginResourceSharingHeaders_AllowOrigin) | From MDN: Access-Control-Allow-Origin specifies either a single origin which tells browsers to allow that origin to access the resource; or else — for requests without credentials — the "*" wildcard tells browsers to allow any origin to access the resource. |
| [AllowOrigins](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins.md#Sisk_Core_Entity_CrossOriginResourceSharingHeaders_AllowOrigins) | Gets or sets domains which will define the source header according to one of the domains present below. |
| [Empty](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.Empty.md#Sisk_Core_Entity_CrossOriginResourceSharingHeaders_Empty) | Gets an instance of an empty CrossOriginResourceSharingHeaders. |
| [ExposeHeaders](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.ExposeHeaders.md#Sisk_Core_Entity_CrossOriginResourceSharingHeaders_ExposeHeaders) | Gets or sets the Access-Control-Expose-Headers header adds the specified headers to the allowlist that JavaScript in browsers is allowed to access. |
| [MaxAge](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.MaxAge.md#Sisk_Core_Entity_CrossOriginResourceSharingHeaders_MaxAge) | Gets or sets the Access-Control-Max-Age header indicates how long the results of a preflight request can be cached. |

## Methods

| Name | Description |
| --- | --- |
| [CreatePublicContext\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.CreatePublicContext.md#Sisk_Core_Entity_CrossOriginResourceSharingHeaders_CreatePublicContext) | Create an instance of Cross-Origin Resource Sharing that allows any origin, any method and any header in the request. |
