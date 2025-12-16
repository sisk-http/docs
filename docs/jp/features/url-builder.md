# UrlBuilder

`UrlBuilder` クラスは、URL 文字列を作成および操作するためのユーティリティです。クエリ パラメータ、セグメント、フラグメントを追加または削除して、フルエントな方法で URL を構築できます。

このクラスは、`Sisk.Core.Http` 名前空間にあります。

## UrlBuilder の作成

`UrlBuilder` は、文字列 URL または `Uri` オブジェクトから作成できます。

```csharp
var builder = new UrlBuilder("http://localhost:5000");
```

## URL の変更

セグメント、クエリ パラメータ、フラグメントを追加または削除して、URL を変更できます。

```csharp
builder.AddSegment("users")
       .AddSegment("123")
       .AddQuery("active", "true")
       .SetFragment("profile");

string url = builder.ToString();
// Output: http://localhost:5000/users/123?active=true#profile
```

## メソッド

| メソッド | 説明 |
|---|---|
| `AddSegment(string segment)` | URL にパス セグメントを追加します。 |
| `AddQuery(string key, string value)` | URL にクエリ パラメータを追加します。 |
| `RemoveQuery(string key)` | URL からクエリ パラメータを削除します。 |
| `SetFragment(string fragment)` | URL フラグメント (ハッシュ) を設定します。 |
| `SetPort(int port)` | URL のポートを設定します。 |
| `SetHost(string host)` | URL のホストを設定します。 |
| `SetScheme(string scheme)` | URL のスキーム (プロトコル) を設定します。 |
| `Pop()` | URL パスから最後のセグメントを削除します。 |

## クエリ文字列の解析

`UrlBuilder` を使用して、既存のクエリ文字列を解析および操作することもできます。

```csharp
var builder = new UrlBuilder("http://example.com?foo=bar&baz=qux");

// クエリ パラメータを変更
builder.RemoveQuery("foo")
       .AddQuery("new", "value");

Console.WriteLine(builder.ToString());
// Output: http://example.com/?baz=qux&new=value
```