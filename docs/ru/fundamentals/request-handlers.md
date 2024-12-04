# Обработка запросов

Обработчики запросов, также известные как "中间件", - это функции, которые выполняются до или после того, как запрос будет обработан маршрутизатором. Их можно определить для конкретного маршрута или для всего маршрутизатора.

Существуют два типа обработчиков запросов:

- **BeforeResponse**: указывает, что обработчик запроса будет выполнен до вызова действия маршрутизатора.
- **AfterResponse**: указывает, что обработчик запроса будет выполнен после вызова действия маршрутизатора. Отправка HTTP-ответа в этом контексте перезапишет ответ действия маршрутизатора.

Оба обработчика запросов могут перезаписать фактический ответ функции обратного вызова маршрутизатора. Кстати, обработчики запросов могут быть полезны для валидации запроса, например, аутентификации, содержимого или любой другой информации, такой как хранение информации, логирование или другие действия, которые можно выполнить до или после ответа.

![](/assets/img/requesthandlers1.png)

Таким образом, обработчик запроса может прервать все эти действия и вернуть ответ, прежде чем завершить цикл, отбросив все остальное.

Пример: предположим, что обработчик запроса для аутентификации пользователя не аутентифицирует его. Это помешает продолжению жизненного цикла запроса и зависнет. Если это происходит в обработчике запроса на позиции два, то третий и последующие не будут оценены.

![](/assets/img/requesthandlers2.png)

## Создание обработчика запроса

Чтобы создать обработчик запроса, можно создать класс, наследующий интерфейс [IRequestHandler](/api/Sisk.Core.Routing.IRequestHandler), в следующем формате:

```cs
public class AuthenticateUserRequestHandler : IRequestHandler
{
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;

    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization != null)
        {
            // Возвращение null указывает на то, что цикл запроса может быть продолжен
            return null;
        }
        else
        {
            // Возвращение объекта HttpResponse указывает на то, что этот ответ перезапишет соседние ответы.
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}
```

В приведенном выше примере указано, что если запрос содержит заголовок `Authorization`, он должен продолжить выполнение, и будет вызван следующий обработчик запроса или обратный вызов маршрутизатора, whichever comes next. Если обработчик запроса выполняется после ответа с помощью их свойства [ExecutionMode](/api/Sisk.Core.Routing.IRequestHandler.ExecutionMode) и возвращает не null значение, он перезапишет ответ маршрутизатора.

Каждый раз, когда обработчик запроса возвращает `null`, это указывает на то, что запрос должен быть продолжен, и должен быть вызван следующий объект или цикл должен завершиться ответом маршрутизатора.

## Связывание обработчика запроса с отдельным маршрутом

Можно определить один или несколько обработчиков запросов для маршрута.

```cs
mainRouter.SetRoute(RouteMethod.Get, "/", IndexPage, "", new IRequestHandler[]
{
    new AuthenticateUserRequestHandler(),     // before request handler
    new ValidateJsonContentRequestHandler(),  // before request handler
    //                                        -- method IndexPage будет выполнен здесь
    new WriteToLogRequestHandler()            // after request handler
});
```

Или создание объекта [Route](/api/Sisk.Core.Routing.Route):

```cs
Route indexRoute = new Route(RouteMethod.Get, "/", "", IndexPage, null);
indexRoute.RequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
mainRouter.SetRoute(indexRoute);
```

## Связывание обработчика запроса с маршрутизатором

Можно определить глобальный обработчик запроса, который будет выполняться на всех маршрутах маршрутизатора.

```cs
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
```

## Связывание обработчика запроса с атрибутом

Можно определить обработчик запроса на методе атрибута вместе с атрибутом маршрута.

```cs
public class MyController
{
    [RouteGet("/")]
    [RequestHandler<AuthenticateUserRequestHandler>]
    static HttpResponse Index(HttpRequest request)
    {
        return new HttpResponse()
            .WithContent(new StringContent("Hello world!"));
    }
}
```

Обратите внимание, что необходимо передать тип желаемого обработчика запроса, а не экземпляр объекта. Таким образом, обработчик запроса будет создан парсером маршрутизатора. Вы можете передавать аргументы в конструктор класса с помощью свойства [ConstructorArguments](/api/Sisk.Core.Routing.RequestHandlerAttribute.ConstructorArguments).

Пример:

```cs
[RequestHandler<AuthenticateUserRequestHandler>("arg1", 123, ...)]
static HttpResponse Index(HttpRequest request)
{
    HttpResponse res = new HttpResponse();
    res.Content = new StringContent("Hello world!");
    return res;
}
```

Также можно создать свой собственный атрибут, который реализует RequestHandler:

```cs
public class AuthenticateAttribute : RequestHandlerAttribute
{
    public AuthenticateAttribute() : base(typeof(AuthenticateUserRequestHandler), ConstructorArguments = new object?[] { "arg1", 123, ... })
    {
        ;
    }
}
```

И использовать его так:

```cs
[Authenticate]
static HttpResponse Index(HttpRequest request)
{
    HttpResponse res = new HttpResponse();
    res.Content = new StringContent("Hello world!");
    return res;
}
```

## Игнорирование глобального обработчика запроса

После определения глобального обработчика запроса на маршруте можно игнорировать этот обработчик запроса на конкретных маршрутах.

```cs
var myRequestHandler = new AuthenticateUserRequestHandler();
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    myRequestHandler
};

mainRouter.SetRoute(new Route(RouteMethod.Get, "/", "My route", IndexPage, null)
{
    BypassGlobalRequestHandlers = new IRequestHandler[]
    {
        myRequestHandler,                    // ok: the same instance of what is in the global request handlers
        new AuthenticateUserRequestHandler() // wrong: will not skip the global request handler
    }
});
```

> [!NOTE]
> Если вы игнорируете обработчик запроса, вам необходимо использовать тот же ссылаемый объект, который был установлен ранее, чтобы пропустить его. Создание нового экземпляра обработчика запроса не позволит пропустить глобальный обработчик запроса, так как его ссылка изменится. Не забудьте использовать ту же ссылку на обработчик запроса, которая используется как в GlobalRequestHandlers, так и в BypassGlobalRequestHandlers.
