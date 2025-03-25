# Ответы

Ответы представляют собой объекты, которые являются HTTP-ответами на HTTP-запросы. Они отправляются сервером клиенту в качестве указания на запрос ресурса, страницы, документа, файла или другого объекта.

HTTP-ответ состоит из статуса, заголовков и содержимого.

В этом документе мы научим вас, как проектировать HTTP-ответы с помощью Sisk.

## Установка HTTP-статуса

Список HTTP-статусов остался неизменным с HTTP/1.0, и Sisk поддерживает все они.

```cs
HttpResponse res = new HttpResponse();
res.Status = System.Net.HttpStatusCode.Accepted; // 202
```

Или с помощью синтаксиса Fluent:

```cs
new HttpResponse()
    .WithStatus(200) // или
    .WithStatus(HttpStatusCode.Ok) // или
    .WithStatus(HttpStatusInformation.Ok);
```

Вы можете увидеть полный список доступных HttpStatusCode [здесь](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httpstatuscode). Вы также можете предоставить свой собственный код статуса, используя структуру [HttpStatusInformation](/api/Sisk.Core.Http.HttpStatusInformation).

## Тело и тип содержимого

Sisk поддерживает родные объекты .NET для отправки тела в ответах. Вы можете использовать класс [StringContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.stringcontent), чтобы отправить JSON-ответ, например:

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

Сервер всегда попытается рассчитать `Content-Length` из того, что вы определили в содержимом, если вы не определили его явно в заголовке. Если сервер не может неявно получить заголовок `Content-Length` из содержимого ответа, ответ будет отправлен с Chunked-Encoding.

Вы также можете передавать ответ, отправляя [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent) или используя метод [GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream).

## Заголовки ответа

Вы можете добавлять, редактировать или удалять заголовки, которые отправляются в ответе. Пример ниже показывает, как отправить ответ с перенаправлением клиенту.

```cs
HttpResponse res = new HttpResponse();
res.Status = HttpStatusCode.Moved;
res.Headers.Add(HttpKnownHeaderNames.Location, "/login");
```

Или с помощью синтаксиса Fluent:

```cs
new HttpResponse(301)
    .WithHeader("Location", "/login");
```

Когда вы используете метод [Add](/api/Sisk.Core.Entity.HttpHeaderCollection.Add) класса HttpHeaderCollection, вы добавляете заголовок к запросу без изменения уже отправленных заголовков. Метод [Set](/api/Sisk.Core.Entity.HttpHeaderCollection.Set) заменяет заголовки с тем же именем на указанное значение. Индексатор HttpHeaderCollection внутренне вызывает метод Set для замены заголовков.

## Отправка файлов cookie

Sisk имеет методы, которые облегчают определение файлов cookie на клиенте. Файлы cookie, установленные этим методом, уже закодированы в URL и соответствуют стандарту RFC-6265.

```cs
HttpResponse res = new HttpResponse();
res.SetCookie("cookie-name", "cookie-value");
```

Или с помощью синтаксиса Fluent:

```cs
new HttpResponse(301)
    .WithCookie("cookie-name", "cookie-value", expiresAt: DateTime.Now.Add(TimeSpan.FromDays(7)));
```

Существуют другие [более полные версии](/api/Sisk.Core.Http.CookieHelper.SetCookie) того же метода.

## Фрагментированные ответы

Вы можете установить кодирование передачи на фрагментированное, чтобы отправить большие ответы.

```cs
HttpResponse res = new HttpResponse();
res.SendChunked = true;
```

При использовании фрагментированного кодирования заголовок `Content-Length` автоматически опускается.

## Поток ответа

Потоки ответа являются управляемым способом, который позволяет отправлять ответы поэтапно. Это более низкоуровневая операция, чем использование объектов HttpResponse, поскольку они требуют от вас отправки заголовков и содержимого вручную, а затем закрытия соединения.

Этот пример открывает поток только для чтения файла, копирует поток в поток вывода ответа и не загружает весь файл в память. Это может быть полезно для обслуживания средних или больших файлов.

```cs
// получает поток вывода ответа
using var fileStream = File.OpenRead("my-big-file.zip");
var responseStream = request.GetResponseStream();

// устанавливает кодирование ответа для использования фрагментированного кодирования
// также не следует отправлять заголовок content-length при использовании
// фрагментированного кодирования
responseStream.SendChunked = true;
responseStream.SetStatus(200);
responseStream.SetHeader(HttpKnownHeaderNames.ContentType, contentType);

// копирует поток файла в поток вывода ответа
fileStream.CopyTo(responseStream.ResponseStream);

// закрывает поток
return responseStream.Close();
```

## Сжатие GZip, Deflate и Brotli

Вы можете отправлять ответы со сжатым содержимым в Sisk, сжимая HTTP-содержимое. Сначала оберните объект [HttpContent](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.httpcontent) в один из компрессоров ниже, чтобы отправить сжатый ответ клиенту.

```cs
router.MapGet("/hello.html", request => {
    string myHtml = "...";
    
    return new HttpResponse () {
        Content = new GZipContent(new HtmlContent(myHtml)),
        // или Content = new BrotliContent(new HtmlContent(myHtml)),
        // или Content = new DeflateContent(new HtmlContent(myHtml)),
    };
});
```

Вы также можете использовать эти сжатые содержимые с потоками.

```cs
router.MapGet("/archive.zip", request => {
    
    // не примените "using" здесь. HttpServer будет удалять ваше содержимое
    // после отправки ответа.
    var archive = File.OpenRead("/path/to/big-file.zip");
    
    return new HttpResponse () {
        Content = new GZipContent(archive)
    }
});
```

Заголовки `Content-Encoding` автоматически устанавливаются при использовании этих содержимых.

## Неявные типы ответов

Поскольку версии 0.15, вы можете использовать другие типы ответов, кроме HttpResponse, но необходимо настроить маршрутизатор, чтобы он обрабатывал каждый тип объекта.

Концепция заключается в том, чтобы всегда возвращать ссылочный тип и преобразовать его в допустимый объект HttpResponse. Маршруты, которые возвращают HttpResponse, не проходят никаких преобразований.

Типы значений (структуры) не могут использоваться в качестве типа ответа, поскольку они несовместимы с [RouterCallback](/api/Sisk.Core.Routing.RouterCallback), поэтому они должны быть обернуты в ValueResult, чтобы их можно было использовать в обработчиках.

Рассмотрим следующий пример из модуля маршрутизатора, не использующего HttpResponse в качестве типа ответа:

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
        int id = request.RouteParameters["id"].GetInteger();
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

С этого момента необходимо определить в маршрутизаторе, как он будет обрабатывать каждый тип объекта. Объекты всегда являются первым аргументом обработчика, а тип ответа должен быть допустимым объектом HttpResponse. Кроме того, выходные объекты маршрута никогда не должны быть null.

Для типов ValueResult не нужно указывать, что входной объект является ValueResult, и только T, поскольку ValueResult является объектом, отраженным от его исходного компонента.

Связь типов не сравнивает, что было зарегистрировано с типом объекта, возвращаемого из обратного вызова маршрутизатора. Вместо этого он проверяет, является ли тип результата маршрутизатора присваиваемым зарегистрированному типу.

Регистрация обработчика типа Object будет откатиться ко всем предыдущим непроверенным типам. Порядок вставки обработчиков значений также имеет значение, поэтому регистрация обработчика Object будет игнорировать все другие типоспецифические обработчики. Всегда регистрируйте конкретные обработчики значений сначала, чтобы обеспечить порядок.

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
    // do something with enumerableValue here
});

// регистрация обработчика значения объекта должна быть последней
// обработчик значения, который будет использоваться в качестве откатного
r.RegisterValueHandler<object>(fallback =>
{
    HttpResponse res = new HttpResponse();
    res.Status = HttpStatusCode.OK;
    res.Content = JsonContent.Create(fallback);
    return res;
});
```