# Запросы

Запросы представляют собой структуры, которые представляют сообщение HTTP-запроса. Объект [HttpRequest](/api/Sisk.Core.Http.HttpRequest) содержит полезные функции для обработки сообщений HTTP в вашем приложении.

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
> В отличие от маршрутных методов, это свойство не возвращает элемент [RouteMethod.Any](/api/Sisk.Core.Routing.RouteMethod). Вместо этого оно возвращает настоящий метод запроса.

## Получение компонентов URL-адреса запроса

Вы можете получить различные компоненты из URL-адреса с помощью определенных свойств запроса. Для этого примера рассмотрим URL-адрес:

```
http://localhost:5000/user/login?email=foo@bar.com
```

| Название компонента | Описание | Значение компонента |
|---|---|---|
| [Path](/api/Sisk.Core.Http.HttpRequest.Path) | Получает путь запроса. | `/user/login` |
| [FullPath](/api/Sisk.Core.Http.HttpRequest.FullPath) | Получает путь запроса и строку запроса. | `/user/login?email=foo@bar.com` |
* [FullUrl](/api/Sisk.Core.Http.HttpRequest.FullUrl) | Получает полный URL-адрес запроса. | `http://localhost:5000/user/login?email=foo@bar.com` |
| [Host](/api/Sisk.Core.Http.HttpRequest.Host) | Получает хост запроса. | `localhost` |
| [Authority](/api/Sisk.Core.Http.HttpRequest.Authority) | Получает хост и порт запроса. | `localhost:5000` |
| [QueryString](/api/Sisk.Core.Http.HttpRequest.QueryString) | Получает запрос запроса. | `?email=foo@bar.com` |
| [Query](/api/Sisk.Core.Http.HttpRequest.Query) | Получает запрос запроса в коллекцию значений с именем. | `{StringValueCollection object}` |
| [IsSecure](/api/Sisk.Core.Http.HttpRequest.IsSecure) | Определяет, использует ли запрос SSL (true) или нет (false). | `false` |

Вы также можете использовать свойство [HttpRequest.Uri](/api/Sisk.Core.Http.HttpRequest.Uri), которое включает все вышеперечисленное в одном объекте.

## Получение тела запроса

Некоторые запросы включают тело, например, формы, файлы или транзакции API. Вы можете получить тело запроса из свойства:

```cs
// получает тело запроса в виде строки, используя кодировку запроса в качестве кодировщика
string body = request.Body;

// или получает его в виде массива байтов
byte[] bodyBytes = request.RawBody;

// или иначе, вы можете получить его потоком
Stream requestStream = request.GetRequestStream();
```

Также можно определить, есть ли тело в запросе и загружено ли оно с помощью свойств [HasContents](/api/Sisk.Core.Http.HttpRequest.HasContents), которое определяет, имеет ли запрос содержимое, и [IsContentAvailable](/api/Sisk.Core.Http.HttpRequest.IsContentAvailable), которое указывает на то, что HTTP-сервер полностью получил содержимое из удаленного узла.

Невозможно прочитать содержимое запроса через `GetRequestStream` более одного раза. Если вы прочитаете с помощью этого метода, значения в `RawBody` и `Body` также не будут доступны. Не нужно освобождать поток запроса в контексте запроса, так как он освобождается в конце HTTP-сессии, в которой он был создан. Также вы можете использовать свойство [HttpRequest.RequestEncoding](/api/Sisk.Core.Http.HttpRequest.RequestEncoding), чтобы получить лучшую кодировку для декодирования запроса вручную.

Сервер имеет ограничения для чтения содержимого запроса, которые применяются как к [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body), так и к [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.RawBody). Эти свойства копируют весь входной поток в локальный буфер, размером с [HttpRequest.ContentLength](/api/Sisk.Core.Http.HttpRequest.ContentLength).

Ответ с кодом состояния 413 Content Too Large возвращается клиенту, если отправленное содержимое больше, чем [HttpServerConfiguration.MaximumContentLength](/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength), определенный в конфигурации пользователя. Кроме того, если конфигурация не задана или она слишком велика, сервер выбросит исключение [OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception?view=net-8.0), когда содержимое, отправленное клиентом, превышает [Int32.MaxValue](https://learn.microsoft.com/en-us/dotnet/api/system.int32.maxvalue) (2 ГБ) и если содержимое пытаются получить с помощью одного из упомянутых выше свойств. Вы все еще можете обрабатывать содержимое с помощью потоковой передачи.

> [!NOTE]
> Sisk следует RFC 9110 "HTTP Semantics", которые не разрешают определенным методам запроса иметь тело. Эти запросы немедленно сбросят 400 (Bad Request) с статусом `ContentServedOnIllegalMethod`. Запросы с телами не разрешены в методах GET, OPTIONS, HEAD и TRACE. Вы можете прочитать [RFC 9910](https://httpwg.org/spec/rfc9110.html) здесь.

> You can disable this feature by setting [ThrowContentOnNonSemanticMethods](/api/Sisk.Core.Http.HttpServerFlags.ThrowContentOnNonSemanticMethods) to `false`.

## Получение контекста запроса

HTTP-контекст - это эксклюзивный объект Sisk, который хранит информацию о HTTP-сервере, маршруте, маршрутизаторе и обработчике запроса. Вы можете использовать его, чтобы организовать себя в среде, где эти объекты сложно организовать.

Объект [RequestBag](/api/Sisk.Core.Http.HttpContext.RequestBag) содержит хранимую информацию, которая передается из обработчика запроса в другое место, и может быть использована в конечном вызове. Этот объект также может быть использован обработчиками запроса, которые выполняются после вызова маршрута.

> [!TIP]
> This property is also accessible by [HttpRequest.Bag](/api/Sisk.Core.Http.HttpRequest.Bag) property.

```cs
public class AuthenticateUserRequestHandler : IRequestHandler
{
    public string Identifier { get; init; } = Guid.NewGuid().ToString();
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;

    public HttpResponse? Execute(HttpRequest request, HttpContext context)

    if (request.Headers["Authorization"] != null)
    {
        context.RequestBag.Add("AuthenticatedUser", "Bob");
        return null;
    }
    else
    {
        return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
    }
}
```

The above request handler will define `AuthenticatedUser` in the request bag, and can be consumed later in the final callback:

```cs
public class MyController
{
    [RouteGet("/")]
    [RequestHandler<AuthenticateUserRequestHandler>
    static HttpResponse Index(HttpRequest request)
    {
        var user = request.Context.RequestBag.Get<User>();
    }
}
```

You can also use the `Bag.Set()` and `Bag.Get()` helper methods to get or set objects by their type singletons.

```cs
public class Authenticate : RequestHandler
{
    public override HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        request.Bag.Set<User>
    }
}
```

## Получение данных формы

You can get the values of a form data in a [NameValueCollection](https://learn.

```cs
static HttpResponse Index(HttpRequest request)
{
    var form = request.GetFormContent();

    string? username = form["username"];
    string? password = form["password"];

    if (AttempLogin(username, password) == true
    {
        ...
    }
}
```

## Получение многочленных данных формы

Sisk's HTTP request lets you get uploaded multipart contents, such as files, form fields, or any binary content.

```cs
static HttpResponse Index(HttpRequest request)
{
    var multipartFormDataObjects = request.GetMultipartFormContent();

    foreach (MultipartObject uploadedObject in multipartFormDataObjects
    {
        Console.WriteLine("File name       : " + uploadedObject.Filename;
        Console.WriteLine("Field name      : " + uploadedObject.Name;
        Console.WriteLine("Content length  : " + uploadedObject.ContentLength;
        Console.WriteLine("Common format   : " + uploadedObject.GetCommonFileFormat();
    }
```

You can read more about Sisk [Multipart form objects](/api/Sisk.Core.Entity.MultipartObject) and it's methods, properties and functionalities.

## Поддержка событий сервер-side events

Sisk supports [Server-side events](https://developer.mozilla.org/en-US/API/EventSource/close)

Calling the [HttpRequest.GetEventSource](/api/Sisk.Core.Http.HttpRequest.GetEventSource) method will put the HttpRequest in it's listener state. From this, the context of this HTTP request will not expect an HttpResponse as it will overlap the packets sent by server-side events.

After sending all packets, the callback must return the [Close](/api/Sisk.Core.Http.HttpRequestEventSource.Close) method, which will send the final response to the server and indicate that the streaming has ended.

It's not possible to predict the total length of all packets that will be sent, so it's not possible to determine the end of the connection with `Content-Length header.

By default, most browsers restart streams if the `EventSource.close
```html
<html>
<body>
<b>Fruits:</b>
<ul>
<li>
<li>
<li>
<li>
```

And progressively send the messages to the client:
```cs
public class MyController
```

























































































```html
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
