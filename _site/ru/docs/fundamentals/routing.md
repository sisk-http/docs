# Маршрутизация

Source: https://docs.sisk-framework.org/ru/docs/fundamentals/routing.html

[Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) — первый шаг в построении сервера. Он отвечает за хранение объектов [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md), которые являются конечными точками, сопоставляющими URL‑адреса и их методы с действиями, выполняемыми сервером. Каждое действие отвечает за получение запроса и отправку ответа клиенту.

Маршруты представляют собой пары выражений пути («шаблон пути») и HTTP‑метода, которые они могут обрабатывать. Когда к серверу поступает запрос, он пытается найти маршрут, соответствующий полученному запросу, затем вызывает действие этого маршрута и отправляет полученный ответ клиенту.

В Sisk существует несколько способов определения маршрутов: они могут быть статическими, динамическими или автоматически сканируемыми, задаваться атрибутами или напрямую в объекте Router.

```cs
Router mainRouter = new Router();

// сопоставляет GET / с следующим действием
mainRouter.MapGet("/", request => {
    return new HttpResponse("Hello, world!");
});
```

Чтобы понять, что может делать маршрут, нужно понять, что может делать запрос. [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) содержит всё необходимое. Sisk также включает дополнительные возможности, ускоряющие общую разработку.

Для каждого действия, полученного сервером, будет вызван делегат типа [RouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAction.md). Этот делегат принимает параметр, содержащий [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) со всей необходимой информацией о запросе, полученном сервером. Объект, возвращаемый этим делегатом, должен быть [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) или объектом, который к нему неявно преобразуется через [implicit response types](https://docs.sisk-framework.org/ru/docs/fundamentals/responses.md#implicit-response-types).

## Сопоставление маршрутов

Когда HTTP‑сервер получает запрос, Sisk ищет маршрут, удовлетворяющий выражению пути, полученного в запросе. Выражение всегда сравнивается между маршрутом и путём запроса без учёта строки запроса.

Этот тест не имеет приоритета и является эксклюзивным для одного маршрута. Если ни один маршрут не совпадает с запросом, возвращается ответ [Router.NotFoundErrorHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.NotFoundErrorHandler.md). Если шаблон пути совпадает, но HTTP‑метод не совпадает, отправляется ответ [Router.MethodNotAllowedErrorHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MethodNotAllowedErrorHandler.md).

Sisk проверяет возможность конфликтов маршрутов, чтобы избежать этих проблем. При определении маршрутов Sisk ищет потенциальные маршруты, которые могут конфликтовать с определяемым маршрутом. Этот тест включает проверку пути и метода, которые маршрут принимает.

### Создание маршрутов с помощью шаблонов пути

Для новых приложений предпочтительнее использовать методы `Map*`. Они делают HTTP‑метод видимым в месте вызова и соответствуют текущему API `Router`. Более старые методы `SetRoute` всё ещё существуют как совместимые обёртки, но новые примеры следует писать с использованием `Map`, `MapGet`, `MapPost`, `MapPut`, `MapDelete`, `MapPatch`, `MapAny`, `MapOptions` или `MapHead`.

```cs
// Методы Map* — обычный способ определения маршрутов, специфичных для метода.
mainRouter.MapGet("/hey/<name>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    return new HttpResponse($"Hello, {name}");
});

mainRouter.MapPost("/form", (request) =>
{
    var formData = request.GetFormContent();
    return new HttpResponse(); // пустой 200 OK
});

// Map также может принимать экземпляр Route, когда нужны параметры маршрута.
mainRouter.Map(Route.Get("/image.png", (request) =>
{
    var imageStream = File.OpenRead("image.png");
    
    return new HttpResponse()
    {
        // внутренний StreamContent
        // поток будет освобождён после отправки
        // ответа.
        Content = new StreamContent(imageStream)
    };
}));

// несколько параметров
mainRouter.MapGet("/hey/<name>/surname/<surname>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    string surname = request.RouteParameters["surname"].GetString();

    return new HttpResponse($"Hello, {name} {surname}!");
});
```

Свойство [RouteParameters](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RouteParameters.md) объекта HttpRequest содержит всю информацию о переменных пути полученного запроса.

Каждый путь, полученный сервером, нормализуется перед выполнением теста шаблона пути согласно следующим правилам:

- Все пустые сегменты удаляются из пути, например: `////foo//bar` превращается в `/foo/bar`.
- Сопоставление пути **чувствительно к регистру**, если только [Router.MatchRoutesIgnoreCase](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MatchRoutesIgnoreCase.md) не установлен в `true`.

Свойства [Query](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Query.md) и [RouteParameters](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RouteParameters.md) объекта [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) возвращают объект [StringValueCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValueCollection.md), где каждый индексированный элемент возвращает ненулевой [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md), который можно использовать как опцию/монад для преобразования его сырого значения в управляемый объект.

Ниже пример, читающий параметр маршрута «id» и получающий из него `Guid`. Если параметр не является корректным Guid, генерируется исключение, и клиент получает ошибку 500, если сервер не обрабатывает [Router.CallbackErrorHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.CallbackErrorHandler.md).

```cs
mainRouter.MapGet("/user/<id>", (request) =>
{
    Guid id = request.RouteParameters["id"].GetGuid();
    return new HttpResponse($"User id: {id}");
});
```

> [!NOTE]
> Конечный `/` в путях игнорируется как в запросе, так и в маршруте, то есть если вы попытаетесь обратиться к маршруту, определённому как `/index/page`, вы сможете также обратиться к нему как к `/index/page/`.
>
> Вы также можете принудительно требовать завершающий `/`, включив [HttpServerConfiguration.ForceTrailingSlash](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ForceTrailingSlash.md).

### Создание маршрутов с помощью экземпляров классов

Вы также можете определять маршруты динамически с помощью рефлексии и атрибута [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md). Таким образом, экземпляр класса, методы которого помечены этим атрибутом, получит свои маршруты в целевом роутере.

Чтобы метод был определён как маршрут, он должен быть помечен [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md), например самим атрибутом или [RouteGetAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteGetAttribute.md). Метод может быть статическим, экземплярным, публичным или приватным. Используйте `MapInstance`, когда хотите сопоставить экземплярные и статические методы маршрутов из объекта. Используйте `MapType`, когда хотите сопоставить только статические методы маршрутов из типа.

```cs {title="Controller/MyController.cs"}
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

Следующая строка определит оба метода `Index` и `Hello` класса `MyController` как маршруты, поскольку оба помечены как маршруты, и предоставлен экземпляр класса, а не его тип. Если бы был предоставлен тип, определялись бы только статические методы.

```cs
var myController = new MyController();
mainRouter.MapInstance(myController);
```

Чтобы сопоставить только статические методы маршрутов из типа, используйте:

```cs
mainRouter.MapType<MyController>();
```

Начиная с версии Sisk 0.16, можно включить AutoScan, который будет искать пользовательские классы, реализующие `RouterModule`, и автоматически связывать их с роутером. Это не поддерживается при AOT‑компиляции.

```cs
mainRouter.AutoScanModules<ApiController>();
```

Вышеприведённая инструкция будет искать все типы, реализующие `ApiController`, но **не сам тип**. Два необязательных параметра указывают, как метод будет искать эти типы. Первый аргумент задаёт сборку, в которой будет происходить поиск, а второй — способ определения найденных типов.

## Маршруты с регулярными выражениями

Вместо использования стандартных методов сопоставления HTTP‑путей вы можете пометить маршрут как интерпретируемый с помощью Regex.

```cs
Route indexRoute = new RegexRoute(RouteMethod.Get, @"\/[a-z]+\/", IndexPage);
mainRouter.Map(indexRoute);
```

Или с помощью класса [RegexRoute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RegexRoute.md):

```cs
mainRouter.Map(new RegexRoute(RouteMethod.Get, @"\/[a-z]+\/", request =>
{
    return new HttpResponse("hello, world");
}));
```

Вы также можете захватывать группы из шаблона regex в содержимое [HttpRequest.RouteParameters](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RouteParameters.md):

```cs {title="Controller/MyController.cs"}
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

Вы можете задать префикс для всех маршрутов в классе или модуле с помощью атрибута [RoutePrefix](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RoutePrefixAttribute.md) и указать префикс в виде строки.

См. пример ниже, использующий архитектуру BREAD (Browse, Read, Edit, Add, Delete):

```cs {title="Controller/Api/UsersController.cs"}
[RoutePrefix("/api/users")]
public class UsersController
{
    // GET /api/users
    [RouteGet]
    public async Task<HttpResponse> Browse()
    {
        ...
    }
    
    // GET /api/users/<id>
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

В приведённом примере параметр HttpResponse опущен в пользу использования глобального контекста [HttpContext.Current](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.Current.md). Подробнее об этом в следующем разделе.

## Маршруты без параметра запроса

Маршруты могут быть определены без параметра [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) и всё равно иметь возможность получать запрос и его компоненты из контекста запроса. Рассмотрим абстракцию `ControllerBase`, служащую основой для всех контроллеров API, которая предоставляет свойство `Request` для получения текущего [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md).

```cs {title="Controller/ControllerBase.cs"}
public abstract class ControllerBase
{
    // получает запрос из текущего потока
    public HttpRequest Request { get => HttpContext.Current.Request; }
    
    // строка ниже, при вызове, получает базу данных из текущей HTTP‑сессии,
    // или создаёт новую, если её нет
    public DbContext Database { get => HttpContext.Current.RequestBag.GetOrAdd<DbContext>(); }
}
```

И чтобы все его наследники могли использовать синтаксис маршрута без параметра запроса:

```cs {title="Controller/UsersController.cs"}
[RoutePrefix("/api/users")]
public class UsersController : ControllerBase
{    
    [RoutePost]
    public async Task<HttpResponse> Create()
    {
        // читает JSON‑данные из текущего запроса
        UserCreationDto? user = await Request.GetJsonContentAsync<UserCreationDto>();
        ...
        Database.Users.Add(user);
        
        return new HttpResponse(201);
    }
}
```

Больше деталей о текущем контексте и внедрении зависимостей можно найти в руководстве [dependency injection](https://docs.sisk-framework.org/ru/docs/features/instancing.md).

## Маршруты любого метода

Вы можете определить маршрут, который будет совпадать только по пути, игнорируя HTTP‑метод. Это может быть полезно, если вы хотите выполнять проверку метода внутри обратного вызова маршрута.

```cs
// будет соответствовать / на любом HTTP‑методе
mainRouter.MapAny("/", callbackFunction);
```

## Маршруты любого пути

Маршруты любого пути проверяют любой путь, полученный HTTP‑сервером, с учётом проверяемого метода маршрута. Если метод маршрута `RouteMethod.Any` и путь использует [Route.AnyPath](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.AnyPath.md), такой маршрут будет слушать все запросы сервера, и другие маршруты определять нельзя.

```cs
// следующий маршрут будет соответствовать всем POST‑запросам
mainRouter.Map(RouteMethod.Post, Route.AnyPath, callbackFunction);
```

## Игнорирование регистра при сопоставлении маршрутов

По умолчанию сопоставление маршрутов с запросами чувствительно к регистру. Чтобы игнорировать регистр, включите эту опцию:

```cs
mainRouter.MatchRoutesIgnoreCase = true;
```

Это также включит опцию `RegexOptions.IgnoreCase` для маршрутов, использующих сопоставление через регулярные выражения.

## Обработчик обратного вызова «Не найдено» (404)

Вы можете создать пользовательский обратный вызов для случая, когда запрос не совпадает ни с одним известным маршрутом.

```cs
mainRouter.NotFoundErrorHandler = () =>
{
    return new HttpResponse(404)
    {
        // Начиная с v0.14
        Content = new HtmlContent("<h1>Not found</h1>")
        // более старые версии
        Content = new StringContent("<h1>Not found</h1>", Encoding.UTF8, "text/html")
    };
};
```

## Обработчик обратного вызова «Метод не разрешён» (405)

Вы также можете создать пользовательский обратный вызов для случая, когда запрос совпадает по пути, но не совпадает по методу.

```cs
mainRouter.MethodNotAllowedErrorHandler = (context) =>
{
    return new HttpResponse(405)
    {
        Content = new StringContent($"Method not allowed for this route.")
    };
};
```

## Обработка ошибок

Исключения могут возникать в течение жизненного цикла запроса, начиная от обработчика предвыполнения, через действие роутера, до обработчиков поствыполнения и обработчиков значений. Эти исключения управляются следующим механизмом:

- Если [HttpServerConfiguration.ThrowExceptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions.md) установлен в `true`, исключения будут выбрасываться обычным образом и не будут перехвачены Sisk, и HTTP‑сервер может быть прерван, если исключение не будет поймано.
- Если [HttpServerConfiguration.ThrowExceptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions.md) установлен в `false`, исключения будут перехвачены и обработаны Sisk. После этого, если определён `Router.CallbackErrorHandler`, он будет вызван с перехваченным исключением и контекстом запроса, и **не будет** передан в стандартный вывод ошибок. Если `Router.CallbackErrorHandler` не определён, исключение будет передано в стандартный вывод ошибок, и клиент получит ответ HTTP 500. Если стандартный вывод ошибок не определён, ошибка будет тихо проигнорирована.

Примечание: внутри `Router.CallbackErrorHandler` вы можете задать режим логирования для ошибок, доступа, обоих или ни одного, а также изменить поведение записи в журнал по умолчанию:

```csharp
router.CallbackErrorHandler = (ex, ctx) =>
{
    ctx.LogMode = LogOutput.Both; // переопределить режим логирования, чтобы записывать ошибку и в журнал доступа, и в журнал ошибок
}
```

## Внутренний обработчик ошибок

Обратные вызовы маршрутов могут бросать ошибки во время выполнения сервера. Если их не обработать корректно, общая работа HTTP‑сервера может быть прервана. У роутера есть обратный вызов для случая, когда обратный вызов маршрута завершился ошибкой и предотвращает прерывание сервиса.

Этот метод доступен только когда [ThrowExceptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions.md) установлен в `false`.

```cs
mainRouter.CallbackErrorHandler = (ex, context) =>
{
    return new HttpResponse(500)
    {
        Content = new StringContent($"Error: {ex.Message}")
    };
};
```
