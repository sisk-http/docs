# Antworten

Antworten stellen Objekte dar, die HTTP-Antworten auf HTTP-Anfragen sind. Sie werden vom Server an den Client gesendet, um die Anfrage für eine Ressource, Seite, Dokument, Datei oder ein anderes Objekt zu bestätigen.

Eine HTTP-Antwort besteht aus Status, Headern und Inhalt.

In diesem Dokument werden wir Ihnen zeigen, wie Sie HTTP-Antworten mit Sisk architektieren.

## Festlegen eines HTTP-Status

Die Liste der HTTP-Status ist seit HTTP/1.0 dieselbe, und Sisk unterstützt alle davon.

```cs
HttpResponse res = new HttpResponse();
res.Status = System.Net.HttpStatusCode.Accepted; // 202
```

Oder mit Fluent-Syntax:

```cs
new HttpResponse()
    .WithStatus(200) // oder
    .WithStatus(HttpStatusCode.Ok) // oder
    .WithStatus(HttpStatusInformation.Ok);
```

Sie können die vollständige Liste der verfügbaren HttpStatusCode [hier](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httpstatuscode) einsehen. Sie können auch Ihren eigenen Statuscode verwenden, indem Sie die [HttpStatusInformation](/api/Sisk.Core.Http.HttpStatusInformation)-Struktur verwenden.

## Body und Content-Type

Sisk unterstützt native .NET-Inhaltsobjekte, um den Body in Antworten zu senden. Sie können die [StringContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.stringcontent)-Klasse verwenden, um beispielsweise eine JSON-Antwort zu senden:

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

Der Server wird immer versuchen, die `Content-Length` aus dem zuvor definierten Inhalt zu berechnen, wenn Sie sie nicht explizit in einem Header definiert haben. Wenn der Server die `Content-Length`-Header nicht implizit aus dem Antwortinhalt erhalten kann, wird die Antwort mit Chunked-Encoding gesendet.

Sie können auch die Antwort streamen, indem Sie ein [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent) senden oder die Methode [GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream) verwenden.

## Antwort-Header

Sie können Header hinzufügen, bearbeiten oder entfernen, die Sie in der Antwort senden. Das folgende Beispiel zeigt, wie Sie eine Umleitungsantwort an den Client senden.

```cs
HttpResponse res = new HttpResponse();
res.Status = HttpStatusCode.Moved;
res.Headers.Add(HttpKnownHeaderNames.Location, "/login");
```

Oder mit Fluent-Syntax:

```cs
new HttpResponse(301)
    .WithHeader("Location", "/login");
```

Wenn Sie die [Add](/api/Sisk.Core.Entity.HttpHeaderCollection.Add)-Methode von HttpHeaderCollection verwenden, fügen Sie einen Header zur Anfrage hinzu, ohne die bereits gesendeten Header zu ändern. Die [Set](/api/Sisk.Core.Entity.HttpHeaderCollection.Set)-Methode ersetzt die Header mit dem gleichen Namen durch den angegebenen Wert. Der Indexer von HttpHeaderCollection ruft intern die Set-Methode auf, um die Header zu ersetzen.

Sie können auch Headerwerte mithilfe der [GetHeaderValue](/api/Sisk.Core.Entity.HttpHeaderCollection.GetHeaderValue)-Methode abrufen. Diese Methode hilft dabei, Werte aus beiden Antwort-Headern und Inhalt-Headern (sofern Inhalt gesetzt ist) zu erhalten.

```cs
// Gibt den Wert des "Content-Type"-Headers zurück, indem beide response.Headers und response.Content.Headers überprüft werden
string? contentType = response.GetHeaderValue("Content-Type");
```

## Senden von Cookies

Sisk verfügt über Methoden, die die Definition von Cookies auf dem Client erleichtern. Cookies, die mit dieser Methode festgelegt werden, sind bereits URL-codiert und entsprechen dem RFC-6265-Standard.

```cs
HttpResponse res = new HttpResponse();
res.SetCookie("cookie-name", "cookie-value");
```

Oder mit Fluent-Syntax:

```cs
new HttpResponse(301)
    .WithCookie("cookie-name", "cookie-value", expiresAt: DateTime.Now.Add(TimeSpan.FromDays(7)));
```

Es gibt andere [umfassendere Versionen](/api/Sisk.Core.Http.CookieHelper.SetCookie) der gleichen Methode.

## Chunked-Antworten

Sie können die Übertragungskodierung auf chunked setzen, um große Antworten zu senden.

```cs
HttpResponse res = new HttpResponse();
res.SendChunked = true;
```

Wenn Sie chunked-encoding verwenden, wird der Content-Length-Header automatisch weggelassen.

## Antwort-Stream

Antwort-Streams sind eine verwaltete Möglichkeit, Antworten in einer segmentierten Weise zu senden. Es handelt sich um eine niedrigere Ebene als die Verwendung von HttpResponse-Objekten, da sie erfordern, dass Sie die Header und den Inhalt manuell senden und dann die Verbindung schließen.

Dieses Beispiel öffnet einen schreibgeschützten Stream für die Datei, kopiert den Stream in den Antwort-Ausgabestream und lädt die gesamte Datei nicht in den Speicher. Dies kann nützlich sein, um mittelgroße oder große Dateien zu servieren.

```cs
// Ruft den Antwort-Ausgabestream ab
using var fileStream = File.OpenRead("my-big-file.zip");
var responseStream = request.GetResponseStream();

// Setzt die Antwort-Kodierung auf chunked-encoding
// Außerdem sollten Sie keinen Content-Length-Header senden, wenn Sie chunked-encoding verwenden
responseStream.SendChunked = true;
responseStream.SetStatus(200);
responseStream.SetHeader(HttpKnownHeaderNames.ContentType, contentType);

// Kopiert den Dateistream in den Antwort-Ausgabestream
fileStream.CopyTo(responseStream.ResponseStream);

// Schließt den Stream
return responseStream.Close();
```

## GZip, Deflate und Brotli-Komprimierung

Sie können Antworten mit komprimiertem Inhalt in Sisk senden, indem Sie HTTP-Inhalte komprimieren. Zuerst müssen Sie Ihr [HttpContent](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.httpcontent)-Objekt in einen der folgenden Komprimierer einwickeln, um die komprimierte Antwort an den Client zu senden.

```cs
router.MapGet("/hello.html", request => {
    string myHtml = "...";
    
    return new HttpResponse () {
        Content = new GZipContent(new HtmlContent(myHtml)),
        // oder Content = new BrotliContent(new HtmlContent(myHtml)),
        // oder Content = new DeflateContent(new HtmlContent(myHtml)),
    };
});
```

Sie können diese komprimierten Inhalte auch mit Streams verwenden.

```cs
router.MapGet("/archive.zip", request => {
    
    // Verwenden Sie hier kein "using", da der HttpServer Ihren Inhalt nach dem Senden der Antwort verwirft
    var archive = File.OpenRead("/path/to/big-file.zip");
    
    return new HttpResponse () {
        Content = new GZipContent(archive)
    }
});
```

Die Content-Encoding-Header werden automatisch gesetzt, wenn Sie diese Inhalte verwenden.

## Automatische Komprimierung

Es ist möglich, HTTP-Antworten automatisch zu komprimieren, indem Sie die [EnableAutomaticResponseCompression](/api/Sisk.Core.Http.HttpServerConfiguration.EnableAutomaticResponseCompression)-Eigenschaft verwenden. Diese Eigenschaft kapselt den Antwortinhalt aus dem Router automatisch in einen komprimierbaren Inhalt, der vom Request akzeptiert wird, sofern die Antwort nicht von einem [CompressedContent](/api/Sisk.Core.Http.CompressedContent) abgeleitet ist.

Nur ein komprimierbarer Inhalt wird für eine Anfrage ausgewählt, basierend auf dem Accept-Encoding-Header, der der folgenden Reihenfolge folgt:

- [BrotliContent](/api/Sisk.Core.Http.BrotliContent) (br)
- [GZipContent](/api/Sisk.Core.Http.GZipContent) (gzip)
- [DeflateContent](/api/Sisk.Core.Http.DeflateContent) (deflate)

Wenn die Anfrage angibt, dass sie eine dieser Komprimierungsmethoden akzeptiert, wird die Antwort automatisch komprimiert.

## Hinweis auf Aufzählungsobjekte und Arrays

Implizite Antwortobjekte, die [IEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.ienumerable?view=net-8.0) implementieren, werden durch die `ToArray()`-Methode in den Speicher eingelesen, bevor sie durch einen definierten Wert-Handler konvertiert werden. Damit dies geschieht, wird das `IEnumerable`-Objekt in ein Array von Objekten konvertiert, und der Antwort-Konverter erhält immer ein `Object[]` anstelle des ursprünglichen Typs.

Betrachten Sie das folgende Szenario:

```csharp
using var host = HttpServer.CreateBuilder(12300)
    .UseRouter(r =>
    {
        r.RegisterValueHandler<IEnumerable<string>>(stringEnumerable =>
        {
            return new HttpResponse("String-Array:\n" + string.Join("\n", stringEnumerable));
        });
        r.RegisterValueHandler<IEnumerable<object>>(stringEnumerable =>
        {
            return new HttpResponse("Objekt-Array:\n" + string.Join("\n", stringEnumerable));
        });
        r.MapGet("/", request =>
        {
            return (IEnumerable<string>)["hello", "world"];
        });
    })
    .Build();
```

In dem obigen Beispiel wird der `IEnumerable<string>`-Konverter **nie aufgerufen**, da das Eingabeobjekt immer ein `Object[]` ist und nicht in ein `IEnumerable<string>` konvertierbar ist. Der Konverter darunter, der ein `IEnumerable<object>` erhält, erhält jedoch seine Eingabe, da sein Wert kompatibel ist.

Wenn Sie den tatsächlichen Typ des Objekts verarbeiten müssen, das aufgezählt wird, müssen Sie die Reflexion verwenden, um den Typ des Sammlungselements zu erhalten. Alle Aufzählungsobjekte (Listen, Arrays und Sammlungen) werden durch den HTTP-Antwort-Konverter in ein Array von Objekten konvertiert.

Werte, die [IAsyncEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.generic.iasyncenumerable-1?view=net-8.0) implementieren, werden automatisch vom Server gehandhabt, wenn die [ConvertIAsyncEnumerableIntoEnumerable](/api/Sisk.Core.Http.HttpServerConfiguration.ConvertIAsyncEnumerableIntoEnumerable)-Eigenschaft aktiviert ist, ähnlich wie bei `IEnumerable`. Eine asynchrone Aufzählung wird in einen blockierenden Enumerator konvertiert und dann in ein synchrones Array von Objekten.