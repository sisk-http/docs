# Forwarding Resolvers

Um Forwarding Resolver é um auxiliar que ajuda a decodificar informações que identificam o cliente por meio de uma solicitação, proxy, CDN ou balanceadores de carga. Quando seu serviço Sisk é executado por meio de um proxy inverso ou avançado, o endereço IP, o host e o protocolo do cliente podem ser diferentes da solicitação original, pois é um encaminhamento de um serviço para outro. Essa funcionalidade do Sisk permite que você controle e resolva essas informações antes de trabalhar com a solicitação. Esses proxies geralmente fornecem cabeçalhos úteis para identificar seu cliente.

Atualmente, com a classe [ForwardingResolver](/api/Sisk.Core.Http.ForwardingResolver), é possível resolver o endereço IP do cliente, o host e o protocolo HTTP usado. Após a versão 1.0 do Sisk, o servidor não possui mais uma implementação padrão para decodificar esses cabeçalhos por motivos de segurança que variam de serviço para serviço.

Por exemplo, o cabeçalho `X-Forwarded-For` inclui informações sobre os endereços IP que encaminharam a solicitação. Este cabeçalho é usado por proxies para transportar uma cadeia de informações para o serviço final e inclui o IP de todos os proxies usados, incluindo o endereço real do cliente. O problema é: às vezes é desafiador identificar o IP remoto do cliente e não há uma regra específica para identificar este cabeçalho. É altamente recomendável ler a documentação dos cabeçalhos que você está prestes a implementar abaixo:

- Leia sobre o cabeçalho `X-Forwarded-For` [aqui](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For#security_and_privacy_concerns).
- Leia sobre o cabeçalho `X-Forwarded-Host` [aqui](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Host).
- Leia sobre o cabeçalho `X-Forwarded-Proto` [aqui](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto).

## A classe ForwardingResolver

Esta classe possui três métodos virtuais que permitem a implementação mais adequada para cada serviço. Cada método é responsável por resolver informações da solicitação por meio de um proxy: o endereço IP do cliente, o host da solicitação e o protocolo de segurança usado. Por padrão, o Sisk sempre usará as informações da solicitação original, sem resolver nenhum cabeçalho.

O exemplo abaixo mostra como essa implementação pode ser usada. Este exemplo resolve o endereço IP do cliente através do cabeçalho `X-Forwarded-For` e lança um erro quando mais de um IP foi encaminhado na solicitação.

> [!IMPORTANTE]
> Não use este exemplo em código de produção. Verifique sempre se a implementação é apropriada para uso. Leia a documentação do cabeçalho antes de implementá-lo.

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
                throw new Exception("Número excessivo de endereços no cabeçalho X-Forwarded-For.");
            }

            return IPAddress.Parse(ipAddresses[0]);
        }
    }
}
```