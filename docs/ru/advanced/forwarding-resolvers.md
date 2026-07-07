# Forwarding Resolvers

Forwarding Resolver — это вспомогательный компонент, который помогает декодировать информацию, идентифицирующую клиента через запрос, прокси, CDN или балансировщик нагрузки. Когда ваш сервис Sisk работает через обратный или прямой прокси, IP‑адрес клиента, хост и протокол могут отличаться от оригинального запроса, поскольку происходит переадресация от одного сервиса к другому. Эта возможность Sisk позволяет контролировать и определять эту информацию до работы с запросом. Такие прокси обычно предоставляют полезные заголовки для идентификации своего клиента.

В настоящее время с классом [ForwardingResolver](/api/Sisk.Core.Http.ForwardingResolver) можно определить IP‑адрес клиента, хост и используемый HTTP‑протокол. Начиная с версии 1.0 Sisk, сервер больше не имеет стандартной реализации декодирования этих заголовков по соображениям безопасности, которые различаются от сервиса к сервису.

Например, заголовок `X-Forwarded-For` содержит информацию об IP‑адресах, которые переадресовали запрос. Этот заголовок используется прокси для передачи цепочки информации конечному сервису и включает IP всех задействованных прокси, включая реальный адрес клиента. Проблема в том, что иногда сложно определить удалённый IP клиента, и нет единого правила для распознавания этого заголовка. Настоятельно рекомендуется ознакомиться с документацией по заголовкам, которые вы собираетесь использовать, ниже:

- Подробнее о заголовке `X-Forwarded-For` — [здесь](https://developer.mozilla.org/en-US/docs/ru/Web/HTTP/Headers/X-Forwarded-For#security_and_privacy_concerns).
- Подробнее о заголовке `X-Forwarded-Host` — [здесь](https://developer.mozilla.org/en-US/docs/ru/Web/HTTP/Headers/X-Forwarded-Host).
- Подробнее о заголовке `X-Forwarded-Proto` — [здесь](https://developer.mozilla.org/en-US/docs/ru/Web/HTTP/Headers/X-Forwarded-Proto).

## The ForwardingResolver class

Этот класс содержит три виртуальных метода, позволяющих реализовать наиболее подходящее решение для каждого сервиса. Каждый метод отвечает за определение информации из запроса через прокси: IP‑адрес клиента, хост запроса и используемый протокол безопасности. По умолчанию Sisk всегда использует данные оригинального запроса, не обрабатывая заголовки.

Ниже приведён пример того, как можно использовать эту реализацию. Пример определяет IP клиента через заголовок `X-Forwarded-For` и генерирует ошибку, если в запросе передано более одного IP‑адреса.

> [!IMPORTANT]
> Не используйте этот пример в продакшн‑коде. Всегда проверяйте, подходит ли реализация для вашего случая. Ознакомьтесь с документацией заголовков перед их внедрением.

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