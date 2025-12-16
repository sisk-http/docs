# Cadente

Cadente é uma implementação experimental de ouvinte HTTP/1.1 gerenciado para Sisk. Ele serve como substituto para o `System.Net.HttpListener` padrão, oferecendo maior controle e flexibilidade, especialmente em plataformas não-Windows.

## Visão Geral

Por padrão, o Sisk usa `HttpListener` (do `System.Net`) como seu mecanismo de servidor HTTP subjacente. Embora `HttpListener` seja estável e performático no Windows (onde ele usa o driver HTTP.sys do kernel), sua implementação no Linux e macOS é gerenciada e historicamente teve limitações, como falta de suporte nativo SSL (requerendo um proxy reverso como Nginx ou Sisk.SslProxy) e características de desempenho variadas.

Cadente visa resolver esses problemas fornecendo um servidor HTTP/1.1 totalmente gerenciado escrito em C#. Seus principais objetivos são:

- **Suporte Nativo SSL:** Funciona em todas as plataformas sem precisar de proxies externos ou configuração complexa.
- **Consistência Cross-Platform:** Comportamento idêntico no Windows, Linux e macOS.
- **Desempenho:** Projetado para ser uma alternativa de alto desempenho ao `HttpListener` gerenciado.
- **Independência:** Desacoplado do `System.Net.HttpListener`, isolando o Sisk de possíveis depreciações futuras ou falta de manutenção desse componente no .NET.

> [!WARNING]
> **Status Experimental**
> 
> Cadente está atualmente em uma fase experimental (Beta). Ele não é recomendado ainda para ambientes de produção críticos. A API e o comportamento podem mudar.

## Instalação

Cadente está disponível como um pacote separado. Para usá-lo com Sisk, você precisa do pacote `Sisk.Cadente.CoreEngine`.

```bash
dotnet add package Sisk.Cadente.CoreEngine --prerelease
```

## Usando com Sisk

Para usar Cadente como o mecanismo de servidor HTTP para sua aplicação Sisk, você precisa configurar o `HttpServer` para usar `CadenteHttpServerEngine` em vez do mecanismo padrão.

O `CadenteHttpServerEngine` adapta o `HttpHost` do Cadente à abstração `HttpServerEngine` necessária pelo Sisk.

```csharp
using Sisk.Core.Http;
using Sisk.Cadente.CoreEngine;

using var host = HttpServer.CreateBuilder()
    .UseEngine<CadenteHttpServerEngine>()
    .UseSsl(certificate: CertificateHelper.CreateTrustedDevelopmentCertificate("localhost"))
    .Build();

await host.StartAsync();
```

### Configuração Avançada

Você pode personalizar a instância subjacente `HttpHost` passando uma ação de configuração para o construtor do `CadenteHttpServerEngine`. Isso é útil para configurar tempos de espera ou outros ajustes de nível baixo.

```csharp
using var engine = new CadenteHttpServerEngine(host =>
{
    // Configure tempos de espera de leitura/escrita do cliente
    host.TimeoutManager.ClientReadTimeout = TimeSpan.FromSeconds(30);
    host.TimeoutManager.ClientWriteTimeout = TimeSpan.FromSeconds(30);
});
```

## Uso Autônomo

Embora projetado principalmente para Sisk, Cadente pode ser usado como um servidor HTTP autônomo (semelhante ao `HttpListener`).

```csharp
using Sisk.Cadente;

var host = new HttpHost(15000)
{
    Handler = new MyHostHandler()
};

host.Start();
Thread.Sleep(-1);

class MyHostHandler : HttpHostHandler
{
    public override async Task OnContextCreatedAsync(HttpHost host, HttpHostContext context)
    {
        context.Response.StatusCode = 200;
        using var writer = new StreamWriter(context.Response.GetResponseStream());
        await writer.WriteLineAsync("Olá, mundo!");
    }
}
```