# Резолверы Перенаправления

Резолвер перенаправления - это помощник, который помогает декодировать информацию, идентифицирующую клиента, через запрос, прокси, CDN или балансировщик нагрузки. Когда ваш сервис Sisk запускается через обратный прокси или прямой прокси, адрес IP клиента, хост и протокол могут быть khácными от исходного запроса, поскольку это перенаправление из одного сервиса в другой. Эта функциональность Sisk позволяет контролировать и решать эту информацию до работы с запросом. Эти прокси обычно предоставляют полезные заголовки для идентификации вашего клиента.

В настоящее время, с классом [ForwardingResolver](/api/Sisk.Core.Http.ForwardingResolver), возможно решить адрес IP клиента, хост и протокол HTTP, используемый. После версии 1.0 Sisk сервер больше не имеет стандартной реализации для декодирования этих заголовков по причинам безопасности, которые варьируются от сервиса к сервису.

Например, заголовок `X-Forwarded-For` включает информацию о адресах IP, которые перенаправили запрос. Этот заголовок используется для передачи цепочки информации конечному сервису и включает адрес IP всех использованных прокси, включая реальный адрес клиента. Проблема в том, что иногда бывает трудно идентифицировать удаленный адрес IP клиента, и нет конкретного правила для идентификации этого заголовка. Рекомендуется внимательно прочитать документацию о заголовках, которые будут реализованы:

- Прочитайте о заголовке `X-Forwarded-For` [здесь](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For#security_and_privacy_concerns).
- Прочитайте о заголовке `X-Forwarded-Host` [здесь](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Host).
- Прочитайте о заголовке `X-Forwarded-Proto` [здесь](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto).

## Класс ForwardingResolver

Этот класс имеет три виртуальных метода, которые позволяют реализовать наиболее подходящую реализацию для каждого сервиса. Каждый метод отвечает за решение информации запроса через прокси: адрес IP клиента, хост запроса и протокол безопасности, используемый. По умолчанию Sisk всегда будет использовать информацию исходного запроса, не решая никаких заголовков.

Пример ниже показывает, как можно использовать эту реализацию. Этот пример решает адрес IP клиента через заголовок `X-Forwarded-For` и генерирует ошибку, когда в запросе перенаправляются более одной адреса IP.

> [!IMPORTANT]
> Не используйте этот пример в коде производства. Всегда проверяйте, является ли реализация подходящей для вашего использования. Прочитайте документацию заголовка перед его реализацией.

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