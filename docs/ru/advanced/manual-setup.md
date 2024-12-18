# Руководство (упрощенный)

В этом разделе мы создадим наш HTTP-сервер без каких-либо предварительно определенных стандартов, совершенно абстрактно. Здесь вы можете вручную построить, как будет функционировать ваш HTTP-сервер. У каждого ListeningHost есть маршрутизатор, и HTTP-сервер может иметь несколько ListeningHosts, каждый из которых указывает на другой хост на другом порту.

Сначала нам нужно понять концепцию запроса/ответа. Она довольно проста: на каждый запрос должен быть ответ. Sisk также следует этому принципу. Давайте создадим метод, который отвечает сообщением "Привет, мир!" в формате HTML, указав код состояния и заголовки.

```csharp
// Program.cs
using Sisk.Core.Http;
using Sisk.Core.Routing;

static HttpResponse IndexPage(HttpRequest request)
{
    HttpResponse indexResponse = new HttpResponse
    {
        Status = System.Net.HttpStatusCode.OK,
        Content = new HtmlContent(@"
            <html>
                <body>
                    <h1>Привет, мир!</h1>
                </body>
            </html>
        ")
    };

    return indexResponse;
}
```

Следующим шагом является связывание этого метода с маршрутом HTTP.

## Маршрутизаторы

Маршрутизаторы - это абстракции маршрутов запросов и служат мостом между запросами и ответами для службы. Маршрутизаторы управляют маршрутами службы, функциями и ошибками.

Маршрутизатор может иметь несколько маршрутов, и каждый маршрут может выполнять различные операции на этом пути, например, выполнять функцию, отображать страницу или предоставлять ресурс с сервера.

Создадим наш первый маршрутизатор и свяжем наш метод `IndexPage` с путем индекса.

```csharp
Router mainRouter = new Router();

// SetRoute свяжет все маршруты индекса с нашим методом.
mainRouter.SetRoute(RouteMethod.Get, "/", IndexPage);
```

Теперь наш маршрутизатор может получать запросы и отправлять ответы. Однако `mainRouter` не привязан к хосту или серверу, поэтому он не будет работать самостоятельно. Следующим шагом является создание нашего ListeningHost.

## Слушатели и порты

[ListeningHost](/api/Sisk.Core.Http.ListeningHost) может размещать маршрутизатор и несколько портов прослушивания для одного и того же маршрутизатора. [ListeningPort](/api/Sisk.Core.Http.ListeningPort) - это префикс, по которому HTTP-сервер будет прослушивать.

Здесь мы можем создать `ListeningHost`, который указывает на два конечных пункта для нашего маршрутизатора:

```csharp
ListeningHost myHost = new ListeningHost
{
    Router = new Router(),
    Ports = new ListeningPort[]
    {
        new ListeningPort("http://localhost:5000/")
    }
};
```

Теперь наш HTTP-сервер будет прослушивать указанные конечные точки и перенаправлять свои запросы на наш маршрутизатор.

## Настройка сервера

Настройка сервера отвечает за большую часть поведения самого HTTP-сервера. В этой конфигурации мы можем связать `ListeningHosts` с нашим сервером.

```csharp
HttpServerConfiguration config = new HttpServerConfiguration();
config.ListeningHosts.Add(myHost); // Добавляем наш ListeningHost в эту конфигурацию сервера
```

Затем мы можем создать наш HTTP-сервер:

```csharp
HttpServer server = new HttpServer(config);
server.Start();    // Запускаем сервер
Console.ReadKey(); // Предотвращает завершение работы приложения
```

Теперь мы можем скомпилировать наше исполняемое приложение и запустить наш HTTP-сервер с помощью команды:

```bash
dotnet watch
```

Во время выполнения откройте браузер и перейдите по адресу сервера, и вы увидите:
