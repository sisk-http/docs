# Провайдер конфигурации INI

Sisk имеет метод для получения конфигураций запуска, отличных от JSON. На самом деле, любой конвейер, реализующий [IConfigurationReader](/api/Sisk.Core.Http.Hosting.IConfigurationReader), может быть использован с [PortableConfigurationBuilder.WithConfigurationPipeline](/api/Sisk.Core.Http.Hosting.PortableConfigurationBuilder), читая конфигурацию сервера из любого типа файла.

Пакет [Sisk.IniConfiguration](https://www.nuget.org/packages/Sisk.IniConfiguration/) предоставляет потоковый читатель файлов INI, который не выбрасывает исключения для обычных синтаксических ошибок и имеет простой синтаксис конфигурации. Этот пакет можно использовать вне рамок фреймворка Sisk, предлагая гибкость для проектов, требующих эффективного читателя документов INI.

## Установка

Чтобы установить пакет, можно начать с:

```bash
$ dotnet add package Sisk.IniConfiguration
```

Также можно установить основной пакет, который не включает в себя INI [IConfigurationReader](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.IConfigurationReader), ни зависимость от Sisk, только сериализаторы INI:

```bash
$ dotnet add package Sisk.IniConfiguration.Core
```

С основным пакетом можно использовать его в коде, как показано в примере ниже:

```cs
class Program
{
    static HttpServerHostContext Host = null!;

    static void Main(string[] args)
    {
        Host = HttpServer.CreateBuilder()
            .UsePortableConfiguration(config =>
            {
                config.WithConfigFile("app.ini", createIfDontExists: true);
                
                // использует конфигурационный читатель IniConfigurationReader
                config.WithConfigurationPipeline<IniConfigurationReader>();
            })
            .UseRouter(r =>
            {
                r.MapGet("/", SayHello);
            })
            .Build();
        
        Host.Start();
    }

    static HttpResponse SayHello(HttpRequest request)
    {
        string? name = Host.Parameters["name"] ?? "world";
        return new HttpResponse($"Hello, {name}!");
    }
}
```

Код выше будет искать файл app.ini в текущем каталоге процесса (CurrentDirectory). Файл INI выглядит так:

```ini
[Server]
# Множественные адреса прослушивания поддерживаются
Listen = http://localhost:5552/
Listen = http://localhost:5553/
ThrowExceptions = false
AccessLogsStream = console

[Cors]
AllowMethods = GET, POST
AllowHeaders = Content-Type, Authorization
AllowOrigin = *

[Parameters]
Name = "Kanye West"
```

## Вкус и синтаксис INI

Текущая реализация вкуса:

- Имена свойств и секций **не чувствительны к регистру**.
- Имена свойств и значения **обрезаются**, если значения не заключены в кавычки.
- Значения можно заключать в одинарные или двойные кавычки. Кавычки могут содержать переносы строк внутри себя.
- Комментарии поддерживаются с помощью `#` и `;`. Также **допускаются комментарии в конце строки**.
- Свойства могут иметь несколько значений.

В подробностях документация для "вкуса" парсера INI, используемого в Sisk, доступна [в этом документе](https://github.com/sisk-http/archive/blob/master/ext/ini-reader-syntax.md).

Используя следующий код INI в качестве примера:

```ini
One = 1
Value = это значение
Another value = "это значение
    имеет перенос строки"
; код ниже имеет некоторые цвета
[some section]
Color = Red
Color = Blue
Color = Yellow ; не используйте желтый
```

Парсить его можно с помощью:

```csharp
// парсить текст INI из строки
IniDocument doc = IniDocument.FromString(iniText);

// получить одно значение
string? one = doc.Global.GetOne("one");
string? anotherValue = doc.Global.GetOne("another value");

// получить несколько значений
string[]? colors = doc.GetSection("some section")?.GetMany("color");
```

## Параметры конфигурации

| Секция и имя | Разрешить несколько значений | Описание |
| ---------------- | --------------------- | ----------- |
| `Server.Listen` | Да | Адреса/порт прослушивания сервера. |
| `Server.Encoding` | Нет | Кодировка сервера по умолчанию. |
| `Server.MaximumContentLength` | Нет | Максимальный размер контента в байтах. |
| `Server.IncludeRequestIdHeader` | Нет | Указывает, должен ли HTTP-сервер отправлять заголовок X-Request-Id. |
| `Server.ThrowExceptions` | Нет |  Указывает, должны ли быть выброшены необработанные исключения.  |
| `Server.AccessLogsStream` | Нет |  Указывает поток вывода журнала доступа. |
| `Server.ErrorsLogsStream` | Нет |  Указывает поток вывода журнала ошибок. |
| `Cors.AllowMethods` | Нет |  Указывает значение заголовка CORS Allow-Methods. |
| `Cors.AllowHeaders` | Нет |  Указывает значение заголовка CORS Allow-Headers. |
| `Cors.AllowOrigins` | Нет |  Указывает несколько заголовков Allow-Origin, разделенных запятыми. [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins) для более подробной информации. |
| `Cors.AllowOrigin` | Нет |  Указывает один заголовок Allow-Origin. |
| `Cors.ExposeHeaders` | Нет |  Указывает значение заголовка CORS Expose-Headers. |
| `Cors.AllowCredentials` | Нет |  Указывает значение заголовка CORS Allow-Credentials. |
| `Cors.MaxAge` | Нет |  Указывает значение заголовка CORS Max-Age.