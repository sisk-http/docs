# Веб-сокеты

Sisk поддерживает веб-сокеты, как для приема, так и для отправки сообщений клиенту.

Эта функция работает нормально в большинстве браузеров, но в Sisk она все еще находится в экспериментальной стадии. Пожалуйста, если вы найдете какие-либо ошибки, сообщите об этом на github.

## Прием и обработка сообщений асинхронно

Ниже приведен пример того, как работают веб-сокеты на практике, с примером открытия соединения, получения сообщения и его отображения в консоли.

Все сообщения, полученные WebSocket, получаются в виде байтов, поэтому вам придется декодировать их при получении.

По умолчанию сообщения фрагментируются на куски, а последний фрагмент отправляется в качестве последнего пакета сообщения. Вы можете настроить размер пакета с помощью флага [WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize). Этот буферизация одинакова для отправки и получения сообщений.

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

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

    return new ListeningHost("localhost", 5551, r);
}
```

## Прием и обработка сообщений синхронно

В следующем примере показан способ использования синхронного веб-соккета, без асинхронного контекста, где вы получаете сообщения, обрабатываете их и завершаете работу с сокетом.

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/connect", (req) =>
    {
        var ws = req.GetWebSocket();
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

    return new ListeningHost("localhost", 5551, r);
}
```

## Отправка сообщений

Метод Send имеет три перегрузки, которые позволяют отправлять текст, массив байтов или диапазон байтов. Все они фрагментируются, если флаг [WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize) сервера больше общего размера полезной нагрузки.

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        byte[] myByteArrayContent = ...;

        ws.Send("Hello, world");     // будет закодирован как массив байтов UTF-8
        ws.Send(myByteArrayContent);

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## Ожидание закрытия веб-сокета

Метод [WaitForClose()](/api/Sisk.Core.Http.Streams.HttpWebSocket.WaitForClose) блокирует текущий вызов стека до тех пор, пока соединение не будет закрыто ни клиентом, ни сервером.

Благодаря этому выполнение обратного вызова запроса будет заблокировано до тех пор, пока клиент или сервер не разорвет соединение.

Вы также можете вручную закрыть соединение с помощью метода [Close()](/api/Sisk.Core.Http.Streams.HttpWebSocket.Close). Этот метод возвращает объект [HttpResponse](/api/Sisk.Core.Http.HttpResponse), который не отправляется клиенту, но работает как возврат из функции, где был получен HTTP-запрос.

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        // ожидание закрытия соединения клиентом
        ws.WaitForClose();

        // ожидание до тех пор, пока не будет обменено сообщений в течение 60 секунд
        // или пока одна из сторон не закроет соединение
        ws.WaitForClose(TimeSpan.FromSeconds(60));

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## Политика пинга

Подобно тому, как работает политика пинга в Server Side Events, вы также можете настроить политику пинга для поддержания открытого TCP-соединения, если в нем отсутствует активность.

```cs
ws.WithPing(ping =>
{
    ping.DataMessage = "ping-message";
    ping.Interval = TimeSpan.FromSeconds(5);
    ping.Start();
});
```