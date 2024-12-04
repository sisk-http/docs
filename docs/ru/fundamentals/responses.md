# Ответы

От Responses представляют собой объекты HTTP, являющиеся ответом сервера на запрос клиента. Они информируют клиента о результатах запроса ресурса, страницы, документа, файла или другого объекта.

HTTP-ответ состоит из статуса, заголовков и содержимого.

В этом документе мы научим вас, как архитектурировать HTTP-ответы с помощью Sisk.

## Установка HTTP-статуса

Список HTTP-статусов тот же с HTTP/1.0, и Sisk поддерживает все их.

```cs
HttpResponse res = new HttpResponse();
res.Status = System.Net.HttpStatusCode.Accepted; // 202
```

Или с помощью Fluent Syntax:

```cs
new HttpResponse()
    .WithStatus(200) // или
    .WithStatus(HttpStatusCode.Ok) // или
    .WithStatus(HttpStatusInformation.Ok);
```

Полный список доступных HttpStatusCode можно найти [здесь](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httpstatuscode). Вы также можете указать свой собственный код статуса, используя структуру [HttpStatusInformation](/api/Sisk.Core.Http.HttpStatusInformation).

## Тело и content-type

Sisk поддерживает использование встроенных .NET объектов контента для отправки тела в ответах. Вы можете использовать класс [StringContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.stringcontent) для отправки JSON-ответа, например:

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

Сервер всегда будет пытаться рассчитать `Content-Length` на основе того, что вы указали в контенте, если вы не указали его явно в заголовке. Если сервер не может неявно получить заголовок Content-Length из содержимого ответа, ответ будет отправлен с кодировкой Chunked-Encoding.

Вы также можете передавать ответ по потоку, отправляя [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent) или используя метод `GetResponseStream`.

## Заголовки ответа

Вы можете добавлять, изменять или удалять заголовки, которые вы отправляете в ответе. Ниже приведен пример того, как отправить ответ с перенаправлением клиента.

```cs
HttpResponse res = new HttpResponse();
res.Status = HttpStatusCode.Moved;
res.Headers.Add(HttpKnownHeaderNames.Location, "/login");
```

Или с помощью Fluent Syntax:

```cs
new HttpResponse(301)
    .WithHeader("Location", "/login");
```

При использовании метода [Add](/api/Sisk.Core.Entity.HttpHeaderCollection.Add) HttpHeaderCollection, вы добавляете заголовок к запросу без изменения уже отправленных.
Метод [Set](/api/Sisk.Core.Entity.HttpHeaderCollection.Set) заменяет заголовки с тем же именем на указанное значение. Индексатор HttpHeaderCollection внутренне вызывает метод Set для замены заголовков.

## Отправка cookie

Sisk предоставляет методы для определения cookie на стороне клиента. Cookie, установленные этим методом, уже закодированы URL и соответствуют стандарту RFC-6265.

```cs
HttpResponse res = new HttpResponse();
res.SetCookie("cookie-name", "cookie-value");
```

Или с помощью Fluent Syntax:

```cs
new HttpResponse(301)
    .WithCookie("cookie-name", "cookie-value", expiresAt: DateTime.Now.Add(TimeSpan.FromDays(7)));
```

Существуют другие [более полные версии](/api/Sisk.Core.Http.CookieHelper.SetCookie) того же метода.

## Chunked ответы

Вы можете установить кодировку передачи на chunked для отправки больших ответов.

```cs
HttpResponse res = new HttpResponse();
res.SendChunked = true;
```

При использовании chunked-encoding заголовок Content-Length автоматически опускается.

## Поток ответа

Потоки ответа - это управляемый способ отправки ответов частями. Это более низкоуровневая операция, чем использование объектов HttpResponse, так как они требуют от вас отправки заголовков и содержимого вручную, а затем закрытия соединения.

Этот пример открывает для чтения поток для файла, копирует поток в поток ответа и не загружает весь файл в память. Это может быть полезно для обслуживания средних или больших файлов.

```cs
// получает поток ответа
using var fileStream = File.OpenRead("my-big-file.zip");
var responseStream = request.GetResponseStream();

// устанавливает кодировку ответа на chunked-encoding
// также не следует отправлять заголовок Content-Length при использовании
// chunked-encoding
responseStream.SendChunked = true;
responseStream.SetStatus(200);
responseStream.SetHeader(HttpKnownHeaderNames.ContentType, contentType);

// копирует поток файла в поток ответа
fileStream.CopyTo(responseStream.ResponseStream);

// закрывает поток
return responseStream.Close();
```

## Явно определенные типы ответа

С версии 0.15 вы можете использовать типы возврата, отличные от HttpResponse, но необходимо настроить маршрутизатор, как он будет обрабатывать каждый тип объекта.

Суть в том, чтобы всегда возвращать ссылку на тип и преобразовывать его в объект HttpResponse.

Маршруты, возвращающие HttpResponse, не подвергаются преобразованию.

Типы значений (структуры) не могут использоваться в качестве типа возврата, так как они не совместимы с [RouterCallback](/api/Sisk.Core.Routing.RouterCallback), поэтому их необходимо обернуть в ValueResult, чтобы их можно было использовать в обработчиках.

Рассмотрим следующий пример из модуля маршрутизатора, не использующего HttpResponse в типе возврата:

```cs
[RoutePrefix("/users")]
public class UsersController : RouterModule
{
    public List<User> Users = new List<User>();

    [RouteGet]
    public IEnumerable<User> Index(HttpRequest request)
    {
        return Users.ToArray();
    }

    [RouteGet("<id>")]
    public User View(HttpRequest request)
    {
        int id = request.Query["id"].GetInteger();
        User dUser = Users.First(u => u.Id == id);

        return dUser;
    }

    [RoutePost]
    public ValueResult<bool> Create(HttpRequest request)
    {
        User fromBody = JsonSerializer.Deserialize<User>(request.Body)!;
        Users.Add(fromBody);

        return true;
    }
}
```

Теперь необходимо определить в маршрутизаторе, как он будет обрабатывать каждый тип объекта. Объекты всегда являются первым аргументом обработчика, и тип выходных данных должен быть действительным объектом HttpResponse. Также объекты выходных данных маршрута не должны быть null.

Для типов ValueResult не нужно указывать, что входной объект - ValueResult, и только T, так как ValueResult - это объект, отражающий его исходный компонент.

Связь типов не сравнивает то, что было зарегистрировано, с типом объекта, возвращаемого из маршрутизатора callback. Вместо этого она проверяет, является ли тип результата маршрутизатора присваиваемым зарегистрированному типу.

Регистрация обработчика типа Object будет использоваться как fallback для всех ранее невалидированных типов. Порядок вставки обработчиков значений также имеет значение, поэтому регистрация обработчика Object будет игнорировать все другие обработчики, специфичные для типа. Всегда регистрируйте обработчики значений конкретного типа в первую очередь, чтобы обеспечить порядок.

```cs
Router r = new Router();
r.SetObject(new UsersController());

r.RegisterValueHandler<bool>(bolVal =>
{
    HttpResponse res = new HttpResponse();
    res.Status = (bool)bolVal ? HttpStatusCode.OK : HttpStatusCode.BadRequest;
    return res;
});

r.RegisterValueHandler<IEnumerable>(enumerableValue =>
{
    return new HttpResponse();
    // здесь можно что-то сделать с enumerableValue
});

// регистрация обработчика значений типа Object должна быть последней
// обработчиком значений, который будет использоваться как fallback
r.RegisterValueHandler<object>(fallback =>
{
    HttpResponse res = new HttpResponse();
    res.Status = HttpStatusCode.OK;
    res.Content = JsonContent.Create(fallback);
    return res;
});
```
