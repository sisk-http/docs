# Mehrere Lauscher-Hosts pro Server

Das Sisk Framework unterstützt seit jeher die Verwendung von mehr als einem Host pro Server, d.h. ein einzelner HTTP-Server kann auf mehreren Ports hören und jeder Port hat seinen eigenen Router und seinen eigenen Dienst, der darauf läuft.

Auf diese Weise ist es einfach, Verantwortlichkeiten zu trennen und Dienste auf einem einzelnen HTTP-Server mit Sisk zu verwalten. Das folgende Beispiel zeigt die Erstellung von zwei ListeningHosts, von denen jeder auf einem anderen Port hört, mit unterschiedlichen Routern und Aktionen.

Lesen Sie [manuell Ihre App erstellen](/v1/getting-started.md#manuell-ihre-app-erstellen), um die Details über diese Abstraktion zu verstehen.

```cs
static void Main(string[] args)
{
    // Erstellen von zwei Listening-Hosts, von denen jeder seinen eigenen Router und
    // Port hat
    //
    ListeningHost hostA = new ListeningHost();
    hostA.Ports = [new ListeningPort(12000)];
    hostA.Router = new Router();
    hostA.Router.SetRoute(RouteMethod.Get, "/", request => new HttpResponse().WithContent("Hallo vom Host A!"));

    ListeningHost hostB = new ListeningHost();
    hostB.Ports = [new ListeningPort(12001)];
    hostB.Router = new Router();
    hostB.Router.SetRoute(RouteMethod.Get, "/", request => new HttpResponse().WithContent("Hallo vom Host B!"));

    // Erstellen einer Server-Konfiguration und Hinzufügen beider
    // Listening-Hosts
    //
    HttpServerConfiguration configuration = new HttpServerConfiguration();
    configuration.ListeningHosts.Add(hostA);
    configuration.ListeningHosts.Add(hostB);

    // Erstellen eines HTTP-Servers, der die angegebene
    // Konfiguration verwendet
    //
    HttpServer server = new HttpServer(configuration);

    // Starten des Servers
    server.Start();

    Console.WriteLine("Versuchen Sie, Host A unter {0} zu erreichen", server.ListeningPrefixes[0]);
    Console.WriteLine("Versuchen Sie, Host B unter {0} zu erreichen", server.ListeningPrefixes[1]);

    Thread.Sleep(-1);
}
```