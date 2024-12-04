# Обработчики HTTP-сервера

В версии 0.16 Sisk был представлен класс `HttpServerHandler`, который призван расширить общие возможности Sisk и предоставить дополнительные обработчики событий Sisk, такие как обработка HTTP-запросов, маршрутизаторов, контекстных мешков и многое другое.

Класс концентрирует события, которые происходят в течение жизненного цикла всего HTTP-сервера и отдельного запроса. Протокол HTTP не имеет сессий, и поэтому невозможно сохранять информацию из одного запроса в другой. Sisk на данный момент предоставляет способ для вас реализовать сессии, контексты, подключения к базе данных и другие полезные провайдеры, чтобы помочь в вашей работе.

Для того чтобы узнать, где вызывается каждое событие и для чего оно предназначено, обратитесь к этой странице (/api/Sisk.Core.Http.Handlers.HttpServerHandler). Вы также можете просмотреть жизненный цикл HTTP-запроса (/v1/advanced/request-lifecycle), чтобы понять, что происходит с запросом и где вызываются события. HTTP-сервер позволяет использовать несколько обработчиков одновременно. Каждый вызов события синхронный, то есть он заблокирует текущий поток для каждого запроса или контекста до тех пор, пока не будут выполнены и завершены все обработчики, связанные с этой функцией.

В отличие от RequestHandlers, их нельзя применять к определенным группам маршрутов или конкретным маршрутам. Вместо этого они применяются ко всему HTTP-серверу. Вы можете применять условия в своем Http Server Handler. Кроме того, для каждого приложения Sisk определяются сингletons каждого HttpServerHandler, поэтому для каждого `HttpServerHandler` определяется только один экземпляр.

Практический пример использования HttpServerHandler - автоматическое освобождение подключения к базе данных в конце запроса.

```cs
// DatabaseConnectionHandler.cs

public class DatabaseConnectionHandler : HttpServerHandler
{
    public override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        var requestBag = result.Request.Context.RequestBag;

        // проверяет, определен ли в запросе DbContext
        if (requestBag.IsSet<DbContext>())
        {
            var db = requestBag.Get<DbContext>();
            db.Dispose();
        }
    }
}

public static class DatabaseConnectionHandlerExtensions
{
    // позволяет пользователю создать DbContext из HTTP-запроса
    // и сохранить его в его контекстном мешке
    public static DbContext GetDbContext(this HttpRequest request)
    {
        var db = new DbContext();
        return request.SetContextBag<DbContext>(db);
    }
}
```

С приведенным выше кодом расширение `GetDbContext` позволяет создавать контекст подключения непосредственно из объекта HttpRequest. Необработанное подключение может вызвать проблемы при работе с базой данных, поэтому оно завершается в `OnHttpRequestClose`.

Вы можете зарегистрировать обработчик на HTTP-сервере в своем билдере или непосредственно с помощью [HttpServer.RegisterHandler](/api/Sisk.Core.Http.HttpServer.RegisterHandler).

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

С этим `UsersController` может использовать контекст базы данных следующим образом:

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

        return JsonMessage("User added.");
    }
}
```

Код выше использует методы `JsonOk` и `JsonMessage`, которые встроены в `ApiController`, который наследуется от `RouterController`:

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

Разработчики могут реализовать сессии, контексты и подключения к базе данных с помощью этого класса. Предоставленный код демонстрирует практический пример с DatabaseConnectionHandler, автоматизируя освобождение подключения к базе данных в конце каждого запроса.

Интеграция проста, обработчики регистрируются во время настройки сервера. Класс HttpServerHandler предоставляет мощный набор инструментов для управления ресурсами и расширения поведения Sisk в HTTP-приложениях.
