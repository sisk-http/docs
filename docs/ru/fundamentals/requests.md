# Запросы

Запросы — это структуры, представляющие сообщение HTTP-запроса. Объект [HttpRequest](/api/Sisk.Core.Http.HttpRequest) содержит полезные функции для обработки HTTP‑сообщений во всей вашей программе.

HTTP‑запрос формируется методом, путем, версией, заголовками и телом.

В этом документе мы покажем, как получить каждый из этих элементов.

## Получение метода запроса

Чтобы получить метод полученного запроса, можно использовать свойство Method:

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

Вы можете получить различные компоненты из URL через определенные свойства запроса. Для этого примера рассмотрим URL:

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
| [QueryString](/api/Sisk.Core.Http.HttpRequest.QueryString) | Получает запрос. | `?email=foo@bar.com` |
| [Query](/api/Sisk.Core.Http.HttpRequest.Query) | Получает запрос в виде коллекции именованных значений. | `{StringValueCollection object}` |
| [IsSecure](/api/Sisk.Core.Http.HttpRequest.IsSecure) | Определяет, использует ли запрос SSL (true) или нет (false). | `false` |

Вы также можете воспользоваться свойством [HttpRequest.Uri](/api/Sisk.Core.Http.HttpRequest.Uri), которое включает всё вышеупомянутое в одном объекте.

## Получение тела запроса

Некоторые запросы включают тело, такое как формы, файлы или транзакции API. Вы можете получить тело запроса из свойства:

```cs
// получает тело запроса как строку, используя кодировку запроса в качестве кодировщика
string body = request.Body;

// или получает его в виде массива байт
byte[] bodyBytes = request.RawBody;

// или, наоборот, вы можете потоково читать его.
Stream requestStream = request.GetRequestStream();
```

Также возможно определить, есть ли тело в запросе и загружено ли оно, с помощью свойств [HasContents](/api/Sisk.Core.Http.HttpRequest.HasContents), которое определяет, есть ли у запроса содержимое, и [IsContentAvailable](/api/Sisk.Core.Http.HttpRequest.IsContentAvailable), которое указывает, что HTTP‑сервер полностью получил содержимое от удалённой точки.

Невозможно прочитать содержимое запроса через `GetRequestStream` более одного раза. Если вы прочитаете с помощью этого метода, значения в `RawBody` и `Body` также не будут доступны. Нет необходимости освобождать поток запроса в контексте запроса, так как он освобождается в конце HTTP‑сессии, в которой он создан. Кроме того, вы можете использовать свойство [HttpRequest.RequestEncoding](/api/Sisk.Core.Http.HttpRequest.RequestEncoding), чтобы получить лучшую кодировку для ручного декодирования запроса.

Сервер имеет ограничения на чтение содержимого запроса, которые применяются как к [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body), так и к [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.Body). Эти свойства копируют весь входной поток в локальный буфер того же размера, что и [HttpRequest.ContentLength](/api/Sisk.Core.Http.HttpRequest.ContentLength).

Ответ со статусом 413 Content Too Large возвращается клиенту, если отправленное содержимое превышает [HttpServerConfiguration.MaximumContentLength](/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength), определённое в пользовательской конфигурации. Кроме того, если нет настроенного ограничения или оно слишком велико, сервер выбросит [OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception?view=net-8.0), когда содержимое, отправленное клиентом, превышает [Int32.MaxValue](https://learn.microsoft.com/en-us/dotnet/api/system.int32.maxvalue) (2 ГБ), и если содержимое попытаться получить через одно из упомянутых выше свойств. Вы всё равно можете работать с содержимым через поток.

> [!NOTE]
> Хотя Sisk позволяет это, всегда полезно следовать HTTP‑семантике при создании вашего приложения и не получать или обслуживать контент в методах, которые этого не допускают. Читайте о [RFC 9110 "HTTP Semantics"](https://httpwg.org/spec/rfc9110.html).

## Получение контекста запроса

HTTP Context — это эксклюзивный объект Sisk, который хранит информацию о сервере, маршруте, роутере и обработчике запроса. Вы можете использовать его, чтобы организовать себя в среде, где эти объекты трудно организовать.

Объект [RequestBag](/api/Sisk.Core.Http.HttpContext.RequestBag) содержит сохранённую информацию, которая передаётся от обработчика запроса к другому пункту, и может быть использована в конечном пункте. Этот объект также может использоваться обработчиками запросов, которые выполняются после обратного вызова маршрута.

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

Вышеуказанный обработчик запроса определит `AuthenticatedUser` в мешке запроса и может быть использован позже в конечном обратном вызове:

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

Вы также можете использовать вспомогательные методы `Bag.Set()` и `Bag.Get()` для получения или установки объектов по их типу‑единственникам.

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

Вы можете получить значения данных формы в [NameValueCollection](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.specialized.namevaluecollection) с примером ниже:

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

## Получение многокомпонентных данных формы

HTTP‑запрос Sisk позволяет получить загруженные многокомпонентные содержимое, такие как файлы, поля формы или любой бинарный контент.

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
    // следующий метод читает весь входной запрос в
    // массив MultipartObjects
    var multipartFormDataObjects = request.GetMultipartFormContent();
    
    foreach (MultipartObject uploadedObject in multipartFormDataObjects)
    {
        // Имя файла, предоставленное данными формы Multipart.
        // Возвращается Null, если объект не является файлом.
        Console.WriteLine("File name       : " + uploadedObject.Filename);

        // Имя поля объекта данных формы Multipart.
        Console.WriteLine("Field name      : " + uploadedObject.Name);

        // Длина содержимого данных формы Multipart.
        Console.WriteLine("Content length  : " + uploadedObject.ContentLength);

        // Определить формат изображения, основанный на заголовке файла для каждого
        // известного типа содержимого. Если содержимое не является распознанным общим файлом,
        // этот метод ниже вернёт MultipartObjectCommonFormat.Unknown
        Console.WriteLine("Common format   : " + uploadedObject.GetCommonFileFormat());
    }
}
```

Вы можете прочитать больше о [Multipart form objects](/api/Sisk.Core.Entity.MultipartObject) и их методах, свойствах и функциональностях.

## Обнаружение отключения клиента

Начиная с версии v1.15 Sisk предоставляет CancellationToken, который выбрасывается, когда соединение между клиентом и сервером преждевременно закрывается до получения ответа. Этот токен может быть полезен для обнаружения, когда клиент больше не хочет ответа и отмены длительных операций.

```csharp
router.MapGet("/connect", async (HttpRequest req) =>
{
    // получает токен отключения из запроса
    var dc = req.DisconnectToken;

    await LongOperationAsync(dc);

    return new HttpResponse();
});
```

Этот токен не совместим со всеми HTTP‑движками, и каждый требует реализации.

## Поддержка событий, отправляемых сервером

Sisk поддерживает [Server-sent events](https://developer.mozilla.org/en-US/docs/ru/Web/API/Server-sent_events), которые позволяют отправлять куски как поток и держать соединение между сервером и клиентом живым.

Вызов метода [HttpRequest.GetEventSource](/api/Sisk.Core.Http.HttpRequest.GetEventSource) поместит HttpRequest в его состояние слушателя. Отсюда контекст этого HTTP‑запроса не будет ожидать HttpResponse, так как он будет перекрывать пакеты, отправляемые серверными событиями.

После отправки всех пакетов, обратный вызов должен вернуть метод [Close](/api/Sisk.Core.Http.HttpRequestEventSource.Close), который отправит окончательный ответ серверу и укажет, что поток завершён.

Невозможно предсказать, какой будет общая длина всех пакетов, которые будут отправлены, поэтому невозможно определить конец соединения с заголовком `Content-Length`.

По умолчанию большинство браузеров не поддерживают отправку HTTP‑заголовков или методов, отличных от GET. Поэтому будьте осторожны при использовании обработчиков запросов с запросами event‑source, которые требуют конкретных заголовков в запросе, так как они, вероятно, не будут иметь их.

Кроме того, большинство браузеров перезапускают потоки, если метод [EventSource.close](https://developer.mozilla.org/en-US/docs/ru/Web/API/EventSource/close) не вызывается на стороне клиента после получения всех пакетов, вызывая бесконечную дополнительную обработку на стороне сервера. Чтобы избежать такой проблемы, обычно отправляется окончательный пакет, указывающий, что источник событий завершил отправку всех пакетов.

Ниже приведён пример, показывающий, как браузер может сообщить серверу, поддерживающему Server‑side events.

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

При запуске этого кода ожидается результат, похожий на это:

<img src="/assets/img/server side events demo.gif" />

## Разрешение проксированных IP и хостов

Sisk можно использовать с прокси, и поэтому IP‑адреса могут быть заменены прокси‑конечной точкой в транзакции от клиента к прокси.

Вы можете определить собственные резолверы в Sisk с [forwarding resolvers](/docs/ru/advanced/forwarding-resolvers).

## Кодирование заголовков

Кодирование заголовков может быть проблемой для некоторых реализаций. В Windows заголовки UTF‑8 не поддерживаются, поэтому используется ASCII. Sisk имеет встроенный конвертер кодировок, который может быть полезен для декодирования некорректно закодированных заголовков.

Эта операция затратна и отключена по умолчанию, но может быть включена под флагом [NormalizeHeadersEncodings](/specification/spec/Sisk.Core.Http.HttpServerFlags.NormalizeHeadersEncodings).