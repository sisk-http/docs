# Múltiples hosts de escucha por servidor

El Sisk Framework siempre ha soportado el uso de más de un host por servidor, es decir, un único servidor HTTP puede escuchar en varios puertos y cada puerto tiene su propio router y su propio servicio ejecutándose en él.

De esta manera, es fácil separar responsabilidades y gestionar servicios en un único servidor HTTP con Sisk. El ejemplo a continuación muestra la creación de dos ListeningHosts, cada uno escuchando en un puerto diferente, con routers y acciones distintas.

Lea [creación manual de su aplicación](/v1/getting-started.md#manually-creating-your-app) para entender los detalles de esta abstracción.

```cs
static void Main(string[] args)
{
    // crear dos hosts de escucha, cada uno con su propio router y
    // escucha en su propio puerto
    //
    ListeningHost hostA = new ListeningHost();
    hostA.Ports = [new ListeningPort(12000)];
    hostA.Router = new Router();
    hostA.Router.MapGet("/", request => new HttpResponse().WithContent("Hello from the host A!"));

    ListeningHost hostB = new ListeningHost();
    hostB.Ports = [new ListeningPort(12001)];
    hostB.Router = new Router();
    hostB.Router.MapGet("/", request => new HttpResponse().WithContent("Hello from the host B!"));
 
    // crear una configuración de servidor y agregar ambos
    // hosts de escucha en ella
    //
    HttpServerConfiguration configuration = new HttpServerConfiguration();
    configuration.ListeningHosts.Add(hostA);
    configuration.ListeningHosts.Add(hostB);

    // crear un servidor http que usa la
    // configuración especificada
    //
    HttpServer server = new HttpServer(configuration);

    // iniciar el servidor
    server.Start();

    Console.WriteLine("Try to reach host A in {0}", server.ListeningPrefixes[0]);
    Console.WriteLine("Try to reach host B in {0}", server.ListeningPrefixes[1]);

    Thread.Sleep(-1);
}
```