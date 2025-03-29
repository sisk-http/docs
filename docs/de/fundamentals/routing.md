# Routing

Der [Router](/api/Sisk.Core.Routing.Router) ist der erste Schritt beim Aufbau des Servers. Er ist verantwortlich für die Unterbringung von [Route](/api/Sisk.Core.Routing.Route)-Objekten, die Endpunkte sind, die URLs und ihre Methoden mit Aktionen verknüpfen, die vom Server ausgeführt werden. Jede Aktion ist verantwortlich für das Empfangen einer Anfrage und das Liefern einer Antwort an den Client.

Die Routen sind Paare von Pfad-Ausdrücken ("Pfadmuster") und der HTTP-Methode, auf die sie hören können. Wenn eine Anfrage an den Server gestellt wird, versucht er, eine Route zu finden, die der erhaltenen Anfrage entspricht, und ruft dann die Aktion dieser Route auf und liefert die resultierende Antwort an den Client.

Es gibt mehrere Möglichkeiten, Routen in Sisk zu definieren: Sie können statisch, dynamisch oder auto-gescannt, durch Attribute definiert oder direkt im Router-Objekt definiert werden.

```cs
Router mainRouter = new Router();

// ordnet die GET /-Route der folgenden Aktion zu
mainRouter.MapGet("/", request => {
    return new HttpResponse("Hallo, Welt!");
});
```

Um zu verstehen, was eine Route tun kann, müssen wir verstehen, was eine Anfrage tun kann. Ein [HttpRequest](/api/Sisk.Core.Http.HttpRequest) enthält alles, was Sie benötigen. Sisk enthält auch einige zusätzliche Funktionen, die die Gesamtentwicklung beschleunigen.

Für jede vom Server empfangene Aktion wird ein Delegat vom Typ [RouteAction](/api/Sisk.Core.Routing.RouteAction) aufgerufen. Dieser Delegat enthält ein Parameter, das ein [HttpRequest](/api/Sisk.Core.Http.HttpRequest) mit allen notwendigen Informationen über die vom Server empfangene Anfrage enthält. Das resultierende Objekt aus diesem Delegaten muss ein [HttpResponse](/api/Sisk.Core.Http.HttpResponse) oder ein Objekt sein, das durch [implizite Antworttypen](/docs/de/fundamentals/responses#implizite-antworttypen) darauf abgebildet werden kann.

## Übereinstimmende Routen

Wenn eine Anfrage an den HTTP-Server gestellt wird, sucht Sisk nach einer Route, die den Ausdruck des empfangenen Pfads erfüllt. Der Ausdruck wird immer zwischen der Route und dem Anfragepfad getestet, ohne die Abfragezeichenfolge zu berücksichtigen.

Dieser Test hat keine Priorität und ist exklusiv für eine einzelne Route. Wenn keine Route mit dieser Anfrage übereinstimmt, wird die [Router.NotFoundErrorHandler](/api/Sisk.Core.Routing.Router.NotFoundErrorHandler)-Antwort an den Client zurückgegeben. Wenn der Pfad-Ausdruck übereinstimmt, aber die HTTP-Methode nicht übereinstimmt, wird die [Router.MethodNotAllowedErrorHandler](/api/Sisk.Core.Routing.Router.MethodNotAllowedErrorHandler)-Antwort an den Client zurückgegeben.

Sisk überprüft die Möglichkeit von Routen-Kollisionen, um diese Probleme zu vermeiden. Wenn Routen definiert werden, sucht Sisk nach möglichen Routen, die mit der definierten Route kollidieren könnten. Dieser Test umfasst die Überprüfung des Pfads und der Methode, die die Route akzeptieren soll.

### Erstellen von Routen mit Pfadmustern

Sie können Routen mit verschiedenen `SetRoute`-Methoden definieren.

```cs
// SetRoute-Methode
mainRouter.SetRoute(RouteMethod.Get, "/hey/<name>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    return new HttpResponse($"Hallo, {name}");
});

// Map*-Methode
mainRouter.MapGet("/form", (request) =>
{
    var formData = request.GetFormData();
    return new HttpResponse(); // leerer 200-OK
});

// Route.*-Hilfsmethoden
mainRouter += Route.Get("/image.png", (request) =>
{
    var imageStream = File.OpenRead("image.png");
    
    return new HttpResponse()
    {
        // der StreamContent-Inner
        // stream wird nach dem Senden
        // der Antwort verworfen.
        Content = new StreamContent(imageStream)
    };
});

// mehrere Parameter
mainRouter.MapGet("/hey/<name>/surname/<surname>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    string surname = request.RouteParameters["surname"].GetString();

    return new HttpResponse($"Hallo, {name} {surname}!");
});
```

Die [RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters)-Eigenschaft von HttpResponse enthält alle Informationen über die Pfadvariablen der empfangenen Anfrage.

Jeder vom Server empfangene Pfad wird vor dem Pfad-Ausdruck-Test normalisiert, indem die folgenden Regeln angewendet werden:

- Alle leeren Segmente werden aus dem Pfad entfernt, z. B. `////foo//bar` wird zu `/foo/bar`.
- Der Pfad-Test ist **groß-/kleinschreibungsabhängig**, es sei denn, [Router.MatchRoutesIgnoreCase](/api/Sisk.Core.Routing.Router.MatchRoutesIgnoreCase) ist auf `true` gesetzt.

Die [Query](/api/Sisk.Core.Http.HttpRequest.Query) und [RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) Eigenschaften von [HttpRequest](/api/Sisk.Core.Http.HttpRequest) geben ein [StringValueCollection](/api/Sisk.Core.Entity.StringValueCollection)-Objekt zurück, bei dem jedes indizierte Eigenschaft ein nicht-Null-[StringValue](/api/Sisk.Core.Entity.StringValue) zurückgibt, das als Option/Monad verwendet werden kann, um seinen Rohwert in ein verwaltetes Objekt umzuwandeln.

Das folgende Beispiel liest den Routen-Parameter "id" und erhält ein `Guid` daraus. Wenn der Parameter kein gültiges Guid ist, wird eine Ausnahme ausgelöst und ein 500-Fehler an den Client zurückgegeben, wenn der Server [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler) nicht behandelt.

```cs
mainRouter.SetRoute(RouteMethod.Get, "/user/<id>", (request) =>
{
    Guid id = request.RouteParameters["id"].GetGuid();
});
```

> [!HINWEIS]
> Pfade haben ihre abschließenden `/` ignoriert, sowohl in der Anfrage als auch in der Routen-Pfad, d. h., wenn Sie versuchen, auf eine Route zuzugreifen, die als `/index/page` definiert ist, können Sie auch auf `/index/page/` zugreifen.
>
> Sie können auch URLs zwingen, mit `/` zu enden, indem Sie die [ForceTrailingSlash](/api/Sisk.Core.Http.HttpServerFlags.ForceTrailingSlash)-Flag setzen.

### Erstellen von Routen mit Klasseninstanzen

Sie können auch Routen dynamisch mit Reflexion und dem [RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute) definieren. Auf diese Weise werden die Instanzen einer Klasse, deren Methoden dieses Attribut implementieren, ihre Routen im Ziel-Router definiert.

Für eine Methode, die als Route definiert werden soll, muss sie mit einem [RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute) markiert werden, wie z. B. dem Attribut selbst oder einem [RouteGetAttribute](/api/Sisk.Core.Routing.RouteGetAttribute). Die Methode kann statisch, instanziell, öffentlich oder privat sein. Wenn die Methode `SetObject(type)` oder `SetObject<TType>()` verwendet wird, werden Instanzmethoden ignoriert.

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
    // wird mit GET / übereinstimmen
    [RouteGet]
    HttpResponse Index(HttpRequest request)
    {
        HttpResponse res = new HttpResponse();
        res.Content = new StringContent("Index!");
        return res;
    }
    
    // statische Methoden funktionieren auch
    [RouteGet("/hello")]
    static HttpResponse Hello(HttpRequest request)
    {
        HttpResponse res = new HttpResponse();
        res.Content = new StringContent("Hallo Welt!");
        return res;
    }
}
```

Die folgende Zeile wird beide Methoden `Index` und `Hello` von `MyController` als Routen definieren, da beide als Routen markiert sind und eine Instanz der Klasse bereitgestellt wurde, nicht deren Typ. Wenn deren Typ stattdessen bereitgestellt worden wäre, würden nur die statischen Methoden definiert.

```cs
var myController = new MyController();
mainRouter.SetObject(myController);
```

Seit Sisk-Version 0.16 ist es möglich, AutoScan zu aktivieren, das nach benutzerdefinierten Klassen sucht, die `RouterModule` implementieren, und diese automatisch mit dem Router verknüpft. Dies wird nicht mit AOT-Kompilierung unterstützt.

```cs
mainRouter.AutoScanModules<ApiController>();
```

Der obige Befehl sucht nach allen Typen, die `ApiController` implementieren, aber nicht den Typ selbst. Die beiden optionalen Parameter geben an, wie die Methoden nach diesen Typen suchen. Der erste Argument impliziert die Assembly, in der die Typen gesucht werden, und der zweite gibt an, wie die Typen definiert werden.

## Regex-Routen

Anstelle der Verwendung der Standard-HTTP-Pfad-Übereinstimmungsmethode können Sie eine Route markieren, um sie mit Regex zu interpretieren.

```cs
Route indexRoute = new Route(RouteMethod.Get, @"\/[a-z]+\/", "My route", IndexPage, null);
indexRoute.UseRegex = true;
mainRouter.SetRoute(indexRoute);
```

Oder mit der [RegexRoute](/api/Sisk.Core.Routing.RegexRoute)-Klasse:

```cs
mainRouter.SetRoute(new RegexRoute(RouteMethod.Get, @"\/[a-z]+\/", request =>
{
    return new HttpResponse("hallo, Welt");
}));
```

Sie können auch Gruppen aus dem Regex-Muster in die [HttpRequest.RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters)-Inhalte erfassen:

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
    [RegexRoute(RouteMethod.Get, @"/uploads/(?<filename>.*\.(jpeg|jpg|png))")]
    static HttpResponse RegexRoute(HttpRequest request)
    {
        string filename = request.RouteParameters["filename"].GetString();
        return new HttpResponse().WithContent($"Zugriff auf Datei {filename}");
    }
}
```

## Routen-Präfixe

Sie können alle Routen in einer Klasse oder einem Modul mit dem [RoutePrefix](/api/Sisk.Core.Routing.RoutePrefixAttribute)-Attribut vordefinieren und den Präfix als Zeichenfolge setzen.

Siehe das folgende Beispiel mit der BREAD-Architektur (Browse, Read, Edit, Add und Delete):

<div class="script-header">
    <span>
        Controller/Api/UsersController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RoutePrefix("/api/users")]
public class UsersController
{
    // GET /api/users/<id>
    [RouteGet]
    public async Task<HttpResponse> Browse()
    {
        ...
    }
    
    // GET /api/users
    [RouteGet("/<id>")]
    public async Task<HttpResponse> Read()
    {
        ...
    }
    
    // PATCH /api/users/<id>
    [RoutePatch("/<id>")]
    public async Task<HttpResponse> Edit()
    {
        ...
    }
    
    // POST /api/users
    [RoutePost]
    public async Task<HttpResponse> Add()
    {
        ...
    }
    
    // DELETE /api/users/<id>
    [RouteDelete("/<id>")]
    public async Task<HttpResponse> Delete()
    {
        ...
    }
}
```

Im obigen Beispiel wird der HttpResponse-Parameter weggelassen, um durch den globalen Kontext [HttpContext.Current](/api/Sisk.Core.Http.HttpContext.Current) verwendet zu werden. Weitere Informationen finden Sie im folgenden Abschnitt.

## Routen ohne Anfrageparameter

Routen können ohne den [HttpRequest](/api/Sisk.Core.Http.HttpRequest)-Parameter definiert werden und es ist dennoch möglich, die Anfrage und ihre Komponenten im Anfragekontext zu erhalten. Betrachten wir eine Abstraktion `ControllerBase`, die als Grundlage für alle Controller einer API dient und die `Request`-Eigenschaft bereitstellt, um die [HttpRequest](/api/Sisk.Core.Http.HttpRequest) zu erhalten, die derzeit im Kontext ist.

<div class="script-header">
    <span>
        Controller/ControllerBase.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public abstract class ControllerBase
{
    // erhält die Anfrage aus dem aktuellen Thread
    public HttpRequest Request { get => HttpContext.Current.Request; }
    
    // die folgende Zeile erhält die Datenbank aus der aktuellen HTTP-Sitzung,
    // oder erstellt eine neue, wenn sie nicht existiert
    public DbContext Database { get => HttpContext.Current.RequestBag.GetOrAdd<DbContext>(); }
}
```

Und für alle seine Nachkommen, um die Routen-Syntax ohne den Anfrageparameter zu verwenden:

<div class="script-header">
    <span>
        Controller/UsersController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RoutePrefix("/api/users")]
public class UsersController : ControllerBase
{    
    [RoutePost]
    public async Task<HttpResponse> Create()
    {
        // liest die JSON-Daten aus der aktuellen Anfrage
        UserCreationDto? user = JsonSerializer.DeserializeAsync<UserCreationDto>(Request.Body);
        ...
        Database.Users.Add(user);
        
        return new HttpResponse(201);
    }
}
```

Weitere Details zum aktuellen Kontext und zur Abhängigkeitsinjektion finden Sie im [Abhängigkeitsinjektion](/docs/de/features/instancing)-Tutorial.

## Routen für jede Methode

Sie können eine Route definieren, die nur nach ihrem Pfad übereinstimmt und die HTTP-Methode ignoriert. Dies kann nützlich sein, um die Methode innerhalb der Routen-Aktion zu validieren.

```cs
// wird mit / auf jede HTTP-Methode übereinstimmen
mainRouter.SetRoute(RouteMethod.Any, "/", callbackFunction);
```

## Routen für jeden Pfad

Routen für jeden Pfad testen jeden Pfad, der vom HTTP-Server empfangen wird, unter Vorbehalt der Route-Methode, die getestet wird. Wenn die Route-Methode RouteMethod.Any ist und die Route [Route.AnyPath](/api/Sisk.Core.Routing.Route.AnyPath) in ihrem Pfad-Ausdruck verwendet, wird diese Route auf alle Anfragen vom HTTP-Server hören, und keine anderen Routen können definiert werden.

```cs
// die folgende Route wird mit allen POST-Anfragen übereinstimmen
mainRouter.SetRoute(RouteMethod.Post, Route.AnyPath, callbackFunction);
```

## Groß-/Kleinschreibung ignorierende Routen-Übereinstimmung

Standardmäßig ist die Interpretation von Routen mit Anfragen groß-/kleinschreibungsabhängig. Um dies zu ignorieren, aktivieren Sie diese Option:

```cs
mainRouter.MatchRoutesIgnoreCase = true;
```

Dies aktiviert auch die Option `RegexOptions.IgnoreCase` für Routen, bei denen es sich um Regex-Übereinstimmung handelt.

## Nicht gefunden (404)-Rückruf-Handler

Sie können einen benutzerdefinierten Rückruf für den Fall erstellen, dass eine Anfrage keine bekannte Route entspricht.

```cs
mainRouter.NotFoundErrorHandler = () =>
{
    return new HttpResponse(404)
    {
        // Seit v0.14
        Content = new HtmlContent("<h1>Nicht gefunden</h1>")
        // ältere Versionen
        Content = new StringContent("<h1>Nicht gefunden</h1>", Encoding.UTF8, "text/html")
    };
};
```

## Methode nicht zulässig (405)-Rückruf-Handler

Sie können auch einen benutzerdefinierten Rückruf für den Fall erstellen, dass eine Anfrage ihren Pfad entspricht, aber nicht die Methode.

```cs
mainRouter.MethodNotAllowedErrorHandler = (context) =>
{
    return new HttpResponse(405)
    {
        Content = new StringContent($"Methode nicht zulässig für diese Route.")
    };
};
```

## Interne Fehlerbehandlung

Routen-Rückrufe können während der Serverausführung Fehler auslösen. Wenn diese nicht richtig behandelt werden, kann die Gesamtfunktion des HTTP-Servers unterbrochen werden. Der Router hat einen Rückruf für den Fall, dass ein Routen-Rückruf fehlschlägt und die Serviceunterbrechung verhindert.

Diese Methode ist nur erreichbar, wenn [ThrowExceptions](/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions) auf `false` gesetzt ist.

```cs
mainRouter.CallbackErrorHandler = (ex, context) =>
{
    return new HttpResponse(500)
    {
        Content = new StringContent($"Fehler: {ex.Message}")
    };
};
```