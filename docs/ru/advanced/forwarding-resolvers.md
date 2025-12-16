# Forwarding Resolvers

Передающий решатель - это помощник, который помогает декодировать информацию, идентифицирующую клиента через запрос, прокси, CDN или балансировщики нагрузки. Когда ваш сервис Sisk работает через обратный или прямой прокси, IP-адрес клиента, хост и протокол могут быть khácными от исходного запроса, поскольку это передача от одного сервиса к другому. Эта функциональность Sisk позволяет вам контролировать и решать эту информацию перед работой с запросом. Эти прокси обычно предоставляют полезные заголовки для идентификации их клиента.

В настоящее время с помощью класса [ForwardingResolver](/api/Sisk.Core.Http.ForwardingResolver) возможно решить IP-адрес клиента, хост и HTTP-протокол, используемый. После версии 1.0 Sisk сервер больше не имеет стандартной реализации для декодирования этих заголовков по причинам безопасности, которые варьируются от сервиса к сервису.

Например, заголовок `X-Forwarded-For` содержит информацию об IP-адресах, которые передали запрос. Этот заголовок используется прокси для переноса цепочки информации к конечному сервису и включает IP всех прокси, использованных для этого, включая реальный адрес клиента. Проблема заключается в том, что иногда бывает сложно идентифицировать удаленный IP клиента, и нет конкретного правила для идентификации этого заголовка. Высоко рекомендуется прочитать документацию для заголовков, которые вы собираетесь реализовать ниже:

- Прочитайте о заголовке `X-Forwarded-For` [здесь](https://developer.mozilla.org/en-US/docs/ru/Web/HTTP/Headers/X-Forwarded-For#security_and_privacy_concerns).
- Прочитайте о заголовке `X-Forwarded-Host` [здесь](https://developer.mozilla.org/en-US/docs/ru/Web/HTTP/Headers/X-Forwarded-Host).
- Прочитайте о заголовке `X-Forwarded-Proto` [здесь](https://developer.mozilla.org/en-US/docs/ru/Web/HTTP/Headers/X-Forwarded-Proto).

## Класс ForwardingResolver

Этот класс имеет три виртуальных метода, которые позволяют наиболее подходящую реализацию для каждого сервиса. Каждый метод отвечает за решение информации из запроса через прокси: IP-адрес клиента, хост запроса и протокол безопасности, используемый. По умолчанию Sisk всегда будет использовать информацию из исходного запроса, не решая никаких заголовков.

Пример ниже показывает, как можно использовать эту реализацию. Этот пример решает IP клиента через заголовок `X-Forwarded-For` и выбрасывает ошибку, когда в запросе передано более одного IP.

> [!IMPORTANT]
> Не используйте этот пример в производственном коде. Всегда проверяйте, является ли реализация подходящей для использования. Прочитайте документацию заголовка перед его реализацией.

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