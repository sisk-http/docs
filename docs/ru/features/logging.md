# Логирование

В Sisk можно настроить автоматическое запись в журналы доступа и ошибок. Можно определить ротацию логов, расширения и частоту.

Класс [LogStream](/api/Sisk.Core.Http.LogStream) предоставляет асинхронный способ записи логов и сохранения их в ожидающей очереди записи.

В этой статье мы покажем вам, как настроить логирование для вашего приложения.

## Логи доступа на основе файлов

Логи в файлы открывают файл, записывают строку текста и затем закрывают файл для каждой записанной строки. Эта процедура была принята для поддержания отзывчивости записи в журналах.

```cs
config.AccessLogsStream = new LogStream("logs/access.log");
```

В приведенном выше коде все входящие запросы будут записаны в файл `logs/access.log`. Обратите внимание, что файл создается автоматически, если он не существует, однако папка перед ним не создается. Не обязательно создавать каталог `logs/`, так как класс LogStream автоматически его создает.

## Логирование на основе потока

Вы можете записывать файлы логов в объекты TextWriter, такие как `Console.Out`, передав объект TextWriter в конструктор:

```cs
config.AccessLogsStream = new LogStream(Console.Out);
```

Для каждой записи в потоке лога вызывается метод `TextWriter.Flush()`.

## Форматирование журнала доступа

Вы можете настроить формат журнала доступа с помощью predefined переменных. Рассмотрите следующую строку:

```cs
config.AccessLogsFormat = "%dd/%dmm/%dy %tH:%ti:%ts %tz %ls %ri %rs://%ra%rz%rq [%sc %sd] %lin -> %lou in %lmsms [%{user-agent}]";
```

Она запишет сообщение такого вида:

    29/mar./2023 15:21:47 -0300 Executed ::1 http://localhost:5555/ \[200 OK\] 689B -> 707B in 84ms \[Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/111.0.0.0 Safari/537.36\]

Вы можете отформатировать свой файл журнала, используя формат, описанный в таблице:

|Переменная|Описание|Пример|
|---|---|---|
|%dd|Текущая дата в формате 00|25|
|%dm|Текущий месяц в формате 00|03|
|%dmm|Текущий месяц в сокращенном формате|mar.|
|%dmmm|Текущий месяц в полном формате|Март|
|%dy|Текущий год в формате 0000|2023|
|%th|Текущее время в формате 12 часов|03|
|%tH|Текущее время в формате 24 часов|15|
|%ti|Текущие минуты в формате 00|25|
|%ts|Текущие секунды в формате 00|32|
|%tm|Текущие миллисекунды в формате 000|633|
|%tz|Текущая разница во времени в формате +/- 0000| +0300, -0500, +0000|
|%ri|IP-адрес запрашивающего пользователя (может быть IPv4 или IPv6).|192.168.0.1|
|%rm|Метод запроса в верхнем регистре.|GET|
|%rs|Схема URL-адреса запрашивающего пользователя.|https, http|
|%ra|Доменное имя URL-адреса запрашивающего пользователя.|my.contorso.com:8080|
|%rh|Хост URL-адреса запрашивающего пользователя.|my.contorso.com|
|%rp|Порт URL-адреса запрашивающего пользователя.|8080|
|%rz|Абсолютный путь URL-адреса запрашивающего пользователя.|/index.html|
|%rq|Строка запроса URL-адреса запрашивающего пользователя.|?foo=bar&aaa=bbb|
|%sc|Код состояния ответа в формате 000.|404|
|%sd|Описание кода состояния ответа.|Не найдено|
|%lin|Размер входящего запроса в удобочитаемом виде.|12,5kb|
|%lou|Размер исходящего ответа в удобочитаемом виде.|65,8kb|
|%lms|Время обработки сервером запроса и отправки ответа в миллисекундах (000).|18|
|%{header}|Получает значение заголовка HTTP, где header - это имя заголовка, или пустое значение, если заголовок не существует. Это поле нечувствительно к регистру.|%{user-agent}|


## Ротация логов

> [!TIP]
> В Sisk 0.15 и более ранних версиях эта функция доступна только с пакетом Sisk.ServiceProvider. В Sisk 0.16 и более поздних версиях эта функция реализована в основном пакете.

Вы можете настроить HTTP-сервер для вращения файлов логов в сжатый файл .gz, когда они достигают определенного размера. Размер проверяется периодически по лимиту, который вы определяете.

```cs
config.AccessLogsStream = new LogStream("access.log");

var rotater = new RotatingLogPolicy(config.AccessLogsStream);
rotater.Configure(1024 * 1024, TimeSpan.FromHours(6));
```

В приведенном выше коде каждые шесть часов проверяется, достиг ли LogStream файла его лимита 1 МБ. Если да, то файл сжимается в .gz файл, а затем `access.log` очищается.

Во время этого процесса запись в файл блокируется до тех пор, пока файл не будет сжат и очищен. Все строки, которые должны быть записаны в этот период, будут находиться в очереди ожидания окончания сжатия.

Эта функция работает только с LogStreams на основе файлов.

## Логирование ошибок

Когда сервер не выбрасывает ошибки в отладчик, он перенаправляет их в запись логов, если таковые имеются. Вы можете настроить запись ошибок с помощью:

```cs
config.ThrowExceptions = false;
config.ErrorsLogsStream = new LogStream("error.log");
```

Эта свойство будет записывать что-либо в лог только в том случае, если ошибка не была захвачена обратным вызовом или свойством [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler).

Ошибка, записанная сервером, всегда записывает дату и время, заголовки запроса (не тело), отладочную информацию об ошибке и информацию об ошибке вложенных исключений, если таковые имеются.

## Другие экземпляры логов

Ваше приложение может иметь ноль или несколько LogStreams, нет ограничения на количество каналов логов, которые оно может иметь. Поэтому возможно направить логи вашего приложения в файл, отличный от по умолчанию AccessLog или ErrorLog.

```cs
LogStream appMessages = new LogStream("messages.log");
appMessages.WriteLine("Приложение запущено в {0}", DateTime.Now);
```

## Расширение LogStream

Вы можете расширить класс `LogStream` для записи пользовательских форматов, совместимых с текущей системой логов Sisk. Пример ниже позволяет записывать красочные сообщения в консоль с использованием библиотеки Spectre.Console:

```cs
public class CustomLogStream : LogStream
{
    protected override void WriteLineInternal(string line)
    {
        base.WriteLineInternal($"[{DateTime.Now:g}] {line}");
    }
}
```

Еще один способ автоматически записывать пользовательские логи для каждого запроса/ответа - создать [HttpServerHandler](/api/Sisk.Core.Http.Handlers.HttpServerHandler). Приведенный ниже пример более полный. Он записывает тело запроса и ответа в JSON в консоль. Это может быть полезно для отладки запросов в целом. Этот пример использует ContextBag и HttpServerHandler.

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
                    specialMessage = "Hello, world!! "
                }));
        });

        await app.StartAsync();
    }
}

class JsonMessageHandler : HttpServerHandler
{
    protected override void OnHttpRequestOpen(HttpRequest request)
    {
        if (request.Method != HttpMethod.Get && request.Headers["Content-Type"]?.Contains("json", StringComparison.InvariantCultureIgnoreCase) == true)
        {
            // В этот момент, соединение открыто и клиент отправил заголовок, указывающий, что содержимое JSON.
            // Если содержимое не будет прочитано в действии запроса, GC, вероятно, удалит содержимое после отправки ответа клиенту, поэтому содержимое может быть недоступно после закрытия ответа.
            //
            _ = request.RawBody;

            // добавить подсказку в контекст, чтобы указать, что этот запрос имеет JSON-тело.
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
            // переформатировать JSON с помощью библиотеки CypherPotato.LightJson
            var content = result.Request.Body;
            requestJson = JsonValue.Deserialize(content, new JsonOptions() { WriteIndented = true }.ToString();
        }

        if (result.Response is { } response
        {
            var content = response.Content;
            responseMessage = $"{(int)response.Status {HttpStatusInformation.GetStatusCodeDescription(response.Status)}";

            if (content is HttpContent httpContent &&
                // проверка, является ли ответ JSON
                httpContent.Headers.ContentType?.MediaType?.Contains("json", StringComparison.InvariantCultureIgnoreCase) == true)
            {
                string json = await httpContent.ReadAsStringAsync();
                responseJson = JsonValue.Deserialize(json, new JsonOptions() { WriteIndented = true }.ToString();
            }
        }
        else
        {
            // получает статус сервера
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

        outputMessage.AppendLine("<<< {responseMessage}");
        if (responseJson is not null)
            outputMessage.AppendLine(responseJson);
        outputMessage.AppendLine("-----");
        await Console.Out.WriteLineAsync(outputMessage.ToString());
    }
}
```
