# Abhängigkeitsinjektion

Es ist üblich, Mitglieder und Instanzen zu widmen, die für die gesamte Lebensdauer eines Anfrages gültig sind, wie z.B. eine Datenbankverbindung, einen authentifizierten Benutzer oder ein Sitzungstoken. Eine der Möglichkeiten besteht darin, den [HttpContext.RequestBag](/api/Sisk.Core.Http.HttpContext) zu verwenden, der ein Dictionary erstellt, das für die gesamte Lebensdauer eines Anfrages gültig ist.

Dieses Dictionary kann von [Anfragebehandlern](/docs/fundamentals/request-handlers) zugreifen und Variablen während der gesamten Anfrage definieren. Zum Beispiel kann ein Anfragebehandler, der einen Benutzer authentifiziert, diesen Benutzer im `HttpContext.RequestBag` setzen, und innerhalb der Anfrage-Logik kann dieser Benutzer mit `HttpContext.RequestBag.Get<User>()` abgerufen werden.

Hier ist ein Beispiel:

<div class="script-header">
    <span>
        RequestHandlers/AuthenticateUser.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public class AuthenticateUser : IRequestHandler
{
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;
    
    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        User authenticatedUser = AuthenticateUser(request);
        context.RequestBag.Set(authenticatedUser);
        return null; // advance to the next request handler or request logic
    }
}
```

<div class="script-header">
    <span>
        Controllers/HelloController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RouteGet("/hello")]
[RequestHandler<AuthenticateUser>]
public static HttpResponse SayHello(HttpRequest request)
{
    var authenticatedUser = request.Bag.Get<User>();
    return new HttpResponse()
    {
        Content = new StringContent($"Hallo {authenticatedUser.Name}!")
    };
}
```

Dies ist ein vorläufiges Beispiel für diese Operation. Die Instanz von `User` wurde innerhalb des Anfragebehandlers für die Authentifizierung erstellt, und alle Routen, die diesen Anfragebehandler verwenden, haben die Garantie, dass es eine `User`-Instanz in ihrem `HttpContext.RequestBag` gibt.

Es ist möglich, Logik zu definieren, um Instanzen zu erhalten, wenn sie nicht zuvor im `RequestBag` definiert wurden, durch Methoden wie [GetOrAdd](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAdd) oder [GetOrAddAsync](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAddAsync).

Seit Version 1.3 wurde die statische Eigenschaft [HttpContext.Current](/api/Sisk.Core.Http.HttpContext.Current) eingeführt, die den Zugriff auf den aktuellen `HttpContext` des Anfragekontexts ermöglicht. Dies ermöglicht es, Mitglieder des `HttpContext` außerhalb der aktuellen Anfrage zu exponieren und Instanzen in Routen-Objekten zu definieren.

Das folgende Beispiel definiert einen Controller, der Mitglieder enthält, die häufig im Kontext einer Anfrage zugegriffen werden.

<div class="script-header">
    <span>
        Controllers/Controller.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public abstract class Controller : RouterModule
{
    public DbContext Database
    {
        get
        {
            // erstelle einen DbContext oder hole den bestehenden
            return HttpContext.Current.RequestBag.GetOrAdd(() => new DbContext());
        }
    }

    // die folgende Zeile wird einen Fehler werfen, wenn die Eigenschaft zugegriffen wird, wenn der Benutzer nicht
    // im RequestBag definiert ist
    public User AuthentifizierterBenutzer { get => HttpContext.Current.RequestBag.Get<User>(); }

    // der Zugriff auf die HttpRequest-Instanz wird auch unterstützt
    public HttpRequest Request { get => HttpContext.Current.Request; }
}
```

Und definiere Typen, die von diesem Controller erben:

<div class="script-header">
    <span>
        Controllers/PostsController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RoutePrefix("/api/posts")]
public class PostsController : Controller
{
    [RouteGet]
    public IEnumerable<Blog> ListPosts()
    {
        return Database.Posts
            .Where(post => post.AuthorId == AuthentifizierterBenutzer.Id)
            .ToList();
    }

    [RouteGet("<id>")]
    public Post GetPost()
    {
        int blogId = Request.RouteParameters["id"].GetInteger();

        Post? post = Database.Posts
            .FirstOrDefault(post => post.Id == blogId && post.AuthorId == AuthentifizierterBenutzer.Id);

        return post ?? new HttpResponse(404);
    }
}
```

Für das obige Beispiel müssen Sie einen [Wert-Handler](/docs/fundamentals/responses.html#implicit-response-types) in Ihrem Router konfigurieren, damit die von Ihrem Router zurückgegebenen Objekte in ein gültiges [HttpResponse](/api/Sisk.Core.Http.HttpResponse) umgewandelt werden.

Beachten Sie, dass die Methoden kein `HttpRequest request`-Argument haben, wie es in anderen Methoden der Fall ist. Dies liegt daran, dass der Router seit Version 1.3 zwei Arten von Delegaten für Routing-Antworten unterstützt: [RouteAction](/api/Sisk.Core.Routing.RouteAction), der standardmäßig ein `HttpRequest`-Argument erhält, und [ParameterlessRouteAction](/api/Sisk.Core.Routing.ParameterlessRouteAction). Das `HttpRequest`-Objekt kann immer noch über die [Request](/api/Sisk.Core.Http.HttpContext.Request)-Eigenschaft des statischen `HttpContext` auf dem Thread zugegriffen werden.

Im obigen Beispiel haben wir ein disposable-Objekt, den `DbContext`, definiert, und wir müssen sicherstellen, dass alle im `DbContext` erstellten Instanzen verworfen werden, wenn die HTTP-Sitzung endet. Dazu können wir zwei Methoden verwenden. Eine Möglichkeit besteht darin, einen [Anfragebehandler](/docs/fundamentals/request-handlers) zu erstellen, der nach der Aktion des Routers ausgeführt wird, und die andere Möglichkeit besteht darin, einen benutzerdefinierten [Server-Handler](/docs/advanced/http-server-handlers) zu verwenden.

Für die erste Methode können wir den Anfragebehandler inline direkt im [OnSetup](/api/Sisk.Core.Routing.RouterModule.OnSetup)-Methoden des `RouterModule` erstellen:

<div class="script-header">
    <span>
        Controllers/PostsController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public abstract class Controller : RouterModule
{
    // ...

    protected override void OnSetup(Router parentRouter)
    {
        base.OnSetup(parentRouter);

        HasRequestHandler(RequestHandler.Create(
            execute: (req, ctx) =>
            {
                // hole einen im Request-Handler-Kontext definierten DbContext und
                // verwerfe ihn
                ctx.RequestBag.GetOrDefault<DbContext>()?.Dispose();
                return null;
            },
            executionMode: RequestHandlerExecutionMode.AfterResponse));
    }
}
```

> [!TIP]
>
> Seit Sisk-Version 1.4 ist die Eigenschaft [HttpServerConfiguration.DisposeDisposableContextValues](/api/Sisk.Core.Http.HttpServerConfiguration.DisposeDisposableContextValues) eingeführt und standardmäßig aktiviert, die bestimmt, ob der HTTP-Server alle `IDisposable`-Werte im Kontext-Beutel verwerfen soll, wenn eine HTTP-Sitzung geschlossen wird.

Die obige Methode stellt sicher, dass der `DbContext` verworfen wird, wenn die HTTP-Sitzung abgeschlossen ist. Sie können dies für weitere Mitglieder tun, die am Ende einer Antwort verworfen werden müssen.

Für die zweite Methode können Sie einen benutzerdefinierten [Server-Handler](/docs/advanced/http-server-handlers) erstellen, der den `DbContext` verwerfen wird, wenn die HTTP-Sitzung abgeschlossen ist.

<div class="script-header">
    <span>
        Server/Handlers/ObjectDisposerHandler.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public class ObjectDisposerHandler : HttpServerHandler
{
    protected override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        result.Context.RequestBag.GetOrDefault<DbContext>()?.Dispose();
    }
}
```

Und verwenden Sie ihn in Ihrem App-Builder:

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
using var host = HttpServer.CreateBuilder()
    .UseHandler<ObjectDisposerHandler>()
    .Build();
```

Dies ist eine Möglichkeit, Code-Reinigung und Abhängigkeitsinjektion zu handhaben und die Abhängigkeiten einer Anfrage getrennt von der Art des Moduls zu halten, das verwendet wird, um die Menge an dupliziertem Code innerhalb jeder Aktion eines Routers zu reduzieren. Es ist eine Praxis, die ähnlich ist wie die, die in Frameworks wie ASP.NET verwendet wird.