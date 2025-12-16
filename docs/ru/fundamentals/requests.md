# Запросы

Запросы представляют собой структуры, которые представляют сообщение HTTP-запроса. Объект [HttpRequest](/api/Sisk.Core.Http.HttpRequest) содержит полезные функции для обработки HTTP-сообщений на протяжении всего вашего приложения.

HTTP-запрос формируется методом, путем, версией, заголовками и телом.

В этом документе мы научим вас, как получить каждый из этих элементов.

## Получение метода запроса

Чтобы получить метод полученного запроса, вы можете использовать свойство Method:

```cs
static HttpResponse Index(HttpRequest request)
{
    HttpMethod requestMethod = request.Method;
    ...
}
```

Это свойство возвращает метод запроса, представленный объектом [HttpMethod](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.httpmethod).

> [!NOTE]
> В отличие от методов маршрутизации, это свойство не обслуживает элемент [RouteMethod.Any](/api/Sisk.Core.Routing.RouteMethod). Вместо этого оно возвращает фактический метод запроса.

## Получение компонентов URL

Вы можете получить различные компоненты из URL через определенные свойства запроса. Для этого примера давайте рассмотрим URL:

``` 
http://localhost:5000/user/login?email=foo@bar.com
```

| Название компонента | Описание | Значение компонента |
| --- | --- | --- |
| [Path](/api/Sisk.Core.Http.HttpRequest.Path) | Получает путь запроса. | `/user/login` |
| [FullPath](/api/Sisk.Core.Http.HttpRequest.FullPath) | Получает путь запроса и строку запроса. | `/user/login?email=foo@bar.com` |
| [FullUrl](/api/Sisk.Core.Http.HttpRequest.FullUrl) | Получает всю строку URL запроса. | `http://localhost:5000/user/login?email=foo@bar.com` |
| [Host](/api/Sisk.Core.Http.HttpRequest.Host) | Получает хост запроса. | `localhost` |
| [Authority](/api/Sisk.Core.Http.HttpRequest.Authority) | Получает хост и порт запроса. | `localhost:5000` |
| [QueryString](/api/Sisk.Core.Http.HttpRequest.QueryString) | Получает запрос запроса. | `?email=foo@bar.com` |
| [Query](/api/Sisk.Core.Http.HttpRequest.Query) | Получает запрос запроса в виде коллекции именованных значений. | `{StringValueCollection object}` |
| [IsSecure](/api/Sisk.Core.Http.HttpRequest.IsSecure) | Определяет, использует ли запрос SSL (true) или нет (false). | `false` |

Вы также можете использовать свойство [HttpRequest.Uri](/api/Sisk.Core.Http.HttpRequest.Uri), которое включает все вышеперечисленное в один объект.

## Получение тела запроса

Некоторые запросы включают тело, такие как формы, файлы или транзакции API. Вы можете получить тело запроса из свойства:

```cs
// получает тело запроса как строку, используя кодировку запроса в качестве кодировщика
string body = request.Body;

// или получает его в виде массива байтов
byte[] bodyBytes = request.RawBody;

// или вы можете передать его как поток.
Stream requestStream = request.GetRequestStream();
```

Также возможно определить, есть ли тело в запросе и загружено ли оно с помощью свойств [HasContents](/api/Sisk.Core.Http.HttpRequest.HasContents), которое определяет, имеет ли запрос содержимое, и [IsContentAvailable](/api/Sisk.Core.Http.HttpRequest.IsContentAvailable), которое указывает, что HTTP-сервер полностью получил содержимое из удаленной точки.

Невозможно прочитать содержимое запроса через `GetRequestStream` более одного раза. Если вы прочитаете с помощью этого метода, значения в `RawBody` и `Body` также не будут доступны. Не нужно освобождать поток запроса в контексте запроса, поскольку он освобождается в конце HTTP-сессии, в которой он создается. Кроме того, вы можете использовать свойство [HttpRequest.RequestEncoding](/api/Sisk.Core.Http.HttpRequest.RequestEncoding), чтобы получить лучшую кодировку для декодирования запроса вручную.

Сервер имеет ограничения на чтение содержимого запроса, которые применяются как к [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body), так и к [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.Body). Эти свойства копируют весь входной поток в локальный буфер того же размера, что и [HttpRequest.ContentLength](/api/Sisk.Core.Http.HttpRequest.ContentLength).

Ответ со статусом 413 Содержимое слишком велико возвращается клиенту, если отправленное содержимое больше [HttpServerConfiguration.MaximumContentLength](/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength), определенного в конфигурации пользователя. Кроме того, если нет настроенного ограничения или если оно слишком велико, сервер выдаст исключение [OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception?view=net-8.0), когда содержимое, отправленное клиентом, превышает [Int32.MaxValue](https://learn.microsoft.com/en-us/dotnet/api/system.int32.maxvalue) (2 ГБ) и если содержимое попытается получить доступ через одно из упомянутых выше свойств. Вы все равно можете иметь дело с содержимым через поток.

> [!NOTE]
> Хотя Sisk позволяет это, всегда хорошей идеей является следовать семантике HTTP для создания вашего приложения и не получать или обслуживать содержимое в методах, которые не допускают этого. Прочитайте о [RFC 9110 "HTTP Семантика"](https://httpwg.org/spec/rfc9110.html).

## Получение контекста запроса

Контекст HTTP — это эксклюзивный объект Sisk, который хранит информацию о сервере HTTP, маршруте, маршрутизаторе и обработчике запроса. Вы можете использовать его, чтобы организовать себя в среде, где эти объекты трудно организовать.

Вы можете получить текущий контекст [HttpContext](/api/Sisk.Core.Http.HttpContext) с помощью статического метода `HttpContext.GetCurrentContext()`. Этот метод возвращает контекст запроса, который в настоящее время обрабатывается в текущем потоке.

```cs
HttpContext context = HttpContext.GetCurrentContext();
```

### Режим журнала

Свойство [HttpContext.LogMode](/api/Sisk.Core.Http.HttpContext.LogMode) позволяет вам контролировать поведение журнала для текущего запроса. Вы можете включить или отключить журнал для конкретных запросов, переопределяя конфигурацию сервера по умолчанию.

```cs
// отключить журнал для этого запроса
context.LogMode = LogOutputMode.None;
```

### Мешок запроса

Объект [RequestBag](/api/Sisk.Core.Http.HttpContext.RequestBag) содержит сохраненную информацию, которая передается из обработчика запроса в другую точку и может быть потреблена в конечной точке. Этот объект также может быть использован обработчиками запросов, которые запускаются после обратного вызова маршрута.

> [!TIP]
> Это свойство также доступно через свойство [HttpRequest.Bag](/api/Sisk.Core.Http.HttpRequest.Bag).

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
    public string Identifier { get; init; } = Guid.NewGuid().ToString();
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;
    
    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization != null)
        {
            context.RequestBag.Add("AuthenticatedUser", new User("Bob"));
            return null;
        }
        else
        {
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}
```

Вышеуказанный обработчик запроса определит `AuthenticatedUser` в мешке запроса и может быть потреблен позже в конечном обратном вызове:

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
        User authUser = request.Context.RequestBag["AuthenticatedUser"];
        
        return new HttpResponse() {
            Content = new StringContent($"Hello, {authUser.Name}!")
        };
    }
}
```

Вы также можете использовать методы `Bag.Set()` и `Bag.Get()`, чтобы получить или установить объекты по их типам-одиночкам.

Класс `TypedValueDictionary` также предоставляет методы `GetValue` и `SetValue` для более точного контроля.

<div class="script-header">
    <span>
        Middleware/Authenticate.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class Authenticate : RequestHandler
{
    public override HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        request.Bag.Set<User>(authUser);
    }
}
```

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RouteGet("/")]
[RequestHandler<Authenticate>]
public static HttpResponse GetUser(HttpRequest request)
{
    var user = request.Bag.Get<User>();
    ...
}
```

## Получение данных формы

Вы можете получить значения данных формы в [NameValueCollection](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.specialized.namevaluecollection) с помощью следующего примера:

<div class="script-header">
    <span>
        Controller/Auth.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RoutePost("/auth")]
public HttpResponse Index(HttpRequest request)
{
    var form = request.GetFormContent();

    string? username = form["username"];
    string? password = form["password"];

    if (AttempLogin(username, password))
    {
        ...
    }
}
```

## Получение данных multipart-формы

Запрос HTTP Sisk позволяет получить загруженные multipart-содержимое, такое как файлы, поля форм или любое бинарное содержимое.

<div class="script-header">
    <span>
        Controller/Auth.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RoutePost("/upload-contents")]
public HttpResponse Index(HttpRequest request)
{
    // следующий метод читает весь входной запрос в массив
    // MultipartObjects
    var multipartFormDataObjects = request.GetMultipartFormContent();
    
    foreach (MultipartObject uploadedObject in multipartFormDataObjects)
    {
        // имя файла, предоставленное данными multipart-формы.
        // Null возвращается, если объект не является файлом.
        Console.WriteLine("File name       : " + uploadedObject.Filename);

        // имя поля multipart-формы.
        Console.WriteLine("Field name      : " + uploadedObject.Name);

        // длина содержимого multipart-формы.
        Console.WriteLine("Content length  : " + uploadedObject.ContentLength);

        // определите формат изображения на основе заголовка файла для каждого
        // известного типа содержимого. Если содержимое не является распознаваемым общим форматом файла,
        // этот метод ниже вернет MultipartObjectCommonFormat.Unknown
        Console.WriteLine("Common format   : " + uploadedObject.GetCommonFileFormat());
    }
}
```

Вы можете прочитать больше о [объектах multipart-формы Sisk](/api/Sisk.Core.Entity.MultipartObject) и их методах, свойствах и функциях.

## Обнаружение отключения клиента

Поскольку версия v1.15 Sisk, фреймворк предоставляет токен отмены, который выбрасывается, когда соединение между клиентом и сервером закрывается преждевременно до получения ответа. Этот токен может быть полезен для обнаружения, когда клиент больше не хочет ответа и отмены длительных операций.

```csharp
router.MapGet("/connect", async (HttpRequest req) =>
{
    // получает токен отключения из запроса
    var dc = req.DisconnectToken;

    await LongOperationAsync(dc);

    return new HttpResponse();
});
```

Этот токен не совместим со всеми движками HTTP, и каждый требует реализации.

## Поддержка серверных событий

Sisk поддерживает [серверные события](https://developer.mozilla.org/en-US/docs/ru/Web/API/Server-sent_events), которые позволяют отправлять фрагменты как поток и поддерживать соединение между сервером и клиентом.

Вызов метода [HttpRequest.GetEventSource](/api/Sisk.Core.Http.HttpRequest.GetEventSource) приведет к тому, что запрос HTTP будет находиться в состоянии прослушивания. После этого контекст этого запроса HTTP не будет ожидать ответа HttpResponse, поскольку он будет перекрывать пакеты, отправляемые серверными событиями.

После отправки всех пакетов обратный вызов должен вернуть метод [Close](/api/Sisk.Core.Http.HttpRequestEventSource.Close), который отправит окончательный ответ серверу и укажет, что потоковое вещание завершилось.

Невозможно предсказать, какой будет общий размер всех пакетов, которые будут отправлены, поэтому невозможно определить конец соединения с помощью заголовка `Content-Length`.

По умолчанию большинства браузеров серверные события не поддерживают отправку HTTP-заголовков или методов, кроме метода GET. Поэтому будьте осторожны при использовании обработчиков запросов с запросами event-source, которые требуют определенных заголовков в запросе, поскольку они, вероятно, не будут иметь их.

Кроме того, большинство браузеров перезапускают потоки, если метод [EventSource.close](https://developer.mozilla.org/en-US/docs/ru/Web/API/EventSource/close) не вызван на стороне клиента после получения всех пакетов, что приводит к бесконечной дополнительной обработке на стороне сервера. Чтобы избежать этой проблемы, обычно отправляют окончательный пакет, указывающий, что источник событий завершил отправку всех пакетов.

Пример ниже показывает, как браузер может общаться с сервером, поддерживающим серверные события.

<div class="script-header">
    <span>
        sse-example.html
    </span>
    <span>
        HTML
    </span>
</div>

```html
<html>
    <body>
        <b>Fruits:</b>
        <ul></ul>
    </body>
    <script>
        const evtSource = new EventSource('http://localhost:5555/event-source');
        const eventList = document.querySelector('ul');
        
        evtSource.onmessage = (e) => {
            const newElement = document.createElement("li");

            newElement.textContent = `message: ${e.data}`;
            eventList.appendChild(newElement);

            if (e.data == "Tomato") {
                evtSource.close();
            }
        }
    </script>
</html>
```

И постепенно отправляйте сообщения клиенту:

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
    [RouteGet("/event-source")]
    public async Task<HttpResponse> ServerEventsResponse(HttpRequest request)
    {
        var sse = await request.GetEventSourceAsync ();
        
        string[] fruits = new[] { "Apple", "Banana", "Watermelon", "Tomato" };
        
        foreach (string fruit in fruits)
        {
            await serverEvents.SendAsync(fruit);
            await Task.Delay(1500);
        }

        return serverEvents.Close();
    }
}
```

Когда вы запускаете этот код, мы ожидаем результат, подобный этому:

<img src="/assets/img/server side events demo.gif" />

## Разрешение прокси-IP и хостов

Sisk можно использовать с прокси, и поэтому IP-адреса могут быть заменены конечной точкой прокси в транзакции от клиента к прокси.

Вы можете определить свои собственные разрешители в Sisk с помощью [разрешителей пересылки](/docs/ru/advanced/forwarding-resolvers).

## Кодирование заголовков

Кодирование заголовков может быть проблемой для некоторых реализаций. В Windows заголовки UTF-8 не поддерживаются, поэтому используется ASCII. Sisk имеет встроенный конвертер кодировки, который может быть полезен для декодирования неправильно закодированных заголовков.

Эта операция дорога и отключена по умолчанию, но может быть включена под флагом [NormalizeHeadersEncodings](/specification/spec/Sisk.Core.Http.HttpServerFlags.NormalizeHeadersEncodings).