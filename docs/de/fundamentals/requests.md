# Anfragen

Anfragen sind Strukturen, die eine HTTP-Anfrage-Nachricht darstellen. Das [HttpRequest](/api/Sisk.Core.Http.HttpRequest)-Objekt enthält nützliche Funktionen für die Verarbeitung von HTTP-Nachrichten in Ihrer gesamten Anwendung.

Eine HTTP-Anfrage besteht aus der Methode, dem Pfad, der Version, den Headern und dem Body.

In diesem Dokument werden wir Ihnen zeigen, wie Sie jedes dieser Elemente abrufen.

## Abrufen der Anfragemethode

Um die Methode der erhaltenen Anfrage zu erhalten, können Sie die Methode-Eigenschaft verwenden:

```cs
static HttpResponse Index(HttpRequest request)
{
    HttpMethod requestMethod = request.Method;
    ...
}
```

Diese Eigenschaft gibt die Anfragemethode als [HttpMethod](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.httpmethod)-Objekt zurück.

> [!NOTE]
> Im Gegensatz zu Routenmethoden unterstützt diese Eigenschaft nicht das [RouteMethod.Any](/api/Sisk.Core.Routing.RouteMethod)-Element. Stattdessen gibt sie die tatsächliche Anfragemethode zurück.

## Abrufen von URL-Komponenten

Sie können verschiedene Komponenten aus einer URL über bestimmte Eigenschaften einer Anfrage abrufen. Betrachten wir beispielsweise die folgende URL:

``` 
http://localhost:5000/user/login?email=foo@bar.com
```

| Komponentenname | Beschreibung | Komponentenwert |
| --- | --- | --- |
| [Path](/api/Sisk.Core.Http.HttpRequest.Path) | Ruft den Anfragepfad ab. | `/user/login` |
| [FullPath](/api/Sisk.Core.Http.HttpRequest.FullPath) | Ruft den Anfragepfad und die Abfragezeichenfolge ab. | `/user/login?email=foo@bar.com` |
| [FullUrl](/api/Sisk.Core.Http.HttpRequest.FullUrl) | Ruft die gesamte URL-Anfragezeichenfolge ab. | `http://localhost:5000/user/login?email=foo@bar.com` |
| [Host](/api/Sisk.Core.Http.HttpRequest.Host) | Ruft den Anfragehost ab. | `localhost` |
| [Authority](/api/Sisk.Core.Http.HttpRequest.Authority) | Ruft den Anfragehost und den Port ab. | `localhost:5000` |
| [QueryString](/api/Sisk.Core.Http.HttpRequest.QueryString) | Ruft die Anfrageabfrage ab. | `?email=foo@bar.com` |
| [Query](/api/Sisk.Core.Http.HttpRequest.Query) | Ruft die Anfrageabfrage als benannte Wertesammlung ab. | `{StringValueCollection-Objekt}` |
| [IsSecure](/api/Sisk.Core.Http.HttpRequest.IsSecure) | Bestimmt, ob die Anfrage SSL verwendet (true) oder nicht (false). | `false` |

Sie können auch die [HttpRequest.Uri](/api/Sisk.Core.Http.HttpRequest.Uri)-Eigenschaft verwenden, die alle oben genannten Elemente in einem Objekt enthält.

## Abrufen des Anfragebodies

Einige Anfragen enthalten einen Body, wie z. B. Formulare, Dateien oder API-Transaktionen. Sie können den Body einer Anfrage aus der folgenden Eigenschaft abrufen:

```cs
// Ruft den Anfragebody als Zeichenfolge ab, wobei die Anfragecodierung als Codierer verwendet wird
string body = request.Body;

// Oder ruft ihn als Byte-Array ab
byte[] bodyBytes = request.RawBody;

// Oder Sie können ihn streamen.
Stream requestStream = request.GetRequestStream();
```

Es ist auch möglich, zu bestimmen, ob es einen Body in der Anfrage gibt und ob er geladen ist, mit den Eigenschaften [HasContents](/api/Sisk.Core.Http.HttpRequest.HasContents), die bestimmt, ob die Anfrage Inhalte enthält, und [IsContentAvailable](/api/Sisk.Core.Http.HttpRequest.IsContentAvailable), die angibt, dass der HTTP-Server den Inhalt vollständig vom Remote-Punkt empfangen hat.

Es ist nicht möglich, den Anfrageinhalt über `GetRequestStream` mehr als einmal zu lesen. Wenn Sie mit dieser Methode lesen, sind die Werte in `RawBody` und `Body` nicht mehr verfügbar. Es ist nicht notwendig, den Anfragestream im Kontext der Anfrage zu entsorgen, da er am Ende der HTTP-Sitzung, in der er erstellt wird, entsorgt wird. Sie können auch die [HttpRequest.RequestEncoding](/api/Sisk.Core.Http.HttpRequest.RequestEncoding)-Eigenschaft verwenden, um die beste Codierung zu erhalten, um die Anfrage manuell zu decodieren.

Der Server hat Einschränkungen für das Lesen des Anfrageinhalts, die sowohl für [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body) als auch für [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.Body) gelten. Diese Eigenschaften kopieren den gesamten Eingabestream in einen lokalen Puffer der gleichen Größe wie [HttpRequest.ContentLength](/api/Sisk.Core.Http.HttpRequest.ContentLength).

Eine Antwort mit dem Status 413 Inhalt zu groß wird an den Client zurückgegeben, wenn der gesendete Inhalt größer ist als [HttpServerConfiguration.MaximumContentLength](/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength), wie in der Benutzerkonfiguration definiert. Zusätzlich wird, wenn es keine konfigurierte Einschränkung gibt oder wenn sie zu groß ist, der Server eine [OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception?view=net-8.0) auslösen, wenn der vom Client gesendete Inhalt [Int32.MaxValue](https://learn.microsoft.com/en-us/dotnet/api/system.int32.maxvalue) (2 GB) überschreitet und wenn der Inhalt über eine der oben genannten Eigenschaften abgerufen wird. Sie können den Inhalt immer noch über das Streamen abrufen.

> [!NOTE]
> Obwohl Sisk dies zulässt, ist es immer eine gute Idee, HTTP-Semantik zu befolgen, um Ihre Anwendung zu erstellen und nicht Inhalte in Methoden abzurufen oder zu liefern, die dies nicht zulassen. Lesen Sie über [RFC 9110 "HTTP-Semantik"](https://httpwg.org/spec/rfc9110.html).

## Abrufen des Anfragekontexts

Der HTTP-Kontext ist ein exklusives Sisk-Objekt, das Informationen über den HTTP-Server, die Route, den Router und den Anfragehandler speichert. Sie können es verwenden, um sich in einer Umgebung zu organisieren, in der diese Objekte schwer zu organisieren sind.

Sie können den aktuellen [HttpContext](/api/Sisk.Core.Http.HttpContext) mithilfe der statischen Methode `HttpContext.GetCurrentContext()` abrufen. Diese Methode gibt den Kontext der aktuellen Anfrage zurück, die im aktuellen Thread verarbeitet wird.

```cs
HttpContext context = HttpContext.GetCurrentContext();
```

### Protokollmodus

Die [HttpContext.LogMode](/api/Sisk.Core.Http.HttpContext.LogMode)-Eigenschaft ermöglicht es Ihnen, das Protokollverhalten für die aktuelle Anfrage zu steuern. Sie können die Protokollierung für bestimmte Anfragen aktivieren oder deaktivieren und die Standardserverkonfiguration überschreiben.

```cs
// Deaktiviert die Protokollierung für diese Anfrage
context.LogMode = LogOutputMode.None;
```

### Anfragebeutel

Das [RequestBag](/api/Sisk.Core.Http.HttpContext.RequestBag)-Objekt enthält gespeicherte Informationen, die von einem Anfragehandler an einen anderen Punkt übergeben werden und am Endziel verbraucht werden können. Dieses Objekt kann auch von Anfragehandlern verwendet werden, die nach dem Routenrückruf ausgeführt werden.

> [!TIP]
> Diese Eigenschaft ist auch über die [HttpRequest.Bag](/api/Sisk.Core.Http.HttpRequest.Bag)-Eigenschaft zugänglich.

<div class="script-header">
    <span>
        Middleware/AuthenticateUserRequestHandler.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class AuthenticateUserRequestHandler : IRequestHandler
{
    public string Identifier { get; init; } = Guid.NewGuid().ToString();
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;
    
    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization != null)
        {
            context.RequestBag.Add("AuthenticatedUser", new User("Bob"));
            return null;
        }
        else
        {
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}
```

Der obige Anfragehandler wird `AuthenticatedUser` im Anfragebeutel definieren und kann später im Endrückruf verbraucht werden:

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class MyController
{
    [RouteGet("/")]
    [RequestHandler<AuthenticateUserRequestHandler>]
    static HttpResponse Index(HttpRequest request)
    {
        User authUser = request.Context.RequestBag["AuthenticatedUser"];
        
        return new HttpResponse() {
            Content = new StringContent($"Hallo, {authUser.Name}!")
        };
    }
}
```

Sie können auch die `Bag.Set()`- und `Bag.Get()`-Hilfsmethoden verwenden, um Objekte nach ihrem Typ abzurufen oder zu setzen.

Die `TypedValueDictionary`-Klasse bietet auch `GetValue`- und `SetValue`-Methoden für eine bessere Kontrolle.

<div class="script-header">
    <span>
        Middleware/Authenticate.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class Authenticate : RequestHandler
{
    public override HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        request.Bag.Set<User>(authUser);
    }
}
```

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RouteGet("/")]
[RequestHandler<Authenticate>]
public static HttpResponse GetUser(HttpRequest request)
{
    var user = request.Bag.Get<User>();
    ...
}
```

## Abrufen von Formulardaten

Sie können die Werte von Formulardaten in einer [NameValueCollection](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.specialized.namevaluecollection) mit dem folgenden Beispiel abrufen:

<div class="script-header">
    <span>
        Controller/Auth.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RoutePost("/auth")]
public HttpResponse Index(HttpRequest request)
{
    var form = request.GetFormContent();

    string? username = form["username"];
    string? password = form["password"];

    if (AttempLogin(username, password))
    {
        ...
    }
}
```

## Abrufen von Multipart-Formulardaten

Sisks HTTP-Anfrage ermöglicht es Ihnen, hochgeladene Multipart-Inhalte abzurufen, wie z. B. Dateien, Formulare oder binäre Inhalte.

<div class="script-header">
    <span>
        Controller/Auth.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RoutePost("/upload-contents")]
public HttpResponse Index(HttpRequest request)
{
    // Die folgende Methode liest die gesamte Anfrageeingabe in ein
    // Array von Multipart-Objekten
    var multipartFormDataObjects = request.GetMultipartFormContent();
    
    foreach (MultipartObject uploadedObject in multipartFormDataObjects)
    {
        // Der Name der Datei, die durch die Multipart-Formulardaten bereitgestellt wird.
        // Null wird zurückgegeben, wenn das Objekt keine Datei ist.
        Console.WriteLine("Dateiname       : " + uploadedObject.Filename);

        // Der Name des Multipart-Formulardaten-Felds.
        Console.WriteLine("Feldname      : " + uploadedObject.Name);

        // Die Länge des Multipart-Formulardateninhalts.
        Console.WriteLine("Inhaltslänge  : " + uploadedObject.ContentLength);

        // Bestimmt das Dateiformat basierend auf dem Dateikopf für jedes
        // bekannte Inhaltsformat. Wenn der Inhalt kein anerkanntes gängiges Dateiformat ist, gibt diese Methode MultipartObjectCommonFormat.Unknown zurück
        Console.WriteLine("Gängiges Format   : " + uploadedObject.GetCommonFileFormat());
    }
}
```

Sie können mehr über Sisks [Multipart-Formulardatenobjekte](/api/Sisk.Core.Entity.MultipartObject) und ihre Methoden, Eigenschaften und Funktionen erfahren.

## Erkennen von Client-Verbindungsabbrüchen

Ab Version v1.15 von Sisk bietet das Framework einen CancellationToken, der ausgelöst wird, wenn die Verbindung zwischen Client und Server vor dem Empfangen der Antwort vorzeitig geschlossen wird. Dieser Token kann nützlich sein, um zu erkennen, wenn der Client die Antwort nicht mehr wünscht und um lange laufende Operationen abzubrechen.

```cs
router.MapGet("/connect", async (HttpRequest req) =>
{
    // Ruft den Trennungstoken aus der Anfrage ab
    var dc = req.DisconnectToken;

    await LongOperationAsync(dc);

    return new HttpResponse();
});
```

Dieser Token ist nicht mit allen HTTP-Engines kompatibel und erfordert eine eigene Implementierung.

## Unterstützung von Server-sent-Events

Sisk unterstützt [Server-sent-Events](https://developer.mozilla.org/en-US/docs/de/Web/API/Server-sent_events), die es ermöglichen, Daten als Stream zu senden und die Verbindung zwischen Server und Client aufrechtzuerhalten.

Durch den Aufruf der [HttpRequest.GetEventSource](/api/Sisk.Core.Http.HttpRequest.GetEventSource)-Methode wird die HTTP-Anfrage in ihren Zuhörerzustand versetzt. Von diesem Zeitpunkt an erwartet der Kontext dieser HTTP-Anfrage keine HTTP-Antwort mehr, da sie die Pakete überschneidet, die von Server-seitigen Ereignissen gesendet werden.

Nach dem Senden aller Pakete muss die Rückrufmethode die [Close](/api/Sisk.Core.Http.HttpRequestEventSource.Close)-Methode zurückgeben, die die endgültige Antwort an den Server sendet und anzeigt, dass der Streaming-Vorgang beendet ist.

Es ist nicht möglich, die Gesamtlänge aller Pakete vorherzusagen, die gesendet werden, sodass es nicht möglich ist, das Ende der Verbindung mit dem `Content-Length`-Header zu bestimmen.

In den meisten Browsern wird standardmäßig kein Server-seitiges Ereignis unterstützt, das HTTP-Header oder Methoden anderen als der GET-Methode sendet. Daher sollten Sie vorsichtig sein, wenn Sie Anfragehandler mit Ereignisquellen-Anfragen verwenden, die bestimmte Header in der Anfrage erfordern, da sie wahrscheinlich nicht vorhanden sind.

Außerdem starten die meisten Browser Streams erneut, wenn die [EventSource.close](https://developer.mozilla.org/en-US/docs/de/Web/API/EventSource/close)-Methode auf der Client-Seite nicht aufgerufen wird, nachdem alle Pakete empfangen wurden, was zu einer unendlichen zusätzlichen Verarbeitung auf der Server-Seite führt. Um dieses Problem zu vermeiden, ist es üblich, ein letztes Paket zu senden, das anzeigt, dass die Ereignisquelle alle Pakete gesendet hat.

Das folgende Beispiel zeigt, wie der Browser mit einem Server kommunizieren kann, der Server-seitige Ereignisse unterstützt.

<div class="script-header">
    <span>
        sse-example.html
    </span>
    <span>
        HTML
    </span>
</div>

```html
<html>
    <body>
        <b>Früchte:</b>
        <ul></ul>
    </body>
    <script>
        const evtSource = new EventSource('http://localhost:5555/event-source');
        const eventList = document.querySelector('ul');
        
        evtSource.onmessage = (e) => {
            const newElement = document.createElement("li");

            newElement.textContent = `Nachricht: ${e.data}`;
            eventList.appendChild(newElement);

            if (e.data == "Tomate") {
                evtSource.close();
            }
        }
    </script>
</html>
```

Und sendet die Nachrichten schrittweise an den Client:

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class MyController
{
    [RouteGet("/event-source")]
    public async Task<HttpResponse> ServerEventsResponse(HttpRequest request)
    {
        var sse = await request.GetEventSourceAsync ();
        
        string[] fruechte = new[] { "Apfel", "Banane", "Wassermelone", "Tomate" };
        
        foreach (string frucht in fruechte)
        {
            await serverEvents.SendAsync(frucht);
            await Task.Delay(1500);
        }

        return serverEvents.Close();
    }
}
```

Wenn Sie diesen Code ausführen, erwarten wir ein Ergebnis, das diesem ähnelt:

<img src="/assets/img/server side events demo.gif" />

## Auflösen von proxied IPs und Hosts

Sisk kann mit Proxys verwendet werden und daher können IP-Adressen durch den Proxy-Endpunkt im Transaktionsverlauf von einem Client zu einem Proxy ersetzt werden.

Sie können Ihre eigenen Auflöser in Sisk mit [Forwarding-Resolvery](/docs/de/advanced/forwarding-resolvers) definieren.

## Header-Codierung

Header-Codierung kann ein Problem für einige Implementierungen darstellen. Unter Windows werden UTF-8-Header nicht unterstützt, sodass ASCII verwendet wird. Sisk verfügt über einen integrierten Codierungskonverter, der nützlich sein kann, um falsch codierte Header zu decodieren.

Dieser Vorgang ist kostspielig und standardmäßig deaktiviert, kann aber unter der [NormalizeHeadersEncodings](/specification/spec/Sisk.Core.Http.HttpServerFlags.NormalizeHeadersEncodings)-Flag aktiviert werden.