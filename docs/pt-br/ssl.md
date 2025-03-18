# Trabalhando com SSL

Trabalhar com SSL para desenvolvimento pode ser necessário quando se trabalha em contextos que exigem segurança, como a maioria dos cenários de desenvolvimento web. O Sisk opera em cima do HttpListener, que não suporta HTTPS nativo, apenas HTTP. No entanto, existem soluções que permitem trabalhar com SSL no Sisk. Veja-as abaixo:

## Através do IIS no Windows

- Disponível em: Windows
- Esforço: médio

Se você estiver no Windows, pode usar o IIS para habilitar o SSL no seu servidor HTTP. Para que isso funcione, é aconselhável seguir [este tutorial](/docs/registering-namespace) antes, se você quiser que sua aplicação esteja ouvindo em um host diferente de "localhost".

Para que isso funcione, você deve instalar o IIS através das recursos do Windows. O IIS está disponível gratuitamente para usuários do Windows e Windows Server. Para configurar o SSL na sua aplicação, tenha o certificado SSL pronto, mesmo que seja autoassinado. Em seguida, você pode ver [como configurar o SSL no IIS 7 ou superior](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis).

## Através do mitmproxy

- Disponível em: Linux, macOS, Windows
- Esforço: fácil

**mitmproxy** é uma ferramenta de proxy de interceptação que permite que desenvolvedores e testadores de segurança inspecionem, modifiquem e gravem o tráfego HTTP e HTTPS entre um cliente (como um navegador da web) e um servidor. Você pode usar a utilidade **mitmdump** para iniciar um proxy SSL reverso entre o seu cliente e a aplicação Sisk.

1. Primeiramente, instale o [mitmproxy](https://mitmproxy.org/) na sua máquina.
2. Inicie a aplicação Sisk. Neste exemplo, usaremos a porta 8000 como a porta HTTP insegura.
3. Inicie o servidor mitmproxy para ouvir a porta segura na porta 8001:

```sh
mitmdump --mode reverse:http://localhost:8000/ -p 8001
```

E pronto! Você já pode acessar a aplicação através de `https://localhost:8001/`. A aplicação não precisa estar em execução para iniciar o `mitmdump`.

Alternativamente, você pode adicionar uma referência ao [helper do mitmproxy](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Helpers.mitmproxy) no seu projeto. Isso ainda exige que o mitmproxy esteja instalado no seu computador.

## Através do pacote Sisk.SslProxy

- Disponível em: Linux, macOS, Windows
- Esforço: fácil

O pacote Sisk.SslProxy é uma maneira simples de habilitar o SSL na aplicação Sisk. No entanto, é um pacote **extremamente experimental**. Pode ser instável trabalhar com esse pacote, mas você pode ser parte do pequeno percentual de pessoas que contribuirão para tornar esse pacote viável e estável. Para começar, você pode instalar o pacote Sisk.SslProxy com:

```sh
dotnet add package Sisk.SslProxy
```

> [!NOTE]
>
> Você deve habilitar "Habilitar pacotes de pré-lançamento" no Gerenciador de Pacotes do Visual Studio para instalar o Sisk.SslProxy.

Novamente, é um projeto experimental, então não pense em colocá-lo em produção.

No momento, o Sisk.SslProxy pode lidar com a maioria dos recursos do HTTP/1.1, incluindo HTTP Continue, Chunked-Encoding, WebSockets e SSE. Leia mais sobre o SslProxy [aqui](/docs/extensions/ssl-proxy).