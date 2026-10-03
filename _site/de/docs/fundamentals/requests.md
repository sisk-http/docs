# Anfragen

Source: https://docs.sisk-framework.org/de/docs/fundamentals/requests.html

Anfragen sind Strukturen, die eine HTTP-Anforderungsnachricht darstellen. Das [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md)-Objekt enthält nützliche Funktionen zum Umgang mit HTTP-Nachrichten in Ihrer Anwendung.

Eine HTTP-Anfrage besteht aus Methode, Pfad, Version, Headern und Body.

In diesem Dokument zeigen wir Ihnen, wie Sie jedes dieser Elemente erhalten.

## Abrufen der Anfragemethode

Um die Methode der empfangenen Anfrage zu erhalten, können Sie die Property **Method** verwenden:

```cs
static HttpResponse Index(HttpRequest request)
{
    HttpMethod requestMethod = request.Method;
    ...
}
```

Diese Eigenschaft gibt die Methode der Anfrage zurück, dargestellt durch ein [HttpMethod](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.httpmethod)-Objekt.

> [!NOTE]
> Im Gegensatz zu Routemethoden dient diese Eigenschaft nicht dem [RouteMethod.Any](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md)-Element. Stattdessen gibt sie die tatsächliche Anfragemethode zurück.

## Abrufen von URL-Komponenten der Anfrage

Sie können verschiedene Komponenten einer URL über bestimmte Eigenschaften einer Anfrage erhalten. Für dieses Beispiel betrachten wir die URL:

```
http://localhost:5000/user/login?email=foo@bar.com
```

| Komponentenname | Beschreibung | Komponentenwert |
| --- | --- | --- |
| [Path](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Path.md) | Gibt den Anforderungspfad zurück. | `/user/login` |
| [FullPath](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.FullPath.md) | Gibt den Anforderungspfad und die Abfragezeichenfolge zurück. | `/user/login?email=foo@bar.com` |
| [FullUrl](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.FullUrl.md) | Gibt die gesamte URL-Anforderungszeichenfolge zurück. | `http://localhost:5000/user/login?email=foo@bar.com` |
| [Host](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Host.md) | Gibt den Host der Anfrage zurück. | `localhost` |
| [Authority](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Authority.md) | Gibt den Host und Port der Anfrage zurück. | `localhost:5000` |
| [QueryString](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.QueryString.md) | Gibt die Abfrage der Anfrage zurück. | `?email=foo@bar.com` |
| [Query](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Query.md) | Gibt die Abfrage der Anfrage in einer benannten Wertsammlung zurück. | `{StringValueCollection object}` |
| [IsSecure](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.IsSecure.md) | Bestimmt, ob die Anfrage SSL verwendet (true) oder nicht (false). | `false` |

Sie können auch die Property [HttpRequest.Uri](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Uri.md) verwenden, die alles oben Genannte in einem Objekt enthält.

## Anforderungs-Metadaten und Abbruch

Sisk fügt jeder Anfrage außerdem betriebliche Metadaten hinzu. Diese Eigenschaften sind nützlich für Protokolle, Tracing, Lokalisierung, Diagnose und langlaufende Vorgänge:

| Eigenschaft oder Methode | Verwendung |
| --- | --- |
| [RequestId](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RequestId.md) | Ein eindeutiger Bezeichner für die Anfrage. Aktivieren Sie [IncludeRequestIdHeader](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.IncludeRequestIdHeader.md), um ihn als `X-Request-Id` zurückzugeben. |
| [RequestedAt](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RequestedAt.md) | Der Zeitpunkt, zu dem Sisk das Anforderungsobjekt erstellt hat. |
| [RemoteAddress](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RemoteAddress.md) | Die vom Verbindungsaufbau ermittelte Clientadresse oder aus Ihrem [ForwardingResolver](https://docs.sisk-framework.org/de/docs/advanced/forwarding-resolvers.md). |
| [Culture](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Culture.md) | Die am besten aus `Accept-Language` ermittelte Kultur, mit Rückfall zur aktuellen Kultur. |
| [DisconnectToken](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.DisconnectToken.md) | Ein Abbruch-Token, das ausgelöst wird, wenn der Client die Verbindung trennt, sofern vom konfigurierten HTTP-Engine unterstützt. |
| [Bag](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Bag.md) | Ein typisierter Schlüssel/Wert‑Speicher, der über Anforderungs‑Handler und die Routinenaktion hinweg geteilt wird. |
| [GetRawHttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetRawHttpRequest.md) | Eine Textdarstellung der Anfrage für Diagnosezwecke. |

## Abrufen des Anfragetextes

Einige Anfragen enthalten einen Body, z. B. Formulare, Dateien oder API‑Transaktionen. Sie können den Body einer Anfrage über die Property erhalten:

```cs
// Holt den Anforderungstext als Zeichenkette, wobei die Anforderungs‑Codierung als Encoder verwendet wird
string body = request.Body;

// oder holt ihn als Byte‑Array
byte[] bodyBytes = request.RawBody;

// alternativ kann er gestreamt werden.
Stream requestStream = request.GetRequestStream();

// oder den Body asynchron lesen
Memory<byte> bodyMemory = await request.GetBodyContentsAsync();
```

Es ist außerdem möglich zu bestimmen, ob ein Body vorhanden ist und ob er geladen wurde, über die Properties [HasContents](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.HasContents.md) (bestimmt, ob die Anfrage Inhalte hat) und [IsContentAvailable](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.IsContentAvailable.md) (zeigt an, dass der HTTP‑Server den Inhalt vollständig vom Remote‑Endpunkt erhalten hat).

Es ist nicht möglich, den Anforderungsinhalt über `GetRequestStream` mehr als einmal zu lesen. Wenn Sie diese Methode verwenden, stehen die Werte in `RawBody` und `Body` ebenfalls nicht mehr zur Verfügung. Es ist nicht nötig, den Request‑Stream im Kontext der Anfrage zu disposen, da er am Ende der HTTP‑Sitzung, in der er erstellt wurde, automatisch freigegeben wird. Außerdem können Sie die Property [HttpRequest.RequestEncoding](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RequestEncoding.md) nutzen, um die beste Codierung zum manuellen Dekodieren der Anfrage zu erhalten.

Der Server hat Beschränkungen beim Lesen des Anforderungsinhalts, die sowohl für [HttpRequest.Body](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Body.md) als auch für [HttpRequest.RawBody](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Body.md) gelten. Diese Eigenschaften kopieren den gesamten Eingabestream in einen lokalen Puffer der Größe von [HttpRequest.ContentLength](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.ContentLength.md).

Eine Antwort mit dem Status **413 Content Too Large** wird an den Client gesendet, wenn der gesendete Inhalt größer ist als [HttpServerConfiguration.MaximumContentLength](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength.md), das in der Benutzerkonfiguration definiert ist. Zusätzlich, wenn kein Limit konfiguriert ist oder es zu groß ist, wirft der Server eine [OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception?view=net-8.0), sobald der vom Client gesendete Inhalt [Int32.MaxValue](https://learn.microsoft.com/en-us/dotnet/api/system.int32.maxvalue) (2 GB) überschreitet und wenn versucht wird, über eine der oben genannten Properties darauf zuzugreifen. Sie können den Inhalt weiterhin über Streaming verarbeiten.

> [!NOTE]
> Obwohl Sisk dies erlaubt, ist es stets ratsam, den HTTP‑Semantiken zu folgen, um Ihre Anwendung zu erstellen und Inhalte nicht in Methoden zu erhalten oder zu liefern, die dies nicht zulassen. Lesen Sie mehr über [RFC 9110 „HTTP Semantics“](https://httpwg.org/spec/rfc9110.html).

## Lesen von JSON-Anfragen

Für JSON‑APIs sollten Sie die integrierten JSON‑Hilfsfunktionen verwenden, anstatt `Body` zu lesen und manuell zu deserialisieren. Sie nutzen [System.Text.Json](https://learn.microsoft.com/en-us/dotnet/api/system.text.json) und greifen standardmäßig auf [HttpRequest.DefaultJsonSerializerOptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.DefaultJsonSerializerOptions.md) zurück.

```cs
public record CreateUserRequest(string Name, string Email);

router.MapPost("/users", (HttpRequest request) =>
{
    CreateUserRequest? body = request.GetJsonContent<CreateUserRequest>();
    if (body is null)
        return new HttpResponse(System.Net.HttpStatusCode.BadRequest);

    return new HttpResponse(System.Net.HttpStatusCode.Created);
});
```

Verwenden Sie die asynchrone Überladung, wenn Sie bereits in einer asynchronen Route sind oder die Anfragenabbruch‑Funktion zum Stoppen der Deserialisierung nutzen möchten:

```cs
router.MapPost("/users", async (HttpRequest request) =>
{
    CreateUserRequest? body =
        await request.GetJsonContentAsync<CreateUserRequest>(request.DisconnectToken);

    if (body is null)
        return new HttpResponse(System.Net.HttpStatusCode.BadRequest);

    return new HttpResponse(System.Net.HttpStatusCode.Created);
});
```

Sie können benutzerdefinierte [JsonSerializerOptions](https://learn.microsoft.com/en-us/dotnet/api/system.text.json.jsonserializeroptions) für einen bestimmten Endpunkt übergeben:

```cs
var options = new JsonSerializerOptions(JsonSerializerDefaults.Web)
{
    PropertyNameCaseInsensitive = true
};

UserDto? user = request.GetJsonContent<UserDto>(options);
```

Für Native‑AOT‑ oder trim‑sensible Anwendungen verwenden Sie die `JsonTypeInfo<T>`‑Überladung, die von einem `JsonSerializerContext` erzeugt wird:

```cs
[JsonSerializable(typeof(CreateUserRequest))]
public partial class AppJsonSerializerContext : JsonSerializerContext
{
}

CreateUserRequest? body =
    await request.GetJsonContentAsync(
        AppJsonSerializerContext.Default.CreateUserRequest,
        request.DisconnectToken);
```

Die gleiche „einmal‑lesen“-Regel gilt für JSON‑Hilfen: Nachdem Sisk den Request‑Stream über `GetJsonContent`, `GetJsonContentAsync`, `Body` oder `RawBody` gelesen hat, können Sie den gleichen Body später nicht mehr über `GetRequestStream()` konsumieren.

## Abrufen des Anforderungskontexts

Der HTTP‑Context ist ein exklusives Sisk‑Objekt, das Informationen über HTTP‑Server, Route, Router und Request‑Handler speichert. Sie können ihn nutzen, um sich in einer Umgebung zu organisieren, in der diese Objekte schwer zu handhaben sind.

Sie können den aktuell ausgeführten [HttpContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.md) über die statische Methode `HttpContext.GetCurrentContext()` erhalten. Diese Methode gibt den Kontext der gerade in dem aktuellen Thread verarbeiteten Anfrage zurück.

```cs
HttpContext context = HttpContext.GetCurrentContext();
```

### Protokollmodus

Die Property [HttpContext.LogMode](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.LogMode.md) ermöglicht es Ihnen, das Logging‑Verhalten für die aktuelle Anfrage zu steuern. Sie können das Logging für bestimmte Anfragen aktivieren oder deaktivieren und damit die Standard‑Serverkonfiguration überschreiben.

```cs
// Logging für diese Anfrage deaktivieren
context.LogMode = LogOutputMode.None;
```

### Anforderungsbeutel

Das [RequestBag](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.RequestBag.md)-Objekt enthält gespeicherte Informationen, die von einem Request‑Handler an einen anderen Punkt weitergegeben werden und am Zielort konsumiert werden können. Dieses Objekt kann auch von Request‑Handlern verwendet werden, die nach dem Routinen‑Callback ausgeführt werden.

> [!TIP]
> Diese Property ist ebenfalls über die Property [HttpRequest.Bag](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Bag.md) zugänglich.

```cs {title="Middleware/AuthenticateUserRequestHandler.cs"}
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

Der obige Request‑Handler legt `AuthenticatedUser` im Request‑Bag ab und kann später im finalen Callback konsumiert werden:

```cs {title="Controller/MyController.cs"}
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

Sie können außerdem die Hilfsmethoden `Bag.Set()` und `Bag.Get()` verwenden, um Objekte anhand ihrer Typ‑Singletons zu setzen bzw. zu holen.

Die Klasse `TypedValueDictionary` stellt zudem die Methoden `GetValue` und `SetValue` für mehr Kontrolle bereit.

```cs {title="Middleware/Authenticate.cs"}
public class Authenticate : RequestHandler
{
    public override HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        request.Bag.Set<User>(authUser);
    }
}
```

```csharp {title="Controller/MyController.cs"}
[RouteGet("/")]
[RequestHandler<Authenticate>]
public static HttpResponse GetUser(HttpRequest request)
{
    var user = request.Bag.Get<User>();
    ...
}
```

## Abrufen von Formulardaten

Sie können Formulardatenwerte in einer [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) mit dem untenstehenden Beispiel erhalten:

```cs {title="Controller/Auth.cs"}
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

Die asynchrone Version ist nützlich, wenn der Request‑Body groß sein kann oder Sie eine Abbruch‑Unterstützung benötigen:

```cs
var form = await request.GetFormContentAsync(request.DisconnectToken);
```

## Abrufen von multipart-Formulardaten

Sisk‑HTTP‑Requests ermöglichen das Abrufen hochgeladener multipart‑Inhalte, wie Dateien, Formulardaten oder beliebiger Binärdaten.

```cs {title="Controller/Auth.cs"}
[RoutePost("/upload-contents")]
public HttpResponse Index(HttpRequest request)
{
    // Die folgende Methode liest die gesamte Anforderungs‑Eingabe in ein
    // Array von MultipartObjects ein
    var multipartFormDataObjects = request.GetMultipartFormContent();
    
    foreach (MultipartObject uploadedObject in multipartFormDataObjects)
    {
        // Der Name der Datei, die durch Multipart‑Formulardaten bereitgestellt wird.
        // Null wird zurückgegeben, wenn das Objekt keine Datei ist.
        Console.WriteLine("File name       : " + uploadedObject.Filename);

        // Der Feldname des Multipart‑Formulardatenobjekts.
        Console.WriteLine("Field name      : " + uploadedObject.Name);

        // Die Inhaltslänge des Multipart‑Formulardatenobjekts.
        Console.WriteLine("Content length  : " + uploadedObject.ContentLength);

        // Bestimmt das Bildformat basierend auf dem Dateikopf für jeden
        // bekannten Inhaltstyp. Wenn der Inhalt kein erkanntes gängiges Dateiformat ist,
        // gibt diese Methode MultipartObjectCommonFormat.Unknown zurück
        Console.WriteLine("Common format   : " + uploadedObject.GetCommonFileFormat());
    }
}
```

Verwenden Sie [GetMultipartFormContentAsync](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetMultipartFormContentAsync.md), wenn die Route asynchron ist:

```cs
var multipartFormDataObjects =
    await request.GetMultipartFormContentAsync(request.DisconnectToken);
```

Weitere Informationen zu Sisk‑[Multipart‑Form‑Objects](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.md) sowie zu deren Methoden, Eigenschaften und Funktionalitäten finden Sie in der Dokumentation.

## Erkennen von Client-Disconnects

Seit Version v1.15 von Sisk stellt das Framework über [HttpRequest.DisconnectToken](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.DisconnectToken.md) ein Abbruch‑Token bereit. Wenn die konfigurierte HTTP‑Engine die Erkennung von Disconnects unterstützt, wird dieses Token abgebrochen, sobald die Client‑Verbindung geschlossen wird, bevor die Antwort abgeschlossen ist. Das ist nützlich, um langlaufende Vorgänge zu stoppen, wenn der Client nicht mehr auf das Ergebnis wartet.

```csharp
router.MapGet("/connect", async (HttpRequest req) =>
{
    // Holt das Disconnect‑Token aus der Anfrage
    var dc = req.DisconnectToken;

    await LongOperationAsync(dc);

    return new HttpResponse();
});
```

Dieses Token ist nicht mit allen HTTP‑Engines kompatibel, und jede erfordert eine eigene Implementierung.

Die Standard‑Sisk‑Engine, basierend auf `System.Net.HttpListener`, unterstützt keine Client‑Disconnect‑Erkennung. Wenn Ihre Anwendung die Standard‑Engine nutzt, ist `DisconnectToken` gleich `CancellationToken.None`; praktisch handelt es sich um ein nicht‑abbrechbares Token, das als nicht verfügbar behandelt werden sollte.

Die [Cadente‑Engine](https://docs.sisk-framework.org/de/docs/cadente.md) unterstützt `DisconnectToken`. Wenn Ihre Route von einer disconnect‑bewussten Abbruch‑Logik abhängt, verwenden Sie Cadente oder eine andere Engine, die dieses Verhalten explizit implementiert. Selbst bei einer unterstützten Engine ist das Abbrechen kooperativ: Geben Sie das Token an asynchrone APIs weiter und prüfen Sie es in Ihrer eigenen langlaufenden Arbeit.

## Unterstützung von Server‑Sent Events

Sisk unterstützt [Server‑Sent Events](https://developer.mozilla.org/en-US/docs/de/Web/API/Server-sent_events), wodurch Datenblöcke als Stream gesendet und die Verbindung zwischen Server und Client aufrecht erhalten werden kann.

Der Aufruf der Methode [HttpRequest.GetEventSource](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetEventSource.md) versetzt das HttpRequest in einen Listener‑Zustand. Dadurch erwartet der Kontext dieser HTTP‑Anfrage keine HttpResponse, da sie die von Server‑Side‑Events gesendeten Pakete überlagern würde.

Nach dem Senden aller Pakete muss der Callback die Methode [Close](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequestEventSource.Close.md) zurückgeben, die die finale Antwort an den Server sendet und das Ende des Streamings signalisiert.

Es ist nicht möglich, die Gesamtlänge aller zu sendenden Pakete vorherzusagen, sodass das Ende der Verbindung nicht über den Header `Content‑Length` bestimmt werden kann.

Nach den Standardeinstellungen der meisten Browser unterstützen Server‑Side‑Events das Senden von HTTP‑Headern oder anderen Methoden als GET nicht. Seien Sie daher vorsichtig, wenn Sie Request‑Handler mit Event‑Source‑Anfragen verwenden, die spezifische Header benötigen, da diese wahrscheinlich nicht vorhanden sind.

Außerdem starten die meisten Browser Streams neu, wenn die Methode [EventSource.close](https://developer.mozilla.org/en-US/docs/de/Web/API/EventSource/close) auf der Client‑Seite nach dem Empfang aller Pakete nicht aufgerufen wird, was zu einer unendlichen zusätzlichen Verarbeitung auf der Server‑Seite führt. Um dieses Problem zu vermeiden, ist es üblich, ein finales Paket zu senden, das anzeigt, dass die Event‑Source das Senden aller Pakete abgeschlossen hat.

Das folgende Beispiel zeigt, wie der Browser mit einem Server kommunizieren kann, der Server‑Side‑Events unterstützt.

```html {title="sse-example.html"}
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

Und die Nachrichten schrittweise an den Client senden:

```cs {title="Controller/MyController.cs"}
public class MyController
{
    [RouteGet("/event-source")]
    public async Task<HttpResponse> ServerEventsResponse(HttpRequest request)
    {
        var serverEvents = await request.GetEventSourceAsync ();
        
        string[] fruits = new[] { "Apple", "Banana", "Watermelon", "Tomato" };
        
        foreach (string fruit in fruits)
        {
            await serverEvents.SendAsync(fruit);
            await Task.Delay(1500);
        }

        return await serverEvents.CloseAsync();
    }
}
```

Beim Ausführen dieses Codes erwarten wir ein Ergebnis, das dem Folgenden ähnelt:

<img src="/assets/img/server side events demo.gif" />

## Auflösen von proxied IPs und Hosts

Sisk kann mit Proxies verwendet werden, sodass IP‑Adressen im Austausch zwischen Client und Proxy durch den Proxy‑Endpunkt ersetzt werden können.

Sie können eigene Resolver in Sisk mit [forwarding resolvers](https://docs.sisk-framework.org/de/docs/advanced/forwarding-resolvers.md) definieren.

## Header-Codierung

Header‑Codierung kann bei manchen Implementierungen problematisch sein. Unter Windows werden UTF‑8‑Header nicht unterstützt, daher wird ASCII verwendet. Sisk verfügt über einen eingebauten Codierungs‑Konverter, der beim Dekodieren falsch codierter Header nützlich sein kann.

Dieser Vorgang ist kostenintensiv und standardmäßig deaktiviert, kann jedoch über [HttpServerConfiguration.NormalizeHeadersEncodings](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.NormalizeHeadersEncodings.md) aktiviert werden.
