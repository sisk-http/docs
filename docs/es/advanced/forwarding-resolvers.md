# Resolutores de Reenvío

Un Resolutor de Reenvío es un ayudante que ayuda a decodificar la información que identifica al cliente a través de una solicitud, proxy, CDN o balanceadores de carga. Cuando su servicio Sisk se ejecuta a través de un proxy inverso o directo, la dirección IP del cliente, el host y el protocolo pueden ser diferentes de la solicitud original, ya que es un reenvío de un servicio a otro. Esta funcionalidad de Sisk le permite controlar y resolver esta información antes de trabajar con la solicitud. Estos proxies suelen proporcionar encabezados útiles para identificar a su cliente.

Actualmente, con la clase [ForwardingResolver](/api/Sisk.Core.Http.ForwardingResolver), es posible resolver la dirección IP del cliente, el host y el protocolo HTTP utilizado. Después de la versión 1.0 de Sisk, el servidor ya no tiene una implementación estándar para decodificar estos encabezados por razones de seguridad que varían de servicio a servicio.

Por ejemplo, el encabezado `X-Forwarded-For` incluye información sobre las direcciones IP que reenviaron la solicitud. Este encabezado se utiliza para llevar una cadena de información al servicio final e incluye la dirección IP de todos los proxies utilizados, incluyendo la dirección real del cliente. El problema es: a veces es difícil identificar la dirección IP remota del cliente y no hay una regla específica para identificar este encabezado. Se recomienda encarecidamente leer la documentación de los encabezados que se van a implementar a continuación:

- Lea sobre el encabezado `X-Forwarded-For` [aquí](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For#security_and_privacy_concerns).
- Lea sobre el encabezado `X-Forwarded-Host` [aquí](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Host).
- Lea sobre el encabezado `X-Forwarded-Proto` [aquí](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto).

## La clase ForwardingResolver

Esta clase tiene tres métodos virtuales que permiten la implementación más adecuada para cada servicio. Cada método es responsable de resolver la información de la solicitud a través de un proxy: la dirección IP del cliente, el host de la solicitud y el protocolo de seguridad utilizado. Por defecto, Sisk siempre utilizará la información de la solicitud original, sin resolver ningún encabezado.

El ejemplo a continuación muestra cómo se puede utilizar esta implementación. Este ejemplo resuelve la dirección IP del cliente a través del encabezado `X-Forwarded-For` y lanza un error cuando se reenvían más de una dirección IP en la solicitud.

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

        host.Router.SetRoute(RouteMethod.Any, Route.AnyPath, request =>
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
                throw new Exception("El encabezado X-Forwarded-For está ausente.");
            }
            string[] ipAddresses = forwardedFor.Split(',');
            if (ipAddresses.Length != 1)
            {
                throw new Exception("Demasiadas direcciones en el encabezado X-Forwarded-For.");
            }

            return IPAddress.Parse(ipAddresses[0]);
        }
    }
}
```