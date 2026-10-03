---
title: "Обработка запросов"
linkTitle: "Обработчики запросов"
weight: 20
aliases:
  - "/docs/ru/fundamentals/request-handlers.html"
sourceHash: "77d35afbd210c7a6"
---

Обработчики запросов, также известные как «middleware», — это функции, которые выполняются до или после выполнения запроса роутером. Их можно определять для отдельного маршрута или для роутера.

Существует два типа обработчиков запросов:

- **BeforeResponse**: определяет, что обработчик запроса будет выполнен до вызова действия роутера.
- **AfterResponse**: определяет, что обработчик запроса будет выполнен после вызова действия роутера. Отправка HTTP‑ответа в этом контексте перезапишет ответ действия роутера.

Оба обработчика запросов могут переопределять фактический ответ функции обратного вызова роутера. Кстати, обработчики запросов могут быть полезны для проверки запроса, например аутентификации, содержимого или любой другой информации, такой как сохранение данных, журналирование или другие шаги, которые могут быть выполнены до или после ответа.

![](/assets/img/requesthandlers1.png)

Таким образом, обработчик запроса может прервать всё это выполнение и вернуть ответ до завершения цикла, отбрасывая всё остальное в процессе.

Пример: предположим, что обработчик запроса аутентификации пользователя не аутентифицирует его. Он предотвратит продолжение жизненного цикла запроса и «зависнет». Если это происходит в обработчике запроса на второй позиции, третий и последующие не будут оцениваться.

![](/assets/img/requesthandlers2.png)

## Создание обработчика запроса

Чтобы создать обработчик запроса, можно создать класс, наследующий интерфейс [IRequestHandler](/api/Sisk.Core.Routing.IRequestHandler), в следующем формате:

```cs {title="Middleware/AuthenticateUserRequestHandler.cs"}
public class AuthenticateUserRequestHandler : IRequestHandler
{
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;

    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization != null)
        {
            // Возврат null указывает, что цикл запроса может продолжаться
            return null;
        }
        else
        {
            // Возврат объекта HttpResponse указывает, что этот ответ перезапишет соседние ответы.
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}
```

В приведённом выше примере мы указали, что если заголовок `Authorization` присутствует в запросе, выполнение должно продолжаться и будет вызван следующий обработчик запроса или обратный вызов роутера, в зависимости от того, что следует дальше. Если обработчик запроса выполняется после ответа благодаря свойству [ExecutionMode](/api/Sisk.Core.Routing.IRequestHandler.ExecutionMode) и возвращает ненулевое значение, он перезапишет ответ роутера.

Когда обработчик запроса возвращает `null`, это указывает, что запрос должен продолжаться, и следует вызвать следующий объект, либо цикл завершится ответом роутера.

Если вы наследуете встроенный класс [RequestHandler](/api/Sisk.Core.Routing.RequestHandler), вы можете вернуть `Next()`, чтобы явно указать это намерение:

```cs
public class AuthenticateUserRequestHandler : RequestHandler
{
    public override HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization is not null)
            return Next();

        return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
    }
}
```

Для обработчиков, которым требуется ввод‑вывод, наследуйтесь от [AsyncRequestHandler](/api/Sisk.Core.Routing.AsyncRequestHandler):

```cs
public class LoadUserRequestHandler : AsyncRequestHandler
{
    public override async Task<HttpResponse?> ExecuteAsync(HttpRequest request, HttpContext context)
    {
        var user = await UserRepository.FindAsync(request.Headers.Authorization, request.DisconnectToken);
        if (user is null)
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);

        request.Bag.Set(user);
        return Next();
    }
}
```

Небольшие встроенные обработчики также можно создать с помощью `RequestHandler.Create` или `AsyncRequestHandler.Create`:

```cs
var requireJson = RequestHandler.Create((request, context) =>
{
    if (request.Headers.ContentType?.Contains("application/json") == true)
        return null;

    return new HttpResponse(System.Net.HttpStatusCode.UnsupportedMediaType);
});
```

## Привязка обработчика запроса к отдельному маршруту

Для маршрута можно определить один или несколько обработчиков запросов.

```cs {title="Router.cs"}
mainRouter.Map(RouteMethod.Get, "/", IndexPage, new IRequestHandler[]
{
    new AuthenticateUserRequestHandler(),     // обработчик до запроса
    new ValidateJsonContentRequestHandler(),  // обработчик до запроса
    //                                        -- метод IndexPage будет выполнен здесь
    new WriteToLogRequestHandler()            // обработчик после запроса
});
```

Или создание объекта [Route](/api/Sisk.Core.Routing.Route):

```cs {title="Router.cs"}
Route indexRoute = Route.Get("/", IndexPage);
indexRoute.RequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
mainRouter.Map(indexRoute);
```

## Привязка обработчика запроса к роутеру

Можно определить глобальный обработчик запроса, который будет выполняться на всех маршрутах роутера.

```cs {title="Router.cs"}
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
```

## Привязка обработчика запроса к атрибуту

Можно определить обработчик запроса в атрибуте метода вместе с атрибутом маршрута.

```cs {title="Controller/MyController.cs"}
public class MyController
{
    [RouteGet("/")]
    [RequestHandler<AuthenticateUserRequestHandler>]
    static HttpResponse Index(HttpRequest request)
    {
        return new HttpResponse() {
            Content = new StringContent("Hello world!")
        };
    }
}
```

Обратите внимание, что необходимо передавать тип требуемого обработчика запроса, а не экземпляр объекта. Таким образом, обработчик запроса будет создан парсером роутера. Вы можете передать аргументы в конструктор класса с помощью свойства [ConstructorArguments](/api/Sisk.Core.Routing.RequestHandlerAttribute.ConstructorArguments).

Пример:

```cs {title="Controller/MyController.cs"}
[RequestHandler<AuthenticateUserRequestHandler>("arg1", 123, ...)]
public HttpResponse Index(HttpRequest request)
{
    return res = new HttpResponse() {
        Content = new StringContent("Hello world!")
    };
}
```

Вы также можете создать собственный атрибут, реализующий RequestHandler:

```cs {title="Middleware/Attributes/AuthenticateAttribute.cs"}
public class AuthenticateAttribute : RequestHandlerAttribute
{
    public AuthenticateAttribute() : base(typeof(AuthenticateUserRequestHandler), ConstructorArguments = new object?[] { "arg1", 123, ... })
    {
        ;
    }
}
```

И использовать его так:

```cs {title="Controller/MyController.cs"}
[Authenticate]
static HttpResponse Index(HttpRequest request)
{
    return res = new HttpResponse() {
        Content = new StringContent("Hello world!")
    };
}
```

## Обход глобального обработчика запроса

После определения глобального обработчика запроса на маршруте, вы можете игнорировать этот обработчик на конкретных маршрутах.

```cs {title="Router.cs"}
var myRequestHandler = new AuthenticateUserRequestHandler();
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    myRequestHandler
};

Route publicRoute = Route.Get("/", IndexPage);
publicRoute.Name = "My route";
publicRoute.BypassGlobalRequestHandlers = new IRequestHandler[]
{
    myRequestHandler,                    // ok: тот же экземпляр, что и в глобальных обработчиках запросов
    new AuthenticateUserRequestHandler() // неверно: не пропустит глобальный обработчик запроса
};

mainRouter.Map(publicRoute);
```

> [!NOTE]
> Если вы обходите обработчик запроса, необходимо использовать тот же экземпляр, который был создан ранее, чтобы пропустить его. Создание другого экземпляра обработчика запроса не пропустит глобальный обработчик, поскольку ссылка изменится. Помните, что следует использовать одну и ту же ссылку на обработчик запроса как в GlobalRequestHandlers, так и в BypassGlobalRequestHandlers.
