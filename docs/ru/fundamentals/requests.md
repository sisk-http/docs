# Запросы

Запросы — это структуры, представляющие сообщение HTTP‑запроса. Объект [HttpRequest](/api/Sisk.Core.Http.HttpRequest) содержит полезные функции для обработки HTTP‑сообщений в вашем приложении.

HTTP‑запрос состоит из метода, пути, версии, заголовков и тела.

В этом документе мы расскажем, как получить каждый из этих элементов.

## Получение метода запроса

Чтобы получить метод полученного запроса, используйте свойство `Method`:

```cs
static HttpResponse Index(HttpRequest request)
{
    HttpMethod requestMethod = request.Method;
    ...
}
```

Это свойство возвращает метод запроса, представленный объектом [HttpMethod](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.httpmethod).

> [!NOTE]
> В отличие от методов маршрута, это свойство не обслуживает элемент [RouteMethod.Any](/api/Sisk.Core.Routing.RouteMethod). Вместо этого оно возвращает реальный метод запроса.

## Получение компонентов URL запроса

Вы можете получить различные компоненты URL через определённые свойства запроса. Для примера возьмём URL:

```
http://localhost:5000/user/login?email=foo@bar.com
```

| Имя компонента | Описание | Значение компонента |
| --- | --- | --- |
| [Path](/api/Sisk.Core.Http.HttpRequest.Path) | Возвращает путь запроса. | `/user/login` |
| [FullPath](/api/Sisk.Core.Http.HttpRequest.FullPath) | Возвращает путь запроса и строку запроса. | `/user/login?email=foo@bar.com` |
| [FullUrl](/api/Sisk.Core.Http.HttpRequest.FullUrl) | Возвращает полную строку URL запроса. | `http://localhost:5000/user/login?email=foo@bar.com` |
| [Host](/api/Sisk.Core.Http.HttpRequest.Host) | Возвращает хост запроса. | `localhost` |
| [Authority](/api/Sisk.Core.Http.HttpRequest.Authority) | Возвращает хост и порт запроса. | `localhost:5000` |
| [QueryString](/api/Sisk.Core.Http.HttpRequest.QueryString) | Возвращает строку запроса. | `?email=foo@bar.com` |
| [Query](/api/Sisk.Core.Http.HttpRequest.Query) | Возвращает запрос в виде именованной коллекции значений. | `{StringValueCollection object}` |
| [IsSecure](/api/Sisk.Core.Http.HttpRequest.IsSecure) | Определяет, использует ли запрос SSL (true) или нет (false). | `false` |

Вы также можете воспользоваться свойством [HttpRequest.Uri](/api/Sisk.Core.Http.HttpRequest.Uri), которое включает всё перечисленное в одном объекте.

## Метаданные запроса и отмена

Sisk также прикрепляет к каждому запросу оперативные метаданные. Эти свойства полезны для журналов, трассировки, локализации, диагностики и длительных операций:

| Свойство или метод | Назначение |
| --- | --- |
| [RequestId](/api/Sisk.Core.Http.HttpRequest.RequestId) | Уникальный идентификатор запроса. Включите [IncludeRequestIdHeader](/api/Sisk.Core.Http.HttpServerConfiguration.IncludeRequestIdHeader), чтобы возвращать его в заголовке `X-Request-Id`. |
| [RequestedAt](/api/Sisk.Core.Http.HttpRequest.RequestedAt) | Момент создания объекта запроса Sisk. |
| [RemoteAddress](/api/Sisk.Core.Http.HttpRequest.RemoteAddress) | Адрес клиента, полученный из соединения, либо из вашего [ForwardingResolver](/docs/ru/advanced/forwarding-resolvers). |
| [Culture](/api/Sisk.Core.Http.HttpRequest.Culture) | Наиболее подходящая культура, определённая из `Accept-Language`, с fallback к текущей культуре. |
| [DisconnectToken](/api/Sisk.Core.Http.HttpRequest.DisconnectToken) | Токен отмены, сигнализирующий о разрыве соединения клиентом, если поддерживается используемым HTTP‑движком. |
| [Bag](/api/Sisk.Core.Http.HttpRequest.Bag) | Типизированное хранилище ключ/значение, доступное между обработчиками запросов и действием маршрута. |
| [GetRawHttpRequest](/api/Sisk.Core.Http.HttpRequest.GetRawHttpRequest) | Текстовое представление запроса для диагностики. |

## Получение тела запроса

Некоторые запросы содержат тело, например формы, файлы или API‑транзакции. Тело запроса можно получить через свойство:

```cs
// получает тело запроса как строку, используя кодировку запроса
string body = request.Body;

// или получает его в виде массива байт
byte[] bodyBytes = request.RawBody;

// либо поток
Stream requestStream = request.GetRequestStream();

// или асинхронно читает тело
Memory<byte> bodyMemory = await request.GetBodyContentsAsync();
```

Также можно определить, есть ли тело у запроса и загружено ли оно, с помощью свойств [HasContents](/api/Sisk.Core.Http.HttpRequest.HasContents) (определяет наличие содержимого) и [IsContentAvailable](/api/Sisk.Core.Http.HttpRequest.IsContentAvailable) (указывает, что сервер полностью получил содержимое от удалённого узла).

Повторно читать содержимое запроса через `GetRequestStream` нельзя. Если вы читаете его этим методом, значения в `RawBody` и `Body` также станут недоступными. Не требуется явно освобождать поток запроса в контексте запроса — он освобождается в конце HTTP‑сессии, в которой был создан. Кроме того, вы можете использовать свойство [HttpRequest.RequestEncoding](/api/Sisk.Core.Http.HttpRequest.RequestEncoding) для получения оптимальной кодировки при ручном декодировании запроса.

Сервер накладывает ограничения на чтение содержимого запроса, которые применяются как к [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body), так и к [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.Body). Эти свойства копируют весь входной поток в локальный буфер размером, равным [HttpRequest.ContentLength](/api/Sisk.Core.Http.HttpRequest.ContentLength).

Если отправленное содержимое превышает значение [HttpServerConfiguration.MaximumContentLength](/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength), клиент получает ответ с кодом 413 Content Too Large. Кроме того, если ограничение не задано или слишком велико, сервер бросит [OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception?view=net-8.0), когда размер содержимого, отправленного клиентом, превысит [Int32.MaxValue](https://learn.microsoft.com/en-us/dotnet/api/system.int32.maxvalue) (2 ГБ) и будет попытка доступа к нему через одно из упомянутых выше свойств. Содержимое всё равно можно обрабатывать потоково.

> [!NOTE]
> Хотя Sisk позволяет это, всегда рекомендуется следовать HTTP‑семантике при построении приложения и не получать или обслуживать содержимое в методах, где это не предусмотрено. Подробнее см. [RFC 9110 "HTTP Semantics"](https://httpwg.org/spec/rfc9110.html).

## Чтение JSON‑запросов

Для JSON‑API предпочтительно использовать встроенные помощники JSON вместо ручного чтения `Body` и десериализации. Они используют [System.Text.Json](https://learn.microsoft.com/en-us/dotnet/api/system.text.json) и по умолчанию применяют [HttpRequest.DefaultJsonSerializerOptions](/api/Sisk.Core.Http.HttpRequest.DefaultJsonSerializerOptions).

```cs
public record CreateUserRequest(string Name, string Email);

router.MapPost("/users", (HttpRequest request) =>
{
    CreateUserRequest? body = request.GetJsonContent<CreateUserRequest>();
    if (body is null)
        return new HttpResponse(System.Net.HttpStatusCode.BadRequest);

    return new HttpResponse(System.Net.HttpStatusCode.Created);
});
```

Используйте асинхронную перегрузку, когда вы уже в асинхронном маршруте или хотите, чтобы отмена запроса прерывала десериализацию:

```cs
router.MapPost("/users", async (HttpRequest request) =>
{
    CreateUserRequest? body =
        await request.GetJsonContentAsync<CreateUserRequest>(request.DisconnectToken);

    if (body is null)
        return new HttpResponse(System.Net.HttpStatusCode.BadRequest);

    return new HttpResponse(System.Net.HttpStatusCode.Created);
});
```

Для конкретного эндпоинта можно передать собственные [JsonSerializerOptions](https://learn.microsoft.com/en-us/dotnet/api/system.text.json.jsonserializeroptions):

```cs
var options = new JsonSerializerOptions(JsonSerializerDefaults.Web)
{
    PropertyNameCaseInsensitive = true
};

UserDto? user = request.GetJsonContent<UserDto>(options);
```

Для приложений с Native AOT или чувствительных к обрезке используйте перегрузку `JsonTypeInfo<T>`, генерируемую `JsonSerializerContext`:

```cs
[JsonSerializable(typeof(CreateUserRequest))]
public partial class AppJsonSerializerContext : JsonSerializerContext
{
}

CreateUserRequest? body =
    await request.GetJsonContentAsync(
        AppJsonSerializerContext.Default.CreateUserRequest,
        request.DisconnectToken);
```

То же правило «прочитать один раз» применяется к JSON‑помощникам: после того как Sisk прочитает поток запроса через `GetJsonContent`, `GetJsonContentAsync`, `Body` или `RawBody`, вы не сможете позже использовать тот же поток через `GetRequestStream()`.

## Получение контекста запроса

HTTP‑Context — это эксклюзивный объект Sisk, хранящий информацию о HTTP‑сервере, маршруте, роутере и обработчике запросов. Он упрощает навигацию в среде, где такие объекты трудно упорядочить.

Текущий [HttpContext](/api/Sisk.Core.Http.HttpContext) можно получить статическим методом `HttpContext.GetCurrentContext()`. Этот метод возвращает контекст запроса, обрабатываемого в текущем потоке.

```cs
HttpContext context = HttpContext.GetCurrentContext();
```

### Режим журналирования

Свойство [HttpContext.LogMode](/api/Sisk.Core.Http.HttpContext.LogMode) позволяет управлять поведением журналирования для текущего запроса. Вы можете включать или отключать журналирование для отдельных запросов, переопределяя конфигурацию сервера по умолчанию.

```cs
// Отключить журналирование для этого запроса
context.LogMode = LogOutputMode.None;
```

### Request Bag

Объект [RequestBag](/api/Sisk.Core.Http.HttpContext.RequestBag) хранит информацию, передаваемую от одного обработчика запроса к другому, и может быть использован в конечной точке. Этот объект также доступен обработчикам запросов, которые выполняются после обратного вызова маршрута.

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

Вышеприведённый обработчик запроса добавит `AuthenticatedUser` в RequestBag, откуда его можно будет получить позже в финальном обратном вызове:

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

Также можно использовать вспомогательные методы `Bag.Set()` и `Bag.Get()` для получения или установки объектов по их типу‑синглтону.

Класс `TypedValueDictionary` предоставляет методы `GetValue` и `SetValue` для более тонкого управления.

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

Данные формы можно получить в виде [StringKeyStoreCollection](/api/Sisk.Core.Entity.StringKeyStoreCollection) следующим образом:

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

Асинхронная версия полезна, когда тело запроса может быть большим или требуется поддержка отмены:

```cs
var form = await request.GetFormContentAsync(request.DisconnectToken);
```

## Получение multipart‑данных формы

HTTP‑запрос Sisk позволяет получать загруженные multipart‑содержимое, такое как файлы, поля формы или любой бинарный контент.

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
    // следующий метод читает весь входной поток запроса
    // в массив MultipartObjects
    var multipartFormDataObjects = request.GetMultipartFormContent();
    
    foreach (MultipartObject uploadedObject in multipartFormDataObjects)
    {
        // Имя файла, предоставленное multipart‑формой.
        // Возвращает null, если объект не является файлом.
        Console.WriteLine("File name       : " + uploadedObject.Filename);

        // Имя поля multipart‑формы.
        Console.WriteLine("Field name      : " + uploadedObject.Name);

        // Длина содержимого multipart‑формы.
        Console.WriteLine("Content length  : " + uploadedObject.ContentLength);

        // Определение формата изображения по заголовку файла для каждого
        // известного типа контента. Если контент не является распознанным
        // общим форматом файла, метод ниже вернёт MultipartObjectCommonFormat.Unknown
        Console.WriteLine("Common format   : " + uploadedObject.GetCommonFileFormat());
    }
}
```

Для асинхронных маршрутов используйте [GetMultipartFormContentAsync](/api/Sisk.Core.Http.HttpRequest.GetMultipartFormContentAsync):

```cs
var multipartFormDataObjects =
    await request.GetMultipartFormContentAsync(request.DisconnectToken);
```

Подробнее о [Multipart form objects](/api/Sisk.Core.Entity.MultipartObject) Sisk, их методах, свойствах и возможностях.

## Обнаружение разрыва соединения клиентом

Начиная с версии v1.15 Sisk предоставляет токен отмены через [HttpRequest.DisconnectToken](/api/Sisk.Core.Http.HttpRequest.DisconnectToken). Когда используемый HTTP‑движок поддерживает обнаружение разрыва, этот токен отменяется при закрытии клиентом соединения до завершения ответа. Это удобно для остановки длительных операций, когда клиент больше не ждёт результата.

```csharp
router.MapGet("/connect", async (HttpRequest req) =>
{
    // получаем токен разрыва соединения из запроса
    var dc = req.DisconnectToken;

    await LongOperationAsync(dc);

    return new HttpResponse();
});
```

Токен не совместим со всеми HTTP‑движками; каждый требует собственной реализации.

Движок Sisk по умолчанию, основанный на `System.Net.HttpListener`, не поддерживает обнаружение разрыва клиентом. При использовании движка по умолчанию `DisconnectToken` равен `CancellationToken.None`; фактически это токен без возможности отмены и считается недоступным.

Движок [Cadente](/docs/ru/cadente) поддерживает `DisconnectToken`. Если ваш маршрут зависит от отмены при разрыве, используйте Cadente или другой движок, явно реализующий это поведение. Даже при поддерживаемом движке отмена является кооперативной: передавайте токен в асинхронные API и проверяйте его в собственных длительных задачах.

## Поддержка Server‑sent events

Sisk поддерживает [Server‑sent events](https://developer.mozilla.org/en-US/docs/ru/Web/API/Server-sent_events), позволяя отправлять фрагменты как поток и поддерживать соединение между сервером и клиентом живым.

Вызов метода [HttpRequest.GetEventSource](/api/Sisk.Core.Http.HttpRequest.GetEventSource) переводит HttpRequest в состояние слушателя. В этом случае контекст HTTP‑запроса не будет ожидать HttpResponse, так как он будет «перекрывать» пакеты, отправляемые серверными событиями.

После отправки всех пакетов обратный вызов должен вернуть метод [Close](/api/Sisk.Core.Http.HttpRequestEventSource.Close), который отправит финальный ответ серверу и укажет, что поток завершён.

Невозможно предсказать общую длину всех пакетов, поэтому определить конец соединения с помощью заголовка `Content-Length` нельзя.

По умолчанию большинство браузеров не поддерживают отправку HTTP‑заголовков или методов, отличных от GET, в серверных событиях. Поэтому будьте осторожны, используя обработчики запросов с event‑source, требующие специфических заголовков — скорее всего они не будут присутствовать.

Кроме того, большинство браузеров перезапускают поток, если метод [EventSource.close](https://developer.mozilla.org/en-US/docs/ru/Web/API/EventSource/close) не был вызван на клиенте после получения всех пакетов, что приводит к бесконечной дополнительной обработке на сервере. Чтобы избежать такой проблемы, обычно отправляют финальный пакет, указывающий, что источник событий завершил передачу.

Ниже пример того, как браузер может взаимодействовать с сервером, поддерживающим Server‑side events.

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

И постепенно отправлять сообщения клиенту:

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
        var serverEvents = await request.GetEventSourceAsync ();
        
        string[] fruits = new[] { "Apple", "Banana", "Watermelon", "Tomato" };
        
        foreach (string fruit in fruits)
        {
            await serverEvents.SendAsync(fruit);
            await Task.Delay(1500);
        }

        return await serverEvents.CloseAsync();
    }
}
```

При запуске этого кода ожидаемый результат выглядит примерно так:

<img src="/assets/img/server side events demo.gif" />

## Разрешение проксированных IP и хостов

Sisk может работать через прокси, поэтому IP‑адреса могут быть заменены конечной точкой прокси в транзакции от клиента к прокси.

Вы можете определить собственные резолверы в Sisk с помощью [forwarding resolvers](/docs/ru/advanced/forwarding-resolvers).

## Кодировка заголовков

Кодировка заголовков может стать проблемой для некоторых реализаций. В Windows заголовки UTF‑8 не поддерживаются, поэтому используется ASCII. Sisk имеет встроенный конвертер кодировок, который может помочь декодировать неправильно закодированные заголовки.

Эта операция ресурсоёмка и по умолчанию отключена, но её можно включить через [HttpServerConfiguration.NormalizeHeadersEncodings](/api/Sisk.Core.Http.HttpServerConfiguration.NormalizeHeadersEncodings).