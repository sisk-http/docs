# Обработчики сервера HTTP

В Sisk версии 0.16, мы ввели класс `HttpServerHandler`, целью которого является расширение общего поведения Sisk и предоставление дополнительных обработчиков событий для Sisk, таких как обработка HTTP-запросов, маршрутизация, контекстные сумки и многое другое.

Этот класс концентрирует события, которые происходят во время жизненного цикла всего HTTP-сервера и отдельного запроса. Протокол HTTP не имеет сессий, и поэтому невозможно сохранять информацию от одного запроса к другому. Sisk предоставляет на данный момент способ реализации сессий, контекстов, подключений к базе данных и других полезных провайдеров, чтобы помочь в вашей работе.

Пожалуйста, ознакомьтесь с [этой страницей](/api/Sisk.Core.Http.Handlers.HttpServerHandler), чтобы узнать, где срабатывает каждое событие и какова его цель. Также вы можете ознакомиться с [жизненным циклом HTTP-запроса](/v1/advanced/request-lifecycle), чтобы понять, что происходит с запросом и где срабатывают события. HTTP-сервер позволяет использовать несколько обработчиков одновременно. Каждый вызов события является синхронным, то есть блокирует текущий поток для каждого запроса или контекста до тех пор, пока все связанные с ним обработчики не будут выполнены и завершены.

В отличие от обработчиков запросов, их нельзя применять к группам маршрутов или конкретным маршрутам. Вместо этого они применяются ко всему HTTP-серверу. Вы можете применять условия внутри своего обработчика сервера HTTP. Кроме того, определяются синглтоны для каждого `HttpServerHandler` для каждой приложения Sisk, поэтому определяется только одна инстанция для `HttpServerHandler`.

Практический пример использования `HttpServerHandler` — автоматическое удаление подключения к базе данных в конце запроса.

```cs
// DatabaseConnectionHandler.cs

public class DatabaseConnectionHandler : HttpServerHandler
{
    public override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        var requestBag = result.Request.Context.RequestBag;

        // проверяет, определено ли в контексте запроса DbContext
        if (requestBag.IsSet<DbContext>())
        {
            var db = requestBag.Get<DbContext>();
            db.Dispose();
        }
    }
}

public static class DatabaseConnectionHandlerExtensions
{
    // позволяет пользователю создать контекст базы данных из HTTP-запроса
    // и сохранить его в контекстной сумке
    public static DbContext GetDbContext(this HttpRequest request)
    {
        var db = new DbContext();
        return request.SetContextBag<DbContext>(db);
    }
}
```

С помощью приведенного выше кода, расширение `GetDbContext` позволяет создать контекст подключения直接 из объекта `HttpRequest`. Неразорванное подключение может вызвать проблемы при работе с базой данных, поэтому оно завершается в `OnHttpRequestClose`.

Вы можете зарегистрировать обработчик в HTTP-сервере в его конструкторе или直接 с помощью [HttpServer.RegisterHandler](/api/Sisk.Core.Http.HttpServer.RegisterHandler).

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

С этим, класс `UsersController` может использовать контекст базы данных следующим образом:

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

Приведенный выше код использует методы, такие как `JsonOk` и `JsonMessage`, которые интегрированы в `ApiController`, который наследует от `RouterController`:

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

Разработчики могут реализовать сессии, контексты и подключения к базе данных, используя этот класс. Приведенный выше код демонстрирует практический пример с `DatabaseConnectionHandler`, автоматизирующий удаление подключения к базе данных в конце каждого запроса.

Интеграция проста, с обработчиками, зарегистрированными во время настройки сервера. Класс `HttpServerHandler` предлагает набор мощных инструментов для управления ресурсами и расширения поведения Sisk в HTTP-приложениях.