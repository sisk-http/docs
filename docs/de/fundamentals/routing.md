# Routing

Der [Router](/api/Sisk.Core.Routing.Router) ist der erste Schritt beim Aufbau des Servers. Er ist dafür verantwortlich, [Route](/api/Sisk.Core.Routing.Route)-Objekte zu verwalten, die Endpunkte darstellen, welche URLs und deren Methoden auf Aktionen abbilden, die vom Server ausgeführt werden. Jede Aktion ist dafür zuständig, eine Anfrage zu empfangen und eine Antwort an den Client zu liefern.

Die Routen bestehen aus Paaren von Pfadausdrücken („Pfadmuster“) und der HTTP‑Methode, auf die sie hören können. Wenn eine Anfrage an den Server gestellt wird, versucht er, eine Route zu finden, die zur empfangenen Anfrage passt, ruft dann die Aktion dieser Route auf und liefert die resultierende Antwort an den Client.

Es gibt mehrere Möglichkeiten, Routen in Sisk zu definieren: Sie können statisch, dynamisch oder automatisch gescannt sein, über Attribute definiert werden oder direkt im Router‑Objekt.

```cs
Router mainRouter = new Router();

// mappt die GET / Route in die folgende Aktion
mainRouter.MapGet("/", request => {
    return new HttpResponse("Hello, world!");
});
```

Um zu verstehen, was eine Route leisten kann, müssen wir verstehen, was eine Anfrage leisten kann. Ein [HttpRequest](/api/Sisk.Core.Http.HttpRequest) enthält alles, was Sie benötigen. Sisk enthält außerdem einige zusätzliche Features, die die Gesamtentwicklung beschleunigen.

Für jede vom Server empfangene Aktion wird ein Delegat vom Typ [RouteAction](/api/Sisk.Core.Routing.RouteAction) aufgerufen. Dieser Delegat enthält einen Parameter, der ein [HttpRequest](/api/Sisk.Core.Http.HttpRequest) mit allen notwendigen Informationen über die vom Server empfangene Anfrage hält. Das Ergebnis dieses Delegaten muss ein [HttpResponse](/api/Sisk.Core.Http.HttpResponse) sein oder ein Objekt, das über [implizite Antworttypen](/docs/de/fundamentals/responses#implicit-response-types) darauf abgebildet wird.

## Matching routes

Wenn eine Anfrage vom HTTP‑Server empfangen wird, sucht Sisk nach einer Route, die den Ausdruck des von der Anfrage empfangenen Pfads erfüllt. Der Ausdruck wird immer zwischen der Route und dem Anfrage‑Pfad getestet, ohne die Query‑String zu berücksichtigen.

Dieser Test hat keine Priorität und ist exklusiv für eine einzelne Route. Wenn keine Route zu dieser Anfrage passt, wird die Antwort von [Router.NotFoundErrorHandler](/api/Sisk.Core.Routing.Router.NotFoundErrorHandler) an den Client zurückgegeben. Wenn das Pfadmuster passt, die HTTP‑Methode jedoch nicht, wird die Antwort von [Router.MethodNotAllowedErrorHandler](/api/Sisk.Core.Routing.Router.MethodNotAllowedErrorHandler) an den Client gesendet.

Sisk prüft die Möglichkeit von Routenkollisionen, um diese Probleme zu vermeiden. Beim Definieren von Routen sucht Sisk nach möglichen Routen, die mit der zu definierenden Route kollidieren könnten. Dieser Test beinhaltet die Prüfung des Pfads und der Methode, die die Route akzeptieren soll.

### Creating routes using path patterns

Für neue Anwendungen sollten die `Map*`‑Methoden bevorzugt werden. Sie halten die HTTP‑Methode am Aufrufort sichtbar und entsprechen der aktuellen `Router`‑API. Die älteren `SetRoute`‑Methoden existieren noch als Kompatibilitäts‑Wrapper, aber neue Beispiele sollten `Map`, `MapGet`, `MapPost`, `MapPut`, `MapDelete`, `MapPatch`, `MapAny`, `MapOptions` oder `MapHead` verwenden.

```cs
// Map*-Methoden sind der übliche Weg, um methodenspezifische Routen zu definieren.
mainRouter.MapGet("/hey/<name>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    return new HttpResponse($"Hello, {name}");
});

mainRouter.MapPost("/form", (request) =>
{
    var formData = request.GetFormContent();
    return new HttpResponse(); // leerer 200 OK
});

// Map kann auch eine Route-Instanz erhalten, wenn Sie Routenoptionen benötigen.
mainRouter.Map(Route.Get("/image.png", (request) =>
{
    var imageStream = File.OpenRead("image.png");
    
    return new HttpResponse()
    {
        // das innere StreamContent
        // Stream wird nach dem Senden freigegeben
        // die Antwort.
        Content = new StreamContent(imageStream)
    };
}));

// mehrere Parameter
mainRouter.MapGet("/hey/<name>/surname/<surname>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    string surname = request.RouteParameters["surname"].GetString();

    return new HttpResponse($"Hello, {name} {surname}!");
});
```

Die [RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters)-Eigenschaft von HttpRequest enthält alle Informationen über die Pfadvariablen der empfangenen Anfrage.

Jeder vom Server empfangene Pfad wird normalisiert, bevor der Pfadmuster‑Test ausgeführt wird, nach folgenden Regeln:

- Alle leeren Segmente werden aus dem Pfad entfernt, z. B.: `////foo//bar` wird zu `/foo/bar`.
- Pfad‑Matching ist **case‑sensitive**, es sei denn, [Router.MatchRoutesIgnoreCase](/api/Sisk.Core.Routing.Router.MatchRoutesIgnoreCase) ist auf `true` gesetzt.

Die [Query](/api/Sisk.Core.Http.HttpRequest.Query)- und [RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters)-Eigenschaften von [HttpRequest](/api/Sisk.Core.Http.HttpRequest) geben ein [StringValueCollection](/api/Sisk.Core.Entity.StringValueCollection)-Objekt zurück, wobei jede indizierte Eigenschaft ein nicht‑null [StringValue](/api/Sisk.Core.Entity.StringValue) liefert, das als Option/Monade verwendet werden kann, um seinen Rohwert in ein verwaltetes Objekt zu konvertieren.

Das folgende Beispiel liest den Routen‑Parameter „id“ und erzeugt daraus ein `Guid`. Ist der Parameter kein gültiges Guid, wird eine Ausnahme geworfen und bei nicht aktivem [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler) ein 500‑Fehler an den Client zurückgegeben.

```cs
mainRouter.MapGet("/user/<id>", (request) =>
{
    Guid id = request.RouteParameters["id"].GetGuid();
    return new HttpResponse($"User id: {id}");
});
```

> [!NOTE]
> Pfade ignorieren ihr abschließendes `/` sowohl in Anfrage‑ als auch in Routenkontext, d. h. wenn Sie versuchen, auf eine Route `/index/page` zuzugreifen, können Sie sie auch über `/index/page/` erreichen.
>
> Sie können URLs außerdem dazu zwingen, mit `/` zu enden, indem Sie [HttpServerConfiguration.ForceTrailingSlash](/api/Sisk.Core.Http.HttpServerConfiguration.ForceTrailingSlash) aktivieren.

### Creating routes using class instances

Sie können Routen auch dynamisch über Reflection mit dem Attribut [RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute) definieren. Auf diese Weise werden die Routen einer Klasseninstanz, deren Methoden dieses Attribut implementieren, im Ziel‑Router definiert.

Damit eine Methode als Route definiert werden kann, muss sie mit einem [RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute) markiert sein, etwa dem Attribut selbst oder einem [RouteGetAttribute](/api/Sisk.Core.Routing.RouteGetAttribute). Die Methode kann static, instanziiert, public oder private sein. Verwenden Sie `MapInstance`, wenn Sie Instanz‑ und statische Routinemethoden aus einem Objekt zuordnen wollen. Verwenden Sie `MapType`, wenn Sie nur statische Routinemethoden aus einem Typ zuordnen wollen.

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
    // passt zu GET /
    [RouteGet]
    HttpResponse Index(HttpRequest request)
    {
        HttpResponse res = new HttpResponse();
        res.Content = new StringContent("Index!");
        return res;
    }
    
    // statische Methoden funktionieren ebenfalls
    [RouteGet("/hello")]
    static HttpResponse Hello(HttpRequest request)
    {
        HttpResponse res = new HttpResponse();
        res.Content = new StringContent("Hello world!");
        return res;
    }
}
```

Die Zeile unten definiert sowohl die `Index`‑ als auch die `Hello`‑Methoden von `MyController` als Routen, da beide als Routen markiert sind und eine Instanz der Klasse bereitgestellt wurde, nicht ihr Typ. Wäre stattdessen der Typ übergeben worden, würden nur die statischen Methoden definiert werden.

```cs
var myController = new MyController();
mainRouter.MapInstance(myController);
```

Um nur statische Routinemethoden eines Typs zuzuordnen, verwenden Sie:

```cs
mainRouter.MapType<MyController>();
```

Seit Sisk Version 0.16 ist es möglich, AutoScan zu aktivieren, wodurch nach benutzerdefinierten Klassen gesucht wird, die `RouterModule` implementieren, und diese automatisch dem Router zugeordnet werden. Dies wird bei AOT‑Kompilierung nicht unterstützt.

```cs
mainRouter.AutoScanModules<ApiController>();
```

Der obige Befehl sucht nach allen Typen, die `ApiController` implementieren, **nicht jedoch nach dem Typ selbst**. Die beiden optionalen Parameter geben an, wie die Methode nach diesen Typen sucht. Das erste Argument bezeichnet das Assembly, in dem die Typen gesucht werden, das zweite gibt an, wie die Typen definiert werden sollen.

## Regex routes

Anstatt die standardmäßigen HTTP‑Pfad‑Matching‑Methoden zu verwenden, können Sie eine Route markieren, die mit Regex interpretiert wird.

```cs
Route indexRoute = new RegexRoute(RouteMethod.Get, @"\/[a-z]+\/", IndexPage);
mainRouter.Map(indexRoute);
```

Oder mit der [RegexRoute](/api/Sisk.Core.Routing.RegexRoute)-Klasse:

```cs
mainRouter.Map(new RegexRoute(RouteMethod.Get, @"\/[a-z]+\/", request =>
{
    return new HttpResponse("hello, world");
}));
```

Sie können außerdem Gruppen aus dem Regex‑Muster in den Inhalt von [HttpRequest.RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) übernehmen:

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
        return new HttpResponse().WithContent($"Acessing file {filename}");
    }
}
```

## Prefixing routes

Sie können allen Routen einer Klasse oder eines Moduls das Attribut [RoutePrefix](/api/Sisk.Core.Routing.RoutePrefixAttribute) hinzufügen und das Präfix als Zeichenkette festlegen.

Siehe das folgende Beispiel, das die BREAD‑Architektur (Browse, Read, Edit, Add und Delete) verwendet:

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
    // GET /api/users
    [RouteGet]
    public async Task<HttpResponse> Browse()
    {
        ...
    }
    
    // GET /api/users/<id>
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

Im obigen Beispiel wird der HttpResponse‑Parameter weggelassen, zugunsten der Nutzung über den globalen Kontext [HttpContext.Current](/api/Sisk.Core.Http.HttpContext.Current). Weitere Details im folgenden Abschnitt.

## Routes without request parameter

Routen können ohne den [HttpRequest](/api/Sisk.Core.Http.HttpRequest)-Parameter definiert werden und dennoch im Anforderungskontext auf die Anfrage und ihre Komponenten zugreifen. Betrachten wir eine Abstraktion `ControllerBase`, die als Grundlage für alle Controller einer API dient und die `Request`‑Eigenschaft bereitstellt, um den aktuell gültigen [HttpRequest](/api/Sisk.Core.Http.HttpRequest) zu erhalten.

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
    // holt die Anfrage aus dem aktuellen Thread
    public HttpRequest Request { get => HttpContext.Current.Request; }
    
    // die nachfolgende Zeile ruft, wenn sie aufgerufen wird, die Datenbank aus der aktuellen HTTP-Session ab,
    // oder erstellt eine neue, falls sie nicht existiert
    public DbContext Database { get => HttpContext.Current.RequestBag.GetOrAdd<DbContext>(); }
}
```

Und damit alle Nachfolger die Routensyntax ohne Anfrage‑Parameter nutzen können:

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
        UserCreationDto? user = await Request.GetJsonContentAsync<UserCreationDto>();
        ...
        Database.Users.Add(user);
        
        return new HttpResponse(201);
    }
}
```

Weitere Details zum aktuellen Kontext und zur Dependency Injection finden Sie im Tutorial zu [dependency injection](/docs/de/features/instancing).

## Any method routes

Sie können eine Route definieren, die nur anhand ihres Pfads und nicht anhand der HTTP‑Methode übereinstimmt. Das kann nützlich sein, um die Methodenvalidierung innerhalb des Route‑Callbacks durchzuführen.

```cs
// passt zu / bei jeder HTTP-Methode
mainRouter.MapAny("/", callbackFunction);
```

## Any path routes

Any‑Path‑Routen testen jeden vom HTTP‑Server empfangenen Pfad, wobei die zu testende Routinemethode berücksichtigt wird. Ist die Routinemethode `RouteMethod.Any` und verwendet die Route [Route.AnyPath](/api/Sisk.Core.Routing.Route.AnyPath) im Pfadausdruck, hört diese Route auf alle Anfragen des HTTP‑Servers, und es können keine weiteren Routen definiert werden.

```cs
// die folgende Route passt zu allen POST-Anfragen
mainRouter.Map(RouteMethod.Post, Route.AnyPath, callbackFunction);
```

## Ignore case route matching

Standardmäßig ist das Matching von Routen und Anfragen case‑sensitive. Um die Groß‑/Kleinschreibung zu ignorieren, aktivieren Sie diese Option:

```cs
mainRouter.MatchRoutesIgnoreCase = true;
```

Damit wird ebenfalls die Option `RegexOptions.IgnoreCase` für Routen aktiviert, bei denen Regex‑Matching verwendet wird.

## Not Found (404) callback handler

Sie können einen benutzerdefinierten Callback erstellen, der ausgeführt wird, wenn eine Anfrage zu keiner bekannten Route passt.

```cs
mainRouter.NotFoundErrorHandler = () =>
{
    return new HttpResponse(404)
    {
        // Seit v0.14
        Content = new HtmlContent("<h1>Not found</h1>")
        // ältere Versionen
        Content = new StringContent("<h1>Not found</h1>", Encoding.UTF8, "text/html")
    };
};
```

## Method not allowed (405) callback handler

Sie können ebenfalls einen benutzerdefinierten Callback erstellen, der ausgeführt wird, wenn eine Anfrage zwar zum Pfad, aber nicht zur Methode passt.

```cs
mainRouter.MethodNotAllowedErrorHandler = (context) =>
{
    return new HttpResponse(405)
    {
        Content = new StringContent($"Method not allowed for this route.")
    };
};
```

## Error Handling

Ausnahmen können innerhalb des Anfrage‑Lebenszyklus geworfen werden, der vom Pre‑Execution‑Request‑Handler über die Router‑Aktion bis zu den Post‑Execution‑Request‑Handlern und Value‑Handlern reicht. Diese Ausnahmen werden durch den folgenden Mechanismus verwaltet:

- Wenn [HttpServerConfiguration.ThrowExceptions](/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions) `true` ist, werden Ausnahmen normal geworfen und nicht von Sisk abgefangen; der HTTP‑Server kann bei nicht abgefangener Ausnahme unterbrochen werden.
- Wenn [HttpServerConfiguration.ThrowExceptions](/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions) `false` ist, werden Ausnahmen von Sisk abgefangen und verarbeitet. Danach, falls `Router.CallbackErrorHandler` definiert ist, wird er mit der abgefangenen Ausnahme und dem Anfrage‑Kontext aufgerufen und **nicht** an die Standard‑Fehlerausgabe weitergeleitet. Ist `Router.CallbackErrorHandler` nicht definiert, wird die Ausnahme an die Standard‑Fehlerausgabe weitergeleitet und der Client erhält eine HTTP‑500‑Fehlerantwort. Ist die Standard‑Fehlerausgabe nicht definiert, wird der Fehler stillschweigend ignoriert.

Hinweis: Innerhalb von `Router.CallbackErrorHandler` können Sie den Log‑Modus für Fehler, Zugriffs‑Log, beides oder keins festlegen und das Standard‑Log‑Schreibverhalten ändern:

```csharp
router.CallbackErrorHandler = (ex, ctx) =>
{
    ctx.LogMode = LogOutput.Both; // überschreibt den Logmodus, um den Fehler sowohl im Zugriffs- als auch im Fehlerprotokoll zu protokollieren
}
```

## Internal error handler

Route‑Callbacks können während der Serverausführung Fehler werfen. Wird dies nicht korrekt behandelt, kann die Gesamtfunktion des HTTP‑Servers beendet werden. Der Router verfügt über einen Callback für den Fall, dass ein Route‑Callback fehlschlägt und einen Service‑Abbruch verhindert.

Diese Methode ist nur erreichbar, wenn [ThrowExceptions](/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions) auf `false` gesetzt ist.

```cs
mainRouter.CallbackErrorHandler = (ex, context) =>
{
    return new HttpResponse(500)
    {
        Content = new StringContent($"Error: {ex.Message}")
    };
};
```