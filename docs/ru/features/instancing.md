# Внедрение зависимостей

Обычно выделяют члены и экземпляры, которые существуют в течение всего времени жизни запроса, такие как соединение с базой данных, аутентифицированный пользователь или токен сессии. Одним из возможностей является использование [HttpContext.RequestBag](/api/Sisk.Core.Http.HttpContext), который создает словарь, существующий в течение всего времени жизни запроса.

Этот словарь можно получить у [обработчиков запросов](/docs/fundamentals/request-handlers) и определить переменные на протяжении всего запроса. Например, обработчик запроса, который аутентифицирует пользователя, устанавливает этого пользователя в `HttpContext.RequestBag`, и в логике запроса этот пользователь можно получить с помощью `HttpContext.RequestBag.Get<User>()`.

Вот пример:

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
        Content = new StringContent($"Hello {authenticatedUser.Name}!")
    };
}
```

Это предварительный пример этой операции. Экземпляр `User` был создан в обработчике запроса, посвященном аутентификации, и все маршруты, которые используют этот обработчик запроса, будут иметь гарантию, что в их экземпляре `HttpContext.RequestBag` будет `User`.

Возможно определить логику получения экземпляров, когда они не были предварительно определены в `RequestBag`, через методы типа [GetOrAdd](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAdd) или [GetOrAddAsync](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAddAsync).

С версии 1.3 был введен статический свойство [HttpContext.Current](/api/Sisk.Core.Http.HttpContext.Current), которое позволяет получить доступ к текущему контексту запроса. Это позволяет экспонировать члены `HttpContext` вне текущего запроса и определять экземпляры в объектах маршрутов.

Пример ниже определяет контроллер, который имеет члены, обычно доступные контекстом запроса.

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
            // создать DbContext или получить существующий
            return HttpContext.Current.RequestBag.GetOrAdd(() => new DbContext());
        }
    }

    // следующая строка выдаст исключение, если свойство доступно, когда User не
    // определен в пакете запроса
    public User AuthenticatedUser { get => HttpContext.Current.RequestBag.Get<User>(); }

    // экспонирование экземпляра HttpRequest также поддерживается
    public HttpRequest Request { get => HttpContext.Current.Request; }
}
```

И определить типы, которые наследуются от контроллера:

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
            .Where(post => post.AuthorId == AuthenticatedUser.Id)
            .ToList();
    }

    [RouteGet("<id>")]
    public Post GetPost()
    {
        int blogId = Request.RouteParameters["id"].GetInteger();

        Post? post = Database.Posts
            .FirstOrDefault(post => post.Id == blogId && post.AuthorId == AuthenticatedUser.Id);

        return post ?? new HttpResponse(404);
    }
}
```

Для примера выше вам необходимо настроить [обработчик значения](/docs/fundamentals/responses.html#implicit-response-types) в вашем маршрутизаторе, чтобы объекты, возвращаемые маршрутизатором, были преобразованы в допустимый [HttpResponse](/api/Sisk.Core.Http.HttpResponse).

Обратите внимание, что методы не имеют аргумента `HttpRequest request`, как это присутствует в других методах. Это связано с тем, что с версии 1.3 маршрутизатор поддерживает два типа делегатов для маршрутизации ответов: [RouteAction](/api/Sisk.Core.Routing.RouteAction), который является делегатом по умолчанию, получающим аргумент `HttpRequest`, и [ParameterlessRouteAction](/api/Sisk.Core.Routing.ParameterlessRouteAction). Экземпляр `HttpRequest` все равно можно получить через свойство [Request](/api/Sisk.Core.Http.HttpContext.Request) статического `HttpContext` в потоке.

В примере выше мы определили объект, подлежащий удалению, `DbContext`, и нам необходимо обеспечить, чтобы все экземпляры, созданные в `DbContext`, были удалены, когда HTTP-сессия завершается. Для этого можно использовать два способа достижения этой цели. Один из них - создать [обработчик запроса](/docs/fundamentals/request-handlers), который выполняется после действия маршрутизатора, а другой способ - через пользовательский [обработчик сервера](/docs/advanced/http-server-handlers).

Для первого метода можно создать обработчик запроса trực в методе [OnSetup](/api/Sisk.Core.Routing.RouterModule.OnSetup), унаследованном от `RouterModule`:

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
                // получить один DbContext, определенный в контексте обработчика запроса и
                // удалить его
                ctx.RequestBag.GetOrDefault<DbContext>()?.Dispose();
                return null;
            },
            executionMode: RequestHandlerExecutionMode.AfterResponse));
    }
}
```

> [!TIP]
>
> С версии Sisk 1.4 свойство [HttpServerConfiguration.DisposeDisposableContextValues](/api/Sisk.Core.Http.HttpServerConfiguration.DisposeDisposableContextValues) было введено и включено по умолчанию, которое определяет, должен ли HTTP-сервер удалять все значения `IDisposable` в пакете контекста, когда HTTP-сессия закрывается.

Метод выше обеспечит удаление `DbContext`, когда HTTP-сессия завершается. Вы можете сделать это для других членов, которые необходимо удалить в конце ответа.

Для второго метода можно создать пользовательский [обработчик сервера](/docs/advanced/http-server-handlers), который будет удалять `DbContext`, когда HTTP-сессия завершается.

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

И использовать его в вашем построителе приложения:

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

Это один из способов обработки очистки кода и поддержания зависимостей запроса, разделенных по типу модуля, который будет использоваться, уменьшая количество дублирующего кода внутри каждого действия маршрутизатора. Это практика, аналогичная тому, для чего используется внедрение зависимостей в фреймворках типа ASP.NET.