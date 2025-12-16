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

Вы можете увидеть полный список доступных HttpStatusCode [здесь](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httpstatuscode). Вы также можете предоставить свой собственный код состояния, используя структуру [HttpStatusInformation](/api/Sisk.Core.Http.HttpStatusInformation).

## Тело и тип содержимого

Sisk поддерживает родные объекты .NET для отправки тела в ответах. Вы можете использовать класс [StringContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.stringcontent), чтобы отправить JSON-ответ, например:

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

Сервер всегда попытается рассчитать `Content-Length` из того, что вы определили в содержимом, если вы не определили его явно в заголовке. Если сервер не может неявно получить заголовок `Content-Length` из содержимого ответа, ответ будет отправлен с Chunked-Encoding.

Вы также можете передавать ответ по потоку, отправляя [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent) или используя метод [GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream).

## Заголовки ответа

Вы можете добавлять, редактировать или удалять заголовки, которые вы отправляете в ответе. Пример ниже показывает, как отправить ответ с перенаправлением клиенту.

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

Вы также можете получать значения заголовков, используя метод [GetHeaderValue](/api/Sisk.Core.Entity.HttpHeaderCollection.GetHeaderValue). Этот метод помогает получать значения из обоих ответов и содержимого (если оно установлено).

```cs
// Возвращает значение заголовка "Content-Type", проверяя оба response.Headers и response.Content.Headers
string? contentType = response.GetHeaderValue("Content-Type");
```

## Отправка файлов cookie

Sisk имеет методы, которые облегчают определение файлов cookie на клиенте. Файлы cookie, установленные этим методом, уже URL-кодированы и соответствуют стандарту RFC-6265.

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

При использовании фрагментированного кодирования заголовок Content-Length автоматически опускается.

## Поток ответа

Потоки ответа являются управляемым способом, который позволяет отправлять ответы по частям. Это более низкоуровневая операция, чем использование объектов HttpResponse, поскольку они требуют от вас отправки заголовков и содержимого вручную, а затем закрытия соединения.

Этот пример открывает поток только для чтения для файла, копирует поток в поток вывода ответа и не загружает весь файл в память. Это может быть полезно для обслуживания средних или больших файлов.

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

Заголовки Content-Encoding устанавливаются автоматически при использовании этих содержимых.

## Автоматическое сжатие

Возможно автоматически сжимать HTTP-ответы с помощью свойства [EnableAutomaticResponseCompression](/api/Sisk.Core.Http.HttpServerConfiguration.EnableAutomaticResponseCompression). Это свойство автоматически обертывает содержимое ответа из маршрутизатора в сжимаемое содержимое, которое принимается запросом, если ответ не наследуется от [CompressedContent](/api/Sisk.Core.Http.CompressedContent).

Только одно сжимаемое содержимое выбирается для запроса, выбранное в соответствии с заголовком Accept-Encoding, который следует порядку:

- [BrotliContent](/api/Sisk.Core.Http.BrotliContent) (br)
- [GZipContent](/api/Sisk.Core.Http.GZipContent) (gzip)
- [DeflateContent](/api/Sisk.Core.Http.DeflateContent) (deflate)

Если запрос указывает, что он принимает любой из этих методов сжатия, ответ будет автоматически сжат.

## Неявные типы ответов

Вы можете использовать другие типы возврата, кроме HttpResponse, но для этого необходимо настроить маршрутизатор, чтобы он обрабатывал каждый тип объекта.

Концепция заключается в том, чтобы всегда возвращать ссылочный тип и преобразовывать его в допустимый объект HttpResponse. Маршруты, которые возвращают HttpResponse, не подвергаются никакому преобразованию.

Типы значений (структуры) не могут быть использованы в качестве типа возврата, поскольку они не совместимы с [RouterCallback](/api/Sisk.Core.Routing.RouterCallback), поэтому они должны быть обернуты в ValueResult, чтобы быть использованными в обработчиках.

Рассмотрим следующий пример из модуля маршрутизатора, не использующего HttpResponse в качестве типа возврата:

```csharp
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

С этого момента необходимо определить в маршрутизаторе, как он будет обрабатывать каждый тип объекта. Объекты всегда являются первым аргументом обработчика, а тип вывода должен быть допустимым объектом HttpResponse. Кроме того, выходные объекты маршрута никогда не должны быть null.

Для типов ValueResult не необходимо указывать, что входной объект является ValueResult, и только T, поскольку ValueResult является объектом, отраженным от его исходного компонента.

Связь типов не сравнивает, что было зарегистрировано с типом объекта, возвращаемого из маршрутизатора. Вместо этого он проверяет, является ли тип результата маршрута присваиваемым зарегистрированному типу.

Регистрация обработчика типа Object приведет к тому, что все предыдущие непроверенные типы будут проигнорированы. Порядок вставки обработчиков значений также имеет значение, поэтому регистрация обработчика Object приведет к игнорированию всех других типовых обработчиков. Всегда регистрируйте конкретные обработчики значений сначала, чтобы обеспечить порядок.

```cs
Router r = new Router();
r.SetObject(new UsersController());

r.RegisterValueHandler<ApiResult>(apiResult =>
{
    return new HttpResponse() {
        Status = apiResult.Success ? HttpStatusCode.OK : HttpStatusCode.BadRequest,
        Content = apiResult.GetHttpContent(),
        Headers = apiResult.GetHeaders()
    };
});
r.RegisterValueHandler<bool>(bvalue =>
{
    return new HttpResponse() {
        Status = bvalue ? HttpStatusCode.OK : HttpStatusCode.BadRequest
    };
});
r.RegisterValueHandler<IEnumerable<object>>(enumerableValue =>
{
    return new HttpResponse(string.Join("\n", enumerableValue));
});

// регистрация обработчика значения объекта должна быть последней
// обработчик значения, который будет использоваться в качестве обратного вызова
r.RegisterValueHandler<object>(fallback =>
{
    return new HttpResponse() {
        Status = HttpStatusCode.OK,
        Content = JsonContent.Create(fallback)
    };
});
```

## Примечание об объектах, реализующих IEnumerable и массивах

Неявные объекты ответа, реализующие [IEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.ienumerable?view=net-8.0), читаются в память через метод `ToArray()`, прежде чем быть преобразованными с помощью определенного обработчика значений. Для этого объект `IEnumerable` преобразуется в массив объектов, и обработчик ответа всегда получает `Object[]` вместо исходного типа.

Рассмотрим следующий сценарий:

```csharp
using var host = HttpServer.CreateBuilder(12300)
    .UseRouter(r =>
    {
        r.RegisterValueHandler<IEnumerable<string>>(stringEnumerable =>
        {
            return new HttpResponse("String array:\n" + string.Join("\n", stringEnumerable));
        });
        r.RegisterValueHandler<IEnumerable<object>>(stringEnumerable =>
        {
            return new HttpResponse("Object array:\n" + string.Join("\n", stringEnumerable));
        });
        r.MapGet("/", request =>
        {
            return (IEnumerable<string>)["hello", "world"];
        });
    })
    .Build();
```

В приведенном выше примере конвертер `IEnumerable<string>` **никогда не будет вызван**, поскольку входной объект всегда будет `Object[]` и не может быть преобразован в `IEnumerable<string>`. Однако конвертер ниже, который получает `IEnumerable<object>`, получит свой вход, поскольку его значение совместимо.

Если вам нужно фактически обрабатывать тип объекта, который будет перечислен, вам необходимо использовать отражение, чтобы получить тип элемента коллекции. Все перечисляемые объекты (списки, массивы и коллекции) преобразуются в массив объектов конвертером HTTP-ответа.

Значения, реализующие [IAsyncEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.generic.iasyncenumerable-1?view=net-8.0), обрабатываются автоматически сервером, если свойство [ConvertIAsyncEnumerableIntoEnumerable](/api/Sisk.Core.Http.HttpServerConfiguration.ConvertIAsyncEnumerableIntoEnumerable) включено, аналогично тому, что происходит с `IEnumerable`. Асинхронное перечисление преобразуется в блокирующий перечислитель, а затем преобразуется в синхронный массив объектов.