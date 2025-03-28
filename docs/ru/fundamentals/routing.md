# Маршрутизация

[Router](/api/Sisk.Core.Routing.Router) является первым шагом в построении сервера. Он отвечает за хранение объектов [Route](/api/Sisk.Core.Routing.Route), которые являются конечными точками, сопоставляющими URL и их методы с действиями, выполняемыми сервером. Каждое действие отвечает за получение запроса и доставку ответа клиенту.

Маршруты представляют собой пары выражений пути ("шаблон пути") и HTTP-метода, на который они могут реагировать. Когда сервер получает запрос, он попытается найти маршрут, соответствующий полученному запросу, а затем вызовет действие этого маршрута и доставит результирующий ответ клиенту.

Существует несколько способов определить маршруты в Sisk: они могут быть статическими, динамическими или автоматически сканированными, определены атрибутами или直接 в объекте Router.

```cs
Router mainRouter = new Router();

// сопоставляет GET / с следующим действием
mainRouter.MapGet("/", request => {
    return new HttpResponse("Hello, world!");
});
```

Чтобы понять, что может делать маршрут, нам нужно понять, что может делать запрос. [HttpRequest](/api/Sisk.Core.Http.HttpRequest) будет содержать все необходимое. Sisk также включает некоторые дополнительные функции, которые ускоряют общее развитие.

Для каждого действия, полученного сервером, будет вызван делегат типа [RouteAction](/api/Sisk.Core.Routing.RouteAction). Этот делегат содержит параметр, который держит [HttpRequest](/api/Sisk.Core.Http.HttpRequest) со всей необходимой информацией о полученном запросе. Результирующий объект от этого делегата должен быть [HttpResponse](/api/Sisk.Core.Http.HttpResponse) или объектом, который сопоставляется с ним через [неявные типы ответов](/docs/ru/fundamentals/responses#implicit-response-types).

## Сопоставление маршрутов

Когда сервер получает запрос, Sisk ищет маршрут, удовлетворяющий выражению полученного пути. Это выражение всегда тестируется между маршрутом и путем запроса, без учета строки запроса.

Этот тест не имеет приоритета и исключителен для одного маршрута. Когда нет маршрута, соответствующего этому запросу, возвращается ответ [Router.NotFoundErrorHandler](/api/Sisk.Core.Routing.Router.NotFoundErrorHandler) клиенту. Когда шаблон пути совпадает, но HTTP-метод не совпадает, возвращается ответ [Router.MethodNotAllowedErrorHandler](/api/Sisk.Core.Routing.Router.MethodNotAllowedErrorHandler) клиенту.

Sisk проверяет возможность коллизий маршрутов, чтобы избежать этих проблем. Когда определяются маршруты, Sisk будет искать возможные маршруты, которые могут столкнуться с определяемым маршрутом. Этот тест включает проверку пути и метода, на который настроен маршрут.

### Создание маршрутов с помощью шаблонов пути

Вы можете определить маршруты, используя различные методы `SetRoute`.

```cs
// способ SetRoute
mainRouter.SetRoute(RouteMethod.Get, "/hey/<name>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    return new HttpResponse($"Hello, {name}");
});

// способ Map*
mainRouter.MapGet("/form", (request) =>
{
    var formData = request.GetFormData();
    return new HttpResponse(); // пустой 200 ок
});

// помощник методов Route.*
mainRouter += Route.Get("/image.png", (request) =>
{
    var imageStream = File.OpenRead("image.png");
    
    return new HttpResponse()
    {
        // StreamContent inner
        // stream будет disposed после отправки
        // ответа.
        Content = new StreamContent(imageStream)
    };
});

// несколько параметров
mainRouter.MapGet("/hey/<name>/surname/<surname>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    string surname = request.RouteParameters["surname"].GetString();

    return new HttpResponse($"Hello, {name} {surname}!");
});
```

Свойство [RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) объекта HttpResponse содержит всю информацию о переменных пути полученного запроса.

Каждый полученный сервером путь нормализуется перед выполнением теста шаблона пути, следующим этими правилами:

- Все пустые сегменты удаляются из пути, например: `////foo//bar` становится `/foo/bar`.
- Сопоставление пути **чувствительно к регистру**, если только [Router.MatchRoutesIgnoreCase](/api/Sisk.Core.Routing.Router.MatchRoutesIgnoreCase) не установлен в `true`.

Свойства [Query](/api/Sisk.Core.Http.HttpRequest.Query) и [RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) объекта [HttpRequest](/api/Sisk.Core.Http.HttpRequest) возвращают объект [StringValueCollection](/api/Sisk.Core.Entity.StringValueCollection), где каждый индексированный свойство возвращает не-нулевой [StringValue](/api/Sisk.Core.Entity.StringValue), который можно использовать как опцию/монаду для преобразования его сырого значения в управляемый объект.

Пример ниже читает параметр маршрута "id" и получает из него `Guid`. Если параметр не является допустимым Guid, выбрасывается исключение, и возвращается ошибка 500 клиенту, если сервер не обрабатывает [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler).

```cs
mainRouter.SetRoute(RouteMethod.Get, "/user/<id>", (request) =>
{
    Guid id = request.RouteParameters["id"].GetGuid();
});
```

> [!NOTE]
> Пути имеют игнорируемый завершающий `/` как в запросе, так и в пути маршрута, то есть если вы попытаетесь получить доступ к маршруту, определённому как `/index/page`, вы сможете получить доступ, используя `/index/page/` тоже.
>
> Вы также можете принудительно завершать URL `/`, включив флаг [ForceTrailingSlash](/api/Sisk.Core.Http.HttpServerFlags.ForceTrailingSlash).

### Создание маршрутов с помощью экземпляров классов

Вы также можете определять маршруты динамически с помощью рефлексии и атрибута [RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute). Таким образом, экземпляр класса, в котором его методы реализуют этот атрибут, будут иметь свои маршруты, определенные в целевом маршрутизаторе.

Чтобы метод был определен как маршрут, он должен быть помечен атрибутом [RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute), таким как сам атрибут или [RouteGetAttribute](/api/Sisk.Core.Routing.RouteGetAttribute). Метод может быть статическим, экземпляром, публичным или приватным. Когда метод `SetObject(type)` или `SetObject<TType>()` используется, методы экземпляра игнорируются.

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
    // будет соответствовать GET /
    [RouteGet]
    HttpResponse Index(HttpRequest request)
    {
        HttpResponse res = new HttpResponse();
        res.Content = new StringContent("Index!");
        return res;
    }
    
    // статические методы также работают
    [RouteGet("/hello")]
    static HttpResponse Hello(HttpRequest request)
    {
        HttpResponse res = new HttpResponse();
        res.Content = new StringContent("Hello world!");
        return res;
    }
}
```

Строка ниже определит оба метода `Index` и `Hello` класса `MyController` как маршруты, поскольку они помечены как маршруты, и предоставлен экземпляр класса, а не его тип. Если бы вместо этого был предоставлен его тип, были бы определены только статические методы.

```cs
var myController = new MyController();
mainRouter.SetObject(myController);
```

С версии Sisk 0.16 возможно включить AutoScan, который будет искать пользовательские классы, реализующие `RouterModule`, и автоматически ассоциировать их с маршрутизатором. Это не поддерживается с AOT-компиляцией.

```cs
mainRouter.AutoScanModules<ApiController>();
```

Вышеуказанная инструкция будет искать все типы, которые реализуют `ApiController`, но не сам тип. Два необязательных параметра указывают, как метод будет искать эти типы. Первый аргумент подразумевает сборку, где будут искаться типы, а второй указывает, каким образом будут определены типы.

## Регулярные маршруты

Вместо использования методов сопоставления пути HTTP по умолчанию вы можете пометить маршрут как интерпретируемый с помощью Regex.

```cs
Route indexRoute = new Route(RouteMethod.Get, @"\/[a-z]+\/", "My route", IndexPage, null);
indexRoute.UseRegex = true;
mainRouter.SetRoute(indexRoute);
```

Или с помощью класса [RegexRoute](/api/Sisk.Core.Routing.RegexRoute):

```cs
mainRouter.SetRoute(new RegexRoute(RouteMethod.Get, @"\/[a-z]+\/", request =>
{
    return new HttpResponse("hello, world");
}));
```

Вы также можете захватить группы из шаблона Regex в содержимое [HttpRequest.RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters):

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
    [RegexRoute(RouteMethod.Get, @"/uploads/(?<filename>.*\.(jpeg|jpg|png))")]
    static HttpResponse RegexRoute(HttpRequest request)
    {
        string filename = request.RouteParameters["filename"].GetString();
        return new HttpResponse().WithContent($"Acessing file {filename}");
    }
}
```

## Префиксирование маршрутов

Вы можете префиксировать все маршруты в классе или модуле с помощью атрибута [RoutePrefix](/api/Sisk.Core.Routing.RoutePrefixAttribute) и установить префикс как строку.

Смотрите пример ниже, используя архитектуру BREAD (Browse, Read, Edit, Add и Delete):

<div class="script-header">
    <span>
        Controller/Api/UsersController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RoutePrefix("/api/users")]
public class UsersController
{
    // GET /api/users/<id>
    [RouteGet]
    public async Task<HttpResponse> Browse()
    {
        ...
    }
    
    // GET /api/users
    [RouteGet("/<id>")]
    public async Task<HttpResponse> Read()
    {
        ...
    }
    
    // PATCH /api/users/<id>
    [RoutePatch("/<id>")]
    public async Task<HttpResponse> Edit()
    {
        ...
    }
    
    // POST /api/users
    [RoutePost]
    public async Task<HttpResponse> Add()
    {
        ...
    }
    
    // DELETE /api/users/<id>
    [RouteDelete("/<id>")]
    public async Task<HttpResponse> Delete()
    {
        ...
    }
}
```

В вышеуказанном примере параметр HttpResponse опущен в пользу использования через глобальный контекст [HttpContext.Current](/api/Sisk.Core.Http.HttpContext.Current). Читайте больше в следующем разделе.

## Маршруты без параметра запроса

Маршруты можно определять без параметра [HttpRequest](/api/Sisk.Core.Http.HttpRequest) и все равно можно получить запрос и его компоненты в контексте запроса. Давайте рассмотрим абстракцию `ControllerBase`, которая служит основой для всех контроллеров API, и эта абстракция предоставляет свойство `Request` для получения [HttpRequest](/api/Sisk.Core.Http.HttpRequest), в настоящее время полученного.

<div class="script-header">
    <span>
        Controller/ControllerBase.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public abstract class ControllerBase
{
    // получает запрос из текущей нити
    public HttpRequest Request { get => HttpContext.Current.Request; }
    
    // строка ниже, когда вызывается, получает базу данных из текущей HTTP-сессии,
    // или создает новую, если она не существует
    public DbContext Database { get => HttpContext.Current.RequestBag.GetOrAdd<DbContext>(); }
}
```

И для всех его потомков, чтобы они могли использовать синтаксис маршрута без параметра запроса:

<div class="script-header">
    <span>
        Controller/UsersController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RoutePrefix("/api/users")]
public class UsersController : ControllerBase
{    
    [RoutePost]
    public async Task<HttpResponse> Create()
    {
        // читает JSON-данные из текущего запроса
        UserCreationDto? user = JsonSerializer.DeserializeAsync<UserCreationDto>(Request.Body);
        ...
        Database.Users.Add(user);
        
        return new HttpResponse(201);
    }
}
```

Более подробную информацию о текущем контексте и внедрении зависимостей можно найти в учебнике [внедрение зависимостей](/docs/ru/features/instancing).

## Маршруты любого метода

Вы можете определить маршрут, чтобы он соответствовал только его пути и пропустить HTTP-метод. Это может быть полезно для проверки метода внутри маршрута.

```cs
// будет соответствовать / на любом HTTP-методе
mainRouter.SetRoute(RouteMethod.Any, "/", callbackFunction);
```

## Маршруты любого пути

Маршруты любого пути тестируют любой путь, полученный HTTP-сервером, подлежащий маршруту метода. Если маршрут метода равен RouteMethod.Any и маршрут использует [Route.AnyPath](/api/Sisk.Core.Routing.Route.AnyPath) в его выражении пути, этот маршрут будет слушать все запросы от HTTP-сервера, и не могут быть определены другие маршруты.

```cs
// следующий маршрут будет соответствовать всем запросам POST
mainRouter.SetRoute(RouteMethod.Post, Route.AnyPath, callbackFunction);
```

## Игнорирование регистра маршрута

По умолчанию интерпретация маршрутов с запросами чувствительна к регистру. Чтобы сделать ее игнорирующей регистр, включите эту опцию:

```cs
mainRouter.MatchRoutesIgnoreCase = true;
```

Это также включит опцию `RegexOptions.IgnoreCase` для маршрутов, где используется сопоставление с помощью Regex.

## Обработчик не найденного (404) обратного вызова

Вы можете создать пользовательский обратный вызов для случая, когда запрос не соответствует ни одному известному маршруту.

```cs
mainRouter.NotFoundErrorHandler = () =>
{
    return new HttpResponse(404)
    {
        // С версии v0.14
        Content = new HtmlContent("<h1>Not found</h1>")
        // более ранние версии
        Content = new StringContent("<h1>Not found</h1>", Encoding.UTF8, "text/html")
    };
};
```

## Обработчик метода не допускается (405) обратного вызова

Вы также можете создать пользовательский обратный вызов для случая, когда запрос соответствует его пути, но не соответствует методу.

```cs
mainRouter.MethodNotAllowedErrorHandler = (context) =>
{
    return new HttpResponse(405)
    {
        Content = new StringContent($"Method not allowed for this route.")
    };
};
```

## Внутренний обработчик ошибок

Обратные вызовы маршрутов могут выбрасывать ошибки во время выполнения сервера. Если они не обрабатываются правильно, общая работа HTTP-сервера может быть прервана. Маршрутизатор имеет обратный вызов для случая, когда обратный вызов маршрута неудачно и предотвращает прерывание службы.

Этот метод доступен только тогда, когда [ThrowExceptions](/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions) установлен в `false`.

```cs
mainRouter.CallbackErrorHandler = (ex, context) =>
{
    return new HttpResponse(500)
    {
        Content = new StringContent($"Error: {ex.Message}")
    };
};
```