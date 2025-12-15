# UrlBuilder

The `UrlBuilder` class is a utility for creating and manipulating URL strings in a fluent way. It allows you to build URLs by adding or removing query parameters, segments, and fragments.

This class is available in the `Sisk.Core.Http` namespace.

## Creating a UrlBuilder

You can create a `UrlBuilder` from a string URL or from a `Uri` object.

```csharp
var builder = new UrlBuilder("http://localhost:5000");
```

## Modifying the URL

You can modify the URL by adding or removing segments, query parameters, and fragments.

```csharp
builder.AddSegment("users")
       .AddSegment("123")
       .AddQuery("active", "true")
       .SetFragment("profile");

string url = builder.ToString();
// Output: http://localhost:5000/users/123?active=true#profile
```

## Methods

| Method | Description |
|---|---|
| `AddSegment(string segment)` | Adds a path segment to the URL. |
| `AddQuery(string key, string value)` | Adds a query parameter to the URL. |
| `RemoveQuery(string key)` | Removes a query parameter from the URL. |
| `SetFragment(string fragment)` | Sets the URL fragment (hash). |
| `SetPort(int port)` | Sets the port of the URL. |
| `SetHost(string host)` | Sets the host of the URL. |
| `SetScheme(string scheme)` | Sets the scheme (protocol) of the URL. |
| `Pop()` | Removes the last segment from the URL path. |

## Parsing Query Strings

You can also use `UrlBuilder` to parse and manipulate existing query strings.

```csharp
var builder = new UrlBuilder("http://example.com?foo=bar&baz=qux");

// Modify query parameters
builder.RemoveQuery("foo")
       .AddQuery("new", "value");

Console.WriteLine(builder.ToString());
// Output: http://example.com/?baz=qux&new=value
```
