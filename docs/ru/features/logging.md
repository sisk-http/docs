# Журналирование

Вы можете настроить Sisk для автоматического записи журналов доступа и ошибок. Также возможно определить ротацию журналов, расширения и частоту.

Класс [LogStream](/api/Sisk.Core.Http.LogStream) предоставляет асинхронный способ записи журналов и поддерживает ожидаемую очередь записи. Класс `LogStream` реализует `IAsyncDisposable`, гарантируя, что все ожидающие журналы будут записаны перед закрытием потока.

В этой статье мы покажем вам, как настроить журналирование для вашего приложения.

## Журналы доступа на основе файлов

Журналы в файлах открывают файл, записывают текст строки, а затем закрывают файл для каждой записанной строки. Этот процесс был принят для поддержания отзывчивости записи в журналах.

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

Вышеуказанный код запишет все входящие запросы в файл `logs/access.log`. Обратите внимание, что файл создается автоматически, если он не существует, однако папка перед ним не создается. Не обязательно создавать папку `logs/`, поскольку класс `LogStream` автоматически создает ее.

## Журналирование на основе потока

Вы можете записывать журналы в объекты `TextWriter`, такие как `Console.Out`, передав объект `TextWriter` в конструктор:

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

Для каждой записанной в поток сообщения вызывается метод `TextWriter.Flush()`.

## Форматирование журнала доступа

Вы можете настроить формат журнала доступа с помощью предопределенных переменных. Рассмотрим следующую строку:

```cs
config.AccessLogsFormat = "%dd/%dmm/%dy %tH:%ti:%ts %tz %ls %ri %rs://%ra%rz%rq [%sc %sd] %lin -> %lou in %lmsms [%{user-agent}]";
```

Она запишет сообщение, подобное:

    29/мар./2023 15:21:47 -0300 Executed ::1 http://localhost:5555/ [200 OK] 689B -> 707B in 84ms [Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/111.0.0.0 Safari/537.36]

Вы можете форматировать свой журнал по формату, описанному в таблице:

| Значение  | Что оно представляет                                                                 | Пример                               |
|--------|-----------------------------------------------------------------------------------|---------------------------------------|
| %dd    | День месяца (форматирован как два знака)                                        | 05                                    |
| %dmmm  | Полное название месяца                                                            | Июль                                  |
| %dmm   | Аббревиатура месяца (три буквы)                                                  | Июл                                  |
| %dm    | Номер месяца (форматирован как два знака)                                          | 07                                    |
| %dy    | Год (форматирован как четыре знака)                                                 | 2023                                 |
| %th    | Час в 12-часовом формате                                                          | 03                                    |
| %tH    | Час в 24-часовом формате (HH)                                                    | 15                                    |
| %ti    | Минуты (форматированы как два знака)                                               | 30                                    |
| %ts    | Секунды (форматированы как два знака)                                               | 45                                    |
| %tm    | Миллисекунды (форматированы как три знака)                                        | 123                                   |
| %tz    | Смещение часового пояса (общее количество часов в UTC)                             | +03:00                               |
| %ri    | IP-адрес клиента                                                                   | 192.168.1.100                        |
| %rm    | HTTP-метод (в верхнем регистре)                                                  | GET                                   |
| %rs    | Схема URI (http/https)                                                            | https                                |
| %ra    | Авторитет URI (домен)                                                           | example.com                          |
| %rh    | Хост запроса                                                                     | www.example.com                       |
| %rp    | Порт запроса                                                                     | 443                                  |
| %rz    | Путь запроса                                                                     | /path/to/resource                    |
| %rq    | Строка запроса                                                                    | ?key=value&another=123               |
| %sc    | Код состояния HTTP-ответа                                                      | 200                                  |
| %sd    | Описание состояния HTTP-ответа                                                  | OK                                   |
| %lin   | Человекочитаемый размер запроса                                                   | 1.2 KB                               |
| %linr  | Необработанный размер запроса (байты)                                            | 1234                                |
| %lou   | Человекочитаемый размер ответа                                                    | 2.5 KB                               |
| %lour  | Необработанный размер ответа (байты)                                              | 2560                                |
| %lms   | Затраченное время в миллисекундах                                                 | 120                                  |
| %ls    | Статус выполнения                                                                 | Executed                |
| %{header-name}    | Представляет собой заголовок `header-name` запроса.                                                                | `Mozilla/5.0 (platform; rv:gecko [...]`                |
| %{:header-name}    | Представляет собой заголовок `header-name` ответа. | `application/json` |

Вы также можете использовать `HttpServerConfiguration.DefaultAccessLogFormat`, чтобы использовать формат журнала доступа по умолчанию.

## Ротация журналов

Вы можете настроить веб-сервер для ротации файлов журналов в сжатый файл `.gz`, когда они достигают определенного размера. Размер проверяется периодически по порогу, который вы определяете.

```cs
LogStream errorLog = new LogStream("logs/error.log")
    .ConfigureRotatingPolicy(
        maximumSize: 64 * SizeHelper.UnitMb,
        dueTime: TimeSpan.FromHours(6));
```

Вышеуказанный код проверит каждые шесть часов, достиг ли файл LogStream предела в 64 МБ. Если да, файл сжимается в файл `.gz`, а затем очищается `access.log`.

Во время этого процесса запись в файл блокируется до тех пор, пока файл не будет сжат и очищен. Все строки, которые поступают для записи в этот период, будут в очереди ожидания до окончания сжатия.

Эта функция работает только с журналами на основе файлов.

## Журналирование ошибок

Когда сервер не передает ошибки отладчику, он передает ошибки для записи в журнал, когда они есть. Вы можете настроить запись ошибок с помощью:

```cs
config.ThrowExceptions = false;
config.ErrorsLogsStream = new LogStream("error.log");
```

Это свойство запишет что-либо в журнал только в том случае, если ошибка не была поймана обратным вызовом или свойством [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler).

Ошибка, записанная сервером, всегда записывает дату и время, заголовки запроса (не тело), отслеживание ошибки и отслеживание внутренней ошибки, если она есть.

## Другие экземпляры журналирования

Ваше приложение может иметь ноль или несколько экземпляров `LogStream`, нет ограничения на количество каналов журналирования, которое оно может иметь. Следовательно, возможно направить журнал вашего приложения в файл, отличный от журнала доступа или журнала ошибок по умолчанию.

```cs
LogStream appMessages = new LogStream("messages.log");
appMessages.WriteLine("Приложение запущено в {0}", DateTime.Now);
```

## Расширение LogStream

Вы можете расширить класс `LogStream`, чтобы записывать пользовательские форматы, совместимые с текущим движком журналирования Sisk. Пример ниже позволяет записывать цветные сообщения в консоль через библиотеку Spectre.Console:

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

Другой способ автоматически записывать пользовательские журналы для каждого запроса/ответа — создать [HttpServerHandler](/api/Sisk.Core.Http.Handlers.HttpServerHandler). Пример ниже немного более полный. Он записывает тело запроса и ответа в JSON в консоль. Это может быть полезно для отладки запросов в целом. Этот пример использует `ContextBag` и `HttpServerHandler`.

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
            // что содержимое является JSON. Строка ниже читает содержимое и оставляет его в запросе.
            //
            // Если содержимое не прочитано в действии запроса, GC, скорее всего, соберет содержимое
            // после отправки ответа клиенту, поэтому содержимое может быть недоступно после закрытия ответа.
            //
            _ = request.RawBody;

            // добавляет намек в контекст, чтобы сказать, что этот запрос имеет JSON-тело
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
                // проверяет, является ли ответ JSON
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