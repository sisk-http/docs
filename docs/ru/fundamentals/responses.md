# Ответы

Ответы представляют собой объекты, являющиеся HTTP‑ответами на HTTP‑запросы. Они отправляются сервером клиенту в качестве указания на запрос ресурса, страницы, документа, файла или другого объекта.

HTTP‑ответ состоит из статуса, заголовков и содержимого.

В этом документе мы расскажем, как формировать HTTP‑ответы с помощью Sisk.

## Установка HTTP‑статуса

Список HTTP‑статусов не изменился с версии HTTP/1.0, и Sisk поддерживает их все.

```cs
HttpResponse res = new HttpResponse();
res.Status = System.Net.HttpStatusCode.Accepted; // 202
```

Или с Fluent‑синтаксисом:

```cs
new HttpResponse()
    .WithStatus(200) // or
    .WithStatus(HttpStatusCode.Ok) // or
    .WithStatus(HttpStatusInformation.Ok);
```

Полный список доступных HttpStatusCode вы можете увидеть [здесь](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httpstatuscode). Вы также можете задать собственный код статуса, используя структуру [HttpStatusInformation](/api/Sisk.Core.Http.HttpStatusInformation).

## Тело и тип содержимого

Sisk поддерживает нативные .NET‑объекты содержимого для отправки тела в ответах. Например, вы можете использовать класс [StringContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.stringcontent) для отправки JSON‑ответа:

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

Сервер всегда будет пытаться вычислить `Content-Length` из того, что вы задали в содержимом, если вы явно не указали его в заголовке. Если сервер не может неявно получить заголовок Content-Length из содержимого ответа, ответ будет отправлен с Chunked‑Encoding.

Вы также можете передавать ответ потоково, отправив [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent) или используя метод [GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream).

## Заголовки ответа

Вы можете добавлять, изменять или удалять заголовки, отправляемые в ответе. Пример ниже показывает, как отправить клиенту ответ с перенаправлением.

```cs
HttpResponse res = new HttpResponse();
res.Status = HttpStatusCode.Moved;
res.Headers.Add(HttpKnownHeaderNames.Location, "/login");
```

Или с Fluent‑синтаксисом:

```cs
new HttpResponse(301)
    .WithHeader("Location", "/login");
```

Когда вы используете метод [Add](/api/Sisk.Core.Entity.HttpHeaderCollection.Add) коллекции HttpHeaderCollection, вы добавляете заголовок к запросу, не изменяя уже отправленные. Метод [Set](/api/Sisk.Core.Entity.HttpHeaderCollection.Set) заменяет заголовки с тем же именем указанным значением. Индексатор HttpHeaderCollection внутри вызывает метод Set для замены заголовков.

Вы также можете получать значения заголовков с помощью метода [GetHeaderValue](/api/Sisk.Core.Entity.HttpHeaderCollection.GetHeaderValue). Этот метод помогает получать значения как из заголовков ответа, так и из заголовков содержимого (если содержимое задано).

```cs
// Возвращает значение заголовка "Content-Type", проверяя как response.Headers, так и response.Content.Headers
string? contentType = response.GetHeaderValue("Content-Type");
```

## Отправка cookie

Sisk предоставляет методы, упрощающие определение cookie в клиенте. Cookie, установленные этим методом, уже URL‑закодированы и соответствуют стандарту RFC-6265.

```cs
HttpResponse res = new HttpResponse();
res.SetCookie("cookie-name", "cookie-value");
```

Или с Fluent‑синтаксисом:

```cs
new HttpResponse(301)
    .WithCookie("cookie-name", "cookie-value", expiresAt: DateTime.Now.Add(TimeSpan.FromDays(7)));
```

Существуют и другие [более полные версии](/api/Sisk.Core.Helpers.CookieHelper.SetCookie) того же метода.

## Chunked‑ответы

Вы можете установить кодировку передачи в chunked, чтобы отправлять большие ответы.

```cs
HttpResponse res = new HttpResponse();
res.SendChunked = true;
```

При использовании chunked‑encoding заголовок Content-Length автоматически опускается.

## Поток ответа

Потоки ответа — это управляемый способ отправки ответов сегментами. Это более низкоуровневая операция по сравнению с использованием объектов HttpResponse, так как требует вручную отправлять заголовки и содержимое, а затем закрывать соединение.

Этот пример открывает поток только для чтения файла, копирует поток в выходной поток ответа и не загружает весь файл в память. Это может быть полезно при обслуживании средних или больших файлов.

```cs
// получает поток вывода ответа
using var fileStream = File.OpenRead("my-big-file.zip");
var responseStream = request.GetResponseStream();

// устанавливает кодировку ответа для использования chunked-encoding
// также не следует отправлять заголовок content-length при использовании
// chunked‑encoding
responseStream.SendChunked = true;
responseStream.SetStatus(200);
responseStream.SetHeader(HttpKnownHeaderNames.ContentType, contentType);

// копирует файловый поток в выходной поток ответа
fileStream.CopyTo(responseStream.ResponseStream);

// закрывает поток
return responseStream.Close();
```

## Сжатие GZip, Deflate и Brotli

Вы можете отправлять ответы со сжатым содержимым в Sisk, сжимая HTTP‑содержимое. Сначала оберните ваш объект [HttpContent](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.httpcontent) в один из компрессоров ниже, чтобы отправить сжатый ответ клиенту.

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

Вы также можете использовать эти сжатые содержимые со потоками.

```cs
router.MapGet("/archive.zip", request => {
    
    // не используйте "using" здесь. HttpServer удалит ваш контент
    // после отправки ответа.
    var archive = File.OpenRead("/path/to/big-file.zip");
    
    return new HttpResponse () {
        Content = new GZipContent(archive)
    }
});
```

Заголовки Content-Encoding устанавливаются автоматически при использовании этих содержимых.

## Автоматическое сжатие

Можно автоматически сжимать HTTP‑ответы с помощью свойства [EnableAutomaticResponseCompression](/api/Sisk.Core.Http.HttpServerConfiguration.EnableAutomaticResponseCompression). Это свойство автоматически оборачивает содержимое ответа из роутера в сжимаемое содержимое, которое принимается запросом, при условии, что ответ не наследуется от [CompressedContent](/api/Sisk.Core.Http.CompressedContent).

Для запроса выбирается только одно сжимаемое содержимое, выбранное согласно заголовку Accept-Encoding, который следует в порядке:

- [BrotliContent](/api/Sisk.Core.Http.BrotliContent) (br)
- [GZipContent](/api/Sisk.Core.Http.GZipContent) (gzip)
- [DeflateContent](/api/Sisk.Core.Http.DeflateContent) (deflate)

Если запрос указывает, что принимает любой из этих методов сжатия, ответ будет автоматически сжат.

## Неявные типы ответов

Вы можете использовать другие типы возвращаемых значений, помимо HttpResponse, но необходимо настроить роутер, как он будет обрабатывать каждый тип объекта.

Концепция состоит в том, чтобы всегда возвращать ссылочный тип и преобразовывать его в действительный объект HttpResponse. Маршруты, возвращающие HttpResponse, не проходят никакого преобразования.

Типы‑значения (структуры) нельзя использовать в качестве типа возврата, поскольку они несовместимы с [RouterCallback](/api/Sisk.Core.Routing.RouterCallback), поэтому их необходимо обернуть в ValueResult, чтобы их можно было использовать в обработчиках.

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
        User fromBody = request.GetJsonContent<User>()!;
        Users.Add(fromBody);
        
        return true;
    }
}
```

С этим теперь необходимо определить в роутере, как он будет работать с каждым типом объекта. Объекты всегда являются первым аргументом обработчика, а тип вывода должен быть действительным HttpResponse. Кроме того, объекты вывода маршрута никогда не должны быть null.

Для типов ValueResult не требуется указывать, что входной объект является ValueResult и только T, поскольку ValueResult — это объект, отражающий исходный компонент.

Связывание типов не сравнивает то, что было зарегистрировано, с типом объекта, возвращаемого из обратного вызова роутера. Вместо этого проверяется, может ли тип результата роутера быть присвоен зарегистрированному типу.

Регистрация обработчика типа Object будет использоваться как fallback для всех ранее не проверенных типов. Порядок вставки value‑обработчиков также имеет значение, поэтому регистрация обработчика Object игнорирует все остальные типо‑специфичные обработчики. Всегда регистрируйте специфичные value‑обработчики первыми, чтобы обеспечить порядок.

```cs
Router r = new Router();
r.MapInstance(new UsersController());

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

// регистрация value‑обработчика типа object должна быть последней
// value‑handler, который будет использоваться как fallback
r.RegisterValueHandler<object>(fallback =>
{
    return new HttpResponse() {
        Status = HttpStatusCode.OK,
        Content = JsonContent.Create(fallback)
    };
});
```

## Отложенные действия

Когда запрос попадает в роутер, он сначала проходит через [request handlers](/docs/ru/fundamentals/request-handlers), обрабатывается в действии роутера, а затем через post‑execution request handlers. Результат действия роутера передаётся value‑обработчикам, а результат value‑обработчика отправляется клиенту в виде ответа.

Этот жизненный цикл происходит в асинхронном контексте. Этот асинхронный контекст предоставляет переменные, которые пользователь может добавить в [HttpContext Bag](/api/Sisk.Core.Http.HttpContext), чтобы делиться данными между обработчиками и действием роутера. Значение, возвращённое действием роутера, добавляется в этот асинхронный контекст и может быть доступно value‑обработчикам.

Отложенные действия — это действия, которые всегда выполняются в конце цикла, после отправки ответа клиенту, но всё ещё в том же асинхронном контексте. Эти действия могут использоваться для выполнения длительных задач, не требующих завершения до отправки ответа клиенту, таких как сохранение логов, обновление базы данных, отправка писем и т.д.

Исключения всё ещё перехватываются в отложенных действиях и обрабатываются так же, как исключения, выброшенные в любой части жизненного цикла запроса. Разница в том, что клиент уже получил ответ, поэтому исключение обрабатывается стандартным обработчиком ошибок.

Отложить выполнение действия можно с помощью метода [HttpContext.EnqueueDeferredAction](/api/Sisk.Core.Http.HttpContext.EnqueueDeferredAction). Метод принимает асинхронную функцию, представляющую действие для выполнения, и необязательный тайм‑аут для ограничения времени выполнения действия. Если действие не завершится в пределах лимита, оно будет отменено.

```csharp
[RoutePost("/send-mail")]
public HttpResponse SendMail(HttpRequest request)
{
    string to = request.Query["to"].GetString();
    string subject = request.Query["subject"].GetString();
    string body = request.Query["body"].GetString();
    if (string.IsNullOrWhiteSpace(to) || string.IsNullOrWhiteSpace(subject) || string.IsNullOrWhiteSpace(body))
    {
        throw new ApiException("Missing required parameters.");
    }

    // планирует длительное действие, которое будет выполнено после отправки ответа клиенту, но всё ещё в том же асинхронном контексте запроса
    request.Context.EnqueueDeferredAction(async (ct) =>
    {
        await EmailService.SendEmailAsync(to, subject, body);
    }, timeout: TimeSpan.FromSeconds(30));

    return new HttpResponse()
    {
        Status = 200,
        Content = new StringContent("Sending the email...")
    };
}
```

## Примечание об перечисляемых объектах и массивах

Неявные объекты ответа, реализующие [IEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.ienumerable?view=net-8.0), читаются в память через метод `ToArray()` перед преобразованием через определённый value‑handler. Для этого объект `IEnumerable` преобразуется в массив объектов, и конвертер ответа всегда получает `Object[]` вместо исходного типа.

Рассмотрим следующую ситуацию:

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

В приведённом выше примере конвертер `IEnumerable<string>` **никогда не будет вызван**, потому что входной объект всегда будет `Object[]` и не может быть преобразован в `IEnumerable<string>`. Однако конвертер ниже, получающий `IEnumerable<object>`, получит свой ввод, поскольку его значение совместимо.

Если вам действительно нужно обрабатывать тип объекта, который будет перечисляться, вам придётся использовать рефлексию для получения типа элемента коллекции. Все перечисляемые объекты (списки, массивы и коллекции) конвертируются в массив объектов конвертером HTTP‑ответов.

Значения, реализующие [IAsyncEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.generic.iasyncenumerable-1?view=net-8.0), обрабатываются сервером автоматически, если включено свойство [ConvertIAsyncEnumerableIntoEnumerable](/api/Sisk.Core.Http.HttpServerConfiguration.ConvertIAsyncEnumerableIntoEnumerable), аналогично тому, что происходит с `IEnumerable`. Эта опция включена по умолчанию в `HttpServerConfiguration`; асинхронное перечисление преобразуется в блокирующий перечислитель, а затем в синхронный массив объектов. Отключайте её только когда предоставляете собственный value‑handler или стратегию потокового ответа для асинхронных последовательностей.