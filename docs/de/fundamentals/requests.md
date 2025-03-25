# Anfragen

Anfragen sind Strukturen, die eine HTTP-Anfrage-Nachricht darstellen. Das [HttpRequest](/api/Sisk.Core.Http.HttpRequest)-Objekt enthält nützliche Funktionen für die Verarbeitung von HTTP-Nachrichten in Ihrer Anwendung.

Eine HTTP-Anfrage besteht aus der Methode, dem Pfad, der Version, den Headern und dem Body.

In diesem Dokument werden wir Ihnen zeigen, wie Sie jedes dieser Elemente erhalten.

## Abrufen der Anfragemethode

Um die Methode der empfangenen Anfrage zu erhalten, können Sie die Methode-Eigenschaft verwenden:

```cs
static HttpResponse Index(HttpRequest request)
{
    HttpMethod requestMethod = request.Method;
    ...
}
```

Diese Eigenschaft gibt die Anfragemethode als [HttpMethod](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.httpmethod)-Objekt zurück.

> [!NOTE]
> Im Gegensatz zu Routenmethoden dient diese Eigenschaft nicht dem [RouteMethod.Any](/api/Sisk.Core.Routing.RouteMethod)-Element. Stattdessen gibt sie die tatsächliche Anfragemethode zurück.

## Abrufen von URL-Komponenten

Sie können verschiedene Komponenten aus einer URL über bestimmte Eigenschaften einer Anfrage abrufen. Für dieses Beispiel betrachten wir die URL:

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

Sie können auch die [HttpRequest.Uri](/api/Sisk.Core.Http.HttpRequest.Uri)-Eigenschaft verwenden, die alles oben Genannte in einem Objekt enthält.

## Abrufen des Anfragebodies

Einige Anfragen enthalten einen Body, wie z. B. Formulare, Dateien oder API-Transaktionen. Sie können den Body einer Anfrage aus der Eigenschaft abrufen:

```cs
// Ruft den Anfragebody als Zeichenfolge ab, wobei die Anfragecodierung als Codierer verwendet wird
string body = request.Body;

// oder ruft ihn als Byte-Array ab
byte[] bodyBytes = request.RawBody;

// oder Sie können ihn streamen
Stream requestStream = request.GetRequestStream();
```

Es ist auch möglich, zu bestimmen, ob ein Body in der Anfrage vorhanden ist und ob er geladen ist, mit den Eigenschaften [HasContents](/api/Sisk.Core.Http.HttpRequest.HasContents), die bestimmt, ob die Anfrage Inhalte enthält, und [IsContentAvailable](/api/Sisk.Core.Http.HttpRequest.IsContentAvailable), die angibt, dass der HTTP-Server den Inhalt vom Remote-Punkt vollständig empfangen hat.

Es ist nicht möglich, den Anfrageinhalt über `GetRequestStream` mehr als einmal zu lesen. Wenn Sie mit dieser Methode lesen, sind die Werte in `RawBody` und `Body` nicht mehr verfügbar. Es ist nicht notwendig, den Anfragestream im Kontext der Anfrage zu entsorgen, da er am Ende der HTTP-Sitzung, in der er erstellt wird, entsorgt wird. Sie können auch die [HttpRequest.RequestEncoding](/api/Sisk.Core.Http.HttpRequest.RequestEncoding)-Eigenschaft verwenden, um die beste Codierung zu erhalten, um die Anfrage manuell zu decodieren.

Der Server hat Grenzen für das Lesen des Anfrageinhalts, die sowohl für [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body) als auch für [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.Body) gelten. Diese Eigenschaften kopieren den gesamten Eingabestream in einen lokalen Puffer der gleichen Größe wie [HttpRequest.ContentLength](/api/Sisk.Core.Http.HttpRequest.ContentLength).

Eine Antwort mit dem Status 413 Inhalt zu groß wird an den Client zurückgegeben, wenn der gesendete Inhalt größer ist als [HttpServerConfiguration.MaximumContentLength](/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength), wie in der Benutzerkonfiguration definiert. Zusätzlich wird, wenn es keine konfigurierte Grenze gibt oder wenn sie zu groß ist, der Server eine [OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception?view=net-8.0) auslösen, wenn der vom Client gesendete Inhalt [Int32.MaxValue](https://learn.microsoft.com/en-us/dotnet/api/system.int32.maxvalue) (2 GB) überschreitet und wenn der Inhalt über eine der oben genannten Eigenschaften abgerufen wird. Sie können den Inhalt immer noch über Streaming verarbeiten.

> [!NOTE]
> Obwohl Sisk dies zulässt, ist es immer eine gute Idee, HTTP-Semantik zu befolgen, um Ihre Anwendung zu erstellen und nicht Inhalte in Methoden zu erhalten oder bereitzustellen, die dies nicht zulassen. Lesen Sie über [RFC 9110 "HTTP-Semantik"](https://httpwg.org/spec/rfc9110.html).

## Abrufen des Anfragekontexts

Der HTTP-Kontext ist ein exklusives Sisk-Objekt, das Informationen über den HTTP-Server, die Route, den Router und den Anfragehandler enthält. Sie können es verwenden, um sich in einer Umgebung zu organisieren, in der diese Objekte schwer zu organisieren sind.

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

Sie können auch die `Bag.Set()`- und `Bag.Get()`-Hilfsmethoden verwenden, um Objekte nach ihrem Typ zu erhalten oder zu setzen.

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

Sisks HTTP-Anfrage ermöglicht es Ihnen, hochgeladene Multipart-Inhalte wie Dateien, Formularfelder oder beliebige Binärinhalte abzurufen.

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
    // Array von MultipartObjecten
    var multipartFormDataObjects = request.GetMultipartFormContent();
    
    foreach (MultipartObject uploadedObject in multipartFormDataObjects)
    {
        // Der Name der Datei, die durch die Multipart-Formulardaten bereitgestellt wird.
        // Null wird zurückgegeben, wenn das Objekt keine Datei ist.
        Console.WriteLine("Dateiname       : " + uploadedObject.Filename);

        // Der Name des Multipart-Formulardatenfelds.
        Console.WriteLine("Feldname      : " + uploadedObject.Name);

        // Die Länge des Multipart-Formulardateninhalts.
        Console.WriteLine("Inhaltslänge  : " + uploadedObject.ContentLength);

        // Bestimmt das Dateiformat basierend auf dem Dateikopf für jeden
        // bekannten Inhaltstyp. Wenn der Inhalt kein erkanntes gängiges Dateiformat ist,
        // gibt diese Methode MultipartObjectCommonFormat.Unknown zurück
        Console.WriteLine("Gängiges Format   : " + uploadedObject.GetCommonFileFormat());
    }
}
```

Sie können mehr über Sisks [Multipart-Formulardatenobjekte](/api/Sisk.Core.Entity.MultipartObject) und ihre Methoden, Eigenschaften und Funktionen erfahren.

## Server-sent-Events-Unterstützung

Sisk unterstützt [Server-sent-Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events), die es ermöglichen, Chunks als Stream zu senden und die Verbindung zwischen Server und Client aufrechtzuerhalten.

Durch den Aufruf der [HttpRequest.GetEventSource](/api/Sisk.Core.Http.HttpRequest.GetEventSource)-Methode wird die HttpRequest in ihren Zuhörerzustand versetzt. Von diesem Zeitpunkt an erwartet der Kontext dieser HTTP-Anfrage keine HttpResponse, da sie die von der Server-Seite gesendeten Pakete überlagert.

Nach dem Senden aller Pakete muss die Rückrufmethode die [Close](/api/Sisk.Core.Http.HttpRequestEventSource.Close)-Methode zurückgeben, die die endgültige Antwort an den Server sendet und anzeigt, dass der Streamingvorgang beendet wurde.

Es ist nicht möglich, die Gesamtlänge aller Pakete vorherzusagen, die gesendet werden, daher ist es nicht möglich, das Ende der Verbindung mit dem `Content-Length`-Header zu bestimmen.

Die meisten Browser unterstützen standardmäßig keine Server-sent-Events, die HTTP-Header oder Methoden anderen als der GET-Methode senden. Daher sollten Sie vorsichtig sein, wenn Sie Anfragehandler mit Event-Quellen-Anfragen verwenden, die bestimmte Header in der Anfrage erfordern, da sie wahrscheinlich nicht vorhanden sind.

Außerdem starten die meisten Browser Streams erneut, wenn die [EventSource.close](https://developer.mozilla.org/en-US/docs/Web/API/EventSource/close)-Methode auf der Client-Seite nach dem Empfang aller Pakete nicht aufgerufen wird, was zu endlosem zusätzlichem Verarbeitung auf der Server-Seite führt. Um dieses Problem zu vermeiden, ist es üblich, ein letztes Paket zu senden, das anzeigt, dass die Event-Quelle alle Pakete gesendet hat.

Das folgende Beispiel zeigt, wie der Browser mit einem Server kommunizieren kann, der Server-sent-Events unterstützt.

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

Wenn wir diesen Code ausführen, erwarten wir ein Ergebnis, das diesem ähnelt:

<img src="/assets/img/server side events demo.gif" />

## Auflösen von proxied IPs und Hosts

Sisk kann mit Proxys verwendet werden, und daher können IP-Adressen durch den Proxy-Endpunkt im Transaktionsverlauf von einem Client zum Proxy ersetzt werden.

Sie können Ihre eigenen Auflöser in Sisk mit [Forwarding-Resolvery](/docs/advanced/forwarding-resolvers) definieren.

## Header-Codierung

Header-Codierung kann ein Problem für einige Implementierungen darstellen. Unter Windows werden UTF-8-Header nicht unterstützt, daher wird ASCII verwendet. Sisk verfügt über einen integrierten Codierungskonverter, der für die Decodierung von falsch codierten Headern nützlich sein kann.

Dieser Vorgang ist kostspielig und standardmäßig deaktiviert, kann aber unter der [NormalizeHeadersEncodings](/specification/spec/Sisk.Core.Http.HttpServerFlags.NormalizeHeadersEncodings)-Flag aktiviert werden.