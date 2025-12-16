# Trabalhando com SSL

Trabalhar com SSL para desenvolvimento pode ser necessário quando se trabalha em contextos que exigem segurança, como a maioria dos cenários de desenvolvimento web. O Sisk opera sobre o HttpListener, que não suporta HTTPS nativo, apenas HTTP. No entanto, existem soluções que permitem trabalhar com SSL no Sisk. Veja-as abaixo:

## Através do Sisk.Cadente.CoreEngine

- Disponível em: Linux, macOS, Windows
- Esforço: fácil

É possível usar o motor experimental **Cadente** em projetos Sisk, sem exigir configuração adicional no computador ou no projeto. Você precisará instalar o pacote `Sisk.Cadente.CoreEngine` em seu projeto para poder usar o servidor Cadente no servidor Sisk.

Para configurar SSL, você pode usar os métodos `UseSsl` e `UseEngine` do construtor:

```csharp
using var http = HttpServer.CreateBuilder()
    .UseEngine<CadenteHttpServerEngine>()
    .UseSsl(CertificateHelper.CreateTrustedDevelopmentCertificate("localhost"))
```

> Nota: este pacote ainda está em fase experimental.

## Através do IIS no Windows

- Disponível em: Windows
- Esforço: médio

Se você estiver no Windows, pode usar o IIS para habilitar SSL no seu servidor HTTP. Para que isso funcione, é aconselhável seguir [este tutorial](/docs/pt-br/registering-namespace) anteriormente, se você quiser que sua aplicação esteja ouvindo em um host diferente de "localhost".

Para que isso funcione, você deve instalar o IIS por meio de recursos do Windows. O IIS está disponível gratuitamente para usuários do Windows e Windows Server. Para configurar SSL em sua aplicação, tenha o certificado SSL pronto, mesmo que seja autoassinado. Em seguida, você pode ver [como configurar SSL no IIS 7 ou superior](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis).

## Através do mitmproxy

- Disponível em: Linux, macOS, Windows
- Esforço: fácil

**mitmproxy** é uma ferramenta de proxy de interceptação que permite que desenvolvedores e testadores de segurança inspecionem, modifiquem e registrem tráfego HTTP e HTTPS entre um cliente (como um navegador da web) e um servidor. Você pode usar a utilidade **mitmdump** para iniciar um proxy SSL reverso entre seu cliente e sua aplicação Sisk.

1. Primeiramente, instale [mitmproxy](https://mitmproxy.org/) em sua máquina.
2. Inicie sua aplicação Sisk. Para este exemplo, usaremos a porta 8000 como a porta HTTP insegura.
3. Inicie o servidor mitmproxy para ouvir na porta segura 8001:

```sh
mitmdump --mode reverse:http://localhost:8000/ -p 8001
```

E pronto! Você já pode acessar sua aplicação por meio de `https://localhost:8001/`. Sua aplicação não precisa estar em execução para iniciar `mitmdump`.

Alternativamente, você pode adicionar uma referência ao [helper do mitmproxy](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Helpers.mitmproxy) em seu projeto. Isso ainda exige que o mitmproxy esteja instalado em seu computador.

## Através do pacote Sisk.SslProxy

- Disponível em: Linux, macOS, Windows
- Esforço: fácil

> [!IMPORTANT]
>
> O pacote Sisk.SslProxy está depreciado em favor do pacote `Sisk.Cadente.CoreEngine` e não será mais mantido.

O pacote Sisk.SslProxy é uma maneira simples de habilitar SSL em sua aplicação Sisk. No entanto, é um pacote **extremamente experimental**. Pode ser instável trabalhar com este pacote, mas você pode ser parte do pequeno percentual de pessoas que contribuirão para tornar este pacote viável e estável. Para começar, você pode instalar o pacote Sisk.SslProxy com:

```sh
dotnet add package Sisk.SslProxy
```

> [!NOTE]
>
> Você deve habilitar "Incluir pré-lançamento" no Gerenciador de Pacotes do Visual Studio para instalar Sisk.SslProxy.

Novamente, é um projeto experimental, então nem pense em colocá-lo em produção.

No momento, o Sisk.SslProxy pode lidar com a maioria dos recursos do HTTP/1.1, incluindo HTTP Continue, Chunked-Encoding, WebSockets e SSE. Leia mais sobre SslProxy [aqui](/docs/pt-br/extensions/ssl-proxy).