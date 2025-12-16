# Resolvedores de Encaminhamento

Um Resolvedor de Encaminhamento é um auxiliar que ajuda a decodificar informações que identificam o cliente por meio de uma solicitação, proxy, CDN ou balanceadores de carga. Quando seu serviço Sisk é executado por meio de um proxy reverso ou de encaminhamento, o endereço IP do cliente, o host e o protocolo podem ser diferentes do da solicitação original, pois é um encaminhamento de um serviço para outro. Essa funcionalidade do Sisk permite controlar e resolver essas informações antes de trabalhar com a solicitação. Esses proxies geralmente fornecem cabeçalhos úteis para identificar seu cliente.

Atualmente, com a classe [ForwardingResolver](/api/Sisk.Core.Http.ForwardingResolver), é possível resolver o endereço IP do cliente, o host e o protocolo HTTP usado. Após a versão 1.0 do Sisk, o servidor não tem mais uma implementação padrão para decodificar esses cabeçalhos por motivos de segurança que variam de serviço para serviço.

Por exemplo, o cabeçalho `X-Forwarded-For` inclui informações sobre os endereços IP que encaminharam a solicitação. Esse cabeçalho é usado por proxies para transportar uma cadeia de informações para o serviço final e inclui o IP de todos os proxies usados, incluindo o endereço real do cliente. O problema é: às vezes é desafiador identificar o endereço IP remoto do cliente e não há regra específica para identificar esse cabeçalho. É altamente recomendado ler a documentação para os cabeçalhos que você está prestes a implementar abaixo:

- Leia sobre o cabeçalho `X-Forwarded-For` [aqui](https://developer.mozilla.org/en-US/docs/pt-br/Web/HTTP/Headers/X-Forwarded-For#security_and_privacy_concerns).
- Leia sobre o cabeçalho `X-Forwarded-Host` [aqui](https://developer.mozilla.org/en-US/docs/pt-br/Web/HTTP/Headers/X-Forwarded-Host).
- Leia sobre o cabeçalho `X-Forwarded-Proto` [aqui](https://developer.mozilla.org/en-US/docs/pt-br/Web/HTTP/Headers/X-Forwarded-Proto).

## A classe ForwardingResolver

Essa classe tem três métodos virtuais que permitem a implementação mais apropriada para cada serviço. Cada método é responsável por resolver informações da solicitação por meio de um proxy: o endereço IP do cliente, o host da solicitação e o protocolo de segurança usado. Por padrão, o Sisk sempre usará as informações da solicitação original, sem resolver nenhum cabeçalho.

O exemplo abaixo mostra como essa implementação pode ser usada. Esse exemplo resolve o endereço IP do cliente por meio do cabeçalho `X-Forwarded-For` e lança um erro quando mais de um IP foi encaminhado na solicitação.

> [!IMPORTANT]
> Não use esse exemplo em código de produção. Sempre verifique se a implementação é apropriada para uso. Leia a documentação do cabeçalho antes de implementá-lo.

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
                throw new Exception("O cabeçalho X-Forwarded-For está faltando.");
            }
            string[] ipAddresses = forwardedFor.Split(',');
            if (ipAddresses.Length != 1)
            {
                throw new Exception("Muitos endereços no cabeçalho X-Forwarded-For.");
            }

            return IPAddress.Parse(ipAddresses[0]);
        }
    }
}
```