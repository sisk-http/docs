# Logging

Вы можете настроить Sisk для автоматического записи журналов доступа и ошибок. Можно определить ротацию журналов, расширения и частоту.

Класс [LogStream](/api/Sisk.Core.Http.LogStream) предоставляет асинхронный способ записи журналов и их хранение в ожидаемой очереди записи.

В этой статье мы покажем, как настроить логирование для вашего приложения.

## Журналы доступа на основе файлов

Журналы в файлы открывают файл, записывают строку текста, а затем закрывают файл для каждой записанной строки. Эта процедура была принята для поддержания отзывчивости записи в журналах.

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
class Program
{
    static async Task Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseConfiguration(config => {
                config.AccessLogsStream = new LogStream("logs/access.log");
            })
            .Build();
        
        ...
        
        await app.StartAsync();
    }
}
```

Вышеуказанный код будет записывать все входящие запросы в файл `logs/access.log`. Обратите внимание, что файл создаётся автоматически, если он не существует, однако папка перед ним не создаётся. Создавать каталог `logs/` вручную не требуется, так как класс LogStream автоматически его создаёт.

## Логирование на основе потока

Вы можете записывать журналы в объекты TextWriter, такие как `Console.Out`, передав объект TextWriter в конструктор:

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
using var app = HttpServer.CreateBuilder()
    .UseConfiguration(config => {
        config.AccessLogsStream = new LogStream(Console.Out);
    })
    .Build();
```

Для каждой записи в потоковом журнале вызывается метод `TextWriter.Flush()`.

## Форматирование журнала доступа

Вы можете настроить формат журнала доступа с помощью предопределённых переменных. Рассмотрим следующую строку:

```cs
config.AccessLogsFormat = "%dd/%dmm/%dy %tH:%ti:%ts %tz %ls %ri %rs://%ra%rz%rq [%sc %sd] %lin -> %lou in %lmsms [%{user-agent}]";
```

Она будет записывать сообщение вида:

    29/mar./2023 15:21:47 -0300 Executed ::1 http://localhost:5555/ [200 OK] 689B -> 707B in 84ms [Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/111.0.0.0 Safari/537.36]

Вы можете форматировать ваш файл журнала по описанному в таблице формату:

| Value  | Что это представляет                                                                 | Пример                               |
|--------|-----------------------------------------------------------------------------------|---------------------------------------|
| %dd    | День месяца (форматирован как два числа)                                        | 05                                    |
| %dmmm  | Полное название месяца                                                            | July                                  |
| %dmm   | Сокращённое название месяца (три буквы)                                          | Jul                                  |
| %dm    | Номер месяца (форматирован как два числа)                                      | 07                                    |
| %dy    | Год (форматирован как четыре числа)                                            | 2023                                 |
| %th    | Час в 12‑часовом формате                                                      | 03                                    |
| %tH    | Час в 24‑часовом формате (HH)                                                   | 15                                    |
| %ti    | Минуты (форматирован как два числа)                                            | 30                                    |
| %ts    | Секунды (форматирован как два числа)                                          | 45                                    |
| %tm    | Миллисекунды (форматирован как три числа)                                     | 123                                   |
| %tz    | Смещение часового пояса (полные часы в UTC)                                     | +03:00                               |
| %ri    | Удалённый IP‑адрес клиента                                                     | 192.168.1.100                        |
| %rm    | HTTP‑метод (в верхнем регистре)                                                  | GET                                   |
| %rs    | Схема URI (http/https)                                                          | https                                |
| %ra    | Авторитет URI (домен)                                                           | example.com                          |
| %rh    | Хост запроса                                                                   | www.example.com                       |
| %rp    | Порт запроса                                                                   | 443                                  |
| %rz    | Путь запроса                                                                   | /path/to/resource                    |
| %rq    | Строка запроса                                                                 | ?key=value&another=123               |
| %sc    | Код статуса HTTP ответа                                                        | 200                                  |
| %sd    | Описание статуса HTTP ответа                                                   | OK                                   |
| %lin   | Человеко‑читабельный размер запроса                                            | 1.2 KB                               |
| %linr  | Сырой размер запроса (байты)                                                     | 1234                                |
| %lou   | Человеко‑читабельный размер ответа                                            | 2.5 KB                               |
| %lour  | Сырой размер ответа (байты)                                                     | 2560                                |
| %lms   | Время выполнения в миллисекундах                                               | 120                                  |
| %ls    | Статус выполнения                                                              | Executed                |
| %{header-name}    | Представляет заголовок `header-name` запроса.                                                                | `Mozilla/5.0 (platform; rv:gecko [...]`                |
| %{:res-name}    | Представляет заголовок `res-name` ответа. | |

## Ротация журналов

Вы можете настроить HTTP‑сервер для ротации файлов журналов в сжатый файл .gz, когда они достигают определённого размера. Размер проверяется периодически по порогу, который вы определяете.

```cs
LogStream errorLog = new LogStream("logs/error.log")
    .ConfigureRotatingPolicy(
        maximumSize: 64 * SizeHelper.UnitMb,
        dueTime: TimeSpan.FromHours(6));
```

Вышеуказанный код будет проверять каждые шесть часов, достиг ли файл LogStream своего лимита в 64 МБ. Если да, файл сжимается в .gz файл, а затем `access.log` очищается.

Во время этого процесса запись в файл блокируется до тех пор, пока файл не будет сжат и очищен. Все строки, которые попадают в запись в этот период, находятся в очереди, ожидающей завершения сжатия.

Эта функция работает только с файловыми LogStreams.

## Логирование ошибок

Когда сервер не генерирует ошибки в отладчик, он перенаправляет ошибки в запись журнала, если они есть. Вы можете настроить запись ошибок с помощью:

```cs
config.ThrowExceptions = false;
config.ErrorsLogsStream = new LogStream("error.log");
```

Это свойство будет записывать что‑то в журнал только если ошибка не захвачена обратным вызовом или свойством [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler).

Запись ошибки сервером всегда включает дату и время, заголовки запроса (не тело), трассировку ошибки и трассировку внутреннего исключения, если таковые имеются.

## Другие экземпляры логирования

Ваше приложение может иметь ноль или несколько LogStreams, нет ограничения на количество каналов журналов. Поэтому возможно перенаправить журнал вашего приложения в файл, отличный от стандартного AccessLog или ErrorLog.

```cs
LogStream appMessages = new LogStream("messages.log");
appMessages.WriteLine("Application started at {0}", DateTime.Now);
```

## Расширение LogStream

Вы можете расширить класс `LogStream`, чтобы писать пользовательские форматы, совместимые с текущим движком журналов Sisk. Пример ниже позволяет писать цветные сообщения в консоль через библиотеку Spectre.Console:

<div class="script-header">
    <span>
        CustomLogStream.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class CustomLogStream : LogStream
{
    protected override void WriteLineInternal(string line)
    {
        base.WriteLineInternal($"[{DateTime.Now:g}] {line}");
    }
}
```

Другой способ автоматически писать пользовательские журналы для каждого запроса/ответа – создать [HttpServerHandler](/api/Sisk.Core.Http.Handlers.HttpServerHandler). Пример ниже чуть более полный. Он записывает тело запроса и ответа в JSON в консоль. Это может быть полезно для отладки запросов в целом. В этом примере используется ContextBag и HttpServerHandler.

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
class Program
{
    static async Task Main(string[] args)
    {
        var app = HttpServer.CreateBuilder(host =>
        {
            host.UseListeningPort(5555);
            host.UseHandler<JsonMessageHandler>();
        });

        app.Router += new Route(RouteMethod.Any, "/json", request =>
        {
            return new HttpResponse()
                .WithContent(JsonContent.Create(new
                {
                    method = request.Method.Method,
                    path = request.Path,
                    specialMessage = "Hello, world!!"
                }));
        });

        await app.StartAsync();
    }
}
```

<div class="script-header">
    <span>
        JsonMessageHandler.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
class JsonMessageHandler : HttpServerHandler
{
    protected override void OnHttpRequestOpen(HttpRequest request)
    {
        if (request.Method != HttpMethod.Get && request.Headers["Content-Type"]?.Contains("json", StringComparison.InvariantCultureIgnoreCase) == true)
        {
            // На этом этапе соединение открыто, и клиент отправил заголовок, указывающий,
            // что контент является JSON. Ниже строка читает контент и оставляет его
            // в запросе.
            //
            // Если контент не будет прочитан в действии запроса, GC, скорее всего,
            // соберёт контент после отправки ответа клиенту, поэтому контент
            // может быть недоступен после закрытия ответа.
            //
            _ = request.RawBody;

            // добавляем подсказку в контекст, чтобы указать, что этот запрос
            // имеет JSON‑тело
            request.Bag.Add("IsJsonRequest", true);
        }
    }

    protected override async void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        string? requestJson = null,
                responseJson = null,
                responseMessage;

        if (result.Request.Bag.ContainsKey("IsJsonRequest"))
        {
            // переформатирует JSON с помощью библиотеки CypherPotato.LightJson
            var content = result.Request.Body;
            requestJson = JsonValue.Deserialize(content, new JsonOptions() { WriteIndented = true }).ToString();
        }
        
        if (result.Response is { } response)
        {
            var content = response.Content;
            responseMessage = $"{(int)response.Status} {HttpStatusInformation.GetStatusCodeDescription(response.Status)}";
            
            if (content is HttpContent httpContent &&
                // проверяем, является ли ответ JSON
                httpContent.Headers.ContentType?.MediaType?.Contains("json", StringComparison.InvariantCultureIgnoreCase) == true)
            {
                string json = await httpContent.ReadAsStringAsync();
                responseJson = JsonValue.Deserialize(json, new JsonOptions() { WriteIndented = true }).ToString();
            }
        }
        else
        {
            // получает внутренний статус обработки сервера
            responseMessage = result.Status.ToString();
        }
        
        StringBuilder outputMessage = new StringBuilder();

        if (requestJson != null)
        {
            outputMessage.AppendLine("-----");
            outputMessage.AppendLine($">>> {result.Request.Method} {result.Request.Path}");

            if (requestJson is not null)
                outputMessage.AppendLine(requestJson);
        }

        outputMessage.AppendLine($"<<< {responseMessage}");

        if (responseJson is not null)
            outputMessage.AppendLine(responseJson);

        outputMessage.AppendLine("-----");

        await Console.Out.WriteLineAsync(outputMessage.ToString());
    }
}
```