# Поставщики услуг

Поставщики услуг - это способ перенести ваше приложение Sisk в разные среды с помощью портативного файла конфигурации. Эта функция позволяет изменять порт сервера, параметры и другие опции без необходимости модификации кода приложения для каждой среды. Этот модуль зависит от синтаксиса построения Sisk и может быть настроен с помощью метода UsePortableConfiguration.

Поставщик конфигурации реализуется с помощью IConfigurationProvider, который предоставляет читатель конфигурации и может принимать любую реализацию. По умолчанию Sisk предоставляет читатель конфигурации JSON, но также есть пакет для файлов INI. Вы также можете создать свой собственный поставщик конфигурации и зарегистрировать его с помощью:

```csharp
using var app = HttpServer.CreateBuilder()
    .UsePortableConfiguration(config =>
    {
        config.WithConfigReader<MyConfigurationReader>();
    })
    .Build();
```

Как уже упоминалось ранее, по умолчанию используется поставщик JSON-файла. По умолчанию искомый файл называется service-config.json, и он ищется в текущем каталоге выполняемого процесса, а не в каталоге исполняемого файла.

Вы можете изменить имя файла, а также то, где Sisk должен искать файл конфигурации, с помощью:

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

Код выше будет искать файл config.toml в текущем каталоге выполняемого процесса. Если файл не найден, он будет искать его в каталоге, где находится исполняемый файл. Если файл не существует, параметр createIfDontExists будет выполнен, создавая файл без содержимого в последнем протестированном пути (на основе lookupDirectories), и в консоли будет выброшено исключение, предотвращая инициализацию приложения.

> [!TIP]
> 
> Вы можете ознакомиться с исходным кодом читателя конфигурации INI и читателя конфигурации JSON, чтобы понять, как реализован IConfigurationProvider.

## Чтение конфигураций из JSON-файла

По умолчанию Sisk предоставляет поставщик конфигурации, который считывает конфигурации из JSON-файла. Этот файл следует фиксированной структуре и состоит из следующих параметров:

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
            "https://localhost:443/",  // В JSON-файлах также поддерживаются комментарии
        ],
        "CrossOriginResourceSharingPolicy": {
            "AllowOrigin": "*",
            "AllowOrigins": [ "*" ],   // новое с версии 0.14
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

Каждый читатель конфигурации предоставляет способ чтения параметров инициализации сервера. Некоторые свойства указаны как находящиеся в окружении процесса, а не определенные в файле конфигурации, например, конфиденциальные данные API, ключи API и т. д.

## Структура файла конфигурации

JSON-файл конфигурации состоит из следующих свойств:

<table>
    <thead>
        <tr>
            <th>Свойство</th>
            <th>Обязательно</th>
            <th>Описание</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Server</td>
            <td>Да</td>
            <td>Представляет сам сервер со своими настройками.</td>
        </tr>
        <tr>
            <td>Server.AccessLogsStream</td>
            <td>Опционально</td>
            <td>По умолчанию равно <code>console</code>. Указывает поток вывода журнала доступа. Может быть именем файла, 
                <code>null</code> или <code>console</code>.
            </td>
        </tr>
        <tr>
            <td>Server.ErrorsLogsStream</td>
            <td>Опционально</td>
            <td>По умолчанию равно <code>null</code>. Указывает поток вывода журнала ошибок. Может быть именем файла, 
                <code>null</code> или <code>console</code>.
            </td>
        </tr>
        <tr>
            <td>Server.MaximumContentLength</td>
            <td>Опционально</td>
            <td>По умолчанию равно <code>0</code>. Указывает максимальный размер контента в байтах. Ноль означает бесконечность.</td>
        </tr>
        <tr>
            <td>Server.IncludeRequestIdHeader</td>
            <td>Опционально</td>
            <td>По умолчанию равно <code>false</code>. Указывает, должен ли HTTP-сервер отправлять заголовок <code>X-Request-Id</code>.</td>
        </tr>
        <tr>
            <td>Server.ThrowExceptions</td>
            <td>Опционально</td>
            <td>По умолчанию равно <code>true</code>. Указывает, должны ли необработанные исключения быть брошены. Установите значение 
                <code>false</code> при работе в режиме производства и <code>true</code> при отладке.</td>
        </tr>
        <tr>
            <td>ListeningHost</td>
            <td>Да</td>
            <td>Представляет хост, на котором слушает сервер.</td>
        </tr>
        <tr>
            <td>ListeningHost.Label</td>
            <td>Опционально</td>
            <td>Представляет метку приложения.</td>
        </tr>
        <tr>
            <td>ListeningHost.Ports</td>
            <td>Да</td>
            <td>Представляет массив строк, соответствующих синтаксису <a href="/api/Sisk.Core.Http.ListeningPort">ListeningPort</a>.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy</td>
            <td>Опционально</td>
            <td>Настройка заголовков CORS для приложения.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowCredentials</td>
            <td>Опционально</td>
            <td>По умолчанию равно <code>false</code>. Указывает заголовок <code>Allow-Credentials</code>.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.ExposeHeaders</td>
            <td>Опционально</td>
            <td>По умолчанию равно <code>null</code>. Это свойство ожидает массив строк. Указывает заголовок 
                <code>Expose-Headers</code>.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowOrigin</td>
            <td>Опционально</td>
            <td>По умолчанию равно <code>null</code>. Это свойство ожидает строку. Указывает заголовок 
                <code>Allow-Origin</code>.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowOrigins</td>
            <td>Опционально</td>
            <td>По умолчанию равно <code>null</code>. Это свойство ожидает массив строк. Указывает 
                несколько заголовков <code>Allow-Origin</code>. См. <a href="/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins">AllowOrigins</a> 
                для получения более подробной информации.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowMethods</td>
            <td>Опционально</td>
            <td>По умолчанию равно <code>null</code>. Это свойство ожидает массив строк. Указывает заголовок 
                <code>Allow-Methods</code>.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowHeaders</td>
            <td>Опционально</td>
            <td>По умолчанию равно <code>null</code>. Это свойство ожидает массив строк. Указывает заголовок 
                <code>Allow-Headers</code>.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.MaxAge</td>
            <td>Опционально</td>
            <td>По умолчанию равно <code>null</code>. Это свойство ожидает целое число. Указывает заголовок 
                <code>Max-Age</code> в секундах.</td>
        </tr>
        <tr>
            <td>ListeningHost.Parameters</td>
            <td>Опционально</td>
            <td>Указывает свойства, передаваемые в метод настройки приложения.</td>
        </tr>
    </tbody>
</table>