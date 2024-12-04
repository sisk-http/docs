# Roteamento

O [Roteador](/api/Sisk.Core.Routing.Router) é o primeiro passo na construção do servidor. Ele é responsável por abrigar objetos [Rota](/api/Sisk.Core.Routing.Route), que são pontos de extremidade que mapeiam URLs e seus métodos para ações executadas pelo servidor. Cada ação é responsável por receber uma solicitação e entregar uma resposta ao cliente.

As rotas são pares de expressões de caminho ("padrão de caminho") e o método HTTP que elas podem escutar. Quando uma solicitação é feita ao servidor, ele tentará encontrar uma rota que corresponda à solicitação recebida, em seguida, chamará a ação dessa rota e entregará a resposta resultante ao cliente.

Existem várias maneiras de definir rotas no Sisk: elas podem ser estáticas, dinâmicas ou auto-procuradas, definidas por atributos ou diretamente no objeto Roteador.

```cs
Router roteadorPrincipal = new Router();

// mapeia o GET / para a seguinte ação
roteadorPrincipal.MapGet("/", request => {
    return new HttpResponse("Olá, mundo!");
});
```

Para entender o que uma rota é capaz de fazer, precisamos entender o que uma solicitação é capaz de fazer. Um [HttpRequest](/api/Sisk.Core.Http.HttpRequest) conterá tudo o que você precisa. O Sisk também inclui alguns recursos extras que aceleram o desenvolvimento geral.

Para cada ação recebida pelo servidor, um delegado do tipo [RouteAction](/api/Sisk.Core.Routing.RouteAction) será chamado. Este delegado contém um parâmetro que contém um [HttpRequest](/api/Sisk.Core.Http.HttpRequest) com todas as informações necessárias sobre a solicitação recebida pelo servidor. O objeto resultante deste delegado deve ser um [HttpResponse](/api/Sisk.Core.Http.HttpResponse) ou um objeto que mapeia para ele através de [tipos de resposta implícitos](/docs/fundamentals/responses#tipos-de-resposta-implícitos).

## Correspondência de rotas

Quando uma solicitação é recebida pelo servidor HTTP, o Sisk procura uma rota que satisfaça a expressão do caminho recebida na solicitação. A expressão é sempre testada entre a rota e o caminho da solicitação, sem considerar a string de consulta.

Este teste não tem prioridade e é exclusivo para uma única rota. Quando nenhuma rota é correspondida àquela solicitação, a resposta [Router.NotFoundErrorHandler](/api/Sisk.Core.Routing.Router.NotFoundErrorHandler) é retornada ao cliente. Quando o padrão de caminho é correspondido, mas o método HTTP não corresponde, a resposta [Router.MethodNotAllowedErrorHandler](/api/Sisk.Core.Routing.Router.MethodNotAllowedErrorHandler) é enviada de volta ao cliente.

O Sisk verifica a possibilidade de colisões de rotas para evitar esses problemas. Ao definir rotas, o Sisk procurará por possíveis rotas que possam colidir com a rota sendo definida. Este teste inclui verificar o caminho e o método que a rota está definida para aceitar.

### Criando rotas usando padrões de caminho

Você pode definir rotas usando vários métodos `SetRoute`.

```cs
// SetRoute way
roteadorPrincipal.SetRoute(RouteMethod.Get, "/hey/<name>", (request) =>
{
    string nome = request.RouteParameters["name"].GetString();
    return new HttpResponse($"Olá, {nome}");
});

// Map* way
roteadorPrincipal.MapGet("/form", (request) =>
{
    var formData = request.GetFormData();
    return new HttpResponse(); // empty 200 ok
});

// Route.* helper methods
roteadorPrincipal += Route.Get("/image.png", (request) =>
{
    var imageStream = File.OpenRead("image.png");

    return new HttpResponse()
    {
        // o StreamContent inner
        // stream é descartado após o envio
        // da resposta.
        Content = new StreamContent(imageStream)
    };
});

// múltiplos parâmetros
roteadorPrincipal.MapGet("/hey/<name>/surname/<surname>", (request) =>
{
    string nome = request.RouteParameters["name"].GetString();
    string sobrenome = request.RouteParameters["surname"].GetString();

    return new HttpResponse($"Olá, {nome} {sobrenome}!");
});
```

A propriedade [RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) do HttpResponse contém todas as informações sobre as variáveis de caminho da solicitação recebida.

Cada caminho recebido pelo servidor é normalizado antes de ser executado o teste do padrão de caminho, seguindo estas regras:

- Todos os segmentos vazios são removidos do caminho, por exemplo: `////foo//bar` se torna `/foo/bar`.
- A correspondência de caminho é **sensível a maiúsculas e minúsculas**, a menos que [Router.MatchRoutesIgnoreCase](/api/Sisk.Core.Routing.Router.MatchRoutesIgnoreCase) seja definido como `true`.

As propriedades [Query](/api/Sisk.Core.Http.HttpRequest.Query) e [RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) do [HttpRequest](/api/Sisk.Core.Http.HttpRequest) retornam um objeto [StringValueCollection](/api/Sisk.Core.Entity.StringValueCollection), onde cada propriedade indexada retorna um [StringValue](/api/Sisk.Core.Entity.StringValue) não nulo, que pode ser usado como uma opção/monada para converter seu valor bruto em um objeto gerenciado.

O exemplo abaixo lê o parâmetro de rota "id" e obtém um `Guid` a partir dele. Se o parâmetro não for um `Guid` válido, uma exceção é lançada e um erro 500 é retornado ao cliente se o servidor não estiver lidando com [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler).

```cs
roteadorPrincipal.SetRoute(RouteMethod.Get, "/user/<id>", (request) =>
{
    Guid id = request.RouteParameters["id"].GetGuid();
});
```

> [!NOTA]
> Caminhos têm seu `/` final ignorado tanto na solicitação quanto no caminho da rota, ou seja, se você tentar acessar uma rota definida como `/index/page`, poderá acessá-la usando `/index/page/` também.
>
> Você também pode forçar URLs a terminarem com `/` habilitando a bandeira [ForceTrailingSlash](/api/Sisk.Core.Http.HttpServerFlags.ForceTrailingSlash).

### Criando rotas usando instâncias de classe

Você também pode definir rotas dinamicamente usando reflexão com o atributo [RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute). Dessa forma, a instância de uma classe em que seus métodos implementam este atributo terá suas rotas definidas no roteador alvo.

Para que um método seja definido como uma rota, ele deve ser marcado com um [RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute), como o próprio atributo ou um [RouteGetAttribute](/api/Sisk.Core.Routing.RouteGetAttribute). O método pode ser estático, instância, público ou privado. Quando o método `SetObject(type)` ou `SetObject<TType>()` é usado, métodos de instância são ignorados.

```cs
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

A linha abaixo definirá tanto o método `Index` quanto o método `Hello` da classe `MyController` como rotas, pois ambos são marcados como rotas e uma instância da classe foi fornecida, não o tipo da classe. Se o tipo da classe tivesse sido fornecido em vez de uma instância, apenas os métodos estáticos seriam definidos.

```cs
var controladorMeu = new MyController();
mainRouter.SetObject(controladorMeu);
```

Desde a versão 0.16 do Sisk, é possível habilitar AutoScan, que procurará por tipos definidos pelo usuário que implementam `RouterModule` e associará automaticamente o tipo ao roteador. Isso não é suportado com compilação AOT.

```cs
mainRouter.AutoScanModules<ApiController>();
```

O exemplo acima irá procurar por todos os tipos que implementam `ApiController` mas não o tipo em si. Os dois parâmetros opcionais indicam como o método irá procurar por esses tipos. O primeiro argumento implica o Assembly onde os tipos serão pesquisados e o segundo indica a forma como os tipos serão definidos.



## Rotas Regex

Em vez de usar os métodos padrão de correspondência de caminho HTTP, você pode marcar uma rota para ser interpretada com Regex.

```cs
Route routeIndex = new Route(RouteMethod.Get, @"\/[a-z]+/", "My route", IndexPage, null);
routeIndex.UseRegex = true;
mainRouter.SetRoute(routeIndex);
```

Ou com a classe [RegexRoute](/api/Sisk.Core.Routing.RegexRoute)

```cs
RegexRoute routeIndex = new RegexRoute(RouteMethod.Get, @"/uploads/(?<filename>.*\.(jpeg|jpg|png)", request =>
{
    string filename = request.Query["filename"].GetString();
    return new HttpResponse($"Acessing file {filename}");
});
mainRouter.SetRoute(routeIndex);
```

You can also capture groups from the regex pattern into the [Request.Query](/api/Sisk.Core.Http.HttpRequest.Query) contents:

## Rotas de qualquer método

Você pode definir uma rota para ser correspondente apenas pelo caminho e ignorar o método HTTP. Isso pode ser útil para você fazer a validação de método dentro do callback da rota.

```cs
// will match / on any HTTP method
mainRouter.SetRoute(RouteMethod.Any, "/", callbackFunction);
```

## Rotas de qualquer caminho

Rotas de qualquer caminho testam para qualquer caminho recebido pelo servidor HTTP. Se o método da rota for RouteMethod.Any e a rota usar [Route.AnyPath](/api/Sisk.Core.Routing.Route.AnyPath) em sua expressão de caminho, essa rota corresponderá a todas as solicitações do servidor HTTP, e nenhuma outra rota pode ser definida.

```cs
// the following route will match all POST requests
mainRouter.SetRoute(RouteMethod.Post, Route.AnyPath, callbackFunction);
```

## Ignorar o caso da correspondência de rota

Por padrão, a interpretação de rotas com solicitações são sensíveis a maiúsculas e minúsculas. Para fazer a correspondência ignorar o caso, habilite essa opção.

```cs
mainRouter.MatchRoutesIgnoreCase = true;
```

This will also enable the option `RegexOptions.IgnoreCase` for routes where it's regex-matching.

## Handler de erro interno

Callbacks de rota podem lançar erros durante a execução do servidor. Se não forem tratados corretamente, o funcionamento geral do servidor HTTP pode ser interrompido. O roteador tem um callback para quando um callback de rota falha e previne a interrupção do serviço.

Este método é apenas acessível quando [ThrowExceptions](/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions) é definido como false.

```cs
mainRouter.CallbackErrorHandler = (ex, context =>
{
    return new HttpResponse(500)
    return new HttpResponse(500)
```
