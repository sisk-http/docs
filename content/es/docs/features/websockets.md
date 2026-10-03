---
title: "Web Sockets"
linkTitle: "WebSockets"
weight: 30
aliases:
  - "/docs/es/features/websockets.html"
sourceHash: "cef36acaab7b825b"
---

Sisk también soporta websockets, como recibir y enviar mensajes a su cliente.

Esta característica funciona bien en la mayoría de los navegadores, pero en Sisk sigue siendo experimental. Por favor, si encuentras algún error, repórtalo en GitHub.

## Aceptar mensajes

Los mensajes WebSocket se reciben en orden, encolados hasta que los procesa `ReceiveMessageAsync`. Este método no devuelve ningún mensaje cuando se alcanza el tiempo de espera, cuando la operación se cancela o cuando el cliente se desconecta.

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

## Conexión persistente

El siguiente ejemplo muestra cómo usar una conexión websocket persistente, donde recibes los mensajes, los procesas y finalizas el uso del socket.

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

Similar a cómo funciona la política de ping en Server Side Events, también puedes configurar una política de ping para mantener la conexión TCP abierta si hay inactividad.

```cs
ws.PingPolicy.Start(
    dataMessage: "ping-message",
    interval: TimeSpan.FromSeconds(10));
```

## Conexiones gestionadas

Al aceptar un WebSocket, puedes proporcionar un identificador. Los sockets identificados se registran en [HttpServer.WebSockets](/api/Sisk.Core.Http.HttpServer.WebSockets), lo que permite al servidor encontrar conexiones activas fuera de la ruta que los aceptó.

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
        await ws.SendAsync("Received: " + message.GetString());
    }

    return await ws.CloseAsync();
});
```

Desde otra parte de la aplicación, consulta la colección por identificador o predicado:

```cs
HttpWebSocket? socket = server.WebSockets.GetByIdentifier("user:42");
if (socket is { IsClosed: false })
{
    await socket.SendAsync("Your report is ready.");
}

foreach (HttpWebSocket activeSocket in server.WebSockets.Find(id => id.StartsWith("user:")))
{
    await activeSocket.SendAsync("Broadcast message");
}
```

Cada `HttpWebSocket` expone `Identifier`, `State`, `IsClosed` y `PingPolicy`. La colección también expone `All()`, `Find(...)`, `GetByIdentifier(...)`, `ActiveConnections` y `DropAll()` para estrategias de conexión gestionadas por el servidor.
