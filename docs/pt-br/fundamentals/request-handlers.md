# Processamento de Requisições

Os manipuladores de requisições, também conhecidos como "middlewares", são funções que são executadas antes ou depois de uma requisição ser processada pelo roteador. Eles podem ser definidos por rota ou por roteador.

Existem dois tipos de manipuladores de requisições:

- **BeforeResponse**: define que o manipulador de requisição será executado antes de chamar a ação do roteador.
- **AfterResponse**: define que o manipulador de requisição será executado após chamar a ação do roteador. O envio de uma resposta HTTP neste contexto sobrescreverá a resposta da ação do roteador.

Ambos os manipuladores de requisições podem sobrescrever a resposta da função de callback do roteador. Aliás, manipuladores de requisições podem ser úteis para validar uma requisição, como autenticação, conteúdo ou qualquer outra informação, como armazenar informações, logs ou outras etapas que podem ser realizadas antes ou depois de uma resposta.

![](/assets/img/requesthandlers1.png)

Desta forma, um manipulador de requisição pode interromper toda essa execução e retornar uma resposta antes de terminar o ciclo, descartando tudo mais no processo.

Exemplo: suponha que um manipulador de requisição de autenticação de usuário não o autentique. Ele impedirá que o ciclo de vida da requisição seja continuado e ficará pendente. Se isso acontecer no manipulador de requisição na posição dois, o terceiro e os seguintes não serão avaliados.

![](/assets/img/requesthandlers2.png)

## Criando um manipulador de requisição

Para criar um manipulador de requisição, podemos criar uma classe que herda a interface [IRequestHandler](/api/Sisk.Core.Routing.IRequestHandler), no seguinte formato:

```cs
public class AuthenticateUserRequestHandler : IRequestHandler
{
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;

    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization != null)
        {
            // Retornando null indica que o ciclo de requisição pode ser continuado
            return null;
        }
        else
        {
            // Retornando um objeto HttpResponse indica que esta resposta sobrescreverá respostas adjacentes.
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}
```

No exemplo acima, indicamos que se o cabeçalho `Authorization` estiver presente na requisição, ele deve continuar e o próximo manipulador de requisição ou a callback do roteador deve ser chamada, seja qual for a próxima. Se um manipulador de requisição é executado após a resposta por sua propriedade [ExecutionMode](/api/Sisk.Core.Routing.IRequestHandler.ExecutionMode) e retornar um valor não nulo, ele sobrescreverá a resposta do roteador.

Sempre que um manipulador de requisição retorna `null`, indica que a requisição deve continuar e o próximo objeto deve ser chamado ou o ciclo deve terminar com a resposta do roteador.

## Associando um manipulador de requisição a uma única rota

Você pode definir um ou mais manipuladores de requisição para uma rota.

```cs
mainRouter.SetRoute(RouteMethod.Get, "/", IndexPage, "", new IRequestHandler[]
{
    new AuthenticateUserRequestHandler(),     // manipulador de requisição antes
    new ValidateJsonContentRequestHandler(),  // manipulador de requisição antes
    //                -- método IndexPage será executado aqui
    new WriteToLogRequestHandler()            // manipulador de requisição depois
});
```

Ou criando um objeto [Route](/api/Sisk.Core.Routing.Route):

```cs
Route indexRoute = new Route(RouteMethod.Get, "/", "", IndexPage, null);
indexRoute.RequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
mainRouter.SetRoute(indexRoute);
```

## Associando um manipulador de requisição a um roteador

Você pode definir um manipulador de requisição global que será executado em todas as rotas de um roteador.

```cs
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
```

## Associando um manipulador de requisição a um atributo

Você pode definir um manipulador de requisição em um atributo de método junto com um atributo de rota.

```cs
public class MyController
{
    [RouteGet("/")]
    [RequestHandler<AuthenticateUserRequestHandler>]
    static HttpResponse Index(HttpRequest request)
    {
        return new HttpResponse()
            .WithContent(new StringContent("Hello world!"));
    }
}
```

Observe que é necessário passar o tipo de manipulador de requisição desejado e não uma instância de objeto. Dessa forma, o manipulador de requisição será instanciado pelo parser do roteador. Você pode passar argumentos no construtor com a propriedade [ConstructorArguments](/api/Sisk.Core.Routing.RequestHandlerAttribute.ConstructorArguments).

Exemplo:

```cs
[RequestHandler<AuthenticateUserRequestHandler>("arg1", 123, ...)]
static HttpResponse Index(HttpRequest request)
{
    HttpResponse res = new HttpResponse();
    res.Content = new StringContent("Hello world!");
    return res;
}
```

Você também pode criar seu próprio atributo que implementa RequestHandler:

```cs
public class AuthenticateAttribute : RequestHandlerAttribute
{
    public AuthenticateAttribute() : base(typeof(AuthenticateUserRequestHandler), ConstructorArguments = new object?[] { "arg1", 123, ... })
    {
        ;
    }
}
```

E usá-lo como:

```cs
[Authenticate]
static HttpResponse Index(HttpRequest request)
{
    HttpResponse res = new HttpResponse();
    res.Content = new StringContent("Hello world!");
    return res;
}
```

## Ignorando um manipulador de requisição global

Depois de definir um manipulador de requisição global em uma rota, você pode ignorá-lo em rotas específicas.

```cs
var myRequestHandler = new AuthenticateUserRequestHandler();
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    myRequestHandler
};

mainRouter.SetRoute(new Route(RouteMethod.Get, "/", "My route", IndexPage, null)
{
    BypassGlobalRequestHandlers = new IRequestHandler[]
    {
        myRequestHandler,                    // ok: a mesma instância do que está nos manipuladores de requisição globais
        new AuthenticateUserRequestHandler() // errado: não ignorará o manipulador de requisição global
    }
});
```

> [!NOTE]
> Se você estiver ignorando um manipulador de requisição, deve usar a mesma referência do que você instanciou antes para ignorá-lo. Criar outra instância de manipulador de requisição não ignorará o manipulador de requisição global, pois a referência será alterada. Lembre-se de usar a mesma referência de manipulador de requisição usada tanto em GlobalRequestHandlers quanto em BypassGlobalRequestHandlers.