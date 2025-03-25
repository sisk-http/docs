# Antworten

Antworten stellen Objekte dar, die HTTP-Antworten auf HTTP-Anfragen sind. Sie werden vom Server an den Client gesendet, um die Anfrage für eine Ressource, Seite, Dokument, Datei oder ein anderes Objekt zu bestätigen.

Eine HTTP-Antwort besteht aus Status, Headern und Inhalt.

In diesem Dokument werden wir Ihnen zeigen, wie Sie HTTP-Antworten mit Sisk erstellen können.

## Festlegung eines HTTP-Status

Die Liste der HTTP-Status ist seit HTTP/1.0 gleich geblieben, und Sisk unterstützt alle davon.

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

## Inhalt und Content-Type

Sisk unterstützt native .NET-Inhaltsobjekte, um den Inhalt von Antworten zu senden. Sie können die [StringContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.stringcontent)-Klasse verwenden, um beispielsweise eine JSON-Antwort zu senden:

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

Der Server versucht immer, die `Content-Length` aus dem von Ihnen definierten Inhalt zu berechnen, wenn Sie sie nicht explizit in einem Header definiert haben. Wenn der Server die `Content-Length`-Header nicht implizit aus dem Antwortinhalt erhalten kann, wird die Antwort mit Chunked-Encoding gesendet.

Sie können auch die Antwort streamen, indem Sie einen [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent) senden oder die Methode [GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream) verwenden.

## Antwort-Header

Sie können Header hinzufügen, bearbeiten oder entfernen, die Sie in der Antwort senden. Das folgende Beispiel zeigt, wie Sie eine Umleitungsantwort an den Client senden können.

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

## Senden von Cookies

Sisk hat Methoden, die die Definition von Cookies auf dem Client erleichtern. Cookies, die mit dieser Methode gesetzt werden, sind bereits URL-codiert und entsprechen dem RFC-6265-Standard.

```cs
HttpResponse res = new HttpResponse();
res.SetCookie("cookie-name", "cookie-value");
```

Oder mit Fluent-Syntax:

```cs
new HttpResponse(301)
    .WithCookie("cookie-name", "cookie-value", expiresAt: DateTime.Now.Add(TimeSpan.FromDays(7)));
```

Es gibt auch [umfassendere Versionen](/api/Sisk.Core.Http.CookieHelper.SetCookie) der gleichen Methode.

## Chunked-Antworten

Sie können die Übertragungskodierung auf chunked setzen, um große Antworten zu senden.

```cs
HttpResponse res = new HttpResponse();
res.SendChunked = true;
```

Wenn Sie chunked-encoding verwenden, wird der Content-Length-Header automatisch weggelassen.

## Antwort-Stream

Antwort-Streams sind eine verwaltete Möglichkeit, Antworten in einer segmentierten Weise zu senden. Es handelt sich um eine niedrigere Ebene als die Verwendung von HttpResponse-Objekten, da sie erfordern, dass Sie die Header und den Inhalt manuell senden und dann die Verbindung schließen.

Dieses Beispiel öffnet einen schreibgeschützten Stream für die Datei, kopiert den Stream in den Antwort-Ausgabestream und lädt die gesamte Datei nicht in den Speicher. Dies kann nützlich sein, um mittelgroße oder große Dateien zu serven.

```cs
// erhält den Antwort-Ausgabestream
using var fileStream = File.OpenRead("my-big-file.zip");
var responseStream = request.GetResponseStream();

// setzt die Antwort-Kodierung auf chunked-encoding
// außerdem sollten Sie keinen Content-Length-Header senden, wenn Sie chunked-encoding verwenden
responseStream.SendChunked = true;
responseStream.SetStatus(200);
responseStream.SetHeader(HttpKnownHeaderNames.ContentType, contentType);

// kopiert den Dateistream in den Antwort-Ausgabestream
fileStream.CopyTo(responseStream.ResponseStream);

// schließt den Stream
return responseStream.Close();
```

## GZip, Deflate und Brotli-Komprimierung

Sie können Antworten mit komprimiertem Inhalt in Sisk senden, indem Sie HTTP-Inhalte komprimieren. Zuerst kapseln Sie Ihr [HttpContent](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.httpcontent)-Objekt in einen der folgenden Kompressoren, um die komprimierte Antwort an den Client zu senden.

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

Sie können auch diese komprimierten Inhalte mit Streams verwenden.

```cs
router.MapGet("/archive.zip", request => {
    
    // verwenden Sie hier kein "using". Der HttpServer wird Ihren Inhalt nach dem Senden der Antwort verwerten
    var archive = File.OpenRead("/path/to/big-file.zip");
    
    return new HttpResponse () {
        Content = new GZipContent(archive)
    }
});
```

Die Content-Encoding-Header werden automatisch gesetzt, wenn Sie diese Inhalte verwenden.

## Implizite Antworttypen

Seit Version 0.15 können Sie andere Rückgabetypen als HttpResponse verwenden, aber es ist notwendig, den Router so zu konfigurieren, dass er mit jedem Typ von Objekt umgehen kann.

Das Konzept besteht darin, immer einen Referenztyp zurückzugeben und ihn in ein gültiges HttpResponse-Objekt umzuwandeln. Routen, die HttpResponse zurückgeben, unterliegen keiner Umwandlung.

Werttypen (Strukturen) können nicht als Rückgabetyp verwendet werden, da sie nicht mit dem [RouterCallback](/api/Sisk.Core.Routing.RouterCallback) kompatibel sind, daher müssen sie in ein ValueResult eingewickelt werden, um in Handlern verwendet werden zu können.

Betrachten Sie das folgende Beispiel aus einem Router-Modul, das nicht HttpResponse als Rückgabetyp verwendet:

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
        User fromBody = JsonSerializer.Deserialize<User>(request.Body)!;
        Users.Add(fromBody);
        
        return true;
    }
}
```

Daher ist es notwendig, im Router zu definieren, wie er mit jedem Typ von Objekt umgehen soll. Objekte sind immer das erste Argument des Handlers, und der Ausgabetyp muss ein gültiges HttpResponse-Objekt sein. Außerdem sollten die Ausgabeobjekte einer Route niemals null sein.

Für ValueResult-Typen ist es nicht notwendig, anzugeben, dass das Eingabeobjekt ein ValueResult ist, und nur T, da ValueResult ein Objekt ist, das von seinem ursprünglichen Komponenten reflektiert wird.

Die Assoziation von Typen vergleicht nicht, was registriert wurde, mit dem Typ des Objekts, das von der Router-Rückrufmethode zurückgegeben wird. Stattdessen wird überprüft, ob der Typ des Router-Ergebnisses dem registrierten Typ zugeordnet werden kann.

Das Registrieren eines Handlers des Typs Object wird auf alle vorher nicht validierten Typen zurückgreifen. Die Reihenfolge, in der die Wert-Handler eingefügt werden, ist auch wichtig, sodass das Registrieren eines Object-Handlers alle anderen typspezifischen Handler ignoriert. Registrieren Sie immer zuerst spezifische Wert-Handler, um die Reihenfolge sicherzustellen.

```cs
Router r = new Router();
r.SetObject(new UsersController());

r.RegisterValueHandler<bool>(bolVal =>
{
    HttpResponse res = new HttpResponse();
    res.Status = (bool)bolVal ? HttpStatusCode.OK : HttpStatusCode.BadRequest;
    return res;
});

r.RegisterValueHandler<IEnumerable>(enumerableValue =>
{
    return new HttpResponse();
    // tun Sie etwas mit enumerableValue hier
});

// das Registrieren eines Wert-Handlers des Typs Object muss der letzte
// Wert-Handler sein, der als Fallback verwendet wird
r.RegisterValueHandler<object>(fallback =>
{
    HttpResponse res = new HttpResponse();
    res.Status = HttpStatusCode.OK;
    res.Content = JsonContent.Create(fallback);
    return res;
});
```