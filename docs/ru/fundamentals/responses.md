# Responses

Ответы представляют собой объекты, которые являются HTTP-ответами на HTTP-запросы. Они отправляются сервером клиенту в качестве указания на запрос ресурса, страницы, документа, файла или другого объекта.

HTTP-ответ состоит из статуса, заголовков и содержимого.

В этом документе мы научим вас, как архитектировать HTTP-ответы с помощью Sisk.

## Установка HTTP-статуса

Список HTTP-статусов одинаков с момента появления HTTP/1.0, и Sisk поддерживает все из них.

```cs
HttpResponse res = new HttpResponse();
res.Status = System.Net.HttpStatusCode.Accepted; //202
```

Или с помощью Fluent Syntax:

```cs
new HttpResponse()
 .WithStatus(200) // или
 .WithStatus(HttpStatusCode.Ok) // или
 .WithStatus(HttpStatusInformation.Ok);
```

Вы можете просмотреть полный список доступных HttpStatusCode [здесь](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httpstatuscode). Вы также можете указать свой собственный код статуса, используя структуру [HttpStatusInformation](/api/Sisk.Core.Http.HttpStatusInformation).

## Тело и тип содержимого

Sisk поддерживает родные объекты содержимого .NET для отправки тела в ответах. Вы можете использовать класс [StringContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.stringcontent) для отправки JSON-ответа, например:

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

Сервер всегда попытается рассчитать `Content-Length` из того, что вы определили в содержимом, если вы явно не определили его в заголовке. Если сервер не может неявно получить заголовок Content-Length из содержимого ответа, ответ будет отправлен с Chunked-Encoding.

Вы также можете передавать ответ, отправляя [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent) или используя метод [GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream).

## Заголовки ответа

Вы можете добавлять, редактировать или удалять заголовки, которые отправляются в ответе. Пример ниже показывает, как отправить ответ с перенаправлением клиенту.

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

Когда вы используете метод [Add](/api/Sisk.Core.Entity.HttpHeaderCollection.Add) коллекции HttpHeaderCollection, вы добавляете заголовок к запросу, не изменяя уже отправленные. Метод [Set](/api/Sisk.Core.Entity.HttpHeaderCollection.Set) заменяет заголовки с тем же именем на указанное значение. Индексатор HttpHeaderCollection внутренне вызывает метод Set для замены заголовков.

## Отправка куки

Sisk имеет методы, которые облегчают определение куки на клиенте. Куки, установленные этим методом, уже закодированы URL и соответствуют стандарту RFC-6265.

```cs
HttpResponse res = new HttpResponse();
res.SetCookie("cookie-name", "cookie-value");
```

Или с помощью Fluent Syntax:

```cs
new HttpResponse(301)
 .WithCookie("cookie-name", "cookie-value", expiresAt: DateTime.Now.Add(TimeSpan.FromDays(7)));
```

Имеются другие [более полные версии](/api/Sisk.Core.Http.CookieHelper.SetCookie) того же метода.

## Частичные ответы

Вы можете установить тип кодирования передачи на частичный для отправки больших ответов.

```cs
HttpResponse res = new HttpResponse();
res.SendChunked = true;
```

При использовании chunked-encoding заголовок Content-Length автоматически опускается.

## Поток ответа

Потоки ответа - это управляемый способ, который позволяет отправлять ответы в сегментированном виде. Это более низкоуровневая операция, чем использование объектов HttpResponse, поскольку они требуют от вас отправки заголовков и содержимого вручную, а затем закрытия соединения.

Этот пример открывает поток только для чтения для файла, копирует поток в выходной поток ответа и не загружает весь файл в память. Это может быть полезно для обслуживания средних или больших файлов.

```cs
// получает выходной поток ответа
using var fileStream = File.OpenRead("my-big-file.zip");
var responseStream = request.GetResponseStream();

// устанавливает кодирование ответа для использования chunked-encoding
// также не следует отправлять заголовок content-length при использовании
// chunked encoding
responseStream.SendChunked = true;
responseStream.SetStatus(200);
responseStream.SetHeader(HttpKnownHeaderNames.ContentType, contentType);

// копирует поток файла в выходной поток ответа
fileStream.CopyTo(responseStream.ResponseStream);

// закрывает поток
return responseStream.Close();
```

## Сжатие GZip, Deflate и Brotli

Вы можете отправлять ответы со сжатым содержимым в Sisk с помощью сжатия HTTP-содержимого. Во-первых, инкапсулируйте ваш объект [HttpContent](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.httpcontent) внутри одного из компрессоров ниже, чтобы отправить сжатый ответ клиенту.

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

Вы также можете использовать эти сжатые содержимое с потоками.

```cs
router.MapGet("/archive.zip", request => {
    
 // не применяйте "using" здесь. HttpServer отклонит ваше содержимое
 // после отправки ответа.
 var archive = File.OpenRead("/path/to/big-file.zip");
    
 return new HttpResponse () {
 Content = new GZipContent(archive)
 }
});
```

Заголовки Content-Encoding устанавливаются автоматически при использовании этих содержимостей.

## Автоматическое сжатие

Возможно автоматически сжимать HTTP-ответы с помощью свойства [EnableAutomaticResponseCompression](/api/Sisk.Core.Http.HttpServerConfiguration.EnableAutomaticResponseCompression). Это свойство автоматически инкапсулирует содержимое ответа от маршрутизатора в сжимаемое содержимое, которое принимается запросом, при условии, что ответ не унаследован от [CompressedContent](/api/Sisk.Core.Http.CompressedContent).

Только одно сжимаемое содержимое выбирается для запроса, выбранное в соответствии с заголовком Accept-Encoding, который следует порядку:

- [BrotliContent](/api/Sisk.Core.Http.BrotliContent) (br)
- [GZipContent](/api/Sisk.Core.Http.GZipContent) (gzip)
- [DeflateContent](/api/Sisk.Core.Http.DeflateContent) (deflate)

Если запрос указывает, что он принимает любой из этих методов сжатия, ответ будет автоматически сжат.

## Неявные типы ответов

Вы можете использовать другие типы возвращаемых значений, кроме HttpResponse, но необходимо настроить маршрутизатор, чтобы он обрабатывал каждый тип объекта.

Концепция состоит в том, чтобы всегда возвращать ссылочный тип и преобразовывать его в допустимый объект HttpResponse. Маршруты, которые возвращают HttpResponse, не подвергаются никаким преобразованиям.

Типы значений (структуры) не могут быть использованы в качестве типа возвращаемого значения, потому что они не совместимы с [RouterCallback](/api/Sisk.Core.Routing.RouterCallback), поэтому они должны быть обернуты в ValueResult, чтобы иметь возможность использоваться в обработчиках.

Рассмотрим следующий пример из модуля маршрутизатора, не использующего HttpResponse в качестве типа возвращаемого значения:

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

При этом теперь необходимо определить в маршрутизаторе, как он будет обрабатывать каждый тип объекта. Объекты всегда являются первым аргументом обработчика, а тип вывода должен быть допустимым объектом HttpResponse. Также выходные объекты маршрута никогда не должны быть null.

Для типов ValueResult не обязательно указывать, что входной объект является ValueResult, и только T, поскольку ValueResult является объектом, отраженным от его исходного компонента.

Ассоциация типов не сравнивает то, что было зарегистрировано, с типом объекта, возвращаемого из обратного вызова маршрутизатора. Вместо этого она проверяет, является ли тип результата маршрутизатора присваиваемым зарегистрированному типу.

Регистрация обработчика типа Object будет резервным для всех ранее не проверенных типов. Порядок вставки обработчиков значений также имеет значение, поэтому регистрация обработчика Object проигнорирует все другие обработчики, специфичные для типов. Всегда регистрируйте обработчики значений сначала, чтобы обеспечить порядок.

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

// регистрация обработчика значений объекта должна быть последней
// обработчиком значений, который будет использоваться в качестве резервного
r.RegisterValueHandler<object>(fallback =>
{
 return new HttpResponse() {
 Status = HttpStatusCode.OK,
 Content = JsonContent.Create(fallback)
 };
});
```

## Примечание о перечислимых объектах и массивах

Неявные объекты ответа, реализующие [IEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.ienumerable?view=net-8.0), читаются в память с помощью метода `ToArray()` перед преобразованием с помощью определенного обработчика значений. Чтобы это произошло, объект `IEnumerable` преобразуется в массив объектов, и преобразователь ответа всегда получит `Object[]` вместо исходного типа.

Рассмотрим следующий сценарий:

```csharp
using var host = HttpServer.CreateBuilder(12300)
 .UseRouter(r =>
 {
 r.RegisterValueHandler<IEnumerable<string>>(stringEnumerable =>
 {
 return new HttpResponse("Массив строк:\n" + string.Join("\n", stringEnumerable));
 });
 r.RegisterValueHandler<IEnumerable<object>>(stringEnumerable =>
 {
 return new HttpResponse("Массив объектов:\n" + string.Join("\n", stringEnumerable));
 });
 r.MapGet("/", request =>
 {
 return (IEnumerable<string>)["hello", "world"];
 });
 })
 .Build();
```

В приведенном выше примере преобразователь `IEnumerable<string>` **никогда не будет вызван**, потому что входной объект всегда будет массивом `Object[]` и не может быть преобразован в `IEnumerable<string>`. Однако преобразователь ниже, который получает `IEnumerable<object>`, получит свой вход, поскольку его значение совместимо.

Если вам нужно фактически обрабатывать тип объекта, который будет перечислен, вам нужно использовать отражение, чтобы получить тип элемента коллекции. Все перечислимые объекты (списки, массивы и коллекции) преобразуются в массив объектов преобразователем HTTP-ответа.

Значения, реализующие [IAsyncEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.generic.iasyncenumerable-1?view=net-8.0), обрабатываются автоматически сервером, если включено свойство [ConvertIAsyncEnumerableIntoEnumerable](/api/Sisk.Core.Http.HttpServerConfiguration.ConvertIAsyncEnumerableIntoEnumerable), подобно тому, что происходит с `IEnumerable`. Асинхронная перечисляемая последовательность преобразуется в блокирующий перечислитель, а затем преобразуется в синхронный массив объектов.