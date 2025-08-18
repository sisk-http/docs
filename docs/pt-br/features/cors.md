# Habilitando CORS (Compartilhamento de Recursos entre Origens) no Sisk

O Sisk possui uma ferramenta que pode ser útil para lidar com [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/pt-br/Web/HTTP/Guides/CORS) quando expõe seu serviço publicamente. Esse recurso não faz parte do protocolo HTTP, mas é uma funcionalidade específica dos navegadores definidos pelo W3C. Esse mecanismo de segurança impede que uma página web faça requisições para um domínio diferente daquele que forneceu a página. Um provedor de serviço pode permitir que certos domínios acessem seus recursos, ou apenas um.

## Mesma Origem

Para que um recurso seja identificado como “mesma origem”, uma requisição deve identificar o cabeçalho [Origin](https://developer.mozilla.org/en-US/docs/pt-br/Web/HTTP/Reference/Headers/Origin) em sua requisição:

```http
GET /api/users HTTP/1.1
Host: example.com
Origin: http://example.com
...
```

E o servidor remoto deve responder com um cabeçalho [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/pt-br/Web/HTTP/Headers/Access-Control-Allow-Origin) com o mesmo valor da origem solicitada:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
...
```

Essa verificação é **explícita**: host, porta e protocolo devem ser iguais ao solicitados. Veja o exemplo:

- Um servidor responde que seu `Access-Control-Allow-Origin` é `https://example.com`:
    - `https://example.net` – o domínio é diferente.
    - `http://example.com` – o esquema é diferente.
    - `http://example.com:5555` – a porta é diferente.
    - `https://www.example.com` – o host é diferente.

Na especificação, apenas a sintaxe é permitida para ambos os cabeçalhos, tanto para requisições quanto respostas. O caminho da URL é ignorado. A porta também é omitida se for uma porta padrão (80 para HTTP e 443 para HTTPS).

```http
Origin: null
Origin: <scheme>://<hostname>
Origin: <scheme>://<hostname>:<port>
```

## Habilitando CORS

Nativamente, você tem o objeto [CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders) dentro do seu [ListeningHost](/api/Sisk.Core.Http.ListeningHost).

Você pode configurar o CORS ao inicializar o servidor:

```csharp
static async Task Main(string[] args)
{
    using var app = HttpServer.CreateBuilder()
        .UseCors(new CrossOriginResourceSharingHeaders(
            allowOrigin: "http://example.com",
            allowHeaders: ["Authorization"],
            exposeHeaders: ["Content-Type"]))
        .Build();

    await app.StartAsync();
}
```

O código acima enviará os seguintes cabeçalhos para **todas as respostas**:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
Access-Control-Allow-Headers: Authorization
Access-Control-Expose-Headers: Content-Type
```

Esses cabeçalhos precisam ser enviados para todas as respostas a um cliente web, incluindo erros e redirecionamentos.

Você pode notar que a classe [CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders) possui duas propriedades semelhantes: [AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin) e [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins). Observe que uma é plural, enquanto a outra é singular.

- A propriedade **AllowOrigin** é estática: apenas a origem que você especificar será enviada para todas as respostas.
- A propriedade **AllowOrigins** é dinâmica: o servidor verifica se a origem da requisição está contida nesta lista. Se for encontrada, ela será enviada na resposta dessa origem.

### Wildcards e cabeçalhos automáticos

Alternativamente, você pode usar um curinga (`*`) na origem da resposta para indicar que qualquer origem pode acessar o recurso. No entanto, esse valor não é permitido para requisições que têm credenciais (cabeçalhos de autorização) e essa operação [resultará em um erro](https://developer.mozilla.org/en-US/docs/pt-br/Web/HTTP/Guides/CORS/Errors/CORSNotSupportingCredentials).

Você pode contornar esse problema listando explicitamente quais origens serão permitidas através da propriedade [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins) ou também usar a constante [AutoAllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoAllowOrigin) no valor de [AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin). Essa propriedade mágica definirá o cabeçalho `Access-Control-Allow-Origin` para o mesmo valor que o cabeçalho `Origin` da requisição.

Você também pode usar [AutoFromRequestMethod](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoFromRequestMethod) e [AutoFromRequestHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoFromRequestHeaders) para comportamento semelhante ao `AllowOrigin`, que responde automaticamente com base nos cabeçalhos enviados.

```csharp
using var host = HttpServer.CreateBuilder()
    .UseCors(new CrossOriginResourceSharingHeaders(
        
        // Responde com base no cabeçalho Origin da requisição
        allowOrigin: CrossOriginResourceSharingHeaders.AutoAllowOrigin,
        
        // Responde com base no cabeçalho Access-Control-Request-Method ou no método da requisição
        allowMethods: [CrossOriginResourceSharingHeaders.AutoFromRequestMethod],

        // Responde com base no cabeçalho Access-Control-Request-Headers ou nos cabeçalhos enviados
        allowHeaders: [CrossOriginResourceSharingHeaders.AutoFromRequestHeaders]))
```

## Outros Métodos de Aplicar CORS

Se você estiver lidando com [service providers](/docs/pt-br/extensions/service-providers), pode substituir valores definidos no arquivo de configuração:

```csharp
static async Task Main(string[] args)
{
    using var app = HttpServer.CreateBuilder()
        .UsePortableConfiguration(...)
        .UseCors(cors => {
            // Substituirá a origem definida na configuração
            // do arquivo.
            cors.AllowOrigin = "http://example.com";
        })
        .Build();

    await app.StartAsync();
}
```

## Desabilitando CORS em Rotas Específicas

A propriedade `UseCors` está disponível para todas as rotas e todos os atributos de rota e pode ser desativada com o exemplo abaixo:

```csharp
[RoutePrefix("api/widgets")]
public class WidgetController : Controller {

    // GET /api/widgets/colors
    [RouteGet("/colors", UseCors = false)]
    public IEnumerable<string> GetWidgets() {
        return new[] { "Green widget", "Red widget" };
    }
}
```

## Substituindo Valores na Resposta

Você pode substituir ou remover valores explicitamente em uma ação de roteador:

```csharp
[RoutePrefix("api/widgets")]
public class WidgetController : Controller {

    public IEnumerable<string> GetWidgets(HttpRequest request) {

        // Remove o cabeçalho Access-Control-Allow-Credentials
        request.Context.OverrideHeaders.AccessControlAllowCredentials = string.Empty;
        
        // Substitui o Access-Control-Allow-Origin
        request.Context.OverrideHeaders.AccessControlAllowOrigin = "https://contorso.com";

        return new[] { "Green widget", "Red widget" };
    }
}
```

## Requisições Preflight

Uma requisição preflight é uma requisição do método [OPTIONS](https://developer.mozilla.org/en-US/docs/pt-br/Web/HTTP/Reference/Methods/OPTIONS) que o cliente envia antes da requisição real.

O servidor Sisk sempre responderá à requisição com um `200 OK` e os cabeçalhos CORS aplicáveis, e então o cliente pode prosseguir com a requisição real. Essa condição só não é aplicada quando existe uma rota para a requisição com o [RouteMethod](/api/Sisk.Core.Routing.RouteMethod) explicitamente configurado para `Options`.

## Desabilitando CORS Globalmente

Não é possível fazer isso. Para não usar CORS, não o configure.