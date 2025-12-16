# Поставщики услуг

Поставщики услуг - это способ переноса вашего приложения Sisk в разные среды с помощью переносимого файла конфигурации. Эта функция позволяет изменять порт сервера, параметры и другие настройки без необходимости изменения кода приложения для каждой среды. Этот модуль зависит от синтаксиса конструкции Sisk и может быть настроен через метод UsePortableConfiguration.

Поставщик конфигурации реализуется с помощью IConfigurationProvider, который предоставляет читатель конфигурации и может получать любую реализацию. По умолчанию, Sisk предоставляет читатель конфигурации JSON, но также есть пакет для файлов INI. Вы также можете создать свой собственный поставщик конфигурации и зарегистрировать его с:

```csharp
using var app = HttpServer.CreateBuilder()
    .UsePortableConfiguration(config =>
    {
        config.WithConfigReader<MyConfigurationReader>();
    })
    .Build();
```

Как упоминалось ранее, поставщик по умолчанию - это файл JSON. По умолчанию, имя файла, которое ищется, - это service-config.json, и он ищется в текущем каталоге запускаемого процесса, а не в каталоге исполняемого файла.

Вы можете выбрать изменение имени файла, а также указать, где Sisk должен искать файл конфигурации, с помощью:

```csharp
using Sisk.Core.Http;
using Sisk.Core.Http.Hosting;

using var app = HttpServer.CreateBuilder()
    .UsePortableConfiguration(config =>
    {
        config.WithConfigFile("config.toml",
            createIfDontExists: true,
            lookupDirectories:
                ConfigurationFileLookupDirectory.CurrentDirectory |
                ConfigurationFileLookupDirectory.AppDirectory);
    })
    .Build();
```

Код выше будет искать файл config.toml в текущем каталоге запускаемого процесса. Если не найден, он затем будет искать в каталоге, где находится исполняемый файл. Если файл не существует, параметр createIfDontExists будет выполнен, создав файл без содержимого в последнем проверенном пути (на основе lookupDirectories), и будет выдано сообщение об ошибке в консоли, предотвращая инициализацию приложения.

> [!TIP]
> 
> Вы можете посмотреть исходный код поставщика конфигурации INI и поставщика конфигурации JSON, чтобы понять, как реализуется IConfigurationProvider.

## Чтение конфигураций из файла JSON

По умолчанию, Sisk предоставляет поставщик конфигурации, который читает конфигурации из файла JSON. Этот файл имеет фиксированную структуру и состоит из следующих параметров:

```json
{
    "Server": {
        "DefaultEncoding": "UTF-8",
        "ThrowExceptions": true,
        "IncludeRequestIdHeader": true
    },
    "ListeningHost": {
        "Label": "Мое приложение Sisk",
        "Ports": [
            "http://localhost:80/",
            "https://localhost:443/",  // Файлы конфигурации также поддерживают комментарии
        ],
        "CrossOriginResourceSharingPolicy": {
            "AllowOrigin": "*",
            "AllowOrigins": [ "*" ],   // новое в 0.14
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

Параметры, созданные из файла конфигурации, можно получить в конструкторе сервера:

```csharp
using var app = HttpServer.CreateBuilder()
    .UsePortableConfiguration(config =>
    {
        config.WithParameters(paramCollection =>
        {
            string databaseConnection = paramCollection.GetValueOrThrow("MySqlConnection");
        });
    })
    .Build();
```

Каждый поставщик конфигурации предоставляет способ чтения параметров инициализации сервера. Некоторые свойства указаны как находящиеся в процессе окружения вместо определения в файле конфигурации, такие как чувствительные данные API, ключи API и т. д.

## Структура файла конфигурации

Файл конфигурации JSON состоит из следующих свойств:

<table>
    <thead>
        <tr>
            <th>Свойство</th>
            <th>Обязательное</th>
            <th>Описание</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Server</td>
            <td>Требуется</td>
            <td>Представляет сам сервер с его настройками.</td>
        </tr>
        <tr>
            <td>Server.AccessLogsStream</td>
            <td>Необязательно</td>
            <td>По умолчанию <code>console</code>. Указывает поток вывода журнала доступа. Может быть именем файла, <code>null</code> или <code>console</code>.</td>
        </tr>
        <tr>
            <td>Server.ErrorsLogsStream</td>
            <td>Необязательно</td>
            <td>По умолчанию <code>null</code>. Указывает поток вывода журнала ошибок. Может быть именем файла, <code>null</code> или <code>console</code>.</td>
        </tr>
        <tr>
            <td>Server.MaximumContentLength</td>
            <td>Необязательно</td>
            <tr>
            <td>Server.MaximumContentLength</td>
            <td>Необязательно</td>
            <td>По умолчанию <code>0</code>. Указывает максимальную длину содержимого в байтах. Ноль означает бесконечность.</td>
        </tr>
        <tr>
            <td>Server.IncludeRequestIdHeader</td>
            <td>Необязательно</td>
            <td>По умолчанию <code>false</code>. Указывает, должен ли HTTP-сервер отправлять заголовок <code>X-Request-Id</code>.</td>
        </tr>
        <tr>
            <td>Server.ThrowExceptions</td>
            <td>Необязательно</td>
            <td>По умолчанию <code>true</code>. Указывает, должны ли быть выброшены необработанные исключения. Установите в <code>false</code> при производстве и <code>true</code> при отладке.</td>
        </tr>
        <tr>
            <td>ListeningHost</td>
            <td>Требуется</td>
            <td>Представляет хост, на котором слушает сервер.</td>
        </tr>
        <tr>
            <td>ListeningHost.Label</td>
            <td>Необязательно</td>
            <td>Представляет метку приложения.</td>
        </tr>
        <tr>
            <td>ListeningHost.Ports</td>
            <td>Требуется</td>
            <td>Представляет массив строк, соответствующих синтаксису <a href="/api/Sisk.Core.Http.ListeningPort">ListeningPort</a>.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy</td>
            <td>Необязательно</td>
            <td>Настройка заголовков CORS для приложения.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowCredentials</td>
            <td>Необязательно</td>
            <td>По умолчанию <code>false</code>. Указывает заголовок <code>Allow-Credentials</code>.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.ExposeHeaders</td>
            <td>Необязательно</td>
            <td>По умолчанию <code>null</code>. Это свойство ожидает массив строк. Указывает заголовок <code>Expose-Headers</code>.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowOrigin</td>
            <td>Необязательно</td>
            <td>По умолчанию <code>null</code>. Это свойство ожидает строку. Указывает заголовок <code>Allow-Origin</code>.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowOrigins</td>
            <td>Необязательно</td>
            <td>По умолчанию <code>null</code>. Это свойство ожидает массив строк. Указывает несколько заголовков <code>Allow-Origin</code>. См. <a href="/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins">AllowOrigins</a> для получения дополнительной информации.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowMethods</td>
            <td>Необязательно</td>
            <td>По умолчанию <code>null</code>. Это свойство ожидает массив строк. Указывает заголовок <code>Allow-Methods</code>.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowHeaders</td>
            <td>Необязательно</td>
            <td>По умолчанию <code>null</code>. Это свойство ожидает массив строк. Указывает заголовок <code>Allow-Headers</code>.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.MaxAge</td>
            <td>Необязательно</td>
            <td>По умолчанию <code>null</code>. Это свойство ожидает целое число. Указывает заголовок <code>Max-Age</code> в секундах.</td>
        </tr>
        <tr>
            <td>ListeningHost.Parameters</td>
            <td>Необязательно</td>
            <td>Указывает свойства, предоставляемые методу настройки приложения.</td>
        </tr>
    </tbody>
</table>