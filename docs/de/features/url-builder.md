# UrlBuilder

Die `UrlBuilder`-Klasse ist ein Hilfsmittel zum Erstellen und Manipulieren von URL-Strings in einer flüssigen Weise. Sie ermöglicht es Ihnen, URLs durch Hinzufügen oder Entfernen von Abfrageparametern, Segmenten und Fragmenten zu erstellen.

Diese Klasse ist im `Sisk.Core.Http`-Namespace verfügbar.

## Erstellen eines UrlBuilder

Sie können einen `UrlBuilder` aus einer Zeichenfolge-URL oder aus einem `Uri`-Objekt erstellen.

```csharp
var builder = new UrlBuilder("http://localhost:5000");
```

## Ändern der URL

Sie können die URL ändern, indem Sie Segmente, Abfrageparameter und Fragmente hinzufügen oder entfernen.

```csharp
builder.AddSegment("benutzer")
       .AddSegment("123")
       .AddQuery("aktiv", "true")
       .SetFragment("profil");

string url = builder.ToString();
// Ausgabe: http://localhost:5000/benutzer/123?aktiv=true#profil
```

## Methoden

| Methode | Beschreibung |
|---|---|
| `AddSegment(string segment)` | Fügt ein Pfadsegment zur URL hinzu. |
| `AddQuery(string key, string value)` | Fügt einen Abfrageparameter zur URL hinzu. |
| `RemoveQuery(string key)` | Entfernt einen Abfrageparameter aus der URL. |
| `SetFragment(string fragment)` | Legt das URL-Fragment (Hash) fest. |
| `SetPort(int port)` | Legt den Port der URL fest. |
| `SetHost(string host)` | Legt den Host der URL fest. |
| `SetScheme(string scheme)` | Legt das Schema (Protokoll) der URL fest. |
| `Pop()` | Entfernt das letzte Segment aus dem URL-Pfad. |

## Parsen von Abfragezeichenfolgen

Sie können auch `UrlBuilder` verwenden, um vorhandene Abfragezeichenfolgen zu parsen und zu manipulieren.

```csharp
var builder = new UrlBuilder("http://example.com?foo=bar&baz=qux");

// Abfrageparameter ändern
builder.RemoveQuery("foo")
       .AddQuery("neu", "wert");

Console.WriteLine(builder.ToString());
// Ausgabe: http://example.com/?baz=qux&neu=wert
```