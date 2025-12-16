# Proxy SSL

> [!WARNING]
> Esta característica es experimental y no debe usarse en producción. Consulte [este documento](/docs/es/deploying.html#proxying-your-application) si desea hacer que Sisk funcione con SSL.

El Proxy SSL de Sisk es un módulo que proporciona una conexión HTTPS para un [ListeningHost](/api/Sisk.Core.Http.ListeningHost) en Sisk y enruta mensajes HTTPS a un contexto HTTP inseguro. El módulo se creó para proporcionar una conexión SSL para un servicio que utiliza [HttpListener](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httplistener?view=net-8.0) para ejecutarse, que no admite SSL.

El proxy se ejecuta dentro de la misma aplicación y escucha mensajes HTTP/1.1, reenviándolos en el mismo protocolo a Sisk. Actualmente, esta característica es muy experimental y puede ser lo suficientemente inestable como para no usarse en producción.

En la actualidad, el SslProxy admite casi todas las características de HTTP/1.1, como keep-alive, codificación en bloques, websockets, etc. Para una conexión abierta al proxy SSL, se crea una conexión TCP al servidor de destino y el proxy se reenvía a la conexión establecida.

El SslProxy se puede utilizar con HttpServer.CreateBuilder de la siguiente manera:

```csharp
using var app = HttpServer.CreateBuilder(port: 5555)
    .UseRouter(r =>
    {
        r.MapGet("/", request =>
        {
            return new HttpResponse("Hola, mundo!");
        });
    })
    // agregar SSL al proyecto
    .UseSsl(
        sslListeningPort: 5567,
        new X509Certificate2(@".\ssl.pfx", password: "12345")
    )
    .Build();

app.Start();
```

Debe proporcionar un certificado SSL válido para el proxy. Para asegurarse de que el certificado sea aceptado por los navegadores, recuerde importarlo en el sistema operativo para que funcione correctamente.