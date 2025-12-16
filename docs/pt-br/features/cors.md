# Habilitando CORS (Compartilhamento de Recursos de Origem Cruzada) no Sisk

Sisk tem uma ferramenta que pode ser útil para lidar com [Compartilhamento de Recursos de Origem Cruzada (CORS)](https://developer.mozilla.org/pt-BR/docs/pt-br/Web/HTTP/Guides/CORS) ao expor seu serviço publicamente. Essa funcionalidade não faz parte do protocolo HTTP, mas é uma característica específica dos navegadores da web definida pela W3C. Esse mecanismo de segurança impede que uma página da web faça solicitações para um domínio diferente daquele que forneceu a página da web. Um provedor de serviços pode permitir que certos domínios acessem seus recursos ou apenas um.

## Mesma Origem

Para que um recurso seja identificado como "mesma origem", uma solicitação deve identificar o cabeçalho [Origem](https://developer.mozilla.org/pt-BR/docs/pt-br/Web/HTTP/Reference/Headers/Origin) em sua solicitação:

```http
GET /api/usuarios HTTP/1.1
Host: example.com
Origem: http://example.com
...
```

E o servidor remoto deve responder com um cabeçalho [Access-Control-Allow-Origin](https://developer.mozilla.org/pt-BR/docs/pt-br/Web/HTTP/Headers/Access-Control-Allow-Origin) com o mesmo valor que a origem solicitada:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
...
```

Essa verificação é **explícita**: o host, porta e protocolo devem ser os mesmos solicitados. Verifique o exemplo:

- Um servidor responde que seu `Access-Control-Allow-Origin` é `https://example.com`:
    - `https://example.net` - o domínio é diferente.
    - `http://example.com` - o esquema é diferente.
    - `http://example.com:5555` - a porta é diferente.
    - `https://www.example.com` - o host é diferente.

Na especificação, apenas a sintaxe é permitida para ambos os cabeçalhos, seja para solicitações e respostas. O caminho da URL é ignorado. A porta também é omitida se for uma porta padrão (80 para HTTP e 443 para HTTPS).

```http
Origem: null
Origem: <esquema>://<nome_do_host>
Origem: <esquema>://<nome_do_host>:<porta>
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

Esses cabeçalhos precisam ser enviados para todas as respostas para um cliente da web, incluindo erros e redirecionamentos.

Você pode notar que a classe [CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders) tem duas propriedades semelhantes: [AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin) e [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins). Observe que uma é plural, enquanto a outra é singular.

- A propriedade **AllowOrigin** é estática: apenas a origem que você especificar será enviada para todas as respostas.
- A propriedade **AllowOrigins** é dinâmica: o servidor verifica se a origem da solicitação está contida nessa lista. Se for encontrada, ela é enviada para a resposta daquela origem.

### Caracteres Coringa e Cabeçalhos Automáticos

Alternativamente, você pode usar um caractere coringa (`*`) na origem da resposta para especificar que qualquer origem é permitida acessar o recurso. No entanto, esse valor não é permitido para solicitações que têm credenciais (cabeçalhos de autorização) e essa operação [resultará em um erro](https://developer.mozilla.org/pt-BR/docs/pt-br/Web/HTTP/Guides/CORS/Errors/CORSNotSupportingCredentials).

Você pode contornar esse problema listando explicitamente quais origens serão permitidas por meio da propriedade [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins) ou também usar a constante [AutoAllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoAllowOrigin) no valor de [AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin). Essa propriedade mágica definirá o cabeçalho `Access-Control-Allow-Origin` para o mesmo valor que o cabeçalho `Origin` da solicitação.

Você também pode usar [AutoFromRequestMethod](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoFromRequestMethod) e [AutoFromRequestHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoFromRequestHeaders) para um comportamento semelhante ao `AllowOrigin`, que responde automaticamente com base nos cabeçalhos enviados.

```csharp
using var host = HttpServer.CreateBuilder()
    .UseCors(new CrossOriginResourceSharingHeaders(
        
        // Responde com base no cabeçalho Origin da solicitação
        allowOrigin: CrossOriginResourceSharingHeaders.AutoAllowOrigin,
        
        // Responde com base no cabeçalho Access-Control-Request-Method ou no método da solicitação
        allowMethods: [CrossOriginResourceSharingHeaders.AutoFromRequestMethod],

        // Responde com base no cabeçalho Access-Control-Request-Headers ou nos cabeçalhos enviados
        allowHeaders: [CrossOriginResourceSharingHeaders.AutoFromRequestHeaders],

        exposeHeaders: [HttpKnownHeaderNames.ContentType, "X-Authenticated-Account-Id"],
        allowCredentials: true))
    .Build();
```

## Outras Maneiras de Aplicar CORS

Se você estiver lidando com [provedores de serviços](/docs/pt-br/extensions/service-providers), você pode substituir valores definidos no arquivo de configuração:

```csharp
static async Task Main(string[] args)
{
    using var app = HttpServer.CreateBuilder()
        .UsePortableConfiguration(...)
        .UseCors(cors => {
            // Substituirá a origem definida no arquivo de configuração.
            cors.AllowOrigin = "http://example.com";
        })
        .Build();

    await app.StartAsync();
}
```

## Desabilitando CORS em Rotas Específicas

A propriedade `UseCors` está disponível para rotas e todos os atributos de rota e pode ser desabilitada com o seguinte exemplo:

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

Você pode substituir ou remover valores explicitamente em uma ação de roteamento:

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

## Solicitações de Pré-voo

Uma solicitação de pré-voo é um método [OPTIONS](https://developer.mozilla.org/pt-BR/docs/pt-br/Web/HTTP/Reference/Methods/OPTIONS) que o cliente envia antes da solicitação real.

O servidor Sisk sempre responderá à solicitação com um `200 OK` e os cabeçalhos CORS aplicáveis, e então o cliente pode prosseguir com a solicitação real. Essa condição só não se aplica quando uma rota existe para a solicitação com o [RouteMethod](/api/Sisk.Core.Routing.RouteMethod) explicitamente configurado para `Options`.

## Desabilitando CORS Globalmente

Isso não é possível. Para não usar CORS, não configure-o.