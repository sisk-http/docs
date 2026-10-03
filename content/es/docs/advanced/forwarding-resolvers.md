---
title: "Resolvedores de Reenvío"
linkTitle: "Resolutores de reenvío"
weight: 30
aliases:
  - "/docs/es/advanced/forwarding-resolvers.html"
sourceHash: "10f8777c8228e888"
---

Un Resolvedor de Reenvío es un ayudante que ayuda a decodificar información que identifica al cliente a través de una solicitud, proxy, CDN o balanceadores de carga. Cuando su servicio Sisk se ejecuta a través de un proxy inverso o directo, la dirección IP del cliente, el host y el protocolo pueden ser diferentes de la solicitud original ya que es un reenvío de un servicio a otro. Esta funcionalidad de Sisk le permite controlar y resolver esta información antes de trabajar con la solicitud. Estos proxies usualmente proporcionan encabezados útiles para identificar a su cliente.

Actualmente, con la clase [ForwardingResolver](/api/Sisk.Core.Http.ForwardingResolver) es posible resolver la dirección IP del cliente, el host y el protocolo HTTP utilizado. Después de la versión 1.0 de Sisk, el servidor ya no tiene una implementación estándar para decodificar estos encabezados por razones de seguridad que varían de servicio a servicio.

Por ejemplo, el encabezado `X-Forwarded-For` incluye información sobre las direcciones IP que reenviaron la solicitud. Este encabezado es usado por los proxies para transportar una cadena de información al servicio final e incluye la IP de todos los proxies utilizados, incluida la dirección real del cliente. El problema es: a veces es difícil identificar la IP remota del cliente y no existe una regla específica para identificar este encabezado. Se recomienda encarecidamente leer la documentación de los encabezados que está a punto de implementar a continuación:

- Lea sobre el encabezado `X-Forwarded-For` [aquí](https://developer.mozilla.org/en-US/docs/es/Web/HTTP/Headers/X-Forwarded-For#security_and_privacy_concerns).
- Lea sobre el encabezado `X-Forwarded-Host` [aquí](https://developer.mozilla.org/en-US/docs/es/Web/HTTP/Headers/X-Forwarded-Host).
- Lea sobre el encabezado `X-Forwarded-Proto` [aquí](https://developer.mozilla.org/en-US/docs/es/Web/HTTP/Headers/X-Forwarded-Proto).

## La clase ForwardingResolver

Esta clase tiene tres métodos virtuales que permiten la implementación más adecuada para cada servicio. Cada método es responsable de resolver información de la solicitud a través de un proxy: la dirección IP del cliente, el host de la solicitud y el protocolo de seguridad utilizado. Por defecto, Sisk siempre usará la información de la solicitud original, sin resolver ningún encabezado.

El ejemplo a continuación muestra cómo se puede usar esta implementación. Este ejemplo resuelve la IP del cliente mediante el encabezado `X-Forwarded-For` y lanza un error cuando se han reenviado más de una IP en la solicitud.

> [!IMPORTANT]
> No utilice este ejemplo en código de producción. Siempre verifique si la implementación es adecuada para su uso. Lea la documentación del encabezado antes de implementarlo.

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
