---
title: "Forwarding-Resolver"
linkTitle: "Weiterleitungs-Resolver"
weight: 30
aliases:
  - "/docs/de/advanced/forwarding-resolvers.html"
sourceHash: "10f8777c8228e888"
---

Ein Forwarding Resolver ist ein Helfer, der dabei unterstützt, Informationen zu dekodieren, die den Client über eine Anfrage, einen Proxy, ein CDN oder Load‑Balancer identifizieren. Wenn Ihr Sisk‑Dienst hinter einem Reverse‑ oder Forward‑Proxy läuft, können die IP‑Adresse, der Host und das Protokoll des Clients von der ursprünglichen Anfrage abweichen, da die Anfrage von einem Service zum anderen weitergeleitet wird. Diese Sisk‑Funktionalität ermöglicht es Ihnen, diese Informationen zu kontrollieren und zu ermitteln, bevor Sie mit der Anfrage arbeiten. Diese Proxies stellen in der Regel nützliche Header bereit, um ihren Client zu identifizieren.

Derzeit ist es mit der Klasse [ForwardingResolver](/api/Sisk.Core.Http.ForwardingResolver) möglich, die IP‑Adresse des Clients, den Host und das verwendete HTTP‑Protokoll zu ermitteln. Nach Version 1.0 von Sisk besitzt der Server keine standardisierte Implementierung mehr, um diese Header aus Sicherheitsgründen zu dekodieren, die von Service zu Service variieren.

Beispielsweise enthält der Header `X-Forwarded-For` Informationen über die IP‑Adressen, die die Anfrage weitergeleitet haben. Dieser Header wird von Proxies verwendet, um eine Kette von Informationen bis zum Zielservice zu transportieren, und beinhaltet die IP aller genutzten Proxies, einschließlich der echten Adresse des Clients. Das Problem ist: Oft ist es schwierig, die entfernte IP des Clients zu bestimmen, und es gibt keine feste Regel, um diesen Header zu identifizieren. Es wird dringend empfohlen, die Dokumentation der Header, die Sie implementieren möchten, unten zu lesen:

- Lesen Sie über den Header `X-Forwarded-For` [hier](https://developer.mozilla.org/en-US/docs/de/Web/HTTP/Headers/X-Forwarded-For#security_and_privacy_concerns).
- Lesen Sie über den Header `X-Forwarded-Host` [hier](https://developer.mozilla.org/en-US/docs/de/Web/HTTP/Headers/X-Forwarded-Host).
- Lesen Sie über den Header `X-Forwarded-Proto` [hier](https://developer.mozilla.org/en-US/docs/de/Web/HTTP/Headers/X-Forwarded-Proto).

## Die ForwardingResolver‑Klasse

Diese Klasse verfügt über drei virtuelle Methoden, die die jeweils passendste Implementierung für jeden Service ermöglichen. Jede Methode ist dafür verantwortlich, Informationen aus der Anfrage über einen Proxy zu ermitteln: die IP‑Adresse des Clients, den Host der Anfrage und das verwendete Sicherheitsprotokoll. Standardmäßig verwendet Sisk immer die Informationen der ursprünglichen Anfrage, ohne irgendwelche Header zu verarbeiten.

Das nachstehende Beispiel zeigt, wie diese Implementierung verwendet werden kann. Das Beispiel ermittelt die IP des Clients über den Header `X-Forwarded-For` und wirft einen Fehler, wenn mehr als eine IP in der Anfrage weitergeleitet wurde.

> [!IMPORTANT]
> Verwenden Sie dieses Beispiel nicht in Produktionscode. Prüfen Sie stets, ob die Implementierung für den jeweiligen Einsatz geeignet ist. Lesen Sie die Header‑Dokumentation, bevor Sie sie implementieren.

```cs
class Program
{
    static void Main(string[] args)
    {
        using var host = HttpServer.CreateBuilder()
            .UseForwardingResolver<Resolver>()
            .UseListeningPort(5555)
            .Build();

        host.Router.MapAny(Route.AnyPath, request =>
            new HttpResponse("Hello, world!!!"));
 
        host.Start();
    }

    class Resolver : ForwardingResolver
    {
        public override IPAddress OnResolveClientAddress(HttpRequest request, IPEndPoint connectingEndpoint)
        {
            string? forwardedFor = request.Headers.XForwardedFor;
            if (forwardedFor is null)
            {
                throw new Exception("The X-Forwarded-For header is missing.");
            }
            string[] ipAddresses = forwardedFor.Split(',');
            if (ipAddresses.Length != 1)
            {
                throw new Exception("Too many addresses in the X-Forwarded-For header.");
            }

            return IPAddress.Parse(ipAddresses[0]);
        }
    }
}
```
