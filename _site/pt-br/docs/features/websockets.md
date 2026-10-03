# Web Sockets

Source: https://docs.sisk-framework.org/pt-br/docs/features/websockets.html

Sisk também oferece suporte a web sockets, permitindo receber e enviar mensagens ao cliente.

Esse recurso funciona bem na maioria dos navegadores, mas no Sisk ainda está experimental. Por favor, se encontrar algum bug, reporte no GitHub.

## Aceitando mensagens

As mensagens WebSocket são recebidas em ordem, enfileiradas até serem processadas por `ReceiveMessageAsync`. Esse método não retorna mensagem quando o tempo limite é atingido, quando a operação é cancelada ou quando o cliente está desconectado.

Só pode haver uma operação de leitura e escrita simultaneamente; portanto, enquanto você aguarda uma mensagem com `ReceiveMessageAsync`, não é possível escrever para o cliente conectado.

```cs
router.MapGet("/connect", async (HttpRequest req) =>
{
    using var ws = await req.GetWebSocketAsync();
    
    while (await ws.ReceiveMessageAsync(timeout: TimeSpan.FromSeconds(30)) is { } receivedMessage)
    {
        string msgText = receivedMessage.GetString();
        Console.WriteLine("Mensagem recebida: " + msgText);

        await ws.SendAsync("Olá!");
    }

    return await ws.CloseAsync();
});
```

## Conexão persistente

O exemplo abaixo mostra como usar uma conexão websocket persistente, onde você recebe as mensagens, as trata e finaliza o uso do socket.

```cs
router.MapGet("/connect", async (HttpRequest req) =>
{
    using var ws = await req.GetWebSocketAsync();
    WebSocketMessage? msg;

askName:
    await ws.SendAsync("Qual é o seu nome?");
    msg = await ws.ReceiveMessageAsync();

    if (msg is null)
        return await ws.CloseAsync();

    string name = msg.GetString();

    if (string.IsNullOrEmpty(name))
    {
        await ws.SendAsync("Por favor, insira seu nome!");
        goto askName;
    }

askAge:
    await ws.SendAsync("E sua idade?");
    msg = await ws.ReceiveMessageAsync();

    if (msg is null)
        return await ws.CloseAsync();

    if (!Int32.TryParse(msg?.GetString(), out int age))
    {
        await ws.SendAsync("Por favor, insira um número válido");
        goto askAge;
    }

    await ws.SendAsync($"Você é {name}, e tem {age} anos.");

    return await ws.CloseAsync();
});
```

## Ping Policy

Semelhante à política de ping em Server Side Events, você também pode configurar uma política de ping para manter a conexão TCP aberta caso haja inatividade.

```cs
ws.PingPolicy.Start(
    dataMessage: "ping-mensagem",
    interval: TimeSpan.FromSeconds(10));
```

## Conexões gerenciadas

Ao aceitar um WebSocket, você pode fornecer um identificador. Sockets identificados são registrados em [HttpServer.WebSockets](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.WebSockets.md), permitindo que o servidor encontre conexões ativas fora da rota que as aceitou.

```cs
router.MapGet("/connect/<userId>", async (HttpRequest req) =>
{
    string userId = req.RouteParameters["userId"].GetString();

    using var ws = await req.GetWebSocketAsync(identifier: $"user:{userId}");
    ws.State = userId;

    ws.PingPolicy.Start(
        dataMessage: "ping",
        interval: TimeSpan.FromSeconds(10));

    while (await ws.ReceiveMessageAsync(TimeSpan.FromMinutes(5)) is { } message)
    {
        await ws.SendAsync("Recebido: " + message.GetString());
    }

    return await ws.CloseAsync();
});
```

De outra parte da aplicação, consulte a coleção por identificador ou predicado:

```cs
HttpWebSocket? socket = server.WebSockets.GetByIdentifier("user:42");
if (socket is { IsClosed: false })
{
    await socket.SendAsync("Seu relatório está pronto.");
}

foreach (HttpWebSocket activeSocket in server.WebSockets.Find(id => id.StartsWith("user:")))
{
    await activeSocket.SendAsync("Mensagem de broadcast");
}
```

Cada `HttpWebSocket` expõe `Identifier`, `State`, `IsClosed` e `PingPolicy`. A coleção também expõe `All()`, `Find(...)`, `GetByIdentifier(...)`, `ActiveConnections` e `DropAll()` para estratégias de conexão gerenciadas pelo servidor.
