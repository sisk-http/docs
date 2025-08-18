# Включение CORS (Cross-Origin Resource Sharing) в Sisk

Sisk имеет инструмент, который может быть полезен для обработки [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/ru/Web/HTTP/Guides/CORS) при открытии вашего сервиса для публичного доступа. Эта функция не является частью протокола HTTP, а специфической особенностью веб‑браузеров, определённой W3C. Этот механизм безопасности предотвращает выполнение веб‑страницы запросов к другому домену, отличному от того, который предоставил веб‑страницу. Поставщик услуг может разрешить доступ определённым доменам, или только одному.

## Same Origin

Для того чтобы ресурс был идентифицирован как «same origin», запрос должен содержать заголовок [Origin](https://developer.mozilla.org/en-US/docs/ru/Web/HTTP/Reference/Headers/Origin) в своём запросе:

```http
GET /api/users HTTP/1.1
Host: example.com
Origin: http://example.com
...
```

И удалённый сервер должен ответить заголовком [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/ru/Web/HTTP/Headers/Access-Control-Allow-Origin) со значением, совпадающим с запрошенным origin:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
...
```

Эта проверка **явная**: хост, порт и протокол должны совпадать с запрошенными. Проверьте пример:

- Сервер отвечает, что его `Access-Control-Allow-Origin` равен `https://example.com`:
    - `https://example.net` – домен отличается.
    - `http://example.com` – схема отличается.
    - `http://example.com:5555` – порт отличается.
    - `https://www.example.com` – хост отличается.

В спецификации разрешён только синтаксис для обоих заголовков, как для запросов, так и для ответов. Путь URL игнорируется. Порт также опускается, если это порт по умолчанию (80 для HTTP и 443 для HTTPS).

```http
Origin: null
Origin: <scheme>://<hostname>
Origin: <scheme>://<hostname>:<port>
```

## Включение CORS

Нативно у вас есть объект [CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders) внутри вашего [ListeningHost](/api/Sisk.Core.Http.ListeningHost).

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

Код выше отправит следующие заголовки для **всех ответов**:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
Access-Control-Allow-Headers: Authorization
Access-Control-Expose-Headers: Content-Type
```

Эти заголовки необходимо отправлять для всех ответов веб‑клиенту, включая ошибки и перенаправления.

Вы можете заметить, что класс [CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders) имеет два похожих свойства: [AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin) и [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins). Обратите внимание, что одно во множественном числе, другое — в единственном.

- Свойство **AllowOrigin** статическое: только указанный origin будет отправлен для всех ответов.
- Свойство **AllowOrigins** динамическое: сервер проверяет, содержится ли origin запроса в этом списке. Если найден, он отправляется в ответе для того origin.

### Wildcards и автоматические заголовки

В качестве альтернативы вы можете использовать подстановочный символ (`*`) в origin ответа, чтобы указать, что любой origin разрешён для доступа к ресурсу. Однако это значение не допускается для запросов с учётными данными (заголовки авторизации), и эта операция [приведёт к ошибке](https://developer.mozilla.org/en-US/docs/ru/Web/HTTP/Guides/CORS/Errors/CORSNotSupportingCredentials).

Вы можете обойти эту проблему, явно перечислив, какие origins будут разрешены через свойство [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins) или также использовать константу [AutoAllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoAllowOrigin) в значении [AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin). Это «магическое» свойство определит заголовок `Access-Control-Allow-Origin` со значением, совпадающим с заголовком `Origin` запроса.

Вы также можете использовать [AutoFromRequestMethod](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoFromRequestMethod) и [AutoFromRequestHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoFromRequestHeaders) для поведения, аналогичного `AllowOrigin`, которое автоматически отвечает на основе отправленных заголовков.

```csharp
using var host = HttpServer.CreateBuilder()
    .UseCors(new CrossOriginResourceSharingHeaders(
        
        // Отвечает на основе заголовка Origin запроса
        allowOrigin: CrossOriginResourceSharingHeaders.AutoAllowOrigin,
        
        // Отвечает на основе заголовка Access-Control-Request-Method или метода запроса
        allowMethods: [CrossOriginResourceSharingHeaders.AutoFromRequestMethod],

        // Отвечает на основе заголовка Access-Control-Request-Headers или отправленных заголовков
        allowHeaders: [CrossOriginResourceSharingHeaders.AutoFromRequestHeaders]))
```

## Другие способы применения CORS

Если вы работаете с [service providers](/docs/ru/extensions/service-providers), вы можете переопределить значения, определённые в файле конфигурации:

```csharp
static async Task Main(string[] args)
{
    using var app = HttpServer.CreateBuilder()
        .UsePortableConfiguration(...)
        .UseCors(cors => {
            // Переопределит origin, определённый в конфигурации
            // файле.
            cors.AllowOrigin = "http://example.com";
        })
        .Build();

    await app.StartAsync();
}
```

## Отключение CORS на конкретных маршрутах

Свойство `UseCors` доступно как для маршрутов, так и для всех атрибутов маршрута и может быть отключено следующим примером:

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

Вы можете явно заменить или удалить значения в действии роутера:

```csharp
[RoutePrefix("api/widgets")]
public class WidgetController : Controller {

    public IEnumerable<string> GetWidgets(HttpRequest request) {

        // Удаляет заголовок Access-Control-Allow-Credentials
        request.Context.OverrideHeaders.AccessControlAllowCredentials = string.Empty;
        
        // Заменяет Access-Control-Allow-Origin
        request.Context.OverrideHeaders.AccessControlAllowOrigin = "https://contorso.com";

        return new[] { "Green widget", "Red widget" };
    }
}
```

## Предварительные запросы

Предварительный запрос — это запрос метода [OPTIONS](https://developer.mozilla.org/en-US/docs/ru/Web/HTTP/Reference/Methods/OPTIONS), который клиент отправляет до фактического запроса.

Сервер Sisk всегда отвечает на запрос `200 OK` и применимыми заголовками CORS, после чего клиент может продолжить с фактическим запросом. Это условие не применяется, когда существует маршрут для запроса с явно настроенным [RouteMethod](/api/Sisk.Core.Routing.RouteMethod) для `Options`.

## Отключение CORS глобально

Это невозможно. Чтобы не использовать CORS, не настраивайте его.