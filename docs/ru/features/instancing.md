# Создание экземпляров на запрос

Часто используются члены и экземпляры, которые существуют в течение всей жизни запроса, например, соединение с базой данных, аутентифицированный пользователь или токен сеанса.

Одним из способов этого является использование [HttpContext.RequestBag](/api/Sisk.Core.Http.HttpContext), которое создает словарь, существующий в течение всей жизни запроса.

Этот словарь можно получить с помощью [обработчиков запросов](/docs/fundamentals/request-handlers) и определить переменные в течение всего запроса. Например, обработчик запроса, аутентифицирующий пользователя, устанавливает этого пользователя в `HttpContext.RequestBag`, и в логике запроса этот пользователь можно получить с помощью `HttpContext.RequestBag.Get<User>()`.

Вот пример:

```csharp
public class AuthenticateUser : IRequestHandler
{
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;
    
    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        User authenticatedUser = AuthenticateUser(request);
        context.RequestBag.Set(authenticatedUser);
        return null; // перейти к следующему обработчику запроса или логике запроса
    }
}

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

Это предварительный пример этой операции. Экземпляр `User` был создан в обработчике запроса, предназначенном для аутентификации, и все маршруты, использующие этот обработчик запроса, будут иметь гарантию, что в их экземпляре `HttpContext.RequestBag` будет `User`.

Можно определить логику для получения экземпляров, если они не были ранее определены в `RequestBag`, с помощью методов, таких как [GetOrAdd](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAdd) или [GetOrAddAsync](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAddAsync).

С версии 1.3 была введена статическая свойство [HttpContext.Current](/api/Sisk.Core.Http.HttpContext.Current), позволяющая получить доступ к выполняющемуся в данный момент `HttpContext` контекста запроса. Это позволяет экспортировать члены `HttpContext` за пределами текущего запроса и определять экземпляры в объектах маршрутов.

Ниже приведен пример, в котором определяется контроллер, имеющий члены, которые часто используются в контексте запроса.

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

    // следующий ряд будет выбрасывать ошибку, если свойство будет обращаться к нему, когда пользователь не определен в запросе
    public User AuthenticatedUser { get => HttpContext.Current.RequestBag.Get<User>(); }

    // Экспортирование экземпляра HttpRequest также поддерживается
    public HttpRequest Request { get => HttpContext.Current.Request; }
}
```

И определение типов, наследующих от контроллера:

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

Для примера выше вам потребуется настроить [обработчик значений](/docs/fundamentals/responses.html#implicit-response-types) в маршрутизаторе, чтобы объекты, возвращаемые маршрутизатором, преобразовывались в допустимый [HttpResponse](/api/Sisk.Core.Http.HttpResponse).

Обратите внимание, что методы не имеют аргумента `HttpRequest request`, как в других методах. Это связано с тем, что с версии 1.3 маршрутизатор поддерживает два типа делегатов для маршрутизации ответов: [RouteAction](/api/Sisk.Core.Routing.RouteAction), который является по умолчанию делегатом, который получает аргумент `HttpRequest`, и [ParameterlessRouteAction](/api/Sisk.Core.Routing.ParameterlessRouteAction). Экземпляр `HttpRequest` все еще можно получить с помощью обоих делегатов через свойство `Request` статического `HttpContext` на потоке.

В примере выше мы определили объект, который можно утилизировать, `DbContext`, и нам нужно убедиться, что все экземпляры, созданные в `DbContext`, будут утилизированы при завершении HTTP-сессии. Для этого мы можем использовать два способа. Первый - создать [обработчик запроса](/docs/fundamentals/request-handlers), который выполняется после действия маршрутизатора, а второй - использовать пользовательский [обработчик сервера](/docs/advanced/http-server-handlers).

Для первого метода мы можем создать обработчик запроса inline непосредственно в методе [OnSetup](/api/Sisk.Core.Routing.RouterModule.OnSetup), унаследованном от `RouterModule`:

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
                // получить один DbContext, определенный в контексте обработчика запроса, и утилизировать его
                ctx.RequestBag.GetOrDefault<DbContext>()?.Dispose();
                return null;
            },
            executionMode: RequestHandlerExecutionMode.AfterResponse));
    }
}
```

Метод выше обеспечит утилизацию `DbContext` при завершении HTTP-сессии. Вы можете сделать это для более членов, которые должны быть утилизированы в конце ответа.

Для второго метода вы можете создать пользовательский [обработчик сервера](/docs/advanced/http-server-handlers), который утилизирует `DbContext` при завершении HTTP-сессии.

```csharp
public class ObjectDisposerHandler : HttpServerHandler
{
    protected override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        result.Context.RequestBag.GetOrDefault<DbContext>()?.Dispose();
    }
}
```

И использовать его в вашем билдере:

```csharp
using var host = HttpServer.CreateBuilder()
    .UseHandler<ObjectDisposerHandler>()
    .Build();
```

Это способ обработки очистки кода и разделения зависимостей запроса по типу модуля, который будет использоваться, что сокращает количество дублируемого кода в каждом действии маршрутизатора. Это практика, похожая на то, что используется в зависимостном впрыскивании в фреймворках, таких как ASP.NET.
