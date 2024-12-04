# Trabalhando com SSL

Trabalhar com SSL para desenvolvimento pode ser necessário quando se trabalha em contextos que exigem segurança, como a maioria dos cenários de desenvolvimento web. O Sisk opera em cima do HttpListener, que não suporta HTTPS nativo, apenas HTTP. No entanto, existem soluções alternativas que permitem trabalhar com SSL no Sisk. Veja-as abaixo:

## Através do IIS no Windows

- Disponível em: Windows
- Esforço: médio

Se você estiver no Windows, pode usar o IIS para habilitar SSL no seu servidor HTTP. Para que isso funcione, é recomendável que você siga [este tutorial](/docs/registering-namespace) com antecedência se quiser que seu aplicativo esteja ouvindo em um host diferente de "localhost".

Para que isso funcione, você deve instalar o IIS através dos recursos do Windows. O IIS está disponível gratuitamente para usuários do Windows e Windows Server. Para configurar o SSL em seu aplicativo, tenha o certificado SSL pronto, mesmo que seja autoassinado. Em seguida, você pode ver [como configurar o SSL no IIS 7 ou superior](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis).

## Através do mitmproxy

- Disponível em: Linux, macOS, Windows
- Esforço: fácil

**mitmproxy** é uma ferramenta de proxy de interceptação que permite que desenvolvedores e testadores de segurança inspecionem, modifiquem e registrem o tráfego HTTP e HTTPS entre um cliente (como um navegador web) e um servidor. Você pode usar a utilitário **mitmdump** para iniciar um proxy SSL reversa entre seu cliente e seu aplicativo Sisk.

1. Primeiro, instale o [mitmprxy](https://mitmproxy.org/) em sua máquina.
2. Inicie seu aplicativo Sisk. Para este exemplo, usaremos a porta 8000 como a porta HTTP não segura.
3. Inicie o servidor mitmproxy para ouvir a porta segura na 8001:

```sh
mitmdump --mode reverse:http://localhost:8000/ -p 8001
```

E você está pronto para começar! Você já pode acessar seu aplicativo através de `https://localhost:8001/`. Seu aplicativo não precisa estar em execução para você iniciar `mitmdump`.

## Através do pacote Sisk.SslProxy

- Disponível em: Linux, macOS, Windows
- Esforço: fácil

O pacote Sisk.SslProxy é uma maneira simples de habilitar SSL no seu aplicativo Sisk. No entanto, é um pacote **extremamente experimental**. Pode ser instável trabalhar com este pacote, mas você pode fazer parte da pequena porcentagem de pessoas que contribuirão para tornar este pacote viável e estável. Para começar, você pode instalar o pacote Sisk.SslProxy com:

```sh
dotnet add package Sisk.SslProxy
```

> [!NOTE]

> Você deve habilitar "Habilitar pacotes pré-lançamento" no Gerenciador de Pacotes do Visual Studio para instalar o Sisk.SslProxy.

Novamente, é um projeto experimental, então nem pense em colocá-lo em produção.

No momento, o Sisk.SslProxy pode lidar com a maioria dos recursos HTTP/1.1, incluindo HTTP Continue, Chunked-Encoding, WebSockets e SSE. Leia mais sobre o SslProxy [aqui](/docs/extensions/ssl-proxy).
