# HttpResponseStreamManager.SetCookie

Kind: Method  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpResponseStreamManager.SetCookie.html

## SetCookie(Cookie) {#Sisk_Core_Http_Streams_HttpResponseStreamManager_SetCookie_System_Net_Cookie_}

Sets a cookie and sends it in the response to be set by the client.

```csharp
public void SetCookie(Cookie cookie)
```

### Parameters

`cookie` [Cookie](https://learn.microsoft.com/dotnet/api/system.net.cookie)

The cookie object.

## SetCookie(string, string) {#Sisk_Core_Http_Streams_HttpResponseStreamManager_SetCookie_System_String_System_String_}

Sets a cookie and sends it in the response to be set by the client.

```csharp
public void SetCookie(string name, string value)
```

### Parameters

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

The cookie name.

`value` [string](https://learn.microsoft.com/dotnet/api/system.string)

The cookie value.

## SetCookie(string, string, DateTime?, TimeSpan?, string?, string?, bool?, bool?, string?) {#Sisk_Core_Http_Streams_HttpResponseStreamManager_SetCookie_System_String_System_String_System_Nullable_System_DateTime__System_Nullable_System_TimeSpan__System_String_System_String_System_Nullable_System_Boolean__System_Nullable_System_Boolean__System_String_}

Sets a cookie and sends it in the response to be set by the client.

```csharp
public void SetCookie(string name, string value, DateTime? expires = null, TimeSpan? maxAge = null, string? domain = null, string? path = null, bool? secure = null, bool? httpOnly = null, string? sameSite = null)
```

### Parameters

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

The cookie name.

`value` [string](https://learn.microsoft.com/dotnet/api/system.string)

The cookie value.

`expires` [DateTime](https://learn.microsoft.com/dotnet/api/system.datetime)?

The cookie expirity date.

`maxAge` [TimeSpan](https://learn.microsoft.com/dotnet/api/system.timespan)?

The cookie max duration after being set.

`domain` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The domain where the cookie will be valid.

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The path where the cookie will be valid.

`secure` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)?

Determines if the cookie will only be stored in an secure context.

`httpOnly` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)?

Determines if the cookie will be only available in the HTTP context.

`sameSite` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The cookie SameSite parameter.
