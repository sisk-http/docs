# Web Sockets

Sisk soporta websockets también, como recibir y enviar mensajes a su cliente.

Esta característica funciona bien en la mayoría de los navegadores, pero en Sisk todavía es experimental. Por favor, si encuentras algún error, repórtalo en github.

## Aceptar mensajes de forma asíncrona

Los mensajes WebSocket se reciben en orden, se encolan hasta ser procesados por `ReceiveMessageAsync`. Este método no devuelve ningún mensaje cuando se alcanza el tiempo de espera, cuando la operación es cancelada o cuando el cliente se desconecta.

Solo puede ocurrir una operación de lectura y escritura simultáneamente, por lo tanto, mientras esperas un mensaje con `ReceiveMessageAsync`, no es posible escribir al cliente conectado.

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

## Aceptar mensajes de forma síncrona

El ejemplo siguiente contiene una forma de usar un websocket síncrono, sin un contexto asíncrono, donde recibes los mensajes, los manejas y terminas de usar el socket.

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

Similar a cómo funciona la política de ping en Server Side Events, también puedes configurar una política de ping para mantener la conexión TCP abierta si hay inactividad en ella.

```cs
ws.PingPolicy.Start(
    dataMessage: "ping-message",
    interval: TimeSpan.FromSeconds(10));
```
