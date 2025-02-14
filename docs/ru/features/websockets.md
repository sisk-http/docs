# Веб-сокеты

Sisk поддерживает веб-сокеты, такие как получение и отправка сообщений клиенту.

Эта функция работает хорошо в большинстве браузеров, но в Sisk она еще экспериментальная. Пожалуйста, если вы найдете какие-либо ошибки, сообщите об этом на github.

## Принятие и получение сообщений асинхронно

Пример ниже показывает, как работает веб-сокет на практике, с примером открытия соединения, получения сообщения и отображения его в консоли.

Все сообщения, полученные веб-сокетом, получаются в виде байтов, поэтому вам придется их расшифровать при получении.

По умолчанию, сообщения разбиваются на фрагменты и последний фрагмент отправляется как последний пакет сообщения. Вы можете настроить размер пакета с помощью флага [WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize). Этот буферизация одинакова для отправки и получения сообщений.

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
            Console.WriteLine("Получено сообщение: " + msgText);

            // получает контекст HttpWebSocket, который получил сообщение
            HttpWebSocket senderWebSocket = (HttpWebSocket)sender!;
            senderWebSocket.Send("Ответ!");
        };

        ws.WaitForClose();

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## Принятие и получение сообщений синхронно

Пример ниже содержит способ использования синхронного веб-сокета, без асинхронного контекста, где вы получаете сообщения, обрабатываете их и завершаете использование сокета.

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/connect", (req) =>
    {
        var ws = req.GetWebSocket();
        WebSocketMessage? msg;

    askName:
        ws.Send("Как вас зовут?");
        msg = ws.WaitNext();

        string? name = msg?.GetString();

        if (string.IsNullOrEmpty(name))
        {
            ws.Send("Пожалуйста, введите ваше имя!");
            goto askName;
        }

    askAge:
        ws.Send("А ваш возраст?");
        msg = ws.WaitNext();

        if (!Int32.TryParse(msg?.GetString(), out int age))
        {
            ws.Send("Пожалуйста, введите действительное число");
            goto askAge;
        }

        ws.Send($"Вы {name}, и вам {age} лет.");

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## Отправка сообщений

Метод Send имеет три перегрузки, которые позволяют отправлять текст, массив байтов или диапазон байтов. Все они разбиваются на фрагменты, если размер серверного буфера [WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize) больше общего размера полезной нагрузки.

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        byte[] myByteArrayContent = ...;

        ws.Send("Привет, мир");     // будет закодировано как массив байтов UTF-8
        ws.Send(myByteArrayContent);

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## Ожидание закрытия веб-сокета

Метод [WaitForClose()](/api/Sisk.Core.Http.Streams.HttpWebSocket.WaitForClose) блокирует текущий стек вызовов до тех пор, пока соединение не будет завершено клиентом или сервером.

С помощью этого метода выполнение callback запроса будет заблокировано до тех пор, пока клиент или сервер не отключится.

Вы также можете вручную закрыть соединение с помощью метода [Close()](/api/Sisk.Core.Http.Streams.HttpWebSocket.Close). Этот метод возвращает пустой объект [HttpResponse](/api/Sisk.Core.Http.HttpResponse), который не отправляется клиенту, но работает как возвращаемое значение из функции, где был получен HTTP-запрос.

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        // ожидание закрытия соединения клиентом
        ws.WaitForClose();

        // ожидание 60 секунд без обмена сообщениями
        // или до тех пор, пока одна из сторон не закроет соединение
        ws.WaitForClose(TimeSpan.FromSeconds(60));

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## Политика пинга

Аналогично политике пинга в Server Side Events, вы также можете настроить политику пинга, чтобы поддерживать TCP-соединение открытым, если в нем нет активности.

```cs
ws.WithPing(ping =>
{
    ping.DataMessage = "ping-message";
    ping.Interval = TimeSpan.FromSeconds(5);
    ping.Start();
});
```