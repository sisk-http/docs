# Web Sockets

Sisk suporta web sockets também, como receber e enviar mensagens para seus clientes.

Esta funcionalidade funciona bem na maioria dos navegadores, mas no Sisk ainda é experimental. Por favor, se você encontrar algum bug, relate-o no github.

## Aceitando mensagens

Mensagens WebSocket são recebidas em ordem, enfileiradas até serem processadas por `ReceiveMessageAsync`. Este método não retorna nenhuma mensagem quando o tempo limite é alcançado, quando a operação é cancelada ou quando o cliente é desconectado.

Apenas uma operação de leitura e escrita pode ocorrer simultaneamente, portanto, enquanto você está esperando por uma mensagem com `ReceiveMessageAsync`, não é possível escrever no cliente conectado.

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

O exemplo abaixo contém uma forma de você usar uma conexão websocket persistente, onde você recebe as mensagens, lida com elas e finaliza usando o socket.

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

    await ws.SendAsync($"Você é {name}, e você tem {age} anos.");

    return await ws.CloseAsync();
});
```

## Política de Ping

Semelhante à política de ping em Server Side Events, você também pode configurar uma política de ping para manter a conexão TCP aberta se houver inatividade nela.

```cs
ws.PingPolicy.Start(
    dataMessage: "ping-message",
    interval: TimeSpan.FromSeconds(10));
```