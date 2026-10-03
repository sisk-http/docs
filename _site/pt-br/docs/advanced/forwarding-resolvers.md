# Resolvedores de Encaminhamento

Source: https://docs.sisk-framework.org/pt-br/docs/advanced/forwarding-resolvers.html

Um Resolvedor de Encaminhamento é um auxiliar que ajuda a decodificar informações que identificam o cliente por meio de uma requisição, proxy, CDN ou balanceadores de carga. Quando seu serviço Sisk roda através de um proxy reverso ou direto, o endereço IP, host e protocolo do cliente podem ser diferentes da requisição original, pois há um encaminhamento de um serviço para outro. Essa funcionalidade do Sisk permite que você controle e resolva essas informações antes de trabalhar com a requisição. Esses proxies geralmente fornecem cabeçalhos úteis para identificar seu cliente.

Atualmente, com a classe [ForwardingResolver](https://docs.sisk-framework.org/api/Sisk.Core.Http.ForwardingResolver.md) é possível resolver o endereço IP do cliente, o host e o protocolo HTTP usado. A partir da versão 1.0 do Sisk, o servidor não possui mais uma implementação padrão para decodificar esses cabeçalhos por motivos de segurança que variam de serviço para serviço.

Por exemplo, o cabeçalho `X-Forwarded-For` inclui informações sobre os endereços IP que encaminharam a requisição. Esse cabeçalho é usado por proxies para transportar uma cadeia de informações até o serviço final e inclui o IP de todos os proxies utilizados, inclusive o endereço real do cliente. O problema é: às vezes é difícil identificar o IP remoto do cliente e não há uma regra específica para identificar esse cabeçalho. É altamente recomendável ler a documentação dos cabeçalhos que você está prestes a implementar abaixo:

- Leia sobre o cabeçalho `X-Forwarded-For` [aqui](https://developer.mozilla.org/en-US/docs/pt-br/Web/HTTP/Headers/X-Forwarded-For#security_and_privacy_concerns).
- Leia sobre o cabeçalho `X-Forwarded-Host` [aqui](https://developer.mozilla.org/en-US/docs/pt-br/Web/HTTP/Headers/X-Forwarded-Host).
- Leia sobre o cabeçalho `X-Forwarded-Proto` [aqui](https://developer.mozilla.org/en-US/docs/pt-br/Web/HTTP/Headers/X-Forwarded-Proto).

## A classe ForwardingResolver

Esta classe possui três métodos virtuais que permitem a implementação mais adequada para cada serviço. Cada método é responsável por resolver informações da requisição através de um proxy: o endereço IP do cliente, o host da requisição e o protocolo de segurança usado. Por padrão, o Sisk sempre usará as informações da requisição original, sem resolver nenhum cabeçalho.

O exemplo abaixo mostra como essa implementação pode ser usada. Ele resolve o IP do cliente por meio do cabeçalho `X-Forwarded-For` e lança um erro quando mais de um IP foi encaminhado na requisição.

> [!IMPORTANT]
> Não use este exemplo em código de produção. Sempre verifique se a implementação é adequada para uso. Leia a documentação dos cabeçalhos antes de implementá‑los.

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
