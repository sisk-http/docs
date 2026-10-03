---
title: "Mehrere Listening-Hosts pro Server"
linkTitle: "Multi-Host-Setup"
weight: 50
aliases:
  - "/docs/de/advanced/multi-host-setup.html"
sourceHash: "a22de6cfeb6a02de"
---

Das Sisk Framework hat schon immer die Verwendung von mehr als einem Host pro Server unterstützt, das heißt, ein einzelner HTTP-Server kann auf mehreren Ports lauschen und jeder Port hat seinen eigenen Router und seinen eigenen Dienst, der darauf läuft.

Auf diese Weise ist es einfach, Verantwortlichkeiten zu trennen und Dienste auf einem einzelnen HTTP-Server mit Sisk zu verwalten. Das nachstehende Beispiel zeigt die Erstellung von zwei ListeningHosts, die jeweils auf einem anderen Port lauschen, mit unterschiedlichen Routern und Aktionen.

Lesen Sie [manually creating your app](/docs/advanced/manual-setup), um die Details zu dieser Abstraktion zu verstehen.

```cs
static void Main(string[] args)
{
    // Erstelle zwei Listening-Hosts, von denen jeder seinen eigenen Router hat und
    // auf seinem eigenen Port lauscht
    //
    ListeningHost hostA = new ListeningHost();
    hostA.Ports = [new ListeningPort(12000)];
    hostA.Router = new Router();
    hostA.Router.MapGet("/", request => new HttpResponse().WithContent("Hello from the host A!"));

    ListeningHost hostB = new ListeningHost();
    hostB.Ports = [new ListeningPort(12001)];
    hostB.Router = new Router();
    hostB.Router.MapGet("/", request => new HttpResponse().WithContent("Hello from the host B!"));
 
    // Erstelle eine Serverkonfiguration und füge beide
    // Listening-Hosts hinzu
    //
    HttpServerConfiguration configuration = new HttpServerConfiguration();
    configuration.ListeningHosts.Add(hostA);
    configuration.ListeningHosts.Add(hostB);

    // Erstellt einen HTTP-Server, der die angegebene
    // Konfiguration verwendet
    //
    HttpServer server = new HttpServer(configuration);

    // Startet den Server
    server.Start();

    Console.WriteLine("Versuchen Sie, Host A unter {0} zu erreichen", server.ListeningPrefixes[0]);
    Console.WriteLine("Versuchen Sie, Host B unter {0} zu erreichen", server.ListeningPrefixes[1]);

    Thread.Sleep(-1);
}
```
