# Web Sockets

Sisk suporta web sockets também, como receber e enviar mensagens para o seu cliente.

Este recurso funciona bem na maioria dos navegadores, mas no Sisk ainda está experimental. Por favor, se encontrar algum bug, reporte no GitHub.

## Aceitando mensagens assincronamente

Mensagens WebSocket são recebidas em ordem, enfileiradas até serem processadas por `ReceiveMessageAsync`. Este método não retorna mensagem quando o timeout é atingido, quando a operação é cancelada ou quando o cliente se desconecta.

Só pode ocorrer uma operação de leitura e escrita simultaneamente, portanto, enquanto você espera por uma mensagem com `ReceiveMessageAsync`, não é possível escrever para o cliente conectado.

```cs
router.MapGet("/connect", async (HttpRequest req) =>
{
    using var ws = await req.GetWebSocketAsync();
    
    while (await ws.ReceiveMessageAsync(timeout: TimeSpan.FromSeconds(30)) is { } receivedMessage)
    {
        string msgText = receivedMessage.GetString();
        Console.WriteLine("Received message: " + msgText);

        await ws.SendAsync("Hello!");
    }

    return await ws.CloseAsync();
});
```

## Aceitando mensagens sincronamente

O exemplo abaixo contém uma forma de usar um websocket síncrono, sem contexto assíncrono, onde você recebe as mensagens, trata-as e termina usando o socket.

```cs
router.MapGet("/connect", async (HttpRequest req) =>
{
    using var ws = await req.GetWebSocketAsync();
    WebSocketMessage? msg;

askName:
    await ws.SendAsync("What is your name?");
    msg = await ws.ReceiveMessageAsync();

    if (msg is null)
        return await ws.CloseAsync();

    string name = msg.GetString();

    if (string.IsNullOrEmpty(name))
    {
        await ws.SendAsync("Please, insert your name!");
        goto askName;
    }

askAge:
    await ws.SendAsync("And your age?");
    msg = await ws.ReceiveMessageAsync();

    if (msg is null)
        return await ws.CloseAsync();

    if (!Int32.TryParse(msg?.GetString(), out int age))
    {
        await ws.SendAsync("Please, insert an valid number");
        goto askAge;
    }

    await ws.SendAsync($"You're {name}, and you are {age} old.");

    return await ws.CloseAsync();
});
```

## Política de Ping

Semelhante à política de ping em Server Side Events, você também pode configurar uma política de ping para manter a conexão TCP aberta caso haja inatividade nela.

```cs
ws.PingPolicy.Start(
    dataMessage: "ping-message",
    interval: TimeSpan.FromSeconds(10));
```
