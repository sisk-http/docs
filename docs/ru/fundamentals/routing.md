# Маршрутизация

Маршрутизатор ([Router](/api/Sisk.Core.Routing.Router)) является первым шагом при построении сервера. Он отвечает за хранение объектов [Route](/api/Sisk.Core.Routing.Route), которые представляют собой конечные точки, которые сопоставляют URL-адреса и их методы с действиями, выполняемыми сервером. Каждое действие отвечает за прием запроса и отправку ответа клиенту.

Маршруты представляют собой пары выражений пути ("шаблон пути") и HTTP-метода, на который они могут реагировать. Когда поступает запрос к серверу, он пытается найти маршрут, соответствующий полученному запросу, а затем вызывает действие этого маршрута и отправляет полученный ответ клиенту.

Существует несколько способов определения маршрутов в Sisk: они могут быть статическими, динамическими или автоматически сканируемыми, определены с помощью атрибутов или непосредственно в объекте Router.

```cs
Router mainRouter = new Router();

// сопоставляет GET / с последующим действием
mainRouter.MapGet("/", request => {
    return new HttpResponse("Hello, world!");
});
```

Чтобы понять, что может делать маршрут, нужно понять, что может делать запрос. [HttpRequest](/api/Sisk.Core.Http.HttpRequest) будет содержать все необходимые сведения. Sisk также включает некоторые дополнительные функции, которые ускоряют общий процесс разработки.

Для каждого действия, полученного сервером, будет вызываться делегат типа [RouteAction](/api/Sisk.Core.Routing.RouteAction). Этот делегат содержит параметр, содержащий [HttpRequest](/api/Sisk.Core.Http.HttpRequest) со всеми необходимыми сведениями о запросе, полученном сервером. Результирующий объект из этого делегата должен быть [HttpResponse](/api/Sisk.Core.Http.HttpResponse) или объектом, который отображается на него через [явные типы ответов](/docs/fundamentals/responses#явные-типы-ответов).

## Сопоставление маршрутов

Когда к HTTP-серверу поступает запрос, Sisk ищет маршрут, который удовлетворяет выражению пути, полученному в запросе. Выражение всегда проверяется между маршрутом и путем запроса, без учета строки запроса.

Этот тест не имеет приоритета и является исключительным для одного маршрута. Когда маршрут не сопоставляется с запросом, сервер возвращает клиенту ответ [Router.NotFoundErrorHandler](/api/Sisk.Core.Routing.Router.NotFoundErrorHandler). Если шаблон пути совпадает, но HTTP-метод не совпадает, сервер возвращает клиенту ответ [Router.MethodNotAllowedErrorHandler](/api/Sisk.Core.Routing.Router.MethodNotAllowedErrorHandler).

Sisk проверяет возможность столкновения маршрутов, чтобы избежать этих проблем. При определении маршрутов Sisk будет искать возможные маршруты, которые могут столкнуться с определенным маршрутом. Этот тест включает проверку пути и метода, которые маршрут настроен принимать.

### Создание маршрутов с использованием шаблонов пути

Вы можете определить маршруты с использованием различных методов `SetRoute`.

```cs
// способ SetRoute
mainRouter.SetRoute(RouteMethod.Get, "/hey/<name>", (request) => {
    string name = request.RouteParameters["name"].GetString();
    return new HttpResponse($"Hello, {name}");
});

// способ Map*
mainRouter.MapGet("/form", (request) => {
    var formData = request.GetFormData();
    return new HttpResponse(); // пустой 200 ok
});

// вспомогательные методы Route.*
mainRouter += Route.Get("/image.png", (request) => {
    var imageStream = File.OpenRead("image.png");

    return new HttpResponse()
    {
        // внутренний StreamContent
        // поток будет освобожден после отправки
        // ответа.
        Content = new StreamContent(imageStream)
    };
});

// несколько параметров
mainRouter.MapGet("/hey/<name>/surname/<surname>", (request) => {
    string name = request.RouteParameters["name"].GetString();
    string surname = request.RouteParameters["surname"].GetString();

    return new HttpResponse($"Hello, {name} {surname}!");
});
```

Свойство [RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) объекта HttpResponse содержит все сведения о переменных пути полученного запроса.

Каждый путь, полученный сервером, нормализуется перед выполнением теста шаблона пути, следуя этим правилам:

- Все пустые сегменты удаляются из пути, например: `////foo//bar` становится `/foo/bar`.
- Сопоставление путей **чувствительно к регистру**, если [Router.MatchRoutesIgnoreCase](/api/Sisk.Core.Routing.Router.MatchRoutesIgnoreCase) не установлено в `true`.

Свойства [Query](/api/Sisk.Core.Http.HttpRequest.Query) и [RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) объекта [HttpRequest](/api/Sisk.Core.Http.HttpRequest) возвращают объект [StringValueCollection](/api/Sisk.Core.Entity.StringValueCollection), где каждая индексируемая свойство возвращает непустой [StringValue](/api/Sisk.Core.Entity.StringValue), который может использоваться в качестве опции/монад для преобразования его исходного значения в управляемый объект.

В следующем примере читается параметр маршрута "id" и извлекается из него `Guid`. Если параметр не является действительным `Guid`, вызывается исключение, и клиенту возвращается ошибка 500, если сервер не обрабатывает [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler).

```cs
mainRouter.SetRoute(RouteMethod.Get, "/user/<id>", (request) => {
    Guid id = request.RouteParameters["id"].GetGuid();
});
```

> [!NOTE]
> Пути игнорируют слеш в конце пути в обоих запросах и маршрутах, то есть, если вы попытаетесь получить доступ к маршруту, определенному как `/index/page`, вы сможете получить доступ с помощью `/index/page/` также.
>
> Вы также можете принудительно заставить URL-адреса завершаться `/`, включив флаг [ForceTrailingSlash](/api/Sisk.Core.Http.HttpServerFlags.ForceTrailingSlash).

### Создание маршрутов с использованием экземпляров классов

Вы также можете динамически определять маршруты с помощью рефлексии с помощью атрибута [RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute). Таким образом, экземпляр класса, в котором реализованы его методы, будут иметь свои маршруты, определенные в целевом маршрутизаторе.

Для того, чтобы метод был определен как маршрут, он должен быть помечен атрибутом [RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute), например, атрибут сам по себе или [RouteGetAttribute](/api/Sisk.Core.Routing.RouteGetAttribute). Метод может быть статическим, экземпляром класса, публичным или приватным. Когда используется метод `SetObject(type)` или `SetObject<TType>()`, статические методы игнорируются.

```cs
public class MyController
{
    // сопоставляется с GET /
    [RouteGet]
    HttpResponse Index(HttpRequest request)
    {
        HttpResponse res = new HttpResponse();
        res.Content = new StringContent("Index!");
        return res;
    }

    // статические методы тоже работают
    [RouteGet("/hello")]
    static HttpResponse Hello(HttpRequest request)
    {
        HttpResponse res = new HttpResponse();
        res.Content = new StringContent("Hello world!");
        return res;
    }
}
```

Строка ниже определит методы `Index` и `Hello` класса `MyController` как маршруты, так как оба они помечены как маршруты, и был предоставлен экземпляр класса, а не его тип. Если бы был предоставлен тип вместо экземпляра, то были бы определены только статические методы.

```cs
var myController = new MyController();
mainRouter.SetObject(myController);
```

С версии Sisk 0.16 и выше, стало возможным включить AutoScan, который будет искать пользовательские классы, реализующие `RouterModule` и автоматически связывать их с маршрутизатором. Это не поддерживается при компиляции AOT.

```cs
mainRouter.AutoScanModules<ApiController>();
```

В приведенном выше примере, указанный параметр `mainRouter.AutoScanModules` будет искать все типы, которые реализуют `ApiController` но не сам тип. Два необязательных параметра указывают, как метод будет искать эти типы. Первый аргумент подразумевает сборку, где будут искаться типы, а второй указывает, как типы будут определены.

## Маршруты с использованием регулярных выражений

Вместо использования стандартных HTTP-методов сопоставления путей, вы можете пометить маршрут для интерпретации с помощью регулярных выражений.

```cs
Route indexRoute = new Route(RouteMethod.Get, @"\/[a-z]+/", "My route", IndexPage, null);
indexRoute.UseRegex = true;
mainRouter.SetRoute(indexRoute);
```

Или с помощью класса RegexRoute

```cs
RegexRoute indexRoute = new RegexRoute(RouteMethod.Get, @"/uploads/(?<filename>.*\.(jpeg|jpg|png)", request =>
{
    string filename = request.Query["filename"].GetString();
    return new HttpResponse($"Acessing file {filename}");
});
mainRouter.SetRoute(indexRoute);
```

You can also capture groups from the regex pattern into the [Request.Query](/api/Sisk.Core.Http.HttpRequest.Query) contents:

## Маршруты с любым методом

You can define a route to be matched only by its path and skip the HTTP method. This can be useful for you to do method validation inside the route callback.

```cs
// the following route will match all POST requests
mainRouter.SetRoute(RouteMethod.Any, "/", callbackFunction);
```

## Маршруты с любым путем

Any path routes test for any path received by the HTTP server, subject to the route method being tested. If the route method is RouteMethod.Any and the route uses [Route.AnyPath](/api/Sisk.Core.Routing.Route.AnyPath) in its path expression, this route will match all requests from the HTTP server, and no other routes can be defined.

```cs
// the following route will match all POST requests
mainRouter.SetRoute(RouteMethod.Post, Route.AnyPath, callbackFunction);
```

## Игнорирование регистра маршрутов

По умолчанию, интерпретация маршрутов с запросами является регистро-чувствительной. Чтобы сделать его регистро-нечувствительным, включите этот параметр.

```cs
mainRouter.MatchRoutesIgnoreCase = true;
```

This will also enable the option `RegexOptions.IgnoreCase` for routes where it's regex-matching.

## Обработка ошибок

Обработка ошибок

Route callbacks can throw errors during server execution. If not handled correctly, the overall functioning of the HTTP server can be terminated. The router has a callback for when a route callback fails and prevents service interruption.

This method is only reachable when [ThrowExceptions](/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions) is set to false.

```cs
mainRouter.CallbackErrorHandler = (ex, context) => {
    return new HttpResponse(500.Content("Error: {ex.Message}");
```






































































































































































































































































































































































































































































































































































































































































































































































```cs












```cs




```cs




```cs




```cs




```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
