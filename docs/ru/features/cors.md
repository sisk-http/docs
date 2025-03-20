# Включение CORS (Cross-Origin Resource Sharing) в Sisk

Sisk имеет инструмент, который может быть полезен для обработки [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) при публикации вашего сервиса. Эта функция не является частью протокола HTTP, а является специальной функцией веб-браузеров, определенной W3C. Этот механизм безопасности предотвращает возможность веб-страницы отправлять запросы к другому домену, чем тот, который предоставил веб-страницу. Поставщик сервиса может разрешить доступ к своим ресурсам определенным доменам или только одному.

## Same Origin

Чтобы ресурс был идентифицирован как "same origin", запрос должен содержать заголовок [Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Origin):

```http
GET /api/users HTTP/1.1
Host: example.com
Origin: http://example.com
...
```

И удаленный сервер должен ответить с заголовком [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) с тем же значением, что и запрошенный origin:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
...
```

Эта проверка является **явной**: хост, порт и протокол должны быть одинаковыми, как запрошено. Проверьте пример:

- Сервер отвечает, что его `Access-Control-Allow-Origin` равен `https://example.com`:
    - `https://example.net` - домен khác.
    - `http://example.com` - схема khác.
    - `http://example.com:5555` - порт другой.
    - `https://www.example.com` - хост другой.

В спецификации разрешена только синтаксис для обоих заголовков, как для запросов, так и для ответов. Путь URL игнорируется. Порт также опускается, если это стандартный порт (80 для HTTP и 443 для HTTPS).

```http
Origin: null
Origin: <scheme>://<hostname>
Origin: <scheme>://<hostname>:<port>
```

## Включение CORS

По умолчанию у вас есть объект [CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders) внутри вашего [ListeningHost](/api/Sisk.Core.Http.ListeningHost).

Вы можете настроить CORS при инициализации сервера:

```csharp
static async Task Main(string[] args)
{
    using var app = HttpServer.CreateBuilder()
        .UseCors(new CrossOriginResourceSharingHeaders(
            allowOrigin: "http://example.com",
            allowHeaders: ["Authorization"],
            exposeHeaders: ["Content-Type"]))
        .Build();

    await app.StartAsync();
}
```

Код выше будет отправлять следующие заголовки для **всех ответов**:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
Access-Control-Allow-Headers: Authorization
Access-Control-Expose-Headers: Content-Type
```

Эти заголовки необходимо отправлять для всех ответов веб-клиенту, включая ошибки и перенаправления.

Вы можете заметить, что класс [CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders) имеет два похожих свойства: [AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin) и [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins). Обратите внимание, что одно свойство является единственным, а другое - множественным.

- Свойство **AllowOrigin** является статическим: только указанный вами origin будет отправлен для всех ответов.
- Свойство **AllowOrigins** является динамическим: сервер проверяет, содержится ли origin запроса в этом списке. Если он найден, он отправляется для ответа этого origin.

### Wildcard в Origin

Альтернативно, вы можете использовать wildcard (`*`) в ответе origin, чтобы указать, что любой origin может получить доступ к ресурсу. Однако это значение не разрешено для запросов, которые имеют учетные данные (заголовки авторизации) и эта операция [вызовет ошибку](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSNotSupportingCredentials).

Вы можете обойти эту проблему, явно перечислив, какие origins будут разрешены через свойство [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins), или также использовать константу [AutoAllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoAllowOrigin) в значении свойства [AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin). Это магическое свойство определит заголовок `Access-Control-Allow-Origin` для того же значения, что и заголовок `Origin` запроса.

## Другие способы применения CORS

Если вы работаете с [поставщиками сервисов](/docs/extensions/service-providers), вы можете переопределить значения, определенные в файле конфигурации:

```csharp
static async Task Main(string[] args)
{
    using var app = HttpServer.CreateBuilder()
        .UsePortableConfiguration(...)
        .UseCors(cors => {
            // Will override the origin defined in the configuration
            // file.
            cors.AllowOrigin = "http://example.com";
        })
        .Build();

    await app.StartAsync();
}
```

## Отключение CORS на конкретных маршрутах

Свойство `UseCors` доступно для обоих маршрутов и всех атрибутов маршрутов и может быть отключено следующим образом:

```csharp
[RoutePrefix("api/widgets")]
public class WidgetController : Controller {

    // GET /api/widgets/colors
    [RouteGet("/colors", UseCors = false)]
    public IEnumerable<string> GetWidgets() {
        return new[] { "Green widget", "Red widget" };
    }
}
```

## Замена значений в ответе

Вы можете заменить или удалить значения явно в действии маршрута:

```csharp
[RoutePrefix("api/widgets")]
public class WidgetController : Controller {

    public IEnumerable<string> GetWidgets(HttpRequest request) {

        // Removes the Access-Control-Allow-Credentials header
        request.Context.OverrideHeaders.AccessControlAllowCredentials = string.Empty;

        // Replaces the Access-Control-Allow-Origin
        request.Context.OverrideHeaders.AccessControlAllowOrigin = "https://contorso.com";

        return new[] { "Green widget", "Red widget" };
    }
}
```

## Preflight запросы

Preflight запрос - это запрос метода [OPTIONS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/OPTIONS), который клиент отправляет перед фактическим запросом.

Сервер Sisk всегда будет отвечать на запрос с кодом `200 OK` и соответствующими заголовками CORS, и затем клиент может продолжить фактический запрос. Это условие не применяется, когда существует маршрут для запроса с явно настроенным методом [RouteMethod](/api/Sisk.Core.Routing.RouteMethod) для `Options`.

## Глобальное отключение CORS

Это невозможно. Чтобы не использовать CORS, не настраивайте его.