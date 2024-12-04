# Перенаправление Резолверы

Перенаправляющий резолвер - это помощник, который помогает декодировать информацию, которая идентифицирует клиента через запрос, прокси, CDN или балансировщики нагрузки. Когда ваш сервис Sisk работает через обратный или прямой прокси, IP-адрес, хост и протокол клиента могут отличаться от исходного запроса, так как это перенаправление от одной службы к другой. Эта функциональность Sisk позволяет вам контролировать и разрешать эту информацию до работы с запросом. Эти прокси обычно предоставляют полезные заголовки для идентификации их клиента.

В настоящее время с классом [ForwardingResolver](/api/Sisk.Core.Http.ForwardingResolver) можно разрешить IP-адрес клиента, хост и используемый HTTP-протокол. После версии 1.0 Sisk сервер больше не имеет стандартной реализации для декодирования этих заголовков по соображениям безопасности, которые различаются для каждой службы.

Например, заголовок `X-Forwarded-For` включает информацию об IP-адресах, которые перенаправили запрос. Этот заголовок используется прокси для передачи цепочки информации конечной службе и включает IP всех прокси, использованных, включая реальный адрес клиента. Проблема в том, что иногда бывает сложно идентифицировать удаленный IP-адрес клиента, и нет конкретного правила для идентификации этого заголовка.

**Очень рекомендуется** прочитать документацию по заголовкам, которые вы собираетесь реализовать ниже:

- Прочитайте о заголовке `X-Forwarded-For` [здесь](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For#security_and_privacy_concerns).
- Прочитайте о заголовке `X-Forwarded-Host` [здесь](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Host).
- Прочитайте о заголовке `X-Forwarded-Proto` [здесь](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto).

## Класс ForwardingResolver

Этот класс имеет три виртуальных метода, которые позволяют реализовать наиболее подходящий вариант для каждой службы. Каждый метод отвечает за разрешение информации из запроса через прокси: IP-адрес клиента, хост запроса и используемый протокол безопасности. По умолчанию Sisk всегда будет использовать информацию из исходного запроса, не разрешая никаких заголовков.

Ниже приведен пример того, как можно использовать эту реализацию. Этот пример разрешает IP-адрес клиента через заголовок `X-Forwarded-For` и выдает ошибку, если в запросе было перенаправлено более одного IP-адреса.

> [!IMPORTANT]
> Не используйте этот пример в коде для производства. Всегда проверяйте, является ли реализация подходящей для использования. Прочитайте документацию по заголовкам перед ее реализацией.

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
                throw new Exception("Заголовок X-Forwarded-For отсутствует.");
            }
            string[] ipAddresses = forwardedFor.Split(',');
            if (ipAddresses.Length != 1)
            {
                throw new Exception("Слишком много адресов в заголовке X-Forwarded-For.");
            }

            return IPAddress.Parse(ipAddresses[0]);
        }
    }
}
```