# Руководство (расширенная) настройка

Source: https://docs.sisk-framework.org/ru/docs/advanced/manual-setup.html

Используйте ручную настройку, когда вам нужно собрать части сервера самостоятельно, например, когда один процесс должен предоставлять несколько хостов, портов, маршрутизаторов или пользовательскую конфигурацию сервера. Для большинства приложений API построителя короче и предпочтительнее. Ручная настройка полезна, когда вы хотите прямой контроль над четырьмя основными компонентами: `Router`, один или несколько объектов `ListeningHost`, `HttpServerConfiguration` и конечным `HttpServer`.

Сначала нам нужно понять концепцию запрос/ответ. Она довольно проста: для каждого запроса должен быть ответ. Sisk следует этому принципу. Давайте создадим метод, который отвечает сообщением «Hello, World!» в HTML, указывая код статуса и заголовки.

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

Следующий шаг — связать этот метод с HTTP‑маршрутом.

## Routers

Маршрутизаторы — это абстракции маршрутов запросов и служат мостом между запросами и ответами сервиса. Маршрутизаторы управляют маршрутами сервиса, функциями и ошибками.

Маршрутизатор может иметь несколько маршрутов, и каждый маршрут может выполнять разные операции по этому пути, такие как выполнение функции, отдача страницы или предоставление ресурса с сервера.

Создадим наш первый маршрутизатор и свяжем метод `IndexPage` с индексным путём.

```csharp
Router mainRouter = new Router();

mainRouter.MapGet("/", IndexPage);
```

Теперь наш маршрутизатор может принимать запросы и отправлять ответы. Однако `mainRouter` не привязан к хосту или серверу, поэтому он не будет работать сам по себе. Следующий шаг — создать наш ListeningHost.

## Listening Hosts and Ports

Объект [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md) может размещать маршрутизатор и несколько прослушиваемых портов для одного и того же маршрутизатора. [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md) — это префикс, на котором HTTP‑сервер будет слушать.

Здесь мы можем создать `ListeningHost`, который указывает на два конечных пункта для нашего маршрутизатора:

```csharp
ListeningHost myHost = new ListeningHost
{
    Router = mainRouter,
    Ports = new ListeningPort[]
    {
        new ListeningPort("http://localhost:5000/")
    }
};
```

Теперь наш HTTP‑сервер будет слушать указанные конечные точки и перенаправлять запросы к нашему маршрутизатору.

## Server Configuration

Конфигурация сервера отвечает за большую часть поведения самого HTTP‑сервера. В этой конфигурации мы можем связать `ListeningHosts` с нашим сервером.

```csharp
HttpServerConfiguration config = new HttpServerConfiguration();
config.ListeningHosts.Add(myHost); // Добавляем наш ListeningHost в эту конфигурацию сервера
```

Общие параметры конфигурации сервера:

| Свойство | Значение по умолчанию | Когда использовать | Примечания |
| --- | --- | --- | --- |
| [RemoteRequestsAction](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.RemoteRequestsAction.md) | `RequestListenAction.Accept` | Сервис должен отклонять запросы, не являющиеся локальными, если они не проходят через доверенный обратный прокси. | Устанавливайте `Drop` только когда топология развертывания ясна. |
| [IncludeRequestIdHeader](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.IncludeRequestIdHeader.md) | `false` | Клиентам или прокси нужен идентификатор запроса Sisk в заголовке ответа `X-Request-Id`. | Сочетайте с журналами, содержащими `HttpRequest.RequestId`. |
| [IdleConnectionTimeout](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.IdleConnectionTimeout.md) | `120` seconds | Неактивные keep-alive соединения должны быть закрыты рано или поздно. | Это применяется HTTP‑движком. |
| [NormalizeHeadersEncodings](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.NormalizeHeadersEncodings.md) | `false` | Вы получаете заголовки с несоответствием кодировок. | Это требует затрат на обработку; оставляйте отключённым, если не требуется. |
| [SendSiskHeader](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.SendSiskHeader.md) | `true` | Вы хотите скрыть или показать заголовок Sisk `X-Powered-By`. | Отключите его для более строгих политик заголовков в продакшене. |
| [OptionsLogMode](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.OptionsLogMode.md) | `LogOutput.Both` | Вы хотите уменьшить или перенаправить логи, генерируемые автоматической обработкой `OPTIONS`. | Использует те же значения режима логирования, что и маршруты. |
| [AsyncRequestProcessing](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.AsyncRequestProcessing.md) | `true` | Вам нужна детерминированная обработка одиночных запросов для диагностики. | Отключение снижает пропускную способность. |
| [DisposeDisposableContextValues](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.DisposeDisposableContextValues.md) | `true` | Значения в контейнере запроса, реализующие `IDisposable`, должны автоматически освобождаться. | Оставляйте включённым, если только владение не управляется в другом месте. |
| [ConvertIAsyncEnumerableIntoEnumerable](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ConvertIAsyncEnumerableIntoEnumerable.md) | `true` | Обработчики значений должны получать асинхронные перечисления как блокирующие перечисления. | Отключите, если вы реализуете собственную обработку async‑stream. |
| [KeepAlive](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.KeepAlive.md) | `true` | Соединения должны оставаться переиспользуемыми после ответов. | Отключите для клиентов или посредников, которые плохо работают с постоянными соединениями. |
| [ForceTrailingSlash](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ForceTrailingSlash.md) | `false` | GET‑маршруты должны перенаправлять на URL с завершающим слэшем. | Применяется только к маршрутам без регулярных выражений. |
| [MaximumContentLength](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength.md) | `0` | Тела запросов нуждаются в ограничении размера. | `0` означает отсутствие ограничений, пока не достигнуты ограничения фреймворка или памяти. |
| [EnableAutomaticResponseCompression](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.EnableAutomaticResponseCompression.md) | `false` | Ответы должны автоматически сжиматься, если клиент поддерживает сжатие. | Существующие ответы `CompressedContent` не сжимаются повторно. |

Далее мы можем создать наш HTTP‑сервер:

```csharp
HttpServer server = new HttpServer(config);
server.Start();    // Запускает сервер
Console.ReadKey(); // Предотвращает завершение приложения
```

Теперь мы можем собрать наш исполняемый файл и запустить HTTP‑сервер командой:

```bash
dotnet watch
```

Во время выполнения откройте браузер и перейдите по пути сервера, и вы должны увидеть:

<img src="/assets/img/localhost.png" >
