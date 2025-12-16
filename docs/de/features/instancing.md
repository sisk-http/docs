# Abhängigkeitsinjektion

Es ist üblich, Mitglieder und Instanzen zu widmen, die für die gesamte Lebensdauer eines Anfrages bestehen bleiben, wie z.B. eine Datenbankverbindung, ein authentifizierter Benutzer oder ein Sitzungstoken. Eine der Möglichkeiten ist durch den [HttpContext.RequestBag](/api/Sisk.Core.Http.HttpContext), der ein Dictionary erstellt, das für die gesamte Lebensdauer eines Anfrages besteht.

Dieses Dictionary kann von [Anfragebehandlern](/docs/de/fundamentals/request-handlers) zugreift werden und definiert Variablen während dieser Anfrage. Zum Beispiel setzt ein Anfragebehandler, der einen Benutzer authentifiziert, diesen Benutzer im `HttpContext.RequestBag` und innerhalb der Anfrage-Logik kann dieser Benutzer mit `HttpContext.RequestBag.Get<User>()` abgerufen werden.

Die im Dictionary definierten Objekte sind auf den Anfrage-Lebenszyklus beschränkt. Sie werden am Ende der Anfrage entsorgt. Das Senden einer Antwort definiert nicht unbedingt das Ende des Anfrage-Lebenszyklus. Wenn [Anfragebehandler](/docs/de/fundamentals/request-handlers), die nach dem Senden einer Antwort ausgeführt werden, die `RequestBag`-Objekte noch existieren und noch nicht entsorgt wurden.

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
public HttpResponse SayHello(HttpRequest request)
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

Seit Version 1.3 wurde die statische Eigenschaft [HttpContext.Current](/api/Sisk.Core.Http.HttpContext.Current) eingeführt, die den Zugriff auf den aktuellen `HttpContext` des Anfragekontexts ermöglicht. Dies ermöglicht es, Mitglieder des `HttpContext` außerhalb der aktuellen Anfrage zu exponieren und Instanzen in Route-Objekten zu definieren.

Das folgende Beispiel definiert einen Controller, der Mitglieder enthält, die häufig vom Kontext einer Anfrage zugreift werden.

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
    // Erhalten Sie die bestehende oder erstellen Sie eine neue Datenbankinstanz für diese Anfrage
    protected DbContext Database => HttpContext.Current.RequestBag.GetOrAdd(() => new DbContext());

    // Lazy-Loading von Repositories ist auch üblich
    protected IUserRepository Users => HttpContext.Current.RequestBag.GetOrAdd(() => new UserRepository(Database));
    protected IBlogRepository Blogs => HttpContext.Current.RequestBag.GetOrAdd(() => new BlogRepository(Database));
    protected IBlogPostRepository BlogPosts => HttpContext.Current.RequestBag.GetOrAdd(() => new BlogPostRepository(Database));

    // Die folgende Zeile wird einen Fehler werfen, wenn die Eigenschaft aufgerufen wird, wenn der Benutzer nicht
    // im RequestBag definiert ist
    protected User AuthenticatedUser => => HttpContext.Current.RequestBag.Get<User>();

    // Exponieren des HttpRequest-Objekts wird auch unterstützt
    protected HttpRequest Request => HttpContext.Current.Request
}
```

Und definieren Sie Typen, die von dem Controller erben:

<div class="script-header">
    <span>
        Controllers/PostsController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RoutePrefix("/api/posts/{author}")]
sealed class PostsController : Controller
{
    protected Guid AuthorId => Request.RouteParameters["author"].GetInteger();

    [RouteGet]
    public IAsyncEnumerable<BlogPost> ListPosts()
    {
        return BlogPosts.GetPostsAsync(authorId: AuthorId);
    }

    [RouteGet("<id>")]
    public async Task<BlogPost?> GetPost()
    {
        int postId = Request.RouteParameters["id"].GetInteger();

        Post? post = await BlogPosts
            .FindPostAsync(post => post.Id == postId && post.AuthorId == AuthorId);

        return post;
    }
}
```

Für das obige Beispiel müssen Sie einen [Wert-Handler](/docs/de/fundamentals/responses.html#implicit-response-types) in Ihrem Router konfigurieren, damit die Objekte, die vom Router zurückgegeben werden, in eine gültige [HttpResponse](/api/Sisk.Core.Http.HttpResponse) umgewandelt werden.

Beachten Sie, dass die Methoden kein `HttpRequest request`-Argument haben, wie es in anderen Methoden der Fall ist. Dies liegt daran, dass der Router seit Version 1.3 zwei Arten von Delegaten für Routing-Antworten unterstützt: [RouteAction](/api/Sisk.Core.Routing.RouteAction), der standardmäßige Delegate, der ein `HttpRequest`-Argument erhält, und [ParameterlessRouteAction](/api/Sisk.Core.Routing.ParameterlessRouteAction). Das `HttpRequest`-Objekt kann immer noch durch beide Delegaten über die [Request](/api/Sisk.Core.Http.HttpContext.Request)-Eigenschaft des statischen `HttpContext` auf dem Thread zugegriffen werden.

Im obigen Beispiel haben wir ein entsorgbares Objekt, die `DbContext`, definiert, und wir müssen sicherstellen, dass alle im `DbContext` erstellten Instanzen entsorgt werden, wenn die HTTP-Sitzung endet. Dazu können wir zwei Methoden verwenden. Eine Möglichkeit besteht darin, einen [Anfragebehandler](/docs/de/fundamentals/request-handlers) zu erstellen, der nach der Aktion des Routers ausgeführt wird, und die andere Möglichkeit besteht darin, einen benutzerdefinierten [Server-Handler](/docs/de/advanced/http-server-handlers) zu verwenden.

Für die erste Methode können wir den Anfragebehandler inline direkt im [OnSetup](/api/Sisk.Core.Routing.RouterModule.OnSetup)-Methoden erben von `RouterModule` erstellen:

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
    ...

    protected override void OnSetup(Router parentRouter)
    {
        base.OnSetup(parentRouter);

        HasRequestHandler(RequestHandler.Create(
            execute: (req, ctx) =>
            {
                // Erhalten Sie eine im Anfragebehandler-Kontext definierte DbContext und
                // entsorgen Sie sie
                ctx.RequestBag.GetOrDefault<DbContext>()?.Dispose();
                return null;
            },
            executionMode: RequestHandlerExecutionMode.AfterResponse));
    }
}
```

> [!TIP]
>
> Seit Sisk-Version 1.4 ist die Eigenschaft [HttpServerConfiguration.DisposeDisposableContextValues](/api/Sisk.Core.Http.HttpServerConfiguration.DisposeDisposableContextValues) eingeführt und standardmäßig aktiviert, die definiert, ob der HTTP-Server alle `IDisposable`-Werte im Kontext-Beutel entsorgen soll, wenn eine HTTP-Sitzung geschlossen wird.

Die obige Methode stellt sicher, dass die `DbContext` entsorgt wird, wenn die HTTP-Sitzung abgeschlossen ist. Sie können dies für weitere Mitglieder tun, die am Ende einer Antwort entsorgt werden müssen.

Für die zweite Methode können Sie einen benutzerdefinierten [Server-Handler](/docs/de/advanced/http-server-handlers) erstellen, der die `DbContext` entsorgt, wenn die HTTP-Sitzung abgeschlossen ist.

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

Und verwenden Sie es in Ihrem App-Builder:

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

Dies ist eine Möglichkeit, Code-Reinigung zu handhaben und die Abhängigkeiten einer Anfrage getrennt von der Art des Moduls zu halten, das verwendet wird, um die Menge an dupliziertem Code innerhalb jeder Aktion eines Routers zu reduzieren. Es ist eine Praxis, die ähnlich ist wie die, die bei der Abhängigkeitsinjektion in Frameworks wie ASP.NET verwendet wird.