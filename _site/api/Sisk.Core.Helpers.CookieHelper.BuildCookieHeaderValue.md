# CookieHelper.BuildCookieHeaderValue

Kind: Method  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.CookieHelper.BuildCookieHeaderValue.html

## BuildCookieHeaderValue(Cookie) {#Sisk_Core_Helpers_CookieHelper_BuildCookieHeaderValue_System_Net_Cookie_}

Builds the cookie header value and returns an string from it.

```csharp
public static string BuildCookieHeaderValue(Cookie cookie)
```

### Parameters

`cookie` [Cookie](https://learn.microsoft.com/dotnet/api/system.net.cookie)

The [Cookie](https://learn.microsoft.com/dotnet/api/system.net.cookie) instance to build the cookie string.

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)

## BuildCookieHeaderValue(string, string, DateTime?, TimeSpan?, string?, string?, bool?, bool?, string?) {#Sisk_Core_Helpers_CookieHelper_BuildCookieHeaderValue_System_String_System_String_System_Nullable_System_DateTime__System_Nullable_System_TimeSpan__System_String_System_String_System_Nullable_System_Boolean__System_Nullable_System_Boolean__System_String_}

Builds the cookie header value and returns an string from it.

```csharp
public static string BuildCookieHeaderValue(string name, string value, DateTime? expires = null, TimeSpan? maxAge = null, string? domain = null, string? path = null, bool? secure = null, bool? httpOnly = null, string? sameSite = null)
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

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)
