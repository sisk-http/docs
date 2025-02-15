# Roteamento

O [Router](/api/Sisk.Core.Routing.Router) é o primeiro passo na construção do servidor. Ele é responsável por armazenar objetos [Route](/api/Sisk.Core.Routing.Route), que são endpoints que mapeiam URLs e seus métodos para ações executadas pelo servidor. Cada ação é responsável por receber uma solicitação e entregar uma resposta ao cliente.

As rotas são pares de expressões de caminho ("padrão de caminho") e o método HTTP que elas podem ouvir. Quando uma solicitação é feita ao servidor, ele tentará encontrar uma rota que corresponda à solicitação recebida, então ele chamará a ação daquela rota e entregará a resposta resultante ao cliente.

Existem várias maneiras de definir rotas no Sisk: elas podem ser estáticas, dinâmicas ou auto-escaneadas, definidas por atributos ou diretamente no objeto Router.

```cs
Router mainRouter = new Router();

// mapeia a rota GET / para a ação a seguir
mainRouter.MapGet("/", request => {
    return new HttpResponse("Olá, mundo!");
});
```

Para entender o que uma rota é capaz de fazer, precisamos entender o que uma solicitação é capaz de fazer. Um [HttpRequest](/api/Sisk.Core.Http.HttpRequest) conterá tudo o que você precisa. O Sisk também inclui alguns recursos extras que aceleram o desenvolvimento geral.

Para cada ação recebida pelo servidor, um delegado do tipo [RouteAction](/api/Sisk.Core.Routing.RouteAction) será chamado. Esse delegado contém um parâmetro que segura um [HttpRequest](/api/Sisk.Core.Http.HttpRequest) com todas as informações necessárias sobre a solicitação recebida pelo servidor. O objeto resultante desse delegado deve ser um [HttpResponse](/api/Sisk.Core.Http.HttpResponse) ou um objeto que mapeia para ele por meio de [tipos de resposta implícitos](/docs/fundamentos/respostas#tipos-de-resposta-implícitos).

## Correspondência de rotas

Quando uma solicitação é recebida pelo servidor HTTP, o Sisk procura uma rota que satisfaça a expressão do caminho recebido pela solicitação. A expressão é sempre testada entre a rota e o caminho da solicitação, sem considerar a string de consulta.

Esse teste não tem prioridade e é exclusivo para uma única rota. Quando nenhuma rota é correspondida com aquela solicitação, a resposta [Router.NotFoundErrorHandler](/api/Sisk.Core.Routing.Router.NotFoundErrorHandler) é retornada ao cliente. Quando o padrão de caminho é correspondido, mas o método HTTP é incorreto, a resposta [Router.MethodNotAllowedErrorHandler](/api/Sisk.Core.Routing.Router.MethodNotAllowedErrorHandler) é enviada de volta ao cliente.

O Sisk verifica a possibilidade de colisões de rotas para evitar esses problemas. Quando as rotas são definidas, o Sisk procurará por rotas possíveis que possam colidir com a rota sendo definida. Esse teste inclui a verificação do caminho e do método que a rota está configurada para aceitar.

### Criando rotas usando padrões de caminho

Você pode definir rotas usando vários métodos `SetRoute`.

```cs
// maneira SetRoute
mainRouter.SetRoute(RouteMethod.Get, "/hey/<nome>", (request) =>
{
    string nome = request.RouteParameters["nome"].GetString();
    return new HttpResponse($"Olá, {nome}");
});

// maneira Map*
mainRouter.MapGet("/form", (request) =>
{
    var formData = request.GetFormData();
    return new HttpResponse(); // vazio 200 ok
});

// métodos de ajuda Route.*
mainRouter += Route.Get("/image.png", (request) =>
{
    var imageStream = File.OpenRead("image.png");
    
    return new HttpResponse()
    {
        // o StreamContent interno
        // stream é descartado após o envio
        // da resposta.
        Content = new StreamContent(imageStream)
    };
});

// vários parâmetros
mainRouter.MapGet("/hey/<nome>/sobrenome/<sobrenome>", (request) =>
{
    string nome = request.RouteParameters["nome"].GetString();
    string sobrenome = request.RouteParameters["sobrenome"].GetString();

    return new HttpResponse($"Olá, {nome} {sobrenome}!");
});
```

A propriedade [RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) do HttpResponse contém todas as informações sobre as variáveis de caminho da solicitação recebida.

Todo caminho recebido pelo servidor é normalizado antes do teste do padrão de caminho ser executado, seguindo essas regras:

- Todos os segmentos vazios são removidos do caminho, por exemplo: `////foo//bar` se torna `/foo/bar`.
- A correspondência de caminho é **sensível a maiúsculas e minúsculas**, a menos que [Router.MatchRoutesIgnoreCase](/api/Sisk.Core.Routing.Router.MatchRoutesIgnoreCase) seja definido como `true`.

As propriedades [Query](/api/Sisk.Core.Http.HttpRequest.Query) e [RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) do [HttpRequest](/api/Sisk.Core.Http.HttpRequest) retornam um objeto [StringValueCollection](/api/Sisk.Core.Entity.StringValueCollection), onde cada propriedade indexada retorna um [StringValue](/api/Sisk.Core.Entity.StringValue) não nulo, que pode ser usado como uma opção/monad para converter seu valor bruto em um objeto gerenciado.

O exemplo abaixo lê o parâmetro de rota "id" e obtém um `Guid` a partir dele. Se o parâmetro não for um Guid válido, uma exceção é lançada e um erro 500 é retornado ao cliente se o servidor não estiver lidando com [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler).

```cs
mainRouter.SetRoute(RouteMethod.Get, "/user/<id>", (request) =>
{
    Guid id = request.RouteParameters["id"].GetGuid();
});
```

> [!NOTA]
> Os caminhos têm sua barra final `/` ignorada em ambos os caminhos da solicitação e da rota, ou seja, se você tentar acessar uma rota definida como `/index/page` você poderá acessá-la usando `/index/page/` também.
>
> Você também pode forçar as URLs a terminar com `/` habilitando a flag [ForceTrailingSlash](/api/Sisk.Core.Http.HttpServerFlags.ForceTrailingSlash).

### Criando rotas usando instâncias de classe

Você também pode definir rotas dinamicamente usando reflexão com o atributo [RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute). Dessa forma, a instância de uma classe na qual seus métodos implementam esse atributo terá suas rotas definidas no roteador de destino.

Para que um método seja definido como uma rota, ele deve ser marcado com um [RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute), como o próprio atributo ou um [RouteGetAttribute](/api/Sisk.Core.Routing.RouteGetAttribute). O método pode ser estático, de instância, público ou privado. Quando o método `SetObject(type)` ou `SetObject<TType>()` é usado, os métodos de instância são ignorados.

```cs
public class MeuControlador
{
    // corresponderá a GET /
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
        res.Content = new StringContent("Olá, mundo!");
        return res;
    }
}
```

A linha abaixo definirá tanto o método `Index` quanto o método `Hello` da classe `MeuControlador` como rotas, pois ambos são marcados como rotas e uma instância da classe foi fornecida, não seu tipo. Se seu tipo tivesse sido fornecido em vez de uma instância, apenas os métodos estáticos seriam definidos.

```cs
var meuControlador = new MeuControlador();
mainRouter.SetObject(meuControlador);
```

Desde a versão 0.16 do Sisk, é possível habilitar o AutoScan, que procurará por classes definidas pelo usuário que implementam `RouterModule` e as associará automaticamente ao roteador. Isso não é suportado com compilação AOT.

```cs
mainRouter.AutoScanModules<ApiController>();
```

A instrução acima procurará por todos os tipos que implementam `ApiController`, mas não o tipo em si. Os dois parâmetros opcionais indicam como o método procurará por esses tipos. O primeiro argumento implica a Assembly onde os tipos serão procurados e o segundo indica a forma como os tipos serão definidos.

## Rotas de regex

Em vez de usar os métodos de correspondência de caminho HTTP padrão, você pode marcar uma rota para ser interpretada com Regex.

```cs
Route indexRoute = new Route(RouteMethod.Get, @"\/[a-z]+\/", "Minha rota", IndexPage, null);
indexRoute.UseRegex = true;
mainRouter.SetRoute(indexRoute);
```

Ou com a classe [RegexRoute](/api/Sisk.Core.Routing.RegexRoute):

```cs
RegexRoute indexRoute = new RegexRoute(RouteMethod.Get, @"\/[a-z]+\/", request =>
{
    return new HttpResponse("olá, mundo");
});
mainRouter.SetRoute(indexRoute);
```

Você também pode capturar grupos da expressão regular no padrão para o conteúdo de [HttpRequest.RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters):

```cs
[RegexRoute(RouteMethod.Get, @"/uploads/(?<filename>.*\.(jpeg|jpg|png))")]
static HttpResponse RegexRoute(HttpRequest request)
{
    string filename = request.RouteParameters["filename"].GetString();
    return new HttpResponse().WithContent($"Acessando arquivo {filename}");
}
```

## Rotas de qualquer método

Você pode definir uma rota para ser correspondida apenas pelo seu caminho e ignorar o método HTTP. Isso pode ser útil para você fazer a validação do método dentro da callback da rota.

```cs
// corresponderá a / em qualquer método HTTP
mainRouter.SetRoute(RouteMethod.Any, "/", callbackFunction);
```

## Rotas de qualquer caminho

As rotas de qualquer caminho testam qualquer caminho recebido pelo servidor HTTP, sujeito ao método da rota sendo testado. Se o método da rota for RouteMethod.Any e a rota usar [Route.AnyPath](/api/Sisk.Core.Routing.Route.AnyPath) em sua expressão de caminho, essa rota ouvirá todas as solicitações do servidor HTTP e nenhuma outra rota poderá ser definida.

```cs
// a seguinte rota corresponderá a todas as solicitações POST
mainRouter.SetRoute(RouteMethod.Post, Route.AnyPath, callbackFunction);
```

## Ignorar caso na correspondência de rotas

Por padrão, a interpretação de rotas com solicitações é sensível a maiúsculas e minúsculas. Para fazer com que ela ignore o caso, habilite essa opção:

```cs
mainRouter.MatchRoutesIgnoreCase = true;
```

Isso também habilitará a opção `RegexOptions.IgnoreCase` para rotas onde é feita a correspondência com regex.

## Manipulador de callback não encontrado (404)

Você pode criar um callback personalizado para quando uma solicitação não corresponde a nenhuma rota conhecida.

```cs
mainRouter.NotFoundErrorHandler = () =>
{
    return new HttpResponse(404)
    {
        // Desde a v0.14
        Content = new HtmlContent("<h1>Não encontrado</h1>")
        // versões anteriores
        Content = new StringContent("<h1>Não encontrado</h1>", Encoding.UTF8, "text/html")
    };
};
```

## Manipulador de callback de método não permitido (405)

Você também pode criar um callback personalizado para quando uma solicitação corresponde ao seu caminho, mas não corresponde ao método.

```cs
mainRouter.MethodNotAllowedErrorHandler = (context) =>
{
    return new HttpResponse(405)
    {
        Content = new StringContent($"Método não permitido para essa rota.")
    };
};
```

## Manipulador de erro interno

Os callbacks de rota podem lançar erros durante a execução do servidor. Se não forem tratados corretamente, o funcionamento geral do servidor HTTP pode ser interrompido. O roteador tem um callback para quando um callback de rota falha e impede a interrupção do serviço.

Esse método só é alcançável quando [ThrowExceptions](/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions) é definido como `false`.

```cs
mainRouter.CallbackErrorHandler = (ex, context) =>
{
    return new HttpResponse(500)
    {
        Content = new StringContent($"Erro: {ex.Message}")
    };
};
```