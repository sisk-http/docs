# Обработчики HTTP-сервера

В версии Sisk 0.16 мы ввели класс `HttpServerHandler`, целью которого является расширение общего поведения Sisk и предоставление дополнительных обработчиков событий для Sisk, таких как обработка запросов HTTP, маршрутизаторы, контекстные сумки и многое другое.

Этот класс концентрирует события, которые происходят во время существования всего HTTP-сервера и каждого запроса. Протокол HTTP не имеет сессий, и поэтому невозможно сохранить информацию от одного запроса к другому. Sisk в настоящее время предоставляет способ реализации сессий, контекстов, подключений к базе данных и других полезных провайдеров, чтобы помочь вашей работе.

Пожалуйста, обратитесь к [этой странице](/api/Sisk.Core.Http.Handlers.HttpServerHandler), чтобы прочитать, где каждое событие вызывается и какова его цель. Вы также можете просмотреть [жизненный цикл запроса HTTP](/v1/advanced/request-lifecycle), чтобы понять, что происходит с запросом и где вызываются события. HTTP-сервер позволяет использовать несколько обработчиков одновременно. Каждый вызов события является синхронным, то есть он будет блокировать текущую нить для каждого запроса или контекста, пока все обработчики, связанные с этой функцией, не будут выполнены и завершены.

В отличие от RequestHandlers, они не могут быть применены к определенным группам маршрутов или конкретным маршрутам. Вместо этого они применяются к整个 HTTP-серверу. Вы можете применять условия внутри вашего обработчика HTTP-сервера. Кроме того, синглтоны каждого HttpServerHandler определяются для каждого приложения Sisk, поэтому существует только один экземпляр на `HttpServerHandler`.

Практическим примером использования HttpServerHandler является автоматическое освобождение подключения к базе данных в конце запроса.

```cs
// DatabaseConnectionHandler.cs

public class DatabaseConnectionHandler : HttpServerHandler
{
    public override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        var requestBag = result.Request.Context.RequestBag;

        // проверяет, определена ли DbContext в контекстной сумке запроса
        if (requestBag.IsSet<DbContext>())
        {
            var db = requestBag.Get<DbContext>();
            db.Dispose();
        }
    }
}

public static class DatabaseConnectionHandlerExtensions
{
    // позволяет пользователю создать контекст базы данных из запроса HTTP
    // и сохранить его в контекстной сумке
    public static DbContext GetDbContext(this HttpRequest request)
    {
        var db = new DbContext();
        return request.SetContextBag<DbContext>(db);
    }
}
```

С помощью кода выше, расширение `GetDbContext` позволяет создать контекст подключения к базе данных直接 из объекта HttpRequest. Неправильно освобожденное подключение может вызвать проблемы при работе с базой данных, поэтому оно завершается в `OnHttpRequestClose`.

Вы можете зарегистрировать обработчик на HTTP-сервере в вашем построителе или直接 с помощью [HttpServer.RegisterHandler](/api/Sisk.Core.Http.HttpServer.RegisterHandler).

```cs
// Program.cs

class Program
{
    static void Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseHandler<DatabaseConnectionHandler>()
            .Build();

        app.Router.SetObject(new UserController());
        app.Start();
    }
}
```

С помощью этого, класс `UsersController` может использовать контекст базы данных следующим образом:

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

        var userId = request.GetQueryValue<int>("id");
        var user = db.Users.FirstOrDefault(u => u.Id == userId);

        return JsonOk(user);
    }

    [RoutePost]
    public async Task<HttpResponse> Create(HttpRequest request)
    {
        var db = request.GetDbContext();
        var user = JsonSerializer.Deserialize<User>(request.Body);

        ArgumentNullException.ThrowIfNull(user);

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return JsonMessage("Пользователь добавлен.");
    }
}
```

Код выше использует методы, такие как `JsonOk` и `JsonMessage`, которые встроены в `ApiController`, который наследуется от `RouterController`:

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

Разработчики могут реализовать сессии, контексты и подключения к базе данных, используя этот класс. Предоставленный код демонстрирует практический пример с DatabaseConnectionHandler, автоматизирующий освобождение подключения к базе данных в конце каждого запроса.

Интеграция проста, с обработчиками, зарегистрированными во время настройки сервера. Класс HttpServerHandler предлагает мощный набор инструментов для управления ресурсами и расширения поведения Sisk в HTTP-приложениях.