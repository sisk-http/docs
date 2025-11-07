# Trabalhando com SSL

Trabalhar com SSL para desenvolvimento pode ser necessário quando se trabalha em contextos que exigem segurança, como a maioria dos cenários de desenvolvimento web. O Sisk opera sobre o HttpListener, que não suporta HTTPS nativo, apenas HTTP. No entanto, existem contornos que permitem trabalhar com SSL no Sisk. Veja abaixo:

## Através do Sisk.Cadente.CoreEngine

- Disponível em: Linux, macOS, Windows
- Esforço: fácil

É possível usar o motor experimental **Cadente** em projetos Sisk, sem exigir configuração adicional no computador ou no projeto. Você precisará instalar o pacote `Sisk.Cadente.CoreEngine` em seu projeto para poder usar o servidor Cadente no servidor Sisk.

Para configurar SSL, você pode usar os métodos `UseSsl` e `UseEngine` do builder:

```csharp
using var http = HttpServer.CreateBuilder()
    .UseEngine<CadenteHttpServerEngine>()
    .UseSsl(CertificateHelper.CreateTrustedDevelopmentCertificate("localhost"))
```

> Nota: este pacote ainda está na fase experimental.

## Através do IIS no Windows

- Disponível em: Windows
- Esforço: médio

Se você está no Windows, pode usar o IIS para habilitar SSL no seu servidor HTTP. Para que isso funcione, é recomendável que você siga [este tutorial](/docs/pt-br/registering-namespace) antes, caso queira que seu aplicativo escute em um host diferente de "localhost".

Para que isso funcione, você deve instalar o IIS através dos recursos do Windows. O IIS está disponível gratuitamente para usuários do Windows e Windows Server. Para configurar SSL em seu aplicativo, tenha o certificado SSL pronto, mesmo que seja autoassinado. Em seguida, você pode ver [como configurar SSL no IIS 7 ou superior](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis).

## Através do mitmproxy

- Disponível em: Linux, macOS, Windows
- Esforço: fácil

**mitmproxy** é uma ferramenta de proxy de interceptação que permite a desenvolvedores e testadores de segurança inspecionar, modificar e registrar tráfego HTTP e HTTPS entre um cliente (como um navegador web) e um servidor. Você pode usar a utilidade **mitmdump** para iniciar um proxy SSL reverso entre seu cliente e seu aplicativo Sisk.

1. Primeiro, instale o [mitmproxy](https://mitmproxy.org/) em sua máquina.
2. Inicie seu aplicativo Sisk. Para este exemplo, usaremos a porta 8000 como a porta HTTP insegura.
3. Inicie o servidor mitmproxy para escutar na porta segura 8001:

```sh
mitmdump --mode reverse:http://localhost:8000/ -p 8001
```

E você já está pronto! Você já pode acessar seu aplicativo através de `https://localhost:8001/`. Seu aplicativo não precisa estar em execução para que você inicie o `mitmdump`.

Alternativamente, você pode adicionar uma referência ao [mitmproxy helper](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Helpers.mitmproxy) em seu projeto. Isso ainda requer que o mitmproxy esteja instalado em seu computador.

## Através do pacote Sisk.SslProxy

- Disponível em: Linux, macOS, Windows
- Esforço: fácil

> [!IMPORTANT]
>
> O pacote Sisk.SslProxy está obsoleto em favor do pacote `Sisk.Cadente.CoreEngine` e não será mais mantido.

O pacote Sisk.SslProxy é uma maneira simples de habilitar SSL em seu aplicativo Sisk. No entanto, ele é um pacote **extremamente experimental**. Pode ser instável trabalhar com este pacote, mas você pode fazer parte da pequena porcentagem de pessoas que contribuirão para tornar este pacote viável e estável. Para começar, você pode instalar o pacote Sisk.SslProxy com:

```sh
dotnet add package Sisk.SslProxy
```

> [!NOTE]
>
> Você deve habilitar "Incluir pré-lançamento" no Gerenciador de Pacotes do Visual Studio para instalar o Sisk.SslProxy.

Novamente, é um projeto experimental, então não pense nem em colocá-lo em produção.

No momento, o Sisk.SslProxy pode lidar com a maioria dos recursos HTTP/1.1, incluindo HTTP Continue, Chunked-Encoding, WebSockets e SSE. Leia mais sobre o SslProxy [aqui](/docs/pt-br/extensions/ssl-proxy).