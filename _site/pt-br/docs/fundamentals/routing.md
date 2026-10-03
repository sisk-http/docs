# Roteamento

Source: https://docs.sisk-framework.org/pt-br/docs/fundamentals/routing.html

O [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) é o primeiro passo na construção do servidor. Ele é responsável por armazenar objetos [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md), que são pontos de extremidade que mapeiam URLs e seus métodos para ações executadas pelo servidor. Cada ação é responsável por receber uma requisição e entregar uma resposta ao cliente.

As rotas são pares de expressões de caminho (“padrão de caminho”) e o método HTTP que elas podem escutar. Quando uma requisição é feita ao servidor, ele tentará encontrar uma rota que corresponda à requisição recebida, então chamará a ação dessa rota e entregará a resposta resultante ao cliente.

Existem várias maneiras de definir rotas no Sisk: elas podem ser estáticas, dinâmicas ou auto‑escanadas, definidas por atributos, ou diretamente no objeto Router.

```cs
Router mainRouter = new Router();

// mapeia a rota GET / para a ação a seguir
mainRouter.MapGet("/", request => {
    return new HttpResponse("Hello, world!");
});
```

Para entender o que uma rota pode fazer, precisamos entender o que uma requisição pode fazer. Um [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) conterá tudo o que você precisa. O Sisk também inclui alguns recursos extras que aceleram o desenvolvimento geral.

Para cada ação recebida pelo servidor, um delegate do tipo [RouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAction.md) será chamado. Esse delegate contém um parâmetro que contém um [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) com todas as informações necessárias sobre a requisição recebida pelo servidor. O objeto resultante desse delegate deve ser um [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) ou um objeto que mapeie para ele através de [tipos de resposta implícitos](https://docs.sisk-framework.org/pt-br/docs/fundamentals/responses.md#implicit-response-types).

## Correspondência de rotas

Quando uma requisição é recebida pelo servidor HTTP, o Sisk procura uma rota que satisfaça a expressão do caminho recebido pela requisição. A expressão é sempre testada entre a rota e o caminho da requisição, sem considerar a string de consulta.

Esse teste não tem prioridade e é exclusivo a uma única rota. Quando nenhuma rota corresponde àquela requisição, a resposta de [Router.NotFoundErrorHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.NotFoundErrorHandler.md) é retornada ao cliente. Quando o padrão de caminho corresponde, mas o método HTTP não, a resposta de [Router.MethodNotAllowedErrorHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MethodNotAllowedErrorHandler.md) é enviada de volta ao cliente.

O Sisk verifica a possibilidade de colisões de rotas para evitar esses problemas. Ao definir rotas, o Sisk procurará por rotas possíveis que possam colidir com a rota que está sendo definida. Esse teste inclui a verificação do caminho e do método que a rota está configurada para aceitar.

### Criando rotas usando padrões de caminho

Para novas aplicações, prefira os métodos `Map*`. Eles mantêm o método HTTP visível no ponto de chamada e correspondem à API atual do `Router`. Os métodos mais antigos `SetRoute` ainda existem como wrappers de compatibilidade, mas novos exemplos devem usar `Map`, `MapGet`, `MapPost`, `MapPut`, `MapDelete`, `MapPatch`, `MapAny`, `MapOptions` ou `MapHead`.

```cs
// Métodos Map* são a forma usual de definir rotas específicas por método.
mainRouter.MapGet("/hey/<name>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    return new HttpResponse($"Hello, {name}");
});

mainRouter.MapPost("/form", (request) =>
{
    var formData = request.GetFormContent();
    return new HttpResponse(); // 200 ok vazio
});

// Map também pode receber uma instância de Route quando você precisar de opções de rota.
mainRouter.Map(Route.Get("/image.png", (request) =>
{
    var imageStream = File.OpenRead("image.png");
    
    return new HttpResponse()
    {
        // o conteúdo interno StreamContent
        // o stream é descartado após o envio
        // da resposta.
        Content = new StreamContent(imageStream)
    };
}));

// múltiplos parâmetros
mainRouter.MapGet("/hey/<name>/surname/<surname>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    string surname = request.RouteParameters["surname"].GetString();

    return new HttpResponse($"Hello, {name} {surname}!");
});
```

A propriedade [RouteParameters](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RouteParameters.md) de HttpRequest contém todas as informações sobre as variáveis de caminho da requisição recebida.

Todo caminho recebido pelo servidor é normalizado antes da execução do teste de padrão de caminho, seguindo estas regras:

- Todos os segmentos vazios são removidos do caminho, por exemplo: `////foo//bar` torna‑se `/foo/bar`.
- A correspondência de caminho é **sensível a maiúsculas/minúsculas**, a menos que [Router.MatchRoutesIgnoreCase](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MatchRoutesIgnoreCase.md) esteja definido como `true`.

As propriedades [Query](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Query.md) e [RouteParameters](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RouteParameters.md) de [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) retornam um objeto [StringValueCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValueCollection.md), onde cada propriedade indexada retorna um [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) não nulo, que pode ser usado como uma opção/monad para converter seu valor bruto em um objeto gerenciado.

O exemplo abaixo lê o parâmetro de rota “id” e obtém um `Guid` a partir dele. Se o parâmetro não for um Guid válido, uma exceção é lançada, e um erro 500 é retornado ao cliente se o servidor não estiver tratando [Router.CallbackErrorHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.CallbackErrorHandler.md).

```cs
mainRouter.MapGet("/user/<id>", (request) =>
{
    Guid id = request.RouteParameters["id"].GetGuid();
    return new HttpResponse($"User id: {id}");
});
```

> [!NOTE]
> Os caminhos têm sua barra final `/` ignorada tanto na requisição quanto no caminho da rota, ou seja, se você tentar acessar uma rota definida como `/index/page` também poderá acessá‑la usando `/index/page/`.
>
> Você também pode forçar URLs a terminarem com `/` habilitando [HttpServerConfiguration.ForceTrailingSlash](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ForceTrailingSlash.md).

### Criando rotas usando instâncias de classe

Você também pode definir rotas dinamicamente usando reflexão com o atributo [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md). Dessa forma, a instância de uma classe cujos métodos implementam esse atributo terá suas rotas definidas no router de destino.

Para que um método seja definido como rota, ele deve ser marcado com um [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md), como o próprio atributo ou um [RouteGetAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteGetAttribute.md). O método pode ser estático, de instância, público ou privado. Use `MapInstance` quando quiser mapear métodos de rota de instância e estáticos a partir de um objeto. Use `MapType` quando quiser mapear apenas métodos de rota estáticos de um tipo.

```cs {title="Controller/MyController.cs"}
public class MyController
{
    // corresponderá ao GET /
    [RouteGet]
    HttpResponse Index(HttpRequest request)
    {
        HttpResponse res = new HttpResponse();
        res.Content = new StringContent("Index!");
        return res;
    }
    
    // métodos estáticos também funcionam
    [RouteGet("/hello")]
    static HttpResponse Hello(HttpRequest request)
    {
        HttpResponse res = new HttpResponse();
        res.Content = new StringContent("Hello world!");
        return res;
    }
}
```

A linha abaixo definirá tanto os métodos `Index` quanto `Hello` de `MyController` como rotas, já que ambos estão marcados como rotas, e uma instância da classe foi fornecida, não seu tipo. Se o tipo tivesse sido fornecido em vez de uma instância, apenas os métodos estáticos seriam definidos.

```cs
var myController = new MyController();
mainRouter.MapInstance(myController);
```

Para mapear apenas métodos de rota estáticos de um tipo, use:

```cs
mainRouter.MapType<MyController>();
```

Desde a versão 0.16 do Sisk, é possível habilitar AutoScan, que buscará classes definidas pelo usuário que implementem `RouterModule` e as associará automaticamente ao router. Isso não é suportado com compilação AOT.

```cs
mainRouter.AutoScanModules<ApiController>();
```

A instrução acima buscará todos os tipos que implementam `ApiController`, mas **não o próprio tipo**. Os dois parâmetros opcionais indicam como o método buscará esses tipos. O primeiro argumento implica o Assembly onde os tipos serão buscados e o segundo indica a forma como os tipos serão definidos.

## Rotas Regex

Em vez de usar os métodos padrão de correspondência de caminho HTTP, você pode marcar uma rota para ser interpretada com Regex.

```cs
Route indexRoute = new RegexRoute(RouteMethod.Get, @"\/[a-z]+\/", IndexPage);
mainRouter.Map(indexRoute);
```

Ou com a classe [RegexRoute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RegexRoute.md):

```cs
mainRouter.Map(new RegexRoute(RouteMethod.Get, @"\/[a-z]+\/", request =>
{
    return new HttpResponse("hello, world");
}));
```

Você também pode capturar grupos do padrão regex nos conteúdos de [HttpRequest.RouteParameters](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RouteParameters.md):

```cs {title="Controller/MyController.cs"}
public class MyController
{
    [RegexRoute(RouteMethod.Get, @"/uploads/(?<filename>.*\.(jpeg|jpg|png))")]
    static HttpResponse RegexRoute(HttpRequest request)
    {
        string filename = request.RouteParameters["filename"].GetString();
        return new HttpResponse().WithContent($"Acessing file {filename}");
    }
}
```

## Prefixando rotas

Você pode prefixar todas as rotas em uma classe ou módulo com o atributo [RoutePrefix](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RoutePrefixAttribute.md) e definir o prefixo como uma string.

Veja o exemplo abaixo usando a arquitetura BREAD (Browse, Read, Edit, Add and Delete):

```cs {title="Controller/Api/UsersController.cs"}
[RoutePrefix("/api/users")]
public class UsersController
{
    // GET /api/users
    [RouteGet]
    public async Task<HttpResponse> Browse()
    {
        ...
    }
    
    // GET /api/users/<id>
    [RouteGet("/<id>")]
    public async Task<HttpResponse> Read()
    {
        ...
    }
    
    // PATCH /api/users/<id>
    [RoutePatch("/<id>")]
    public async Task<HttpResponse> Edit()
    {
        ...
    }
    
    // POST /api/users
    [RoutePost]
    public async Task<HttpResponse> Add()
    {
        ...
    }
    
    // DELETE /api/users/<id>
    [RouteDelete("/<id>")]
    public async Task<HttpResponse> Delete()
    {
        ...
    }
}
```

No exemplo acima, o parâmetro HttpResponse é omitido em favor de ser usado através do contexto global [HttpContext.Current](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.Current.md). Leia mais na seção que se segue.

## Rotas sem parâmetro de requisição

Rotas podem ser definidas sem o parâmetro [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) e ainda assim ser possível obter a requisição e seus componentes no contexto da requisição. Vamos considerar uma abstração `ControllerBase` que serve como base para todos os controladores de uma API, e que fornece a propriedade `Request` para obter o [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) atual.

```cs {title="Controller/ControllerBase.cs"}
public abstract class ControllerBase
{
    // obtém a requisição da thread atual
    public HttpRequest Request { get => HttpContext.Current.Request; }
    
    // a linha abaixo, quando chamada, obtém o banco de dados da sessão HTTP atual,
    // ou cria um novo caso não exista
    public DbContext Database { get => HttpContext.Current.RequestBag.GetOrAdd<DbContext>(); }
}
```

E para que todos os seus descendentes possam usar a sintaxe de rota sem o parâmetro de requisição:

```cs {title="Controller/UsersController.cs"}
[RoutePrefix("/api/users")]
public class UsersController : ControllerBase
{    
    [RoutePost]
    public async Task<HttpResponse> Create()
    {
        // lê os dados JSON da requisição atual
        UserCreationDto? user = await Request.GetJsonContentAsync<UserCreationDto>();
        ...
        Database.Users.Add(user);
        
        return new HttpResponse(201);
    }
}
```

Mais detalhes sobre o contexto atual e injeção de dependência podem ser encontrados no tutorial de [injeção de dependência](https://docs.sisk-framework.org/pt-br/docs/features/instancing.md).

## Rotas de qualquer método

Você pode definir uma rota para ser correspondida apenas pelo seu caminho e ignorar o método HTTP. Isso pode ser útil para você fazer validação de método dentro do callback da rota.

```cs
// corresponderá a / em qualquer método HTTP
mainRouter.MapAny("/", callbackFunction);
```

## Rotas de qualquer caminho

Rotas de qualquer caminho testam qualquer caminho recebido pelo servidor HTTP, sujeito ao método da rota sendo testado. Se o método da rota for RouteMethod.Any e a rota usar [Route.AnyPath](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.AnyPath.md) em sua expressão de caminho, essa rota ouvirá todas as requisições do servidor HTTP, e nenhuma outra rota poderá ser definida.

```cs
// a rota a seguir corresponderá a todas as requisições POST
mainRouter.Map(RouteMethod.Post, Route.AnyPath, callbackFunction);
```

## Ignorar diferenciação de maiúsculas/minúsculas na correspondência de rotas

Por padrão, a interpretação de rotas com requisições diferencia maiúsculas de minúsculas. Para fazer com que ignore isso, habilite esta opção:

```cs
mainRouter.MatchRoutesIgnoreCase = true;
```

Isso também habilitará a opção `RegexOptions.IgnoreCase` para rotas onde a correspondência é feita por regex.

## Manipulador de callback “Not Found” (404)

Você pode criar um callback customizado para quando uma requisição não corresponder a nenhuma rota conhecida.

```cs
mainRouter.NotFoundErrorHandler = () =>
{
    return new HttpResponse(404)
    {
        // Desde v0.14
        Content = new HtmlContent("<h1>Not found</h1>")
        // versões anteriores
        Content = new StringContent("<h1>Not found</h1>", Encoding.UTF8, "text/html")
    };
};
```

## Manipulador de callback “Method Not Allowed” (405)

Você também pode criar um callback customizado para quando uma requisição corresponde ao caminho, mas não ao método.

```cs
mainRouter.MethodNotAllowedErrorHandler = (context) =>
{
    return new HttpResponse(405)
    {
        Content = new StringContent($"Method not allowed for this route.")
    };
};
```

## Tratamento de Erros

Exceções podem ser lançadas dentro do ciclo de vida de uma requisição, que vai desde o manipulador de requisição pré‑execução, passando pela ação do router, até os manipuladores de requisição pós‑execução e manipuladores de valor. Essas exceções são gerenciadas pelo mecanismo:

- Se [HttpServerConfiguration.ThrowExceptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions.md) for `true`, as exceções serão lançadas normalmente e não serão capturadas pelo Sisk, e o servidor HTTP pode ser interrompido se a exceção não for tratada.
- Se [HttpServerConfiguration.ThrowExceptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions.md) for `false`, as exceções serão capturadas e tratadas pelo Sisk. Depois disso, se `Router.CallbackErrorHandler` estiver definido, ele será chamado com a exceção capturada e o contexto da requisição, e **não** será encaminhado para a saída de erro padrão. Se `Router.CallbackErrorHandler` não estiver definido, a exceção será encaminhada para a saída de erro padrão, e o cliente receberá uma resposta HTTP 500. Se a saída de erro padrão não estiver definida, o erro será silenciosamente ignorado.

Nota: dentro de `Router.CallbackErrorHandler`, você pode definir o modo de log para erros, log de acesso, ambos ou nenhum, e alterar o comportamento padrão de escrita de logs:

```csharp
router.CallbackErrorHandler = (ex, ctx) =>
{
    ctx.LogMode = LogOutput.Both; // sobrescreve o modo de log para registrar o erro tanto no log de acesso quanto no de erro
}
```

## Manipulador interno de erro

Callbacks de rota podem lançar erros durante a execução do servidor. Se não forem tratados corretamente, o funcionamento geral do servidor HTTP pode ser interrompido. O router possui um callback para quando um callback de rota falha e impede a interrupção do serviço.

Esse método só está acessível quando [ThrowExceptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions.md) está definido como false.

```cs
mainRouter.CallbackErrorHandler = (ex, context) =>
{
    return new HttpResponse(500)
    {
        Content = new StringContent($"Error: {ex.Message}")
    };
};
```
