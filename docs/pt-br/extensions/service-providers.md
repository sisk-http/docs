# Fornecedores de Serviços

Os Fornecedores de Serviços são uma maneira simples de transportar seu aplicativo em diferentes ambientes e configurações facilmente, sem precisar alterar seu código para isso. A classe [ServiceProvider](/read?q=/contents/Sisk/Provider/ServiceProvider) é acessível por tipo que define um aplicativo com seu roteador, configuração e outras configurações já disponíveis no Sisk.

> [!IMPORTANT]
> O pacote Sisk.ServiceProvider não é mais mantido. Por favor, use a classe [HttpServerHostContextBuilder](/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder) em vez disso.

> [!WARNING]
> Desde a versão 0.16 do Sisk, esse recurso está integrado ao seu núcleo e não é mais necessário instalar um pacote adicional para isso. Por favor, [leia este documento](https://github.com/sisk-http/docs/blob/master/archive/0.16/service-providers-migration) com mais detalhes, especificação de migração e muito mais.
>
> O pacote será mantido apenas para a versão 0.15 enquanto ela ainda for mantida.

Os Fornecedores de Serviços são gerenciados por um arquivo JSON de configurações que é lido pelo aplicativo que está próximo ao seu executável. Este é um exemplo de arquivo de configuração de serviço:

```json
{
    "Server": {
        "DefaultEncoding": "UTF-8",
        "ThrowExceptions": true,
        "IncludeRequestIdHeader": true
    },
    "ListeningHost": {
        "Label": "Meu aplicativo sisk",
        "Ports": [
            "http://localhost:80/",
            "https://localhost:443/",  // Arquivos de configuração também suportam comentários
        ],
        "CrossOriginResourceSharingPolicy": {
            "AllowOrigin": "*",
            "AllowOrigins": [ "*" ],   // novo em 0.14
            "AllowMethods": [ "*" ],
            "AllowHeaders": [ "*" ],
            "MaxAge": 3600
        },
        "Parameters": {
            "MySqlConnection": "server=localhost;user=root;"
        }
    }
}
```

Este arquivo é lido junto com o executável do servidor, independentemente da plataforma de build. Por padrão, o nome do arquivo é `service-config.json` e deve permanecer no mesmo diretório do executável de saída. Também é possível alterar o nome do arquivo ajustando a classe [ServiceProvider](/api/Sisk/Provider/ServiceProvider).

> [!TIP]
> Em arquivos de configuração de provedores de serviço do Sisk, é permitido escrever `// single` ou `/* multi-line comments */`, pois eles são ignorados pelo interpretador.

## Instalando

Você pode instalar o pacote Sisk.SericeProviders executando:

    dotnet add package Sisk.SericeProviders

Você pode encontrar mais opções baixando-o [aqui](https://www.nuget.org/packages/Sisk.ServiceProvider/).

## Criando uma instância de provedor de serviço

Nesta sessão, aprenderemos como configurar o aplicativo para executar um provedor de serviço Sisk. Primeiro, você precisará ter a versão mais recente do Sisk instalada em seu projeto.

Primeiro, configuremos uma instância da classe RouterFactory que será configurada e emitirá um roteador. Esta classe não é o ponto de entrada do aplicativo, mas é o objeto que executará os objetos de tempo de execução.

```cs
public class Application : RouterFactory
{
    public string? MySqlConnection { get; set; }

    // Abaixo, indicamos ao roteador para procurar as rotas em nossa instância do aplicativo.
    // Você pode definir as rotas em outro objeto ou tipo também.
    public override Router BuildRouter()
    {
        Router r = new Router();
        r.SetObject(this);
        return r;
    }

    // Em setupParameters, podemos definir os parâmetros definidos na seção de parâmetros do nosso JSON.
    public override void Setup(NameValueCollection setupParameters)
    {
        this.MySqlConnection = setupParameters["MySqlConnection"] ?? throw new ArgumentNullException(nameof(MySqlConnection));
    }

    // Método síncrono chamado imediatamente antes do início do servidor HTTP.
    public override void Bootstrap()
    {
        ;
    }

    [Route(RouteMethod.Get, "/")]
    public HttpResponse IndexPage(HttpRequest request)
    {
        HttpResponse htmlResponse = new HttpResponse();
        htmlResponse.Content = new StringContent("Olá, mundo!", System.Text.Encoding.UTF8, "text/plain");
        return htmlResponse;
    }
}
```

Agora, podemos configurar um serviço em nosso ponto de entrada do programa:

```cs
public class Program
{
    public static Application App { get; set; }

    static void Main(string[] args)
    {
        App = new Application();
        ServiceProvider provider = new(App, "config.json");
        provider.ConfigureInit(config =>
        {
            // Define o loop de solicitação principal como a informação cultural brasileira.
            config.UseLocale(CultureInfo.GetCultureInfo("pt-BR"));

            // Define as bandeiras HTTP no início do servidor.
            config.UseFlags(new HttpServerFlags()
            {
                SendSiskHeader = true
            });

            // Indica que após iniciar o servidor, ele não deve terminar o loop principal.
            config.UseHauting(true);

            // Sobrescreve os parâmetros de configuração do servidor HTTP,
            // mesmo que tenham sido parametrizados no arquivo JSON de configuração.
            config.UseConfiguration(httpConfig =>
            {
                if (httpConfig.AccessLogsStream?.FilePath != null)
                {
                    RotatingLogPolicy policy = new RotatingLogPolicy(httpConfig.AccessLogsStream);
                    policy.Configure(1024 * 1024, TimeSpan.FromHours(6));
                }
            });

            // Sobrescreve os parâmetros CORS diretamente para o servidor HTTP
            config.UseCors(cors =>
            {
                cors.AllowMethods = new[] { "GET", "POST", "PUT", "DELETE" };
            });

            // Sobrescreve propriedades diretamente para o servidor HTTP
            config.UseHttpServer(http =>
            {
                http.EventSources.OnEventSourceRegistered += (sender, ws) =>
                {
                    Console.WriteLine("Nova fonte de eventos: " + ws.Identifier);
                };
                http.EventSources.OnEventSourceUnregistration += (sender, ws) =>
                {
                    Console.WriteLine("Fonte de eventos fechada: " + ws.Identifier);
                };
            });
        });
    }
}
```

Agora nosso aplicativo está pronto para ser iniciado com um arquivo JSON que configura as portas, métodos, nomes de host e parâmetros.

## Estrutura do arquivo de configuração

O arquivo JSON é composto pelas propriedades:

<table>
    <thead>
        <tr>
            <th>Propriedade</th>
            <th>Obrigatório</th>
            <th>Descrição</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Server</td>
            <td>Obrigatório</td>
            <td>Representa o próprio servidor com suas configurações.</td>
        </tr>
        <tr>
            <td>Server.AccessLogsStream</td>
            <td>Opcional</td>
            <td>Padrão para <code>console</code>. Especifica o fluxo de saída do log de acesso. Pode ser um nome de arquivo,
                <code>null</code> ou <code>console</code>.</td>
        </tr>
        <tr>
            <td>Server.ErrorsLogsStream</td>
            <td>Opcional</td>
            <td>Padrão para <code>null</code>. Especifica o fluxo de saída do log de erros. Pode ser um nome de arquivo,
                <code>null</code> ou <code>console</code>.</td>
        </tr>
        <tr>
            <td>Server.ResolveForwardedOriginAddress</td>
            <td>Opcional</td>
            <td>Padrão para
                <code>false</code>. Especifica se o servidor HTTP deve resolver o cabeçalho
                <code>X-Forwarded-For</code> para o endereço IP do usuário. (Recomendado para servidores proxy)</td>
        </tr>
        <tr>
            <td>Server.ResolveForwardedOriginHost</td>
            <td>Opcional</td>
            <td>Padrão para
                <code>false</code>. Especifica se o servidor HTTP deve resolver o cabeçalho
                <code>X-Forwarded-Host</code> para o host do servidor.</td>
        </tr>
        <tr>
            <td>Server.DefaultEncoding</td>
            <td>Opcional</td>
            <td>Padrão para
                <code>UTF-8</code>. Especifica a codificação de texto padrão usada pelo servidor HTTP.</td>
        </tr>
        <tr>
            <td>Server.MaximumContentLength</td>
            <td>Opcional</td>
            <td>Padrão para
                <code>0</code>. Especifica o tamanho máximo do conteúdo em bytes. Zero significa infinito.</td>
        </tr>
        <tr>
            <td>Server.IncludeRequestIdHeader</td>
            <td>Opcional</td>
            <td>Padrão para
                <code>false</code>. Especifica se o servidor HTTP deve enviar o cabeçalho
                <code>X-Request-Id</code>.</td>
        </tr>
        <tr>
            <td>Server.ThrowExceptions</td>
            <td>Opcional</td>
            <td>Padrão para
                <code>true</code>. Especifica se as exceções não tratadas devem ser lançadas. Defina como
                <code>false</code> em produção e
                <code>true</code> quando depurando.</td>
        </tr>
        <tr>
            <td>ListeningHost</td>
            <td>Obrigatório</td>
            <td>Representa o host de escuta do servidor.</td>
        </tr>
        <tr>
            <td>ListeningHost.Label</td>
            <td>Opcional</td>
            <td>Representa o rótulo do aplicativo.</td>
        </tr>
        <tr>
            <td>ListeningHost.Ports</td>
            <td>Obrigatório</td>
            <td>Representa um array de strings, correspondente à sintaxe
                <a href="/api/Sisk.Core.Http.ListeningPort">ListeningPort</a>.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy</td>
            <td>Opcional</td>
            <td>Configuração da política CORS para o aplicativo.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowCredentials</td>
            <td>Opcional</td>
            <td>Defaults to
                <code>false</code>. Specifies the
                <code>Allow-Credentials</code> header.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.ExposeHeaders</td>
            <td>Opcional</td>
            <td>Defaults to
                <code>null</code>. This property expects an array of strings. Specifies the
                <code>Expose-Headers</code> header.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowOrigin</td>
            <td>Opcional</td>
            <td>Defaults to
                <code>null</code>. This property expects a string. Specifies the
                <code>Allow-Origin</code> header.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowOrigins</td>
            <td>Opcional</td>
            <td>Defaults to
                <code>null</code>. This property expects an array of strings.
                Specifies multiple
                <code>Allow-Origin</code> headers. See <a href="/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins>AllowOrigins</a> for more information.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowMethods</td>
            <td>Opcional</td>
            <td>Defaults to
                <code>null</code>. This property expects an array of strings. Specifies the
                <code>Allow-Methods</code> header.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowHeaders</td>
            <td>Opcional</td>
            <td>Defaults to
                <code>null</code>. This property expects an array of strings. Specifies the
                <code>Allow-Headers</code> header.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.MaxAge</td>
            <td>Opcional</td>
            <td>Defaults to
                <code>null</code>. This property expects an integer. Specifies the
                <code>Max-Age</code> header in seconds.</td>
        </tr>
    </tbody>
</table>

You can see an example of how to use each property at the top of this page.




























































```cs
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
```
