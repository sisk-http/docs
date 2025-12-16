# Внедрение зависимостей

Обычно посвящают члены и экземпляры, которые существуют в течение времени жизни запроса, такие как соединение с базой данных, аутентифицированный пользователь или токен сеанса. Одним из возможностей является использование [HttpContext.RequestBag](/api/Sisk.Core.Http.HttpContext), который создает словарь, существующий в течение всего времени жизни запроса.

Этот словарь может быть доступен [обработчиками запросов](/docs/ru/fundamentals/request-handlers) и определять переменные на протяжении всего запроса. Например, обработчик запроса, который аутентифицирует пользователя, устанавливает этого пользователя в `HttpContext.RequestBag`, и в логике запроса этот пользователь может быть получен с `HttpContext.RequestBag.Get<User>()`.

Объекты, определенные в этом словаре, имеют область видимости запроса. Они удаляются в конце запроса. Не обязательно отправка ответа определяет конец времени жизни запроса. Когда [обработчики запросов](/docs/ru/fundamentals/request-handlers), которые выполняются после отправки ответа, выполняются, объекты `RequestBag`仍 существуют и не были удалены.

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
``

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
        Content = new StringContent($"Hello {authenticatedUser.Name}!")
    };
}
``

Это предварительный пример этой операции. Экземпляр `User` был создан в обработчике запроса, посвященном аутентификации, и все маршруты, которые используют этот обработчик запроса, будут иметь гарантию, что в их экземпляре `HttpContext.RequestBag` будет `User`.

Возможно определить логику для получения экземпляров, когда они не были предварительно определены в `RequestBag`, через методы, такие как [GetOrAdd](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAdd) или [GetOrAddAsync](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAddAsync).

С версии 1.3 был введен статический свойство [HttpContext.Current](/api/Sisk.Core.Http.HttpContext.Current), которое позволяет получить доступ к текущему контексту запроса. Это позволяет экспонировать члены `HttpContext` вне текущего запроса и определять экземпляры в объектах маршрутов.

В примере ниже определяется контроллер, который имеет члены, часто доступные контекстом запроса.

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
    // Получить существующий или создать новый экземпляр базы данных для этого запроса
    protected DbContext Database => HttpContext.Current.RequestBag.GetOrAdd(() => new DbContext());

    // Ленивая загрузка репозиториев также распространена
    protected IUserRepository Users => HttpContext.Current.RequestBag.GetOrAdd(() => new UserRepository(Database));
    protected IBlogRepository Blogs => HttpContext.Current.RequestBag.GetOrAdd(() => new BlogRepository(Database));
    protected IBlogPostRepository BlogPosts => HttpContext.Current.RequestBag.GetOrAdd(() => new BlogPostRepository(Database));

    // следующая строка выдаст исключение, если свойство доступно, когда пользователь не
    // определен в пакете запроса
    protected User AuthenticatedUser => => HttpContext.Current.RequestBag.Get<User>();

    // Экспонирование экземпляра HttpRequest также поддерживается
    protected HttpRequest Request => HttpContext.Current.Request
}
``

И определяют типы, которые наследуются от контроллера:

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
``

Для примера выше вам необходимо настроить [обработчик значения](/docs/ru/fundamentals/responses.html#implicit-response-types) в вашем маршрутизаторе, чтобы объекты, возвращаемые маршрутизатором, были преобразованы в допустимый [HttpResponse](/api/Sisk.Core.Http.HttpResponse).

Обратите внимание, что методы не имеют аргумента `HttpRequest request`, как это присутствует в других методах. Это потому, что, начиная с версии 1.3, маршрутизатор поддерживает два типа делегатов для маршрутизации ответов: [RouteAction](/api/Sisk.Core.Routing.RouteAction), который является делегатом по умолчанию, получающим аргумент `HttpRequest`, и [ParameterlessRouteAction](/api/Sisk.Core.Routing.ParameterlessRouteAction). Объект `HttpRequest` все равно может быть доступен обоими делегатами через свойство [Request](/api/Sisk.Core.Http.HttpContext.Request) статического `HttpContext` на потоке.

В примере выше мы определили удаляемый объект, `DbContext`, и нам необходимо обеспечить, чтобы все экземпляры, созданные в `DbContext`, были удалены, когда HTTP-сессия заканчивается. Для этого мы можем использовать два способа достижения этого. Один из них - создать [обработчик запроса](/docs/ru/fundamentals/request-handlers), который выполняется после действия маршрутизатора, а другой способ - через пользовательский [обработчик сервера](/docs/ru/advanced/http-server-handlers).

Для первого метода мы можем создать обработчик запроса trực в методе [OnSetup](/api/Sisk.Core.Routing.RouterModule.OnSetup), унаследованном от `RouterModule`:

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
                // получить один экземпляр DbContext, определенный в контексте обработчика запроса, и
                // удалить его
                ctx.RequestBag.GetOrDefault<DbContext>()?.Dispose();
                return null;
            },
            executionMode: RequestHandlerExecutionMode.AfterResponse));
    }
}
``

> [!TIP]
>
> Начиная с версии Sisk 1.4, свойство [HttpServerConfiguration.DisposeDisposableContextValues](/api/Sisk.Core.Http.HttpServerConfiguration.DisposeDisposableContextValues) было введено и включено по умолчанию, которое определяет, должен ли HTTP-сервер удалять все `IDisposable`-значения в контекстном пакете, когда HTTP-сессия закрывается.

Метод выше обеспечит удаление `DbContext`, когда HTTP-сессия будет завершена. Вы можете сделать это для других членов, которые необходимо удалить в конце ответа.

Для второго метода вы можете создать пользовательский [обработчик сервера](/docs/ru/advanced/http-server-handlers), который будет удалять `DbContext`, когда HTTP-сессия будет завершена.

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
``

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
``

Это один из способов обработки очистки кода и сохранения зависимостей запроса, разделенных по типу модуля, который будет использоваться, уменьшая количество дублирующего кода внутри каждого действия маршрутизатора. Это похоже на то, для чего используется внедрение зависимостей в фреймворках, таких как ASP.NET.