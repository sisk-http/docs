# Antworten

Antworten repräsentieren Objekte, die HTTP‑Antworten auf HTTP‑Anfragen sind. Sie werden vom Server an den Client gesendet, um auf die Anforderung einer Ressource, Seite, Dokuments, Datei oder eines anderen Objekts zu reagieren.

Eine HTTP‑Antwort besteht aus Status, Headern und Inhalt.

In diesem Dokument zeigen wir Ihnen, wie Sie HTTP‑Antworten mit Sisk entwerfen.

## Festlegen eines HTTP‑Status

Die HTTP‑Statusliste ist seit HTTP/1.0 unverändert, und Sisk unterstützt alle davon.

```cs
HttpResponse res = new HttpResponse();
res.Status = System.Net.HttpStatusCode.Accepted; // 202
```

Oder mit Fluent‑Syntax:

```cs
new HttpResponse()
    .WithStatus(200) // oder
    .WithStatus(HttpStatusCode.Ok) // oder
    .WithStatus(HttpStatusInformation.Ok);
```

Sie können die vollständige Liste der verfügbaren `HttpStatusCode` [hier](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httpstatuscode) einsehen. Sie können auch Ihren eigenen Statuscode bereitstellen, indem Sie die Struktur [HttpStatusInformation](/api/Sisk.Core.Http.HttpStatusInformation) verwenden.

## Body und Content‑Type

Sisk unterstützt native .NET‑Inhaltsobjekte, um den Body in Antworten zu senden. Sie können die Klasse [StringContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.stringcontent) verwenden, um beispielsweise eine JSON‑Antwort zu senden:

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

Der Server versucht stets, den `Content-Length` aus dem von Ihnen definierten Inhalt zu berechnen, sofern Sie ihn nicht explizit in einem Header festgelegt haben. Kann der Server den `Content-Length`‑Header nicht implizit aus dem Antwortinhalt ableiten, wird die Antwort mit Chunked‑Encoding gesendet.

Sie können die Antwort auch streamen, indem Sie ein [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent) senden oder die Methode [GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream) verwenden.

## Antwort‑Header

Sie können Header, die Sie in der Antwort senden, hinzufügen, bearbeiten oder entfernen. Das folgende Beispiel zeigt, wie Sie eine Weiterleitungsantwort an den Client senden.

```cs
HttpResponse res = new HttpResponse();
res.Status = HttpStatusCode.Moved;
res.Headers.Add(HttpKnownHeaderNames.Location, "/login");
```

Oder mit Fluent‑Syntax:

```cs
new HttpResponse(301)
    .WithHeader("Location", "/login");
```

Wenn Sie die Methode [Add](/api/Sisk.Core.Entity.HttpHeaderCollection.Add) von `HttpHeaderCollection` verwenden, fügen Sie einen Header zur Anfrage hinzu, ohne die bereits gesendeten zu verändern. Die Methode [Set](/api/Sisk.Core.Entity.HttpHeaderCollection.Set) ersetzt Header mit demselben Namen durch den angegebenen Wert. Der Indexer von `HttpHeaderCollection` ruft intern die `Set`‑Methode auf, um die Header zu ersetzen.

Sie können Header‑Werte auch über die Methode [GetHeaderValue](/api/Sisk.Core.Entity.HttpHeaderCollection.GetHeaderValue) abrufen. Diese Methode hilft beim Erhalten von Werten sowohl aus den Antwort‑Headern als auch aus den Inhalts‑Headern (falls ein Inhalt gesetzt ist).

```cs
// Gibt den Wert des "Content-Type"-Headers zurück und prüft sowohl response.Headers als auch response.Content.Headers
string? contentType = response.GetHeaderValue("Content-Type");
```

## Cookies senden

Sisk bietet Methoden, die das Definieren von Cookies im Client erleichtern. Cookies, die mit dieser Methode gesetzt werden, sind bereits URL‑kodiert und entsprechen dem RFC‑6265‑Standard.

```cs
HttpResponse res = new HttpResponse();
res.SetCookie("cookie-name", "cookie-value");
```

Oder mit Fluent‑Syntax:

```cs
new HttpResponse(301)
    .WithCookie("cookie-name", "cookie-value", expiresAt: DateTime.Now.Add(TimeSpan.FromDays(7)));
```

Es gibt weitere [ausführlichere Versionen](/api/Sisk.Core.Helpers.CookieHelper.SetCookie) derselben Methode.

## Chunked‑Antworten

Sie können die Transfer‑Codierung auf Chunked setzen, um große Antworten zu senden.

```cs
HttpResponse res = new HttpResponse();
res.SendChunked = true;
```

Bei Verwendung von Chunked‑Encoding wird der `Content-Length`‑Header automatisch weggelassen.

## Antwort‑Stream

Antwort‑Streams sind ein verwalteter Weg, um Antworten segmentiert zu senden. Sie stellen eine niedrigere Ebene dar als die Verwendung von `HttpResponse`‑Objekten, da Sie Header und Inhalt manuell senden und anschließend die Verbindung schließen müssen.

Dieses Beispiel öffnet einen schreibgeschützten Stream für die Datei, kopiert den Stream in den Antwort‑Ausgabestream und lädt die gesamte Datei nicht in den Speicher. Das kann beim Bereitstellen mittelgroßer oder großer Dateien nützlich sein.

```cs
// erhält den Antwort‑Ausgabestream
using var fileStream = File.OpenRead("my-big-file.zip");
var responseStream = request.GetResponseStream();

// setzt die Antwort‑Codierung auf Chunked‑Encoding
// außerdem sollten Sie keinen Content‑Length‑Header senden, wenn Sie
// Chunked‑Encoding verwenden
responseStream.SendChunked = true;
responseStream.SetStatus(200);
responseStream.SetHeader(HttpKnownHeaderNames.ContentType, contentType);

// kopiert den Dateistream in den Antwort‑Ausgabestream
fileStream.CopyTo(responseStream.ResponseStream);

// schließt den Stream
return responseStream.Close();
```

## GZip-, Deflate- und Brotli‑Kompression

Sie können in Sisk Antworten mit komprimiertem Inhalt senden, indem Sie HTTP‑Inhalte komprimieren. Kapseln Sie zunächst Ihr [HttpContent](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.httpcontent)‑Objekt in einen der nachfolgenden Kompressor, um die komprimierte Antwort an den Client zu senden.

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
    
    // kein "using" hier verwenden. Der HttpServer verwirft Ihren Inhalt
    // nach dem Senden der Antwort.
    var archive = File.OpenRead("/path/to/big-file.zip");
    
    return new HttpResponse () {
        Content = new GZipContent(archive)
    }
});
```

Die `Content-Encoding`‑Header werden automatisch gesetzt, wenn diese Inhalte verwendet werden.

## Automatische Kompression

Es ist möglich, HTTP‑Antworten automatisch zu komprimieren, indem die Eigenschaft [EnableAutomaticResponseCompression](/api/Sisk.Core.Http.HttpServerConfiguration.EnableAutomaticResponseCompression) aktiviert wird. Diese Eigenschaft kapselt den Antwortinhalt des Routers automatisch in einen komprimierbaren Inhalt, der vom Request akzeptiert wird, sofern die Antwort nicht von einem [CompressedContent](/api/Sisk.Core.Http.CompressedContent) erbt.

Für eine Anfrage wird nur ein komprimierbarer Inhalt ausgewählt, basierend auf dem `Accept-Encoding`‑Header, der in folgender Reihenfolge geprüft wird:

- [BrotliContent](/api/Sisk.Core.Http.BrotliContent) (br)
- [GZipContent](/api/Sisk.Core.Http.GZipContent) (gzip)
- [DeflateContent](/api/Sisk.Core.Http.DeflateContent) (deflate)

Wenn die Anfrage angibt, dass sie eines dieser Kompressionsverfahren akzeptiert, wird die Antwort automatisch komprimiert.

## Implizite Antworttypen

Sie können andere Rückgabetypen als `HttpResponse` verwenden, müssen jedoch den Router konfigurieren, wie er mit jedem Objekttyp umgehen soll.

Das Konzept besteht darin, immer einen Referenztyp zurückzugeben und ihn in ein gültiges `HttpResponse`‑Objekt zu verwandeln. Routen, die `HttpResponse` zurückgeben, durchlaufen keine Konvertierung.

Werttypen (Strukturen) können nicht als Rückgabetyp verwendet werden, weil sie nicht mit dem [RouterCallback](/api/Sisk.Core.Routing.RouterCallback) kompatibel sind; sie müssen in ein `ValueResult` gewrappt werden, um in Handlern verwendet zu werden.

Betrachten Sie das folgende Beispiel eines Router‑Moduls, das `HttpResponse` nicht als Rückgabetyp nutzt:

```cs
[RoutePrefix("/users")]
public class UsersController : RouterModule
{
    public List<User> Users = new List<User>();

    [RouteGet]
    public IEnumerable<User> Index(HttpRequest request)
    {
        return Users.ToArray();
    }

    [RouteGet("<id>")]
    public User View(HttpRequest request)
    {
        int id = request.RouteParameters["id"].GetInteger();
        User dUser = Users.First(u => u.Id == id);

        return dUser;
    }

    [RoutePost]
    public ValueResult<bool> Create(HttpRequest request)
    {
        User fromBody = request.GetJsonContent<User>()!;
        Users.Add(fromBody);
        
        return true;
    }
}
```

Damit muss nun im Router definiert werden, wie mit jedem Objekttyp verfahren wird. Objekte sind stets das erste Argument des Handlers und der Ausgabetyp muss ein gültiges `HttpResponse` sein. Außerdem sollten die Ausgabebestandteile einer Route niemals `null` sein.

Für `ValueResult`‑Typen ist es nicht nötig, anzugeben, dass das Eingabeobjekt ein `ValueResult` ist – nur `T`, da `ValueResult` ein Objekt ist, das von seiner ursprünglichen Komponente reflektiert wird.

Die Zuordnung der Typen vergleicht nicht, was registriert wurde, mit dem Typ des vom Router‑Callback zurückgegebenen Objekts. Stattdessen wird geprüft, ob der Typ des Router‑Ergebnisses dem registrierten Typ zuweisbar ist.

Die Registrierung eines Handlers vom Typ `Object` fällt auf alle zuvor nicht validierten Typen zurück. Die Einfügereihenfolge der Wert‑Handler ist ebenfalls wichtig: Ein `Object`‑Handler ignoriert alle anderen typ‑spezifischen Handler. Registrieren Sie daher spezifische Wert‑Handler zuerst, um die Reihenfolge zu sichern.

```cs
Router r = new Router();
r.MapInstance(new UsersController());

r.RegisterValueHandler<ApiResult>(apiResult =>
{
    return new HttpResponse() {
        Status = apiResult.Success ? HttpStatusCode.OK : HttpStatusCode.BadRequest,
        Content = apiResult.GetHttpContent(),
        Headers = apiResult.GetHeaders()
    };
});
r.RegisterValueHandler<bool>(bvalue =>
{
    return new HttpResponse() {
        Status = bvalue ? HttpStatusCode.OK : HttpStatusCode.BadRequest
    };
});
r.RegisterValueHandler<IEnumerable<object>>(enumerableValue =>
{
    return new HttpResponse(string.Join("\n", enumerableValue));
});

// Die Registrierung eines Wert‑Handlers vom Typ object muss der letzte
// Wert‑Handler sein, der als Fallback verwendet wird
r.RegisterValueHandler<object>(fallback =>
{
    return new HttpResponse() {
        Status = HttpStatusCode.OK,
        Content = JsonContent.Create(fallback)
    };
});
```

## Verzögerte Aktionen

Wenn eine Anfrage den Router erreicht, durchläuft sie zuerst die [Request‑Handler](/docs/de/fundamentals/request-handlers), wird in der Router‑Aktion verarbeitet und anschließend von den Post‑Execution‑Request‑Handlern. Das Ergebnis der Router‑Aktion wird an die Wert‑Handler übergeben, und das Ergebnis des Wert‑Handlers wird dem Client als Antwort gesendet.

Dieser Lebenszyklus findet innerhalb eines asynchronen Kontextes statt. Dieser asynchrone Kontext stellt Variablen bereit, die der Benutzer in den [HttpContext‑Bag](/api/Sisk.Core.Http.HttpContext) einfügen kann, um Daten zwischen Handlern und der Router‑Aktion zu teilen. Der von der Router‑Aktion zurückgegebene Wert wird diesem asynchronen Kontext hinzugefügt und kann von den Wert‑Handlern abgerufen werden.

Verzögerte Aktionen sind Aktionen, die immer am Ende des Zyklus ausgeführt werden, nachdem die Antwort an den Client gesendet wurde, jedoch noch innerhalb desselben asynchronen Kontextes. Diese Aktionen können verwendet werden, um langlaufende Aufgaben auszuführen, die nicht abgeschlossen sein müssen, um eine Antwort an den Client zu senden, z. B. das Speichern von Logs, das Aktualisieren der Datenbank, das Versenden von E‑Mails usw.

Ausnahmen werden weiterhin in verzögerten Aktionen abgefangen und wie jede andere Ausnahme im Anforderungs‑Lebenszyklus behandelt. Der Unterschied besteht darin, dass der Client bereits eine Antwort erhalten hat, sodass die Ausnahme von der Standard‑Fehlerbehandlung verarbeitet wird.

Verzögern Sie die Ausführung einer Aktion mit der Methode [HttpContext.EnqueueDeferredAction](/api/Sisk.Core.Http.HttpContext.EnqueueDeferredAction). Die Methode erhält eine asynchrone Funktion, die die auszuführende Aktion repräsentiert, sowie ein optionales Timeout, um die Ausführungszeit der Aktion zu begrenzen. Wird die Aktion nicht innerhalb des Zeitlimits abgeschlossen, wird sie abgebrochen.

```csharp
[RoutePost("/send-mail")]
public HttpResponse SendMail(HttpRequest request)
{
    string to = request.Query["to"].GetString();
    string subject = request.Query["subject"].GetString();
    string body = request.Query["body"].GetString();
    if (string.IsNullOrWhiteSpace(to) || string.IsNullOrWhiteSpace(subject) || string.IsNullOrWhiteSpace(body))
    {
        throw new ApiException("Missing required parameters.");
    }

    // plant eine langlaufende Aktion, die nach dem Senden der Antwort an den Client
    // aber noch innerhalb desselben asynchronen Kontextes der Anfrage ausgeführt wird
    request.Context.EnqueueDeferredAction(async (ct) =>
    {
        await EmailService.SendEmailAsync(to, subject, body);
    }, timeout: TimeSpan.FromSeconds(30));

    return new HttpResponse()
    {
        Status = 200,
        Content = new StringContent("Sending the email...")
    };
}
```

## Hinweis zu aufzählbaren Objekten und Arrays

Implizite Antwortobjekte, die [IEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.ienumerable?view=net-8.0) implementieren, werden über die Methode `ToArray()` in den Speicher geladen, bevor sie durch einen definierten Wert‑Handler konvertiert werden. Dafür wird das `IEnumerable`‑Objekt in ein Objekt‑Array umgewandelt, und der Antwort‑Konverter erhält stets ein `Object[]` statt des ursprünglichen Typs.

Betrachten Sie das folgende Szenario:

```csharp
using var host = HttpServer.CreateBuilder(12300)
    .UseRouter(r =>
    {
        r.RegisterValueHandler<IEnumerable<string>>(stringEnumerable =>
        {
            return new HttpResponse("String array:\n" + string.Join("\n", stringEnumerable));
        });
        r.RegisterValueHandler<IEnumerable<object>>(stringEnumerable =>
        {
            return new HttpResponse("Object array:\n" + string.Join("\n", stringEnumerable));
        });
        r.MapGet("/", request =>
        {
            return (IEnumerable<string>)["hello", "world"];
        });
    })
    .Build();
```

Im obigen Beispiel wird der `IEnumerable<string>`‑Konverter **nie aufgerufen**, weil das Eingabeobjekt immer ein `Object[]` ist und nicht in ein `IEnumerable<string>` konvertierbar ist. Der untenstehende Konverter, der ein `IEnumerable<object>` erhält, wird jedoch aufgerufen, da sein Wert kompatibel ist.

Wenn Sie tatsächlich den Typ des zu enumerierenden Objekts behandeln müssen, benötigen Sie Reflection, um den Typ des Sammlungselements zu ermitteln. Alle aufzählbaren Objekte (Listen, Arrays und Collections) werden vom HTTP‑Antwort‑Konverter in ein Objekt‑Array umgewandelt.

Werte, die [IAsyncEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.generic.iasyncenumerable-1?view=net-8.0) implementieren, werden vom Server automatisch verarbeitet, wenn die Eigenschaft [ConvertIAsyncEnumerableIntoEnumerable](/api/Sisk.Core.Http.HttpServerConfiguration.ConvertIAsyncEnumerableIntoEnumerable) aktiviert ist – analog zu dem, was bei `IEnumerable` geschieht. Diese Option ist standardmäßig in `HttpServerConfiguration` aktiviert; eine asynchrone Enumeration wird in einen blockierenden Enumerator umgewandelt und anschließend in ein synchrones Objekt‑Array. Deaktivieren Sie sie nur, wenn Sie Ihren eigenen Wert‑Handler oder eine Streaming‑Antwort‑Strategie für asynchrone Sequenzen bereitstellen.