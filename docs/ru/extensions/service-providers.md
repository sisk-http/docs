# Провайдеры услуг

Провайдеры услуг - простой способ переносить ваше приложение в разные среды и конфигурации без необходимости изменять код. Класс [ServiceProvider](/read?q=/contents/Sisk/Provider/ServiceProvider) доступен по типу, который устанавливает приложение с вашим маршрутизатором, конфигурацией и другими настройками, уже доступными в Sisk.

> [!IMPORTANT]
> Пакет Sisk.ServiceProvider больше не поддерживается. Пожалуйста, используйте класс [HttpServerHostContextBuilder](/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder) вместо него.

> [!WARNING]
> С версии Sisk 0.16 эта функция встроена в его ядро, и больше не требуется устанавливать дополнительный пакет для этого. Пожалуйста, [прочитайте этот документ](https://github.com/sisk-http/docs/blob/master/archive/0.16/service-providers-migration) с более подробной информацией, спецификацией миграции и т.д.
>
> Пакет будет поддерживаться только для версии 0.15, пока она поддерживается.

Провайдеры услуг управляются файлом настроек JSON, который считывается приложением рядом с исполняемым файлом. Вот пример файла настроек службы:

```json
{
    "Server": {
        "DefaultEncoding": "UTF-8",
        "ThrowExceptions": true,
        "IncludeRequestIdHeader": true
    },
    "ListeningHost": {
        "Label": "My sisk application",
        "Ports": [
            "http://localhost:80/",
            "https://localhost:443/",  // Файлы конфигурации также поддерживают комментарии
        ],
        "CrossOriginResourceSharingPolicy": {
            "AllowOrigin": "*",
            "AllowOrigins": [ "*" ],   // новое с 0.14
            "AllowMethods": [ "*" ],
            "AllowHeaders": [ "*" ],
            "MaxAge": 3600
        },
        "Parameters": {
            "MySqlConnection": "server=localhost;user=root;"
        }
    }
}
```

Этот файл считывается вместе с исполняемым файлом сервера, независимо от платформы сборки. По умолчанию имя файла - `service-config.json` и оно должно находиться в той же директории, что и исполняемый файл. Также можно изменить имя файла, настроек класса [ServiceProvider](/api/Sisk/Provider/ServiceProvider).

> [!TIP]
> В файлах конфигурации провайдеров услуг Sisk разрешено использовать `// single` или `/* multi-line comments */`, так как они игнорируются интерпретатором.

## Установка

Вы можете установить пакет Sisk.SericeProviders с помощью:

    dotnet add package Sisk.SericeProviders

Более подробную информацию о загрузке можно найти [здесь](https://www.nuget.org/packages/Sisk.ServiceProvider/).

## Создание экземпляра провайдера услуг

В этом сеансе мы узнаем, как настроить приложение для запуска провайдера услуг Sisk. Прежде всего, вам нужно установить последнюю версию Sisk в вашем проекте.

Сначала давайте настроим экземпляр класса RouterFactory, который будет настроен и выпустит маршрутизатор. Этот класс не является точкой входа в приложение, но тем не менее, это объект, который будет запускать объекты runtime.

```cs
public class Application : RouterFactory
{
    public string? MySqlConnection { get; set; }

    // Ниже мы указываем маршрутизатору, чтобы он искал маршруты в нашем экземпляре приложения.
    // Вы можете определить маршруты на другом объекте или типе.
    public override Router BuildRouter()
    {
        Router r = new Router();
        r.SetObject(this);
        return r;
    }

    // В setupParameters мы можем установить параметры, указанные в разделе параметров нашего JSON.
    public override void Setup(NameValueCollection setupParameters)
    {
        this.MySqlConnection = setupParameters["MySqlConnection"] ?? throw new ArgumentNullException(nameof(MySqlConnection));
    }

    // Синхронная методика, вызываемая непосредственно перед запуском HTTP-сервера.
    public override void Bootstrap()
    {
        ;
    }

    [Route(RouteMethod.Get, "/")]
    public HttpResponse IndexPage(HttpRequest request)
    {
        HttpResponse htmlResponse = new HttpResponse();
        htmlResponse.Content = new StringContent("Hello, world!", System.Text.Encoding.UTF8, "text/plain");
        return htmlResponse;
    }
}
```

Теперь мы можем настроить службу в точке входа в наше приложение:

```cs
public class Program
{
    public static Application App { get; set; }

    static void Main(string[] args)
    {
        App = new Application();
        ServiceProvider provider = new(App, "config.json");
        provider.ConfigureInit(config =>
        {
            // Определяет основной цикл запросов как информационную культуру португальского языка.
            config.UseLocale(CultureInfo.GetCultureInfo("pt-BR"));

            // Устанавливает флаги HTTP на сервере при запуске.
            config.UseFlags(new HttpServerFlags()
            {
                SendSiskHeader = true
            });

            // Указывает, что после запуска сервера он не должен завершать основной цикл.
            config.UseHauting(true);

            // Переопределяет параметры конфигурации HTTP-сервера, даже если они были параметризированы в файле конфигурации JSON.
            config.UseConfiguration(httpConfig =>
            {
                if (httpConfig.AccessLogsStream?.FilePath != null)
                {
                    RotatingLogPolicy policy = new RotatingLogPolicy(httpConfig.AccessLogsStream);
                    policy.Configure(1024 * 1024, TimeSpan.FromHours(6));
                }
            });

            // Переопределяет параметры CORS из файла конфигурации
            config.UseCors(cors =>
            {
                cors.AllowMethods = new[] { "GET", "POST", "PUT", "DELETE" };
            });

            // Переопределяет свойства непосредственно HTTP-серверу
            config.UseHttpServer(http =>
            {
                http.EventSources.OnEventSourceRegistered += (sender, ws) =>
                {
                    Console.WriteLine("Новый источник событий: " + ws.Identifier);
                };
                http.EventSources.OnEventSourceUnregistration += (sender, ws) =>
                {
                    Console.WriteLine("Закрыт источник событий: " + ws.Identifier);
                };
            });
        });
    }
}
```

Теперь наше приложение готово к запуску с файлом JSON, который настраивает порты, методы, имена хостов и параметры.

## Структура файла конфигурации

Файл JSON состоит из свойств:

| Свойство | Обязательно | Описание |
|---|---|---|
| Server | Да | Представляет сам сервер со своими настройками. |
| Server.AccessLogsStream | Необязательно | По умолчанию равно `console`. Указывает поток вывода журнала доступа. Может быть именем файла, `null` или `console`. |
| Server.ErrorsLogsStream | Необязательно | По умолчанию равно `null`. Указывает поток вывода журнала ошибок. Может быть именем файла, `null` или `console`. |
| Server.ResolveForwardedOriginAddress | Необязательно | По умолчанию равно `false`. Указывает, должен ли HTTP-сервер разрешать заголовки `X-Forwarded-For` на IP-адрес пользователя. (Рекомендуется для прокси-серверов) |
| Server.ResolveForwardedOriginHost | Необязательно | По умолчанию равно `false`. Указывает, должен ли HTTP-сервер разрешать заголовки `X-Forwarded-Host` на хост-сервер. |
| Server.DefaultEncoding | Необязательно | По умолчанию равно `UTF-8`. Указывает кодировку текста, используемую по умолчанию HTTP-сервером. |
| Server.MaximumContentLength | Необязательно | По умолчанию равно `0`. Указывает максимальный размер контента в байтах. Ноль означает бесконечность. |
| Server.IncludeRequestIdHeader | Необязательно | По умолчанию равно `false`. Указывает, должен ли HTTP-сервер отправлять заголовок `X-Request-Id`. |
| Server.ThrowExceptions | Необязательно | По умолчанию равно `true`. Указывает, должны ли необработанные исключения вызывать. Установите `false` при работе в режиме производства и `true` при отладке. |
| ListeningHost | Да | Представляет хост, на котором работает сервер. |
| ListeningHost.Label | Необязательно | Представляет метку приложения. |
| ListeningHost.Ports | Да | Представляет массив строк, соответствующий синтаксису `ListeningPort`. |
| ListeningHost.CrossOriginResourceSharingPolicy | Необязательно | Настройка заголовков CORS для приложения. |
| ListeningHost.CrossOriginResourceSharingPolicy.AllowCredentials | Необязательно | По умолчанию равно `false`. Указывает заголовок `Allow-Credentials`. |
| ListeningHost.CrossOriginResourceSharingPolicy.ExposeHeaders | Необязательно | По умолчанию равно `null`. Этот параметр ожидает массив строк. Указывает заголовок `Expose-Headers`. |
| ListeningHost.CrossOriginResourceSharingPolicy.AllowOrigin | Необязательно | По умолчанию равно `null`. Этот параметр ожидает строку. Указывает заголовок `Allow-Origin`. |
| ListeningHost.CrossOriginResourceSharingPolicy.AllowOrigins | Необязательно | По умолчанию равно `null`. Этот параметр ожидает массив строк. Указывает несколько заголовков `Allow-Origin`. См. [AllowOrigins для более подробной информации. |
| ListeningHost.CrossOriginResourceSharingPolicy.AllowMethods | Необязательно | По умолчанию равно `null`. Этот параметр ожидает массив строк. Указывает заголовок `Allow-Methods`. |
| ListeningHost.CrossOriginResourceSharingPolicy.AllowHeaders | Необязательно | По умолчанию равно `null`. Этот параметр ожидает массив строк. Указывает заголовок `Allow-Headers`. |
| ListeningHost.CrossOriginResourceSharingPolicy.MaxAge | Необязательно | По умолчанию равно `null`. Этот параметр ожидает целое число. Указывает заголовок `Max-Age` в секундах. |


















































































































```cs

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
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs