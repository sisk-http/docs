# CrossOriginResourceSharingHeaders constructor

Kind: Constructor  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.-ctor.html

## CrossOriginResourceSharingHeaders() {#Sisk_Core_Entity_CrossOriginResourceSharingHeaders__ctor}

Creates an empty [CrossOriginResourceSharingHeaders](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.md) instance with no predefined CORS headers.

```csharp
public CrossOriginResourceSharingHeaders()
```

## CrossOriginResourceSharingHeaders(string?, string[]?, string[]?, string[]?, string[]?, TimeSpan?, bool) {#Sisk_Core_Entity_CrossOriginResourceSharingHeaders__ctor_System_String_System_String___System_String___System_String___System_String___System_Nullable_System_TimeSpan__System_Boolean_}

Initializes a new instance of the [CrossOriginResourceSharingHeaders](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.md) class with the specified CORS headers.

```csharp
public CrossOriginResourceSharingHeaders(string? allowOrigin = null, string[]? allowOrigins = null, string[]? allowMethods = null, string[]? allowHeaders = null, string[]? exposeHeaders = null, TimeSpan? maxAge = null, bool allowCredentials = false)
```

### Parameters

`allowOrigin` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The value of the Access-Control-Allow-Origin header.

`allowOrigins` [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]?

The values of the Access-Control-Allow-Origin header.

`allowMethods` [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]?

The values of the Access-Control-Allow-Methods header.

`allowHeaders` [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]?

The values of the Access-Control-Allow-Headers header.

`exposeHeaders` [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]?

The values of the Access-Control-Expose-Headers header.

`maxAge` [TimeSpan](https://learn.microsoft.com/dotnet/api/system.timespan)?

The value of the Access-Control-Max-Age header.

`allowCredentials` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

The value of the Access-Control-Allow-Credentials header.
