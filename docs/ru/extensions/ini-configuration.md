# Провайдер конфигурации INI

Sisk предоставляет способ получения настроек запуска, отличных от JSON. Фактически, любой pipeline, реализующий [IConfigurationReader](/api/Sisk.Core.Http.Hosting.IConfigurationReader), может использоваться с [PortableConfigurationBuilder.WithConfigurationPipeline](/api/Sisk.Core.Http.Hosting.PortableConfigurationBuilder), считывая конфигурацию сервера из любого типа файла.

Пакет [Sisk.IniConfiguration](https://www.nuget.org/packages/Sisk.IniConfiguration/) предоставляет потокоориентированный читатель файлов INI, который не выбрасывает исключения для распространенных синтаксических ошибок и имеет простую синтаксис конфигурации. Этот пакет может использоваться вне фреймворка Sisk, предлагая гибкость для проектов, которым требуется эффективный читатель документа INI.

## Установка

Для установки пакета можно начать с:

```bash
$ dotnet add package Sisk.IniConfiguration
```

и использовать его в своем коде, как показано в примере ниже:

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

                // добавляет IniConfigurationPipeline к pipeline чтения конфигурации
                config.WithConfigurationPipeline<IniConfigurationPipeline>();
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

Код выше будет искать файл app.ini в текущей директории процесса (CurrentDirectory). Файл INI выглядит так:

```ini
[Server]
# Поддерживаются несколько адресов прослушивания
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

## Синтаксис и формат INI

Текущий реализованный формат:

- Имена свойств и разделов нечувствительны к регистру.
- Имена свойств и значения отбрасываются.
- Значения могут быть заключены в одинарные или двойные кавычки. Кавычки могут содержать переносы строк.
- Комментарии поддерживаются с помощью `#` и `;`. Также разрешены ** trailing comments**.
- Свойства могут иметь несколько значений.

Более подробно документация по "формату" парсера INI, используемого в Sisk, [доступна на GitHub](https://github.com/sisk-http/archive/blob/master/ext/ini-reader-syntax.md).

Используя следующий код INI в качестве примера:

```ini
One = 1
Value = this is an value
Another value = "this value
    has an line break on it"

; the code below has some colors
[some section]
Color = Red
Color = Blue
Color = Yellow ; do not use yellow
```

Парсировать его с помощью:

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

| Раздел и имя | Разрешены ли несколько значений | Описание |
| ------------- | --------------------------- | ----------- |
| `Server.Listen` | Да | Адреса/порты прослушивания сервера. |
| `Server.Encoding` | Нет | Кодировка по умолчанию сервера. |
| `Server.MaximumContentLength` | Нет | Максимальный размер контента сервера в байтах. |
| `Server.IncludeRequestIdHeader` | Нет | Указывает, должен ли HTTP-сервер отправлять заголовок X-Request-Id. |
| `Server.ThrowExceptions` | Нет | Указывает, должны ли необработанные исключения выбрасываться. |
| `Server.AccessLogsStream` | Нет | Указывает поток вывода журнала доступа. |
| `Server.ErrorsLogsStream` | Нет | Указывает поток вывода журнала ошибок. |
| `Cors.AllowMethods` | Нет | Указывает значение заголовка CORS Allow-Methods. |
| `Cors.AllowHeaders` | Нет | Указывает значение заголовка CORS Allow-Headers. |
| `Cors.AllowOrigins` | Нет | Указывает несколько заголовков Allow-Origin, разделенных запятыми. [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins) для получения более подробной информации. |
| `Cors.AllowOrigin` | Нет | Указывает один заголовок Allow-Origin. |
| `Cors.ExposeHeaders` | Нет | Указывает значение заголовка CORS Expose-Headers. |
| `Cors.AllowCredentials` | Нет | Указывает значение заголовка CORS Allow-Credentials. |
| `Cors.MaxAge` | Нет | Указывает значение заголовка CORS Max-Age. |