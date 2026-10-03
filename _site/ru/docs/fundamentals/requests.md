# Запросы

Source: https://docs.sisk-framework.org/ru/docs/fundamentals/requests.html

Запросы — это структуры, представляющие сообщение HTTP‑запроса. Объект [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) содержит полезные функции для обработки HTTP‑сообщений в вашем приложении.

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
> В отличие от методов маршрута, это свойство не обслуживает элемент [RouteMethod.Any](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md). Вместо этого оно возвращает реальный метод запроса.

## Получение компонентов URL запроса

Вы можете получить различные компоненты URL через определённые свойства запроса. Для примера возьмём URL:

```
http://localhost:5000/user/login?email=foo@bar.com
```

| Имя компонента | Описание | Значение компонента |
| --- | --- | --- |
| [Path](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Path.md) | Возвращает путь запроса. | `/user/login` |
| [FullPath](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.FullPath.md) | Возвращает путь запроса и строку запроса. | `/user/login?email=foo@bar.com` |
| [FullUrl](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.FullUrl.md) | Возвращает полную строку URL запроса. | `http://localhost:5000/user/login?email=foo@bar.com` |
| [Host](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Host.md) | Возвращает хост запроса. | `localhost` |
| [Authority](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Authority.md) | Возвращает хост и порт запроса. | `localhost:5000` |
| [QueryString](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.QueryString.md) | Возвращает строку запроса. | `?email=foo@bar.com` |
| [Query](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Query.md) | Возвращает запрос в виде именованной коллекции значений. | `{StringValueCollection object}` |
| [IsSecure](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.IsSecure.md) | Определяет, использует ли запрос SSL (true) или нет (false). | `false` |

Вы также можете воспользоваться свойством [HttpRequest.Uri](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Uri.md), которое включает всё перечисленное в одном объекте.

## Метаданные запроса и отмена

Sisk также прикрепляет к каждому запросу оперативные метаданные. Эти свойства полезны для журналов, трассировки, локализации, диагностики и длительных операций:

| Свойство или метод | Назначение |
| --- | --- |
| [RequestId](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RequestId.md) | Уникальный идентификатор запроса. Включите [IncludeRequestIdHeader](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.IncludeRequestIdHeader.md), чтобы возвращать его в заголовке `X-Request-Id`. |
| [RequestedAt](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RequestedAt.md) | Момент создания объекта запроса Sisk. |
| [RemoteAddress](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RemoteAddress.md) | Адрес клиента, полученный из соединения, либо из вашего [ForwardingResolver](https://docs.sisk-framework.org/ru/docs/advanced/forwarding-resolvers.md). |
| [Culture](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Culture.md) | Наиболее подходящая культура, определённая из `Accept-Language`, с fallback к текущей культуре. |
| [DisconnectToken](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.DisconnectToken.md) | Токен отмены, сигнализирующий о разрыве соединения клиентом, если поддерживается используемым HTTP‑движком. |
| [Bag](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Bag.md) | Типизированное хранилище ключ/значение, доступное между обработчиками запросов и действием маршрута. |
| [GetRawHttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetRawHttpRequest.md) | Текстовое представление запроса для диагностики. |

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

Также можно определить, есть ли тело у запроса и загружено ли оно, с помощью свойств [HasContents](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.HasContents.md) (определяет наличие содержимого) и [IsContentAvailable](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.IsContentAvailable.md) (указывает, что сервер полностью получил содержимое от удалённого узла).

Повторно читать содержимое запроса через `GetRequestStream` нельзя. Если вы читаете его этим методом, значения в `RawBody` и `Body` также станут недоступными. Не требуется явно освобождать поток запроса в контексте запроса — он освобождается в конце HTTP‑сессии, в которой был создан. Кроме того, вы можете использовать свойство [HttpRequest.RequestEncoding](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RequestEncoding.md) для получения оптимальной кодировки при ручном декодировании запроса.

Сервер накладывает ограничения на чтение содержимого запроса, которые применяются как к [HttpRequest.Body](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Body.md), так и к [HttpRequest.RawBody](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Body.md). Эти свойства копируют весь входной поток в локальный буфер размером, равным [HttpRequest.ContentLength](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.ContentLength.md).

Если отправленное содержимое превышает значение [HttpServerConfiguration.MaximumContentLength](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength.md), клиент получает ответ с кодом 413 Content Too Large. Кроме того, если ограничение не задано или слишком велико, сервер бросит [OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception?view=net-8.0), когда размер содержимого, отправленного клиентом, превысит [Int32.MaxValue](https://learn.microsoft.com/en-us/dotnet/api/system.int32.maxvalue) (2 ГБ) и будет попытка доступа к нему через одно из упомянутых выше свойств. Содержимое всё равно можно обрабатывать потоково.

> [!NOTE]
> Хотя Sisk позволяет это, всегда рекомендуется следовать HTTP‑семантике при построении приложения и не получать или обслуживать содержимое в методах, где это не предусмотрено. Подробнее см. [RFC 9110 "HTTP Semantics"](https://httpwg.org/spec/rfc9110.html).

## Чтение JSON‑запросов

Для JSON‑API предпочтительно использовать встроенные помощники JSON вместо ручного чтения `Body` и десериализации. Они используют [System.Text.Json](https://learn.microsoft.com/en-us/dotnet/api/system.text.json) и по умолчанию применяют [HttpRequest.DefaultJsonSerializerOptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.DefaultJsonSerializerOptions.md).

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

Текущий [HttpContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.md) можно получить статическим методом `HttpContext.GetCurrentContext()`. Этот метод возвращает контекст запроса, обрабатываемого в текущем потоке.

```cs
HttpContext context = HttpContext.GetCurrentContext();
```

### Режим журналирования

Свойство [HttpContext.LogMode](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.LogMode.md) позволяет управлять поведением журналирования для текущего запроса. Вы можете включать или отключать журналирование для отдельных запросов, переопределяя конфигурацию сервера по умолчанию.

```cs
// Отключить журналирование для этого запроса
context.LogMode = LogOutputMode.None;
```

### Request Bag

Объект [RequestBag](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.RequestBag.md) хранит информацию, передаваемую от одного обработчика запроса к другому, и может быть использован в конечной точке. Этот объект также доступен обработчикам запросов, которые выполняются после обратного вызова маршрута.

> [!TIP]
> Это свойство также доступно через свойство [HttpRequest.Bag](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Bag.md).

```cs {title="Middleware/AuthenticateUserRequestHandler.cs"}
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

```cs {title="Controller/MyController.cs"}
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

```cs {title="Middleware/Authenticate.cs"}
public class Authenticate : RequestHandler
{
    public override HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        request.Bag.Set<User>(authUser);
    }
}
```

```csharp {title="Controller/MyController.cs"}
[RouteGet("/")]
[RequestHandler<Authenticate>]
public static HttpResponse GetUser(HttpRequest request)
{
    var user = request.Bag.Get<User>();
    ...
}
```

## Получение данных формы

Данные формы можно получить в виде [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) следующим образом:

```cs {title="Controller/Auth.cs"}
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

```cs {title="Controller/Auth.cs"}
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

Для асинхронных маршрутов используйте [GetMultipartFormContentAsync](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetMultipartFormContentAsync.md):

```cs
var multipartFormDataObjects =
    await request.GetMultipartFormContentAsync(request.DisconnectToken);
```

Подробнее о [Multipart form objects](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.md) Sisk, их методах, свойствах и возможностях.

## Обнаружение разрыва соединения клиентом

Начиная с версии v1.15 Sisk предоставляет токен отмены через [HttpRequest.DisconnectToken](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.DisconnectToken.md). Когда используемый HTTP‑движок поддерживает обнаружение разрыва, этот токен отменяется при закрытии клиентом соединения до завершения ответа. Это удобно для остановки длительных операций, когда клиент больше не ждёт результата.

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

Движок [Cadente](https://docs.sisk-framework.org/ru/docs/cadente.md) поддерживает `DisconnectToken`. Если ваш маршрут зависит от отмены при разрыве, используйте Cadente или другой движок, явно реализующий это поведение. Даже при поддерживаемом движке отмена является кооперативной: передавайте токен в асинхронные API и проверяйте его в собственных длительных задачах.

## Поддержка Server‑sent events

Sisk поддерживает [Server‑sent events](https://developer.mozilla.org/en-US/docs/ru/Web/API/Server-sent_events), позволяя отправлять фрагменты как поток и поддерживать соединение между сервером и клиентом живым.

Вызов метода [HttpRequest.GetEventSource](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetEventSource.md) переводит HttpRequest в состояние слушателя. В этом случае контекст HTTP‑запроса не будет ожидать HttpResponse, так как он будет «перекрывать» пакеты, отправляемые серверными событиями.

После отправки всех пакетов обратный вызов должен вернуть метод [Close](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequestEventSource.Close.md), который отправит финальный ответ серверу и укажет, что поток завершён.

Невозможно предсказать общую длину всех пакетов, поэтому определить конец соединения с помощью заголовка `Content-Length` нельзя.

По умолчанию большинство браузеров не поддерживают отправку HTTP‑заголовков или методов, отличных от GET, в серверных событиях. Поэтому будьте осторожны, используя обработчики запросов с event‑source, требующие специфических заголовков — скорее всего они не будут присутствовать.

Кроме того, большинство браузеров перезапускают поток, если метод [EventSource.close](https://developer.mozilla.org/en-US/docs/ru/Web/API/EventSource/close) не был вызван на клиенте после получения всех пакетов, что приводит к бесконечной дополнительной обработке на сервере. Чтобы избежать такой проблемы, обычно отправляют финальный пакет, указывающий, что источник событий завершил передачу.

Ниже пример того, как браузер может взаимодействовать с сервером, поддерживающим Server‑side events.

```html {title="sse-example.html"}
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

```cs {title="Controller/MyController.cs"}
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

Вы можете определить собственные резолверы в Sisk с помощью [forwarding resolvers](https://docs.sisk-framework.org/ru/docs/advanced/forwarding-resolvers.md).

## Кодировка заголовков

Кодировка заголовков может стать проблемой для некоторых реализаций. В Windows заголовки UTF‑8 не поддерживаются, поэтому используется ASCII. Sisk имеет встроенный конвертер кодировок, который может помочь декодировать неправильно закодированные заголовки.

Эта операция ресурсоёмка и по умолчанию отключена, но её можно включить через [HttpServerConfiguration.NormalizeHeadersEncodings](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.NormalizeHeadersEncodings.md).
