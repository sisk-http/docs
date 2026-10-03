# Abhängigkeitsinjektion

Source: https://docs.sisk-framework.org/de/docs/features/instancing.html

Es ist üblich, Mitglieder und Instanzen zu widmen, die für die gesamte Lebensdauer eines Anfrages bestehen bleiben, wie z.B. eine Datenbankverbindung, ein authentifizierter Benutzer oder ein Sitzungstoken. Eine der Möglichkeiten ist durch den [HttpContext.RequestBag](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.md), der ein Dictionary erstellt, das für die gesamte Lebensdauer eines Anfrages besteht.

Dieses Dictionary kann von [Anfragebehandlern](https://docs.sisk-framework.org/de/docs/fundamentals/request-handlers.md) zugreift werden und definiert Variablen während dieser Anfrage. Zum Beispiel setzt ein Anfragebehandler, der einen Benutzer authentifiziert, diesen Benutzer im `HttpContext.RequestBag` und innerhalb der Anfrage-Logik kann dieser Benutzer mit `HttpContext.RequestBag.Get<User>()` abgerufen werden.

Die im Dictionary definierten Objekte sind auf den Anfrage-Lebenszyklus beschränkt. Sie werden am Ende der Anfrage entsorgt. Das Senden einer Antwort definiert nicht unbedingt das Ende des Anfrage-Lebenszyklus. Wenn [Anfragebehandler](https://docs.sisk-framework.org/de/docs/fundamentals/request-handlers.md), die nach dem Senden einer Antwort ausgeführt werden, die `RequestBag`-Objekte noch existieren und noch nicht entsorgt wurden.

Hier ist ein Beispiel:

```csharp {title="RequestHandlers/AuthenticateUser.cs"}
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

```csharp {title="Controllers/HelloController.cs"}
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

Es ist möglich, Logik zu definieren, um Instanzen zu erhalten, wenn sie nicht zuvor im `RequestBag` definiert wurden, durch Methoden wie [GetOrAdd](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAdd.md) oder [GetOrAddAsync](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAddAsync.md).

Seit Version 1.3 wurde die statische Eigenschaft [HttpContext.Current](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.Current.md) eingeführt, die den Zugriff auf den aktuellen `HttpContext` des Anfragekontexts ermöglicht. Dies ermöglicht es, Mitglieder des `HttpContext` außerhalb der aktuellen Anfrage zu exponieren und Instanzen in Route-Objekten zu definieren.

Das folgende Beispiel definiert einen Controller, der Mitglieder enthält, die häufig vom Kontext einer Anfrage zugreift werden.

```csharp {title="Controllers/Controller.cs"}
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

```csharp {title="Controllers/PostsController.cs"}
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

Für das obige Beispiel müssen Sie einen [Wert-Handler](https://docs.sisk-framework.org/de/docs/fundamentals/responses.md#implicit-response-types) in Ihrem Router konfigurieren, damit die Objekte, die vom Router zurückgegeben werden, in eine gültige [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) umgewandelt werden.

Beachten Sie, dass die Methoden kein `HttpRequest request`-Argument haben, wie es in anderen Methoden der Fall ist. Dies liegt daran, dass der Router seit Version 1.3 zwei Arten von Delegaten für Routing-Antworten unterstützt: [RouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAction.md), der standardmäßige Delegate, der ein `HttpRequest`-Argument erhält, und [ParameterlessRouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.ParameterlessRouteAction.md). Das `HttpRequest`-Objekt kann immer noch durch beide Delegaten über die [Request](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.Request.md)-Eigenschaft des statischen `HttpContext` auf dem Thread zugegriffen werden.

Im obigen Beispiel haben wir ein entsorgbares Objekt, die `DbContext`, definiert, und wir müssen sicherstellen, dass alle im `DbContext` erstellten Instanzen entsorgt werden, wenn die HTTP-Sitzung endet. Dazu können wir zwei Methoden verwenden. Eine Möglichkeit besteht darin, einen [Anfragebehandler](https://docs.sisk-framework.org/de/docs/fundamentals/request-handlers.md) zu erstellen, der nach der Aktion des Routers ausgeführt wird, und die andere Möglichkeit besteht darin, einen benutzerdefinierten [Server-Handler](https://docs.sisk-framework.org/de/docs/advanced/http-server-handlers.md) zu verwenden.

Für die erste Methode können wir den Anfragebehandler inline direkt im [OnSetup](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.OnSetup.md)-Methoden erben von `RouterModule` erstellen:

```csharp {title="Controllers/PostsController.cs"}
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
> Seit Sisk-Version 1.4 ist die Eigenschaft [HttpServerConfiguration.DisposeDisposableContextValues](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.DisposeDisposableContextValues.md) eingeführt und standardmäßig aktiviert, die definiert, ob der HTTP-Server alle `IDisposable`-Werte im Kontext-Beutel entsorgen soll, wenn eine HTTP-Sitzung geschlossen wird.

Die obige Methode stellt sicher, dass die `DbContext` entsorgt wird, wenn die HTTP-Sitzung abgeschlossen ist. Sie können dies für weitere Mitglieder tun, die am Ende einer Antwort entsorgt werden müssen.

Für die zweite Methode können Sie einen benutzerdefinierten [Server-Handler](https://docs.sisk-framework.org/de/docs/advanced/http-server-handlers.md) erstellen, der die `DbContext` entsorgt, wenn die HTTP-Sitzung abgeschlossen ist.

```csharp {title="Server/Handlers/ObjectDisposerHandler.cs"}
public class ObjectDisposerHandler : HttpServerHandler
{
    protected override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        result.Context.RequestBag.GetOrDefault<DbContext>()?.Dispose();
    }
}
```

Und verwenden Sie es in Ihrem App-Builder:

```csharp {title="Program.cs"}
using var host = HttpServer.CreateBuilder()
    .UseHandler<ObjectDisposerHandler>()
    .Build();
```

Dies ist eine Möglichkeit, Code-Reinigung zu handhaben und die Abhängigkeiten einer Anfrage getrennt von der Art des Moduls zu halten, das verwendet wird, um die Menge an dupliziertem Code innerhalb jeder Aktion eines Routers zu reduzieren. Es ist eine Praxis, die ähnlich ist wie die, die bei der Abhängigkeitsinjektion in Frameworks wie ASP.NET verwendet wird.
