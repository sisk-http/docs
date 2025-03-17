# Tratamento de Requisições

Os tratadores de requisições, também conhecidos como "middlewares", são funções que são executadas antes ou após uma requisição ser executada no roteador. Eles podem ser definidos por rota ou por roteador.

Existem dois tipos de tratadores de requisições:

- **BeforeResponse**: define que o tratador de requisição será executado antes de chamar a ação do roteador.
- **AfterResponse**: define que o tratador de requisição será executado após chamar a ação do roteador. Enviar uma resposta HTTP neste contexto substituirá a resposta da ação do roteador.

Ambos os tratadores de requisições podem substituir a resposta da função de callback real do roteador. Além disso, os tratadores de requisições podem ser úteis para validar uma requisição, como autenticação, conteúdo ou qualquer outra informação, como armazenar informações, logs ou outras etapas que podem ser realizadas antes ou após uma resposta.

![](/assets/img/requesthandlers1.png)

Dessa forma, um tratador de requisição pode interromper toda a execução e retornar uma resposta antes de finalizar o ciclo, descartando tudo o mais no processo.

Exemplo: suponha que um tratador de requisição de autenticação de usuário não autentique o usuário. Isso impedirá que o ciclo de requisição continue e ficará pendente. Se isso acontecer no tratador de requisição na posição dois, o terceiro e subsequentes não serão avaliados.

![](/assets/img/requesthandlers2.png)

## Criando um Tratador de Requisição

Para criar um tratador de requisição, podemos criar uma classe que herda a interface [IRequestHandler](/api/Sisk.Core.Routing.IRequestHandler), no seguinte formato:

<div class="script-header">
    <span>
        Middleware/AuthenticateUserRequestHandler.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public class AuthenticateUserRequestHandler : IRequestHandler
{
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;

    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization != null)
        {
            // Retornar null indica que o ciclo de requisição pode continuar
            return null;
        }
        else
        {
            // Retornar um objeto HttpResponse indica que essa resposta substituirá as respostas adjacentes.
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}
```

No exemplo acima, indicamos que, se o cabeçalho `Authorization` estiver presente na requisição, deve continuar e a próxima requisição ou a ação do roteador deve ser chamada, dependendo do que vier a seguir. Se um tratador de requisição for executado após a resposta por meio de sua propriedade [ExecutionMode](/api/Sisk.Core.Routing.IRequestHandler.ExecutionMode) e retornar um valor não nulo, ele substituirá a resposta do roteador.

Sempre que um tratador de requisição retorna `null`, isso indica que a requisição deve continuar e o próximo objeto deve ser chamado ou o ciclo deve terminar com a resposta do roteador.

## Associando um Tratador de Requisição a uma Rota Única

Você pode definir um ou mais tratadores de requisição para uma rota.

<div class="script-header">
    <span>
        Router.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
mainRouter.SetRoute(RouteMethod.Get, "/", IndexPage, "", new IRequestHandler[]
{
    new AuthenticateUserRequestHandler(),     // antes do tratador de requisição
    new ValidateJsonContentRequestHandler(),  // antes do tratador de requisição
    //                                        -- método IndexPage será executado aqui
    new WriteToLogRequestHandler()            // após o tratador de requisição
});
```

Ou criando um objeto [Route](/api/Sisk.Core.Routing.Route):

<div class="script-header">
    <span>
        Router.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
Route indexRoute = new Route(RouteMethod.Get, "/", "", IndexPage, null);
indexRoute.RequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
mainRouter.SetRoute(indexRoute);
```

## Associando um Tratador de Requisição a um Roteador

Você pode definir um tratador de requisição global que será executado em todas as rotas de um roteador.

<div class="script-header">
    <span>
        Router.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
```

## Associando um Tratador de Requisição a um Atributo

Você pode definir um tratador de requisição em um atributo de método junto com um atributo de rota.

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public class MyController
{
    [RouteGet("/")]
    [RequestHandler<AuthenticateUserRequestHandler>]
    static HttpResponse Index(HttpRequest request)
    {
        return new HttpResponse() {
            Content = new StringContent("Hello world!")
        };
    }
}
```

Observe que é necessário passar o tipo de tratador de requisição desejado e não uma instância do objeto. Dessa forma, o tratador de requisição será instanciado pelo analisador do roteador. Você pode passar argumentos no construtor da classe com a propriedade [ConstructorArguments](/api/Sisk.Core.Routing.RequestHandlerAttribute.ConstructorArguments).

Exemplo:

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RequestHandler<AuthenticateUserRequestHandler>("arg1", 123, ...)]
public HttpResponse Index(HttpRequest request)
{
    return res = new HttpResponse() {
        Content = new StringContent("Hello world!")
    };
}
```

Você também pode criar seu próprio atributo que implementa RequestHandler:

<div class="script-header">
    <span>
        Middleware/Attributes/AuthenticateAttribute.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public class AuthenticateAttribute : RequestHandlerAttribute
{
    public AuthenticateAttribute() : base(typeof(AuthenticateUserRequestHandler), ConstructorArguments = new object?[] { "arg1", 123, ... })
    {
        ;
    }
}
```

E usá-lo como:

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[Authenticate]
static HttpResponse Index(HttpRequest request)
{
    return res = new HttpResponse() {
        Content = new StringContent("Hello world!")
    };
}
```

## Ignorando um Tratador de Requisição Global

Depois de definir um tratador de requisição global em uma rota, você pode ignorá-lo em rotas específicas.

<div class="script-header">
    <span>
        Router.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
var myRequestHandler = new AuthenticateUserRequestHandler();
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    myRequestHandler
};

mainRouter.SetRoute(new Route(RouteMethod.Get, "/", "My route", IndexPage, null)
{
    BypassGlobalRequestHandlers = new IRequestHandler[]
    {
        myRequestHandler,                    // ok: a mesma instância do que está nos tratadores de requisição globais
        new AuthenticateUserRequestHandler() // errado: não ignorará o tratador de requisição global
    }
});
```

> [!NOTE]
> Se você estiver ignorando um tratador de requisição, é necessário usar a mesma referência do que foi instanciada anteriormente para ignorar. Criar outra instância do tratador de requisição não ignorará o tratador de requisição global, pois sua referência será alterada. Lembre-se de usar a mesma referência do tratador de requisição usada em ambos GlobalRequestHandlers e BypassGlobalRequestHandlers.