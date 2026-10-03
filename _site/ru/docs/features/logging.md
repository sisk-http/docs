# Logging

Source: https://docs.sisk-framework.org/ru/docs/features/logging.html

Вы можете настроить Sisk для автоматической записи журналов доступа и ошибок. Возможна настройка ротации журналов, расширений и частоты.

Класс [LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md) предоставляет асинхронный способ записи журналов и хранит их в очереди записи, которую можно ожидать. Класс `LogStream` реализует `IAsyncDisposable`, гарантируя, что все ожидающие записи будут записаны до закрытия потока.

В этой статье мы покажем, как настроить журналирование для вашего приложения.

## File based access logs

Журналы в файлы открывают файл, записывают строку текста, а затем закрывают файл для каждой записанной строки. Такая процедура была принята для поддержания отзывчивости записи в журналах.

```cs {title="Program.cs"}
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

Приведённый код будет записывать все входящие запросы в файл `logs/access.log`. Обратите внимание, что файл создаётся автоматически, если его нет, однако папка перед ним не создаётся. Создавать каталог `logs/` не требуется — класс LogStream создаёт его автоматически.

## Stream based logging

Вы можете записывать журналы в объекты `TextWriter`, такие как `Console.Out`, передавая объект `TextWriter` в конструктор:

```cs {title="Program.cs"}
using var app = HttpServer.CreateBuilder()
    .UseConfiguration(config => {
        config.AccessLogsStream = new LogStream(Console.Out);
    })
    .Build();
```

Для каждого сообщения, записываемого в потоковый журнал, вызывается метод `TextWriter.Flush()`.

## Access log formatting

Вы можете настроить формат журнала доступа с помощью предопределённых переменных. Рассмотрим следующую строку:

```cs
config.AccessLogsFormat = "%dd/%dmm/%dy %tH:%ti:%ts %tz %ls %ri %rs://%ra%rz%rq [%sc %sd] %lin -> %lou in %lmsms [%{user-agent}]";
```

Она запишет сообщение вида:

    29/mar./2023 15:21:47 -0300 Executed ::1 http://localhost:5555/ [200 OK] 689B -> 707B in 84ms [Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/111.0.0.0 Safari/537.36]

Вы можете форматировать ваш журнал, используя формат, описанный в таблице:

| Значение | Что представляет собой | Пример |
|----------|------------------------|--------|
| %dd      | День месяца (двузначный) | 05 |
| %dmmm    | Полное название месяца | July |
| %dmm     | Сокращённое название месяца (три буквы) | Jul |
| %dm      | Номер месяца (двузначный) | 07 |
| %dy      | Год (четыре цифры) | 2023 |
| %th      | Час в 12‑часовом формате | 03 |
| %tH      | Час в 24‑часовом формате (HH) | 15 |
| %ti      | Минуты (двузначные) | 30 |
| %ts      | Секунды (двузначные) | 45 |
| %tm      | Миллисекунды (трёхзначные) | 123 |
| %tz      | Смещение часового пояса (в UTC) | +03:00 |
| %ri      | Удалённый IP‑адрес клиента | 192.168.1.100 |
| %rm      | HTTP‑метод (верхний регистр) | GET |
| %rs      | Схема URI (http/https) | https |
| %ra      | Авторитет URI (домен) | example.com |
| %rh      | Хост запроса | www.example.com |
| %rp      | Порт запроса | 443 |
| %rz      | Путь запроса | /path/to/resource |
| %rq      | Строка запроса | ?key=value&another=123 |
| %sc      | Код статуса HTTP‑ответа | 200 |
| %sd      | Описание статуса HTTP‑ответа | OK |
| %lin     | Читаемый человеком размер запроса | 1.2 KB |
| %linr    | Необработанный размер запроса (байты) | 1234 |
| %lou     | Читаемый человеком размер ответа | 2.5 KB |
| %lour    | Необработанный размер ответа (байты) | 2560 |
| %lms     | Прошедшее время в миллисекундах | 120 |
| %ls      | Статус выполнения | Executed |
| %{header-name} | Представляет заголовок `header-name` запроса. | `Mozilla/5.0 (platform; rv:gecko [...]` |
| %{:header-name} | Представляет заголовок `header-name` ответа. | `application/json` |

Вы также можете использовать `HttpServerConfiguration.DefaultAccessLogFormat`, чтобы применить формат журнала доступа по умолчанию.

## Rotating logs

Вы можете настроить HTTP‑сервер так, чтобы он ротировал файлы журналов в сжатый `.gz`‑файл, когда они достигают определённого размера. Размер проверяется периодически согласно заданному лимиту.

```cs
LogStream errorLog = new LogStream("logs/error.log")
    .ConfigureRotatingPolicy(
        maximumSize: 64 * SizeHelper.UnitMb,
        dueTime: TimeSpan.FromHours(6));
```

Приведённый код будет каждые шесть часов проверять, достиг ли файл LogStream лимита в 64 МБ. Если да, файл сжимается в `.gz`, после чего `access.log` очищается.

Во время этого процесса запись в файл блокируется до завершения сжатия и очистки. Все строки, поступившие на запись в этот период, помещаются в очередь, ожидая окончания сжатия.

Эта функция работает только с файловыми LogStream‑ами.

## Error logging

Когда сервер не бросает ошибки в отладчик, он перенаправляет их в журнал, если они есть. Вы можете настроить запись ошибок так:

```cs
config.ThrowExceptions = false;
config.ErrorsLogsStream = new LogStream("error.log");
```

Это свойство будет записывать в журнал только те ошибки, которые не перехвачены обратным вызовом или свойством [Router.CallbackErrorHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.CallbackErrorHandler.md).

Записываемая сервером ошибка всегда содержит дату и время, заголовки запроса (не тело), трассировку ошибки и трассировку внутреннего исключения, если они есть.

## Other logging instances

Ваше приложение может иметь ноль или несколько LogStream‑ов, ограничений на количество каналов журнала нет. Поэтому возможно направить журнал вашего приложения в файл, отличный от журнала доступа или журнала ошибок по умолчанию.

```cs
LogStream appMessages = new LogStream("messages.log");
appMessages.WriteLine("Application started at {0}", DateTime.Now);
```

## Extending LogStream

Вы можете расширить класс `LogStream`, чтобы писать пользовательские форматы, совместимые с текущим движком журналов Sisk. Пример ниже позволяет выводить цветные сообщения в консоль через библиотеку Spectre.Console:

```cs {title="CustomLogStream.cs"}
public class CustomLogStream : LogStream
{
    protected override void WriteLineInternal(string line)
    {
        base.WriteLineInternal($"[{DateTime.Now:g}] {line}");
    }
}
```

Другой способ автоматически писать пользовательские журналы для каждого запроса/ответа — создать [HttpServerHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.md). Пример ниже более полный. Он выводит тело запроса и ответа в JSON в консоль. Может быть полезен для отладки запросов в целом. В примере используется ContextBag и HttpServerHandler.

```cs {title="Program.cs"}
class Program
{
    static async Task Main(string[] args)
    {
        var app = HttpServer.CreateBuilder(host =>
        {
            host.UseListeningPort(5555);
            host.UseHandler<JsonMessageHandler>();
        });

        app.Router.MapAny("/json", request =>
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

```cs {title="JsonMessageHandler.cs"}
class JsonMessageHandler : HttpServerHandler
{
    protected override void OnHttpRequestOpen(HttpRequest request)
    {
        if (request.Method != HttpMethod.Get && request.Headers["Content-Type"]?.Contains("json", StringComparison.InvariantCultureIgnoreCase) == true)
        {
            // На этом этапе соединение открыто, и клиент отправил заголовок,
            // указывающий, что содержимое является JSON. Ниже строка читает содержимое
            // и оставляет его в запросе.
            //
            // Если содержимое не будет прочитано в обработчике запроса, сборщик мусора
            // вероятно соберёт его после отправки ответа клиенту, поэтому содержимое
            // может стать недоступным после закрытия ответа.
            //
            _ = request.RawBody;

            // добавляем подсказку в контекст, указывая, что у этого запроса есть JSON‑тело
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
            // получаем статус внутренней обработки сервера
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
