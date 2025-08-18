# Requests

Requests sind Strukturen, die eine HTTP-Anforderungsnachricht darstellen. Das [HttpRequest](/api/Sisk.Core.Http.HttpRequest)-Objekt enthält nützliche Funktionen zur Handhabung von HTTP-Nachrichten in Ihrer gesamten Anwendung.

Eine HTTP-Anforderung besteht aus Methode, Pfad, Version, Headern und Körper.

In diesem Dokument zeigen wir Ihnen, wie Sie jedes dieser Elemente erhalten.

## Erhalten der Anforderungsmethode

Um die Methode der empfangenen Anfrage zu erhalten, können Sie die Eigenschaft Method verwenden:

```cs
static HttpResponse Index(HttpRequest request)
{
    HttpMethod requestMethod = request.Method;
    ...
}
```

Diese Eigenschaft gibt die Methode der Anfrage als ein [HttpMethod](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.httpmethod)-Objekt zurück.

> [!NOTE]
> Im Gegensatz zu Routemethoden dient diese Eigenschaft nicht dem [RouteMethod.Any](/api/Sisk.Core.Routing.RouteMethod)-Element. Stattdessen gibt sie die echte Anforderungsmethode zurück.

## Erhalten der URL-Komponenten der Anfrage

Sie können verschiedene Komponenten einer URL über bestimmte Eigenschaften einer Anfrage abrufen. Für dieses Beispiel betrachten wir die URL:

```
http://localhost:5000/user/login?email=foo@bar.com
```

| Component name | Description | Component value |
| --- | --- | --- |
| [Path](/api/Sisk.Core.Http.HttpRequest.Path) | Gibt den Pfad der Anfrage zurück. | `/user/login` |
| [FullPath](/api/Sisk.Core.Http.HttpRequest.FullPath) | Gibt den Pfad der Anfrage und die Abfragezeichenfolge zurück. | `/user/login?email=foo@bar.com` |
| [FullUrl](/api/Sisk.Core.Http.HttpRequest.FullUrl) | Gibt die gesamte URL-Anforderungszeichenfolge zurück. | `http://localhost:5000/user/login?email=foo@bar.com` |
| [Host](/api/Sisk.Core.Http.HttpRequest.Host) | Gibt den Host der Anfrage zurück. | `localhost` |
| [Authority](/api/Sisk.Core.Http.HttpRequest.Authority) | Gibt den Host und Port der Anfrage zurück. | `localhost:5000` |
| [QueryString](/api/Sisk.Core.Http.HttpRequest.QueryString) | Gibt die Abfrage der Anfrage zurück. | `?email=foo@bar.com` |
| [Query](/api/Sisk.Core.Http.HttpRequest.Query) | Gibt die Abfrage der Anfrage in einer benannten Wertsammlung zurück. | `{StringValueCollection object}` |
| [IsSecure](/api/Sisk.Core.Http.HttpRequest.IsSecure) | Bestimmt, ob die Anfrage SSL verwendet (true) oder nicht (false). | `false` |

Sie können auch die Eigenschaft [HttpRequest.Uri](/api/Sisk.Core.Http.HttpRequest.Uri) verwenden, die alles oben Genannte in einem Objekt enthält.

## Erhalten des Anfragekörpers

Einige Anfragen enthalten einen Körper wie Formulare, Dateien oder API-Transaktionen. Sie können den Körper einer Anfrage über die Eigenschaft erhalten:

```cs
// erhält den Anfragekörper als Zeichenkette, unter Verwendung der Anfragekodierung als Encoder
string body = request.Body;

// oder erhält ihn in einem Byte-Array
byte[] bodyBytes = request.RawBody;

// oder sonst, können Sie ihn streamen.
Stream requestStream = request.GetRequestStream();
```

Es ist auch möglich zu bestimmen, ob ein Körper in der Anfrage vorhanden ist und ob er geladen ist, mit den Eigenschaften [HasContents](/api/Sisk.Core.Http.HttpRequest.HasContents), die bestimmt, ob die Anfrage Inhalte hat, und [IsContentAvailable](/api/Sisk.Core.Http.HttpRequest.IsContentAvailable), die anzeigt, dass der HTTP-Server den Inhalt vollständig vom entfernten Punkt empfangen hat.

Es ist nicht möglich, den Anfrageinhalt mehr als einmal über `GetRequestStream` zu lesen. Wenn Sie mit dieser Methode lesen, sind die Werte in `RawBody` und `Body` ebenfalls nicht verfügbar. Es ist nicht erforderlich, den Anfrage-Stream im Kontext der Anfrage zu entsorgen, da er am Ende der HTTP-Sitzung, in der er erstellt wurde, entsorgt wird. Außerdem können Sie die Eigenschaft [HttpRequest.RequestEncoding](/api/Sisk.Core.Http.HttpRequest.RequestEncoding) verwenden, um die beste Kodierung zum manuellen Dekodieren der Anfrage zu erhalten.

Der Server hat Grenzwerte für das Lesen des Anfrageinhalts, die sowohl für [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body) als auch für [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.Body) gelten. Diese Eigenschaften kopieren den gesamten Eingabestream in einen lokalen Puffer der gleichen Größe wie [HttpRequest.ContentLength](/api/Sisk.Core.Http.HttpRequest.ContentLength).

Eine Antwort mit Status 413 Content Too Large wird an den Client zurückgegeben, wenn der gesendete Inhalt größer ist als [HttpServerConfiguration.MaximumContentLength](/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength), der in der Benutzereinstellung definiert ist. Zusätzlich, wenn kein konfigurierter Grenzwert vorhanden ist oder wenn er zu groß ist, wirft der Server eine [OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception?view=net-8.0), wenn der vom Client gesendete Inhalt [Int32.MaxValue](https://learn.microsoft.com/en-us/dotnet/api/system.int32.maxvalue) (2 GB) überschreitet und wenn der Inhalt versucht wird, über eine der oben genannten Eigenschaften zuzugreifen. Sie können den Inhalt weiterhin über Streaming behandeln.

> [!NOTE]
> Obwohl Sisk es zulässt, ist es immer eine gute Idee, die HTTP-Semantik zu befolgen, um Ihre Anwendung zu erstellen und keine Inhalte in Methoden zu erhalten oder bereitzustellen, die dies nicht zulassen. Lesen Sie über [RFC 9110 "HTTP Semantics"](https://httpwg.org/spec/rfc9110.html).

## Erhalten des Anfragekontexts

Der HTTP Context ist ein exklusives Sisk-Objekt, das Informationen zum HTTP-Server, zur Route, zum Router und zum Anfragehandler speichert. Sie können es verwenden, um sich in einer Umgebung zu organisieren, in der diese Objekte schwer zu organisieren sind.

Das [RequestBag](/api/Sisk.Core.Http.HttpContext.RequestBag)-Objekt enthält gespeicherte Informationen, die von einem Anfragehandler an einen anderen Punkt übergeben werden und am endgültigen Ziel verwendet werden können. Dieses Objekt kann auch von Anfragehandlern verwendet werden, die nach dem Routencallback ausgeführt werden.

> [!TIP]
> Diese Eigenschaft ist auch über die Eigenschaft [HttpRequest.Bag](/api/Sisk.Core.Http.HttpRequest.Bag) zugänglich.

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

Der obenstehende Anfragehandler definiert `AuthenticatedUser` im Anfragebag und kann später im endgültigen Callback verwendet werden:

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
            Content = new StringContent($"Hello, {authUser.Name}!")
        };
    }
}
```

Sie können auch die Hilfsmethoden `Bag.Set()` und `Bag.Get()` verwenden, um Objekte nach ihrem Typ-Singleton zu erhalten oder zu setzen.

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

## Erhalten von Formulardaten

Sie können die Werte von Formulardaten in einer [NameValueCollection](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.specialized.namevaluecollection) mit dem folgenden Beispiel erhalten:

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

## Erhalten von multipart Formulardaten

Die HTTP-Anforderung von Sisk ermöglicht es, hochgeladene multipart Inhalte zu erhalten, wie Dateien, Formularfelder oder beliebigen Binärinhalt.

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
    // die folgende Methode liest die gesamte Eingabe der Anfrage in ein
    // Array von MultipartObjects
    var multipartFormDataObjects = request.GetMultipartFormContent();
    
    foreach (MultipartObject uploadedObject in multipartFormDataObjects)
    {
        // Der Name der Datei, die von Multipart Formulardaten bereitgestellt wird.
        // Null wird zurückgegeben, wenn das Objekt keine Datei ist.
        Console.WriteLine("File name       : " + uploadedObject.Filename);

        // Der Feldname des Multipart Formulardatenobjekts.
        Console.WriteLine("Field name      : " + uploadedObject.Name);

        // Die Länge des Multipart Formulardateninhalts.
        Console.WriteLine("Content length  : " + uploadedObject.ContentLength);

        // Bestimmt das Bildformat basierend auf der Dateikopfzeile für jeden
        // bekannten Inhaltstyp. Wenn der Inhalt kein erkanntes übliches Dateiformat ist,
        // gibt diese Methode unten MultipartObjectCommonFormat.Unknown zurück
        Console.WriteLine("Common format   : " + uploadedObject.GetCommonFileFormat());
    }
}
```

Sie können mehr über Sisk [Multipart form objects](/api/Sisk.Core.Entity.MultipartObject) und seine Methoden, Eigenschaften und Funktionalitäten lesen.

## Erkennen von Client-Abschaltungen

Seit Version v1.15 von Sisk stellt das Framework ein CancellationToken bereit, das ausgelöst wird, wenn die Verbindung zwischen Client und Server vorzeitig geschlossen wird, bevor die Antwort empfangen wird. Dieses Token kann nützlich sein, um zu erkennen, wann der Client die Antwort nicht mehr möchte und lang laufende Operationen abzubrechen.

```csharp
router.MapGet("/connect", async (HttpRequest req) =>
{
    // erhält das Abbruchtoken von der Anfrage
    var dc = req.DisconnectToken;

    await LongOperationAsync(dc);

    return new HttpResponse();
});
```

Dieses Token ist nicht mit allen HTTP-Engines kompatibel, und jede erfordert eine Implementierung.

## Unterstützung von Server-sent events

Sisk unterstützt [Server-sent events](https://developer.mozilla.org/en-US/docs/de/Web/API/Server-sent_events), die das Senden von Daten als Stream ermöglichen und die Verbindung zwischen Server und Client aufrechterhalten.

Das Aufrufen der Methode [HttpRequest.GetEventSource](/api/Sisk.Core.Http.HttpRequest.GetEventSource) setzt die HttpRequest in ihren Listener-Zustand. Von dort aus erwartet der Kontext dieser HTTP-Anforderung keine HttpResponse, da er die vom Server gesendeten Pakete überlappt.

Nach dem Senden aller Pakete muss der Callback die Methode [Close](/api/Sisk.Core.Http.HttpRequestEventSource.Close) zurückgeben, die die endgültige Antwort an den Server sendet und anzeigt, dass das Streaming beendet ist.

Es ist nicht möglich vorherzusagen, welche Gesamtlänge aller Pakete gesendet wird, daher ist es nicht möglich, das Ende der Verbindung mit dem Header `Content-Length` zu bestimmen.

Durch die meisten Browser-Standardeinstellungen unterstützen serverseitige Ereignisse keine HTTP-Header oder Methoden außer der GET-Methode. Daher sollten Sie vorsichtig sein, wenn Sie Anfragehandler mit event-source-Anfragen verwenden, die spezifische Header in der Anfrage erfordern, da sie wahrscheinlich nicht vorhanden sind.

Außerdem starten die meisten Browser Streams neu, wenn die Methode [EventSource.close](https://developer.mozilla.org/en-US/docs/de/Web/API/EventSource/close) auf der Clientseite nicht aufgerufen wird, nachdem alle Pakete empfangen wurden, was zu unendlicher zusätzlicher Verarbeitung auf der Serverseite führt. Um dieses Problem zu vermeiden, ist es üblich, ein finales Paket zu senden, das anzeigt, dass die Ereignisquelle alle Pakete gesendet hat.

Das folgende Beispiel zeigt, wie der Browser mit dem Server kommunizieren kann, der Server-sent events unterstützt.

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
        <b>Fruits:</b>
        <ul></ul>
    </body>
    <script>
        const evtSource = new EventSource('http://localhost:5555/event-source');
        const eventList = document.querySelector('ul');
        
        evtSource.onmessage = (e) => {
            const newElement = document.createElement("li");

            newElement.textContent = `message: ${e.data}`;
            eventList.appendChild(newElement);

            if (e.data == "Tomato") {
                evtSource.close();
            }
        }
    </script>
</html>
```

Und senden Sie die Nachrichten schrittweise an den Client:

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
        
        string[] fruits = new[] { "Apple", "Banana", "Watermelon", "Tomato" };
        
        foreach (string fruit in fruits)
        {
            await serverEvents.SendAsync(fruit);
            await Task.Delay(1500);
        }

        return serverEvents.Close();
    }
}
```

Wenn Sie diesen Code ausführen, erwarten wir ein Ergebnis ähnlich dem folgenden:

<img src="/assets/img/server side events demo.gif" />

## Auflösen von proxied IPs und Hosts

Sisk kann mit Proxies verwendet werden, und daher können IP-Adressen durch den Proxy-Endpunkt in der Transaktion von einem Client zum Proxy ersetzt werden.

Sie können Ihre eigenen Auflösungen in Sisk mit [forwarding resolvers](/docs/de/advanced/forwarding-resolvers) definieren.

## Header-Kodierung

Header-Kodierung kann ein Problem für einige Implementierungen sein. Unter Windows werden UTF-8-Header nicht unterstützt, daher wird ASCII verwendet. Sisk verfügt über einen eingebauten Kodierungsumwandler, der nützlich sein kann, um falsch kodierte Header zu dekodieren.

Diese Operation ist kostenintensiv und standardmäßig deaktiviert, kann aber unter dem Flag [NormalizeHeadersEncodings](/specification/spec/Sisk.Core.Http.HttpServerFlags.NormalizeHeadersEncodings) aktiviert werden.