# Web Sockets

Sisk admite web sockets, como recibir y enviar mensajes a sus clientes.

Esta característica funciona bien en la mayoría de los navegadores, pero en Sisk todavía es experimental. Por favor, si encuentra algún error, repórtelo en github.

## Aceptar y recibir mensajes de forma asíncrona

El ejemplo a continuación muestra cómo funciona el websocket en la práctica, con un ejemplo de abrir una conexión, recibir un mensaje y mostrarlo en la consola.

Todos los mensajes recibidos por WebSocket se reciben en bytes, por lo que tendrá que decodificarlos al recibirlos.

De forma predeterminada, los mensajes se fragmentan en trozos y el último trozo se envía como el paquete final del mensaje. Puede configurar el tamaño del paquete con la bandera [WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize). Este búfer es el mismo para enviar y recibir mensajes.

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
            Console.WriteLine("Mensaje recibido: " + msgText);

            // obtiene el contexto de HttpWebSocket que recibió el mensaje
            HttpWebSocket senderWebSocket = (HttpWebSocket)sender!;
            senderWebSocket.Send("Respuesta!");
        };

        ws.WaitForClose();

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## Aceptar y recibir mensajes de forma síncrona

El ejemplo a continuación contiene una forma de utilizar un websocket síncrono, sin un contexto asíncrono, donde recibe los mensajes, los procesa y termina de utilizar el socket.

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/connect", (req) =>
    {
        var ws = req.GetWebSocket();
        WebSocketMessage? msg;

    askName:
        ws.Send("¿Cuál es su nombre?");
        msg = ws.WaitNext();

        string? name = msg?.GetString();

        if (string.IsNullOrEmpty(name))
        {
            ws.Send("Por favor, ingrese su nombre!");
            goto askName;
        }

    askAge:
        ws.Send("¿Y su edad?");
        msg = ws.WaitNext();

        if (!Int32.TryParse(msg?.GetString(), out int age))
        {
            ws.Send("Por favor, ingrese un número válido");
            goto askAge;
        }

        ws.Send($"Usted es {name}, y tiene {age} años.");

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## Enviar mensajes

El método Send tiene tres sobrecargas, que permiten enviar texto, un arreglo de bytes o un span de bytes. Todos ellos se fragmentan si el tamaño del búfer del servidor [WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize) es mayor que el tamaño total de la carga.

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        byte[] myByteArrayContent = ...;

        ws.Send("Hola, mundo");     // se codificará como un arreglo de bytes UTF-8
        ws.Send(myByteArrayContent);

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## Esperar el cierre del websocket

El método [WaitForClose()](/api/Sisk.Core.Http.Streams.HttpWebSocket.WaitForClose) bloquea la pila de llamadas actual hasta que la conexión se termine por parte del cliente o del servidor.

Con esto, la ejecución del callback de la solicitud se bloqueará hasta que el cliente o el servidor se desconecte.

También puede cerrar manualmente la conexión con el método [Close()](/api/Sisk.Core.Http.Streams.HttpWebSocket.Close). Este método devuelve un objeto [HttpResponse](/api/Sisk.Core.Http.HttpResponse) vacío, que no se envía al cliente, pero funciona como un valor de retorno de la función donde se recibió la solicitud HTTP.

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        // espera a que el cliente cierre la conexión
        ws.WaitForClose();

        // espera hasta que no se intercambien mensajes en 60 segundos
        // o hasta que alguna de las partes cierre la conexión
        ws.WaitForClose(TimeSpan.FromSeconds(60));

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## Política de ping

Similar a cómo funciona la política de ping en Server Side Events, también puede configurar una política de ping para mantener la conexión TCP abierta si hay inactividad en ella.

```cs
ws.WithPing(ping =>
{
    ping.DataMessage = "ping-message";
    ping.Interval = TimeSpan.FromSeconds(5);
    ping.Start();
});
```