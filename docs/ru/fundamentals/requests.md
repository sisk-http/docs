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
> В отличие от методов маршрутизации, это свойство не служит для [RouteMethod.Any](/api/Sisk.Core.Routing.RouteMethod) элемента. Вместо этого оно возвращает фактический метод запроса.

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
| [QueryString](/api/Sisk.Core.Http.HttpRequest.QueryString) | Получает строку запроса запроса. | `?email=foo@bar.com` |
| [Query](/api/Sisk.Core.Http.HttpRequest.Query) | Получает строку запроса запроса в виде коллекции именованных значений. | `{StringValueCollection object}` |
| [IsSecure](/api/Sisk.Core.Http.HttpRequest.IsSecure) | Определяет, использует ли запрос SSL (true) или нет (false). | `false` |

Вы также можете использовать свойство [HttpRequest.Uri](/api/Sisk.Core.Http.HttpRequest.Uri), которое включает все вышеперечисленное в один объект.

## Получение тела запроса

Некоторые запросы включают тело, такие как формы, файлы или транзакции API. Вы можете получить тело запроса из свойства:

```cs
// получает тело запроса как строку, используя кодировку запроса в качестве кодировщика
string body = request.Body;

// или получает его в виде массива байтов
byte[] bodyBytes = request.RawBody;

// или же вы можете передать его как поток.
Stream requestStream = request.GetRequestStream();
```

Также возможно определить, есть ли тело в запросе и загружено ли оно с помощью свойств [HasContents](/api/Sisk.Core.Http.HttpRequest.HasContents), которое определяет, имеет ли запрос содержимое, и [IsContentAvailable](/api/Sisk.Core.Http.HttpRequest.IsContentAvailable), которое указывает, что HTTP-сервер полностью получил содержимое из удаленной точки.

Невозможно прочитать содержимое запроса через `GetRequestStream` более одного раза. Если вы прочитаете с помощью этого метода, значения в `RawBody` и `Body` также не будут доступны. Не нужно освобождать поток запроса в контексте запроса, поскольку он освобождается в конце HTTP-сессии, в которой он создается. Кроме того, вы можете использовать свойство [HttpRequest.RequestEncoding](/api/Sisk.Core.Http.HttpRequest.RequestEncoding), чтобы получить лучшую кодировку для декодирования запроса вручную.

Сервер имеет ограничения на чтение содержимого запроса, которые применяются как к [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body), так и к [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.Body). Эти свойства копируют весь входной поток в локальный буфер того же размера, что и [HttpRequest.ContentLength](/api/Sisk.Core.Http.HttpRequest.ContentLength).

Ответ с статусом 413 Содержимое слишком велико возвращается клиенту, если содержимое, отправленное клиентом, больше [HttpServerConfiguration.MaximumContentLength](/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength), определенного в конфигурации пользователя. Кроме того, если нет настроенного ограничения или если оно слишком велико, сервер выдаст исключение [OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception?view=net-8.0), когда содержимое, отправленное клиентом, превышает [Int32.MaxValue](https://learn.microsoft.com/en-us/dotnet/api/system.int32.maxvalue) (2 ГБ) и если содержимое попытается получить доступ через одно из упомянутых выше свойств. Вы все равно можете иметь дело с содержимым через поток.

> [!NOTE]
> Хотя Sisk позволяет это, всегда хорошей идеей является следование семантике HTTP для создания вашего приложения и не получать или обслуживать содержимое в методах, которые не допускают этого. Прочитайте о [RFC 9110 "HTTP Семантика"](https://httpwg.org/spec/rfc9110.html).

## Получение контекста запроса

Контекст HTTP - это эксклюзивный объект Sisk, который хранит информацию о HTTP-сервере, маршруте, маршрутизаторе и обработчике запроса. Вы можете использовать его, чтобы организовать себя в среде, где эти объекты трудно организовать.

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

Вышеуказанный обработчик запроса определит `AuthenticatedUser` в сумке запроса и может быть потреблен позже в конечном обратном вызове:

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

Вы также можете использовать методы `Bag.Set()` и `Bag.Get()`, чтобы получить или задать объекты по их типам синглтонов.

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

Запрос HTTP Sisk позволяет получить загруженные multipart-содержимое, такое как файлы, поля формы или любое бинарное содержимое.

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
    // MultipartObject
    var multipartFormDataObjects = request.GetMultipartFormContent();
    
    foreach (MultipartObject uploadedObject in multipartFormDataObjects)
    {
        // имя файла, предоставленное multipart-формой данных.
        // Null возвращается, если объект не является файлом.
        Console.WriteLine("File name       : " + uploadedObject.Filename);

        // имя поля multipart-формы данных.
        Console.WriteLine("Field name      : " + uploadedObject.Name);

        // длина содержимого multipart-формы данных.
        Console.WriteLine("Content length  : " + uploadedObject.ContentLength);

        // определите формат изображения на основе заголовка файла для каждого
        // известного типа содержимого. Если содержимое не является признанным общим форматом файла,
        // этот метод ниже вернет MultipartObjectCommonFormat.Unknown
        Console.WriteLine("Common format   : " + uploadedObject.GetCommonFileFormat());
    }
}
```

Вы можете прочитать больше о Sisk [Multipart-объектах формы](/api/Sisk.Core.Entity.MultipartObject) и их методах, свойствах и функциях.

## Поддержка серверных событий

Sisk поддерживает [серверные события](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events), которые позволяют отправлять фрагменты как поток и поддерживать соединение между сервером и клиентом.

Вызов метода [HttpRequest.GetEventSource](/api/Sisk.Core.Http.HttpRequest.GetEventSource) поставит HttpRequest в его состояние прослушивания. После этого контекст этого HTTP-запроса не будет ожидать HttpResponse, поскольку он перекроет пакеты, отправленные серверными событиями.

После отправки всех пакетов обратный вызов должен вернуть метод [Close](/api/Sisk.Core.Http.HttpRequestEventSource.Close), который отправит окончательный ответ серверу и укажет, что поток закончился.

Невозможно предсказать, какой будет общая длина всех пакетов, которые будут отправлены, поэтому невозможно определить конец соединения с помощью заголовка `Content-Length`.

По умолчанию большинства браузеров серверные события не поддерживают отправку HTTP-заголовков или методов, кроме метода GET. Поэтому будьте осторожны при использовании обработчиков запросов с запросами event-source, которые требуют определенных заголовков в запросе, поскольку они, вероятно, не будут иметь их.

Кроме того, большинство браузеров перезапускают потоки, если метод [EventSource.close](https://developer.mozilla.org/en-US/docs/Web/API/EventSource/close) не вызван на стороне клиента после получения всех пакетов, что вызывает бесконечную дополнительную обработку на стороне сервера. Чтобы избежать этой проблемы, часто отправляют окончательный пакет, указывающий, что источник событий закончил отправку всех пакетов.

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

И прогрессивно отправляйте сообщения клиенту:

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

Sisk можно использовать с прокси, и поэтому IP-адреса могут быть заменены на конечную точку прокси в транзакции от клиента к прокси.

Вы можете определить свои собственные разрешители в Sisk с помощью [forwarding-разрешителей](/docs/advanced/forwarding-resolvers).

## Кодирование заголовков

Кодирование заголовков может быть проблемой для некоторых реализаций. В Windows заголовки UTF-8 не поддерживаются, поэтому используется ASCII. Sisk имеет встроенный конвертер кодировки, который может быть полезен для декодирования неправильно закодированных заголовков.

Эта операция дорога и отключена по умолчанию, но может быть включена под флагом [NormalizeHeadersEncodings](/specification/spec/Sisk.Core.Http.HttpServerFlags.NormalizeHeadersEncodings).