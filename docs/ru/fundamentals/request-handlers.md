# Обработка запросов

Обработчики запросов, также известные как "посредники", являются функциями, которые выполняются до или после выполнения запроса на маршрутизаторе. Они могут быть определены для каждого маршрута или для всего маршрутизатора.

Существует два типа обработчиков запросов:

- **BeforeResponse**: определяет, что обработчик запроса будет выполнен до вызова действия маршрутизатора.
- **AfterResponse**: определяет, что обработчик запроса будет выполнен после вызова действия маршрутизатора. Отправка HTTP-ответа в этом контексте перезапишет ответ действия маршрутизатора.

Оба обработчика запросов могут переопределить фактический ответ функции обратного вызова маршрутизатора. Кроме того, обработчики запросов могут быть полезны для проверки запроса, такой как аутентификация, содержимое или любую другую информацию, такую как хранение информации, журналов или других шагов, которые можно выполнить до или после ответа.

![](/assets/img/requesthandlers1.png)

Таким образом, обработчик запроса может прервать все это выполнение и вернуть ответ до завершения цикла, отбрасывая все остальное в процессе.

Пример: предположим, что обработчик запроса аутентификации пользователя не аутентифицирует его. Это предотвратит продолжение жизненного цикла запроса и повесит. Если это происходит в обработчике запроса на позиции два, третий и последующие не будут оценены.

![](/assets/img/requesthandlers2.png)

## Создание обработчика запроса

Чтобы создать обработчик запроса, мы можем создать класс, который наследует интерфейс [IRequestHandler](/api/Sisk.Core.Routing.IRequestHandler), в следующем формате:

<div class="script-header">
    <span>
        Middleware/AuthenticateUserRequestHandler.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class AuthenticateUserRequestHandler : IRequestHandler
{
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;

    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization != null)
        {
            // Возвращение null указывает на то, что запрос может быть продолжен
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

В приведенном выше примере мы указали, что если заголовок `Authorization` присутствует в запросе, он должен продолжаться, и следующий обработчик запроса или функция обратного вызова маршрутизатора должна быть вызвана, в зависимости от того, что происходит дальше. Если обработчик запроса выполняется после ответа по свойству [ExecutionMode](/api/Sisk.Core.Routing.IRequestHandler.ExecutionMode) и возвращает не-нулевое значение, он перезапишет ответ маршрутизатора.

Когда обработчик запроса возвращает `null`, это указывает на то, что запрос должен продолжаться, и следующий объект должен быть вызван, или цикл должен завершиться ответом маршрутизатора.

## Связывание обработчика запроса с одним маршрутом

Вы можете определить один или несколько обработчиков запросов для маршрута.

<div class="script-header">
    <span>
        Router.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
mainRouter.SetRoute(RouteMethod.Get, "/", IndexPage, "", new IRequestHandler[]
{
    new AuthenticateUserRequestHandler(),     // до запроса обработчик
    new ValidateJsonContentRequestHandler(),  // до запроса обработчик
    //                                        -- метод IndexPage будет выполнен здесь
    new WriteToLogRequestHandler()            // после запроса обработчик
});
```

Или создавая объект [Route](/api/Sisk.Core.Routing.Route):

<div class="script-header">
    <span>
        Router.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
Route indexRoute = new Route(RouteMethod.Get, "/", "", IndexPage, null);
indexRoute.RequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
mainRouter.SetRoute(indexRoute);
```

## Связывание обработчика запроса с маршрутизатором

Вы можете определить глобальный обработчик запроса, который будет запущен на всех маршрутах маршрутизатора.

<div class="script-header">
    <span>
        Router.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
```

## Связывание обработчика запроса с атрибутом

Вы можете определить обработчик запроса на методе атрибута вместе с атрибутом маршрута.

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
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

Обратите внимание, что необходимо передать желаемый тип обработчика запроса, а не экземпляр объекта. Таким образом, обработчик запроса будет создан парсером маршрутизатора. Вы можете передать аргументы в конструктор класса с помощью свойства [ConstructorArguments](/api/Sisk.Core.Routing.RequestHandlerAttribute.ConstructorArguments).

Пример:

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RequestHandler<AuthenticateUserRequestHandler>("arg1", 123, ...)]
public HttpResponse Index(HttpRequest request)
{
    return res = new HttpResponse() {
        Content = new StringContent("Hello world!")
    };
}
```

Вы также можете создать собственный атрибут, который реализует RequestHandler:

<div class="script-header">
    <span>
        Middleware/Attributes/AuthenticateAttribute.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class AuthenticateAttribute : RequestHandlerAttribute
{
    public AuthenticateAttribute() : base(typeof(AuthenticateUserRequestHandler), ConstructorArguments = new object?[] { "arg1", 123, ... })
    {
        ;
    }
}
```

И использовать его как:

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[Authenticate]
static HttpResponse Index(HttpRequest request)
{
    return res = new HttpResponse() {
        Content = new StringContent("Hello world!")
    };
}
```

## Пропуск глобального обработчика запроса

После определения глобального обработчика запроса на маршруте вы можете игнорировать этот обработчик запроса на конкретных маршрутах.

<div class="script-header">
    <span>
        Router.cs
    </span>
    <span>
        C#
    </span>
</div>

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
        myRequestHandler,                    // ок: тот же экземпляр, что и в глобальных обработчиках запросов
        new AuthenticateUserRequestHandler() // неправильно: не пропустит глобальный обработчик запроса
    }
});
```

> [!NOTE]
> Если вы пропускаете обработчик запроса, вы должны использовать тот же ссылку на то, что было создано ранее, чтобы пропустить. Создание другого экземпляра обработчика запроса не пропустит глобальный обработчик запроса, поскольку ссылка изменится. Помните, что необходимо использовать ту же ссылку на обработчик запроса, которая используется как в GlobalRequestHandlers, так и в BypassGlobalRequestHandlers.