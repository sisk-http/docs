# UrlBuilder

Класс `UrlBuilder` является утилитой для создания и манипулирования строками URL в удобном виде. Он позволяет создавать URL, добавляя или удаляя параметры запроса, сегменты и фрагменты.

Этот класс доступен в пространстве имен `Sisk.Core.Http`.

## Создание UrlBuilder

Вы можете создать `UrlBuilder` из строки URL или из объекта `Uri`.

```csharp
var builder = new UrlBuilder("http://localhost:5000");
```

## Модификация URL

Вы можете модифицировать URL, добавляя или удаляя сегменты, параметры запроса и фрагменты.

```csharp
builder.AddSegment("users")
       .AddSegment("123")
       .AddQuery("active", "true")
       .SetFragment("profile");

string url = builder.ToString();
// Output: http://localhost:5000/users/123?active=true#profile
```

## Методы

| Метод | Описание |
|---|---|
| `AddSegment(string segment)` | Добавляет сегмент пути к URL. |
| `AddQuery(string key, string value)` | Добавляет параметр запроса к URL. |
| `RemoveQuery(string key)` | Удаляет параметр запроса из URL. |
| `SetFragment(string fragment)` | Устанавливает фрагмент URL (хэш). |
| `SetPort(int port)` | Устанавливает порт URL. |
| `SetHost(string host)` | Устанавливает хост URL. |
| `SetScheme(string scheme)` | Устанавливает схему (протокол) URL. |
| `Pop()` | Удаляет последний сегмент из пути URL. |

## Парсинг строк запроса

Вы также можете использовать `UrlBuilder` для парсинга и манипулирования существующими строками запроса.

```csharp
var builder = new UrlBuilder("http://example.com?foo=bar&baz=qux");

// Модификация параметров запроса
builder.RemoveQuery("foo")
       .AddQuery("new", "value");

Console.WriteLine(builder.ToString());
// Output: http://example.com/?baz=qux&new=value
```