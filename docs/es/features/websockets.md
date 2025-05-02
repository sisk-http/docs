# Web Sockets

Sisk también admite web sockets, como recibir y enviar mensajes a sus clientes.

Esta característica funciona bien en la mayoría de los navegadores, pero en Sisk todavía es experimental. Por favor, si encuentras algún error, repórtalo en github.

## Aceptar y recibir mensajes de forma asíncrona

El ejemplo siguiente muestra cómo funciona websocket en la práctica, con un ejemplo de abrir una conexión, recibir un mensaje y mostrarlo en la consola.

Todos los mensajes recibidos por WebSocket se reciben en bytes, por lo que deberá decodificarlos al recibirlos.

De forma predeterminada, los mensajes se fragmentan en fragmentos y el último fragmento se envía como el paquete final del mensaje. Puede configurar el tamaño del paquete con la bandera [WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize). Este almacenamiento en búfer es el mismo para enviar y recibir mensajes.

```cs
router.MapGet("/connect", req =>
{
    using var ws = req.GetWebSocket();
        
    ws.OnReceive += (sender, msg) =>
    {
        string msgText = Encoding.UTF8.GetString(msg.MessageBytes);
        Console.WriteLine("Mensaje recibido: " + msgText);

        // obtiene el contexto de HttpWebSocket que recibió el mensaje
        HttpWebSocket senderWebSocket = (HttpWebSocket)sender!;
        senderWebSocket.Send("Respuesta!");
    };

    ws.WaitForClose();
        
    return ws.Close();
});
```

> [!NOTE]
>
> No utilice eventos asíncronos de esta manera. Puede tener excepciones lanzadas fuera del dominio del servidor HTTP y pueden hacer que su aplicación se bloquee.

Si necesita manejar código asíncrono y tratar con varios mensajes al mismo tiempo, puede utilizar el bucle de mensajes:

```csharp
router.MapGet("/", async delegate (HttpRequest request)
{
    using var ws = await request.GetWebSocketAsync();
    
    WebSocketMessage? message;
    while ((message = ws.WaitNext(timeout: TimeSpan.FromSeconds(30))) != null)
    {
        var messageText = message.GetString();
        Console.WriteLine($"Mensaje recibido: {messageText}");

        await ws.SendAsync("Hola desde el servidor!");
    }

    return ws.Close();
});
```

## Aceptar y recibir mensajes de forma síncrona

El ejemplo siguiente contiene una forma de utilizar un websocket síncrono, sin un contexto asíncrono, donde recibe los mensajes, los trata y termina utilizando el socket.

```cs
router.MapGet("/connect", req =>
{
    using var ws = req.GetWebSocket();
    WebSocketMessage? msg;
    
    askName:
    ws.Send("¿Cuál es tu nombre?");
    msg = ws.WaitNext();
        
    string? name = msg?.GetString();

    if (string.IsNullOrEmpty(name))
    {
        ws.Send("Por favor, introduce tu nombre!");
        goto askName;
    }
    
    askAge:
    ws.Send("¿Y tu edad?");
    msg = ws.WaitNext();
        
    if (!Int32.TryParse(msg?.GetString(), out int age))
    {
        ws.Send("Por favor, introduce un número válido");
        goto askAge;
    }
        
    ws.Send($"Eres {name} y tienes {age} años.");
        
    return ws.Close();
});
```

## Enviar mensajes

El método Send tiene tres sobrecargas, que permiten enviar texto, una matriz de bytes o un lapso de bytes. Todos ellos se fragmentan si el tamaño del paquete del servidor [WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize) es mayor que el tamaño total de la carga.

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        byte[] myByteArrayContent = ...;

        ws.Send("Hola, mundo"); // se codificará como una matriz de bytes UTF-8
        ws.Send(myByteArrayContent);

        return ws.Close();
    });

    return new ListeningHost("localhost",5551, r);
}
```

## Esperar a que se cierre el websocket

El método [WaitForClose()](/api/Sisk.Core.Http.Streams.HttpWebSocket.WaitForClose) bloquea la pila de llamadas actual hasta que la conexión sea terminada por el cliente o el servidor.

Con esto, la ejecución de la devolución de llamada de la solicitud se bloqueará hasta que el cliente o el servidor se desconecten.

También puede cerrar la conexión manualmente con el método [Close()](/api/Sisk.Core.Http.Streams.HttpWebSocket.Close). Este método devuelve un objeto [HttpResponse](/api/Sisk.Core.Http.HttpResponse) vacío, que no se envía al cliente, pero funciona como una devolución de la función donde se recibió la solicitud HTTP.

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        // esperar a que el cliente cierre la conexión
        ws.WaitForClose();

        // espera hasta que no se intercambien mensajes en 60 segundos
        // o hasta que alguna parte cierre la conexión
        ws.WaitForClose(TimeSpan.FromSeconds(60));

        return ws.Close();
    });

    return new ListeningHost("localhost",5551, r);
}
```

## Política de ping

Al igual que funciona la política de ping en Server Side Events, también puede configurar una política de ping para mantener la conexión TCP abierta si hay inactividad en ella.

```cs
ws.WithPing(ping =>
{
    ping.DataMessage = "mensaje-ping";
    ping.Interval = TimeSpan.FromSeconds(5);
    ping.Start();
});
```