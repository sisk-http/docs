# Http server handlers

В версии Sisk 0.16 мы представили класс `HttpServerHandler`, который предназначен для расширения общего поведения Sisk и предоставления дополнительных обработчиков событий, таких как обработка HTTP‑запросов, маршрутизаторов, контекстных мешков и многое другое.

Класс концентрирует события, происходящие в течение жизни всего HTTP‑сервера, а также отдельного запроса. Протокол HTTP не имеет сессий, поэтому невозможно сохранять информацию от одного запроса к другому. Сейчас Sisk предоставляет способ реализовать сессии, контексты, соединения с базой данных и другие полезные провайдеры, помогающие в работе.

Смотрите [эту страницу](/api/Sisk.Core.Http.Handlers.HttpServerHandler), чтобы узнать, где каждый событие вызывается и какова его цель. Вы также можете посмотреть [жизненный цикл HTTP‑запроса](/v1/advanced/request-lifecycle), чтобы понять, что происходит с запросом и где генерируются события. HTTP‑сервер позволяет использовать несколько обработчиков одновременно. Каждый вызов события синхронный, то есть он блокирует текущий поток для каждого запроса или контекста, пока все обработчики, связанные с этой функцией, не будут выполнены и завершены.

В отличие от RequestHandlers, их нельзя применять к отдельным группам маршрутов или конкретным маршрутам. Вместо этого они применяются ко всему HTTP‑серверу. Вы можете задавать условия внутри вашего Http Server Handler. Кроме того, для каждого `HttpServerHandler` в приложении Sisk определяется единственный экземпляр (singleton), то есть существует только один объект `HttpServerHandler`.

Практический пример использования HttpServerHandler — автоматическое освобождение соединения с базой данных в конце запроса.

```cs
// DatabaseConnectionHandler.cs

public class DatabaseConnectionHandler : HttpServerHandler
{
    protected override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        var requestBag = result.Request.Context.RequestBag;

        // проверяет, определён ли в запросе DbContext
        // в его контекстном мешке
        if (requestBag.IsSet<DbContext>())
        {
            var db = requestBag.Get<DbContext>();
            db.Dispose();
        }
    }
}

public static class DatabaseConnectionHandlerExtensions
{
    public static DbContext GetDbContext(this HttpRequest request)
    {
        return request.Bag.GetOrAdd(() => new DbContext());
    }
}
```

С помощью кода выше расширение `GetDbContext` позволяет создать контекст соединения непосредственно из объекта `HttpRequest`. Неосвобождённое соединение может вызвать проблемы при работе с базой данных, поэтому оно закрывается в `OnHttpRequestClose`.

Вы можете зарегистрировать обработчик на HTTP‑сервере в вашем билдере или напрямую через [HttpServer.RegisterHandler](/api/Sisk.Core.Http.HttpServer.RegisterHandler).

```cs
// Program.cs

class Program
{
    static void Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseHandler<DatabaseConnectionHandler>()
            .Build();

        app.Router.MapInstance(new UserController());
        app.Start();
    }
}
```

Таким образом, класс `UsersController` может использовать контекст базы данных следующим образом:

```cs
// UserController.cs

[RoutePrefix("/users")]
public class UserController : ApiController
{
    [RouteGet()]
    public async Task<HttpResponse> List(HttpRequest request)
    {
        var db = request.GetDbContext();
        var users = db.Users.ToArray();

        return JsonOk(users);
    }

    [RouteGet("<id>")]
    public async Task<HttpResponse> View(HttpRequest request)
    {
        var db = request.GetDbContext();

        int userId = request.RouteParameters["id"].GetInteger();
        var user = db.Users.FirstOrDefault(u => u.Id == userId);

        return JsonOk(user);
    }

    [RoutePost]
    public async Task<HttpResponse> Create(HttpRequest request)
    {
        var db = request.GetDbContext();
        var user = await request.GetJsonContentAsync<User>();

        ArgumentNullException.ThrowIfNull(user);

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return JsonMessage("User added.");
    }
}
```

В приведённом коде используются методы `JsonOk` и `JsonMessage`, встроенные в `ApiController`, который наследуется от `RouterController`:

```cs
// ApiController.cs

public class ApiController : RouterModule
{
    public HttpResponse JsonOk(object value)
    {
        return new HttpResponse(200)
            .WithContent(JsonContent.Create(value, null, new JsonSerializerOptions()
            {
                PropertyNameCaseInsensitive = true
            }));
    }

    public HttpResponse JsonMessage(string message, int statusCode = 200)
    {
        return new HttpResponse(statusCode)
            .WithContent(JsonContent.Create(new
            {
                Message = message
            }));
    }
}
```

Разработчики могут реализовывать сессии, контексты и соединения с базой данных, используя этот класс. Приведённый пример демонстрирует практическое применение `DatabaseConnectionHandler`, автоматизирующее освобождение соединения с базой данных в конце каждого запроса.

Интеграция проста: обработчики регистрируются во время настройки сервера. Класс `HttpServerHandler` предоставляет мощный набор инструментов для управления ресурсами и расширения поведения Sisk в HTTP‑приложениях.