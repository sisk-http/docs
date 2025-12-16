# Web Sockets

Sisk admite web sockets también, como recibir y enviar mensajes a sus clientes.

Esta característica funciona bien en la mayoría de los navegadores, pero en Sisk todavía es experimental. Por favor, si encuentra algún error, repórtelo en github.

## Aceptar mensajes

Los mensajes de WebSocket se reciben en orden, encolados hasta que se procesan con `ReceiveMessageAsync`. Este método no devuelve ningún mensaje cuando se alcanza el tiempo de espera, cuando se cancela la operación o cuando el cliente se desconecta.

Solo se puede realizar una operación de lectura y escritura simultáneamente, por lo tanto, mientras espera un mensaje con `ReceiveMessageAsync`, no es posible escribir en el cliente conectado.

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

## Conexión persistente

El ejemplo a continuación contiene una forma de utilizar una conexión de websocket persistente, donde recibe los mensajes, los maneja y termina utilizando el socket.

```cs
router.MapGet("/connect", async (HttpRequest req) =>
{
    using var ws = await req.GetWebSocketAsync();
    WebSocketMessage? msg;

askName:
    await ws.SendAsync("¿Cuál es su nombre?");
    msg = await ws.ReceiveMessageAsync();

    if (msg is null)
        return await ws.CloseAsync();

    string name = msg.GetString();

    if (string.IsNullOrEmpty(name))
    {
        await ws.SendAsync("Por favor, inserte su nombre!");
        goto askName;
    }

askAge:
    await ws.SendAsync("¿Y su edad?");
    msg = await ws.ReceiveMessageAsync();

    if (msg is null)
        return await ws.CloseAsync();

    if (!Int32.TryParse(msg?.GetString(), out int age))
    {
        await ws.SendAsync("Por favor, inserte un número válido");
        goto askAge;
    }

    await ws.SendAsync($"Usted es {name}, y tiene {age} años.");

    return await ws.CloseAsync();
});
```

## Política de ping

Similar a cómo funciona la política de ping en Server Side Events, también puede configurar una política de ping para mantener la conexión TCP abierta si hay inactividad en ella.

```cs
ws.PingPolicy.Start(
    dataMessage: "ping-message",
    interval: TimeSpan.FromSeconds(10));
```