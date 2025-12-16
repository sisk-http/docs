# UrlBuilder

`UrlBuilder` 类是一个用于创建和操作 URL 字符串的工具，允许您以流畅的方式构建 URL，添加或删除查询参数、段和片段。

此类位于 `Sisk.Core.Http` 命名空间中。

## 创建 UrlBuilder

您可以从字符串 URL 或 `Uri` 对象创建 `UrlBuilder`。

```csharp
var builder = new UrlBuilder("http://localhost:5000");
```

## 修改 URL

您可以通过添加或删除段、查询参数和片段来修改 URL。

```csharp
builder.AddSegment("users")
       .AddSegment("123")
       .AddQuery("active", "true")
       .SetFragment("profile");

string url = builder.ToString();
// 输出：http://localhost:5000/users/123?active=true#profile
```

## 方法

| 方法 | 描述 |
|---|---|
| `AddSegment(string segment)` | 向 URL 添加路径段。 |
| `AddQuery(string key, string value)` | 向 URL 添加查询参数。 |
| `RemoveQuery(string key)` | 从 URL 中删除查询参数。 |
| `SetFragment(string fragment)` | 设置 URL 片段（哈希）。 |
| `SetPort(int port)` | 设置 URL 端口。 |
| `SetHost(string host)` | 设置 URL 主机。 |
| `SetScheme(string scheme)` | 设置 URL 方案（协议）。 |
| `Pop()` | 删除 URL 路径的最后一个段。 |

## 解析查询字符串

您还可以使用 `UrlBuilder` 来解析和操作现有的查询字符串。

```csharp
var builder = new UrlBuilder("http://example.com?foo=bar&baz=qux");

// 修改查询参数
builder.RemoveQuery("foo")
       .AddQuery("new", "value");

Console.WriteLine(builder.ToString());
// 输出：http://example.com/?baz=qux&new=value
```