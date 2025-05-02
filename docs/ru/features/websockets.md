# Web Sockets

Sisk также поддерживает веб-сокеты, позволяя получать и отправлять сообщения клиентам.

Эта функция работает в большинстве браузеров, но в Sisk она все еще является экспериментальной. Пожалуйста, если вы обнаружите какие-либо ошибки, сообщите о них на github.

## Принятие и получение сообщений асинхронно

Пример ниже показывает, как веб-сокет работает на практике, с примером открытия соединения, получения сообщения и отображения его в консоли.

Все сообщения, полученные по WebSocket, принимаются в байтах, поэтому вам придется декодировать их при получении.

По умолчанию сообщения фрагментируются на части, и последняя часть отправляется в качестве окончательного пакета сообщения. Вы можете настроить размер пакета с помощью флага [WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize). Это буферизация одинакова для отправки и получения сообщений.

```cs
router.MapGet("/connect", req =>
{
    using var ws = req.GetWebSocket();
    
    ws.OnReceive += (sender, msg) =>
    {
        string msgText = Encoding.UTF8.GetString(msg.MessageBytes);
        Console.WriteLine("Received message: " + msgText);

        // получает контекст HttpWebSocket, который получил сообщение
        HttpWebSocket senderWebSocket = (HttpWebSocket)sender!;
        senderWebSocket.Send("Response!");
    };

    ws.WaitForClose();
    
    return ws.Close();
});
```

> [!NOTE]
>
> Не используйте асинхронные события таким образом. Вы можете получить исключения, выброшенные вне домена HTTP-сервера, и они могут привести к сбою вашего приложения.

Если вам нужно обрабатывать асинхронный код и иметь дело с несколькими сообщениями одновременно, вы можете использовать цикл сообщений:

```csharp
router.MapGet("/", async delegate (HttpRequest request)
{
    using var ws = await request.GetWebSocketAsync();
    
    WebSocketMessage? message;
    while ((message = ws.WaitNext(timeout: TimeSpan.FromSeconds(30))) != null)
    {
        var messageText = message.GetString();
        Console.WriteLine($"Received message: {messageText}");

        await ws.SendAsync("Hello from server!");
    }

    return ws.Close();
});
```

## Принятие и получение сообщений синхронно

Пример ниже содержит способ использования синхронного веб-сокета без асинхронного контекста, где вы получаете сообщения, обрабатываете их и завершаете использование сокета.

```cs
router.MapGet("/connect", req =>
{
    using var ws = req.GetWebSocket();
    WebSocketMessage? msg;
    
askName:
    ws.Send("What is your name?");
    msg = ws.WaitNext();
        
    string? name = msg?.GetString();

    if (string.IsNullOrEmpty(name))
    {
        ws.Send("Please, insert your name!");
        goto askName;
    }
    
askAge:
    ws.Send("And your age?");
    msg = ws.WaitNext();
        
    if (!Int32.TryParse(msg?.GetString(), out int age))
    {
        ws.Send("Please, insert an valid number");
        goto askAge;
    }
        
    ws.Send($"You're {name}, and you are {age} old.");
        
    return ws.Close();
});
```

## Отправка сообщений

Метод Send имеет три перегрузки, которые позволяют отправлять текст, массив байтов или span байтов. Все они фрагментируются, если размер пакета сервера [WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize) больше общего размера полезной нагрузки.

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        byte[] myByteArrayContent = ...;

        ws.Send("Hello, world"); // будет закодировано как массив байтов UTF-8
        ws.Send(myByteArrayContent);

        return ws.Close();
    });

    return new ListeningHost("localhost",5551, r);
}
```

## Ожидание закрытия веб-сокета

Метод [WaitForClose()](/api/Sisk.Core.Http.Streams.HttpWebSocket.WaitForClose) блокирует текущий стек вызовов до тех пор, пока соединение не будет завершено клиентом или сервером.

Таким образом, выполнение обратного вызова запроса будет заблокировано до тех пор, пока клиент или сервер не отключится.

Вы также можете вручную закрыть соединение с помощью метода [Close()](/api/Sisk.Core.Http.Streams.HttpWebSocket.Close). Этот метод возвращает пустой объект [HttpResponse](/api/Sisk.Core.Http.HttpResponse), который не отправляется клиенту, но работает как возврат из функции, где был получен HTTP-запрос.

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        // ожидание закрытия соединения клиентом
        ws.WaitForClose();

        // ожидание в течение 60 секунд без обмена сообщениями
        // или до тех пор, пока одна из сторон не закроет соединение
        ws.WaitForClose(TimeSpan.FromSeconds(60));

        return ws.Close();
    });

    return new ListeningHost("localhost",5551, r);
}
```

## Политика ping

Аналогично тому, как политика ping работает в Server Side Events, вы также можете настроить политику ping, чтобы поддерживать открытое TCP-соединение в случае бездействия.

```cs
ws.WithPing(ping =>
{
    ping.DataMessage = "ping-message";
    ping.Interval = TimeSpan.FromSeconds(5);
    ping.Start();
});
```