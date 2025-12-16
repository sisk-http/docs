# Weiterleitungsauflöser

Ein Weiterleitungsauflöser ist ein Helfer, der dabei hilft, Informationen zu decodieren, die den Client durch eine Anfrage, Proxy, CDN oder Lastenausgleich identifizieren. Wenn Ihr Sisk-Dienst über einen Reverse- oder Forward-Proxy läuft, kann die IP-Adresse, der Host und das Protokoll des Clients von der ursprünglichen Anfrage abweichen, da es sich um eine Weiterleitung von einem Dienst zum anderen handelt. Diese Sisk-Funktion ermöglicht es Ihnen, diese Informationen zu kontrollieren und aufzulösen, bevor Sie mit der Anfrage arbeiten. Diese Proxys liefern normalerweise nützliche Header, um ihren Client zu identifizieren.

Derzeit ist es mit der [ForwardingResolver](/api/Sisk.Core.Http.ForwardingResolver)-Klasse möglich, die IP-Adresse, den Host und das HTTP-Protokoll des Clients aufzulösen. Nach Version 1.0 von Sisk hat der Server keine Standardimplementierung mehr, um diese Header aus Sicherheitsgründen, die von Dienst zu Dienst variieren, zu decodieren.

Zum Beispiel enthält der `X-Forwarded-For`-Header Informationen über die IP-Adressen, die die Anfrage weitergeleitet haben. Dieser Header wird von Proxys verwendet, um eine Kette von Informationen an den Enddienst zu übertragen und enthält die IP-Adresse aller verwendeten Proxys, einschließlich der tatsächlichen Adresse des Clients. Das Problem ist: manchmal ist es schwierig, die Remote-IP-Adresse des Clients zu identifizieren, und es gibt keine spezifische Regel, um diesen Header zu identifizieren. Es wird dringend empfohlen, die Dokumentation für die Header zu lesen, die Sie unten implementieren möchten:

- Lesen Sie über den `X-Forwarded-For`-Header [hier](https://developer.mozilla.org/en-US/docs/de/Web/HTTP/Headers/X-Forwarded-For#security_and_privacy_concerns).
- Lesen Sie über den `X-Forwarded-Host`-Header [hier](https://developer.mozilla.org/en-US/docs/de/Web/HTTP/Headers/X-Forwarded-Host).
- Lesen Sie über den `X-Forwarded-Proto`-Header [hier](https://developer.mozilla.org/en-US/docs/de/Web/HTTP/Headers/X-Forwarded-Proto).

## Die ForwardingResolver-Klasse

Diese Klasse hat drei virtuelle Methoden, die die am besten geeignete Implementierung für jeden Dienst ermöglichen. Jede Methode ist dafür verantwortlich, Informationen aus der Anfrage über einen Proxy aufzulösen: die IP-Adresse des Clients, den Host der Anfrage und das verwendete Sicherheitsprotokoll. Standardmäßig verwendet Sisk immer die Informationen aus der ursprünglichen Anfrage, ohne Header aufzulösen.

Das folgende Beispiel zeigt, wie diese Implementierung verwendet werden kann. Dieses Beispiel löst die IP-Adresse des Clients über den `X-Forwarded-For`-Header auf und wirft einen Fehler, wenn mehr als eine IP-Adresse in der Anfrage weitergeleitet wurde.

> [!IMPORTANT]
> Verwenden Sie dieses Beispiel nicht in Produktionscode. Überprüfen Sie immer, ob die Implementierung für die Verwendung geeignet ist. Lesen Sie die Header-Dokumentation, bevor Sie sie implementieren.

```cs
class Program
{
    static void Main(string[] args)
    {
        using var host = HttpServer.CreateBuilder()
            .UseForwardingResolver<Resolver>()
            .UseListeningPort(5555)
            .Build();

        host.Router.SetRoute(RouteMethod.Any, Route.AnyPath, request =>
            new HttpResponse("Hallo, Welt!!!"));

        host.Start();
    }

    class Resolver : ForwardingResolver
    {
        public override IPAddress OnResolveClientAddress(HttpRequest request, IPEndPoint connectingEndpoint)
        {
            string? forwardedFor = request.Headers.XForwardedFor;
            if (forwardedFor is null)
            {
                throw new Exception("Der X-Forwarded-For-Header fehlt.");
            }
            string[] ipAddresses = forwardedFor.Split(',');
            if (ipAddresses.Length != 1)
            {
                throw new Exception("Zu viele Adressen im X-Forwarded-For-Header.");
            }

            return IPAddress.Parse(ipAddresses[0]);
        }
    }
}
```