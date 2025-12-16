# Varios hosts de escucha por servidor

El Framework Sisk siempre ha soportado el uso de más de un host por servidor, es decir, un solo servidor HTTP puede escuchar en múltiples puertos y cada puerto tiene su own enrutador y su propio servicio en ejecución.

De esta manera, es fácil separar responsabilidades y gestionar servicios en un solo servidor HTTP con Sisk. El ejemplo a continuación muestra la creación de dos ListeningHosts, cada uno escuchando en un puerto diferente, con diferentes enrutadores y acciones.

Lea [creación manual de su aplicación](/v1/getting-started.md#manually-creating-your-app) para entender los detalles sobre esta abstracción.

```cs
static void Main(string[] args)
{
    // crea dos hosts de escucha, cada uno con su own enrutador y
    // escuchando en su own puerto
    //
    ListeningHost hostA = new ListeningHost();
    hostA.Ports = [new ListeningPort(12000)];
    hostA.Router = new Router();
    hostA.Router.SetRoute(RouteMethod.Get, "/", request => new HttpResponse().WithContent("Hola desde el host A!"));

    ListeningHost hostB = new ListeningHost();
    hostB.Ports = [new ListeningPort(12001)];
    hostB.Router = new Router();
    hostB.Router.SetRoute(RouteMethod.Get, "/", request => new HttpResponse().WithContent("Hola desde el host B!"));

    // crea una configuración de servidor y agrega ambos
    // hosts de escucha en ella
    //
    HttpServerConfiguration configuration = new HttpServerConfiguration();
    configuration.ListeningHosts.Add(hostA);
    configuration.ListeningHosts.Add(hostB);

    // crea un servidor HTTP que utiliza la configuración
    // especificada
    //
    HttpServer server = new HttpServer(configuration);

    // inicia el servidor
    server.Start();

    Console.WriteLine("Intente llegar al host A en {0}", server.ListeningPrefixes[0]);
    Console.WriteLine("Intente llegar al host B en {0}", server.ListeningPrefixes[1]);

    Thread.Sleep(-1);
}
```