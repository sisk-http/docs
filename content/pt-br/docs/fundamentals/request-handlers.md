---
title: "Manipulação de requisições"
linkTitle: "Manipuladores de requisição"
weight: 20
aliases:
  - "/docs/pt-br/fundamentals/request-handlers.html"
sourceHash: "77d35afbd210c7a6"
---

Manipuladores de requisição, também conhecidos como "middlewares", são funções que são executadas antes ou depois que uma requisição é processada no roteador. Eles podem ser definidos por rota ou por roteador.

Existem dois tipos de manipuladores de requisição:

- **BeforeResponse**: define que o manipulador de requisição será executado antes de chamar a ação do roteador.
- **AfterResponse**: define que o manipulador de requisição será executado após chamar a ação do roteador. Enviar uma resposta HTTP neste contexto sobrescreverá a resposta da ação do roteador.

Ambos os manipuladores de requisição podem sobrescrever a resposta da função de callback real do roteador. Além disso, manipuladores de requisição podem ser úteis para validar uma requisição, como autenticação, conteúdo ou qualquer outra informação, como armazenar dados, logs ou outras etapas que podem ser realizadas antes ou depois de uma resposta.

![](/assets/img/requesthandlers1.png)

Dessa forma, um manipulador de requisição pode interromper toda essa execução e retornar uma resposta antes de concluir o ciclo, descartando todo o resto no processo.

Exemplo: suponha que um manipulador de requisição de autenticação de usuário não o autentique. Ele impedirá que o ciclo de requisição continue e ficará pendente. Se isso acontecer no manipulador de requisição na posição dois, o terceiro e os subsequentes não serão avaliados.

![](/assets/img/requesthandlers2.png)

## Criando um manipulador de requisição

Para criar um manipulador de requisição, podemos criar uma classe que herda a interface [IRequestHandler](/api/Sisk.Core.Routing.IRequestHandler), no seguinte formato:

```cs {title="Middleware/AuthenticateUserRequestHandler.cs"}
public class AuthenticateUserRequestHandler : IRequestHandler
{
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;

    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization != null)
        {
            // Retornar null indica que o ciclo da requisição pode continuar
            return null;
        }
        else
        {
            // Retornar um objeto HttpResponse indica que esta resposta sobrescreverá respostas adjacentes.
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}
```

No exemplo acima, indicamos que se o cabeçalho `Authorization` estiver presente na requisição, ela deve continuar e o próximo manipulador de requisição ou o callback do roteador deve ser chamado, seja qual for o próximo. Se um manipulador de requisição for executado após a resposta por sua propriedade [ExecutionMode](/api/Sisk.Core.Routing.IRequestHandler.ExecutionMode) e retornar um valor não nulo, ele sobrescreverá a resposta do roteador.

Sempre que um manipulador de requisição retorna `null`, isso indica que a requisição deve continuar e o próximo objeto deve ser chamado ou o ciclo deve terminar com a resposta do roteador.

Se você herdar da classe incorporada [RequestHandler](/api/Sisk.Core.Routing.RequestHandler), pode retornar `Next()` para tornar essa intenção explícita:

```cs
public class AuthenticateUserRequestHandler : RequestHandler
{
    public override HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization is not null)
            return Next();

        return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
    }
}
```

Para manipuladores que precisam de I/O, herde de [AsyncRequestHandler](/api/Sisk.Core.Routing.AsyncRequestHandler):

```cs
public class LoadUserRequestHandler : AsyncRequestHandler
{
    public override async Task<HttpResponse?> ExecuteAsync(HttpRequest request, HttpContext context)
    {
        var user = await UserRepository.FindAsync(request.Headers.Authorization, request.DisconnectToken);
        if (user is null)
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);

        request.Bag.Set(user);
        return Next();
    }
}
```

Pequenos manipuladores inline também podem ser criados com `RequestHandler.Create` ou `AsyncRequestHandler.Create`:

```cs
var requireJson = RequestHandler.Create((request, context) =>
{
    if (request.Headers.ContentType?.Contains("application/json") == true)
        return null;

    return new HttpResponse(System.Net.HttpStatusCode.UnsupportedMediaType);
});
```

## Associando um manipulador de requisição a uma única rota

Você pode definir um ou mais manipuladores de requisição para uma rota.

```cs {title="Router.cs"}
mainRouter.Map(RouteMethod.Get, "/", IndexPage, new IRequestHandler[]
{
    new AuthenticateUserRequestHandler(),     // before request handler
    new ValidateJsonContentRequestHandler(),  // before request handler
    //                                        -- method IndexPage will be executed here
    new WriteToLogRequestHandler()            // after request handler
});
```

Ou criando um objeto [Route](/api/Sisk.Core.Routing.Route):

```cs {title="Router.cs"}
Route indexRoute = Route.Get("/", IndexPage);
indexRoute.RequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
mainRouter.Map(indexRoute);
```

## Associando um manipulador de requisição a um roteador

Você pode definir um manipulador de requisição global que será executado em todas as rotas de um roteador.

```cs {title="Router.cs"}
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
```

## Associando um manipulador de requisição a um atributo

Você pode definir um manipulador de requisição em um atributo de método junto com um atributo de rota.

```cs {title="Controller/MyController.cs"}
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

Observe que é necessário passar o tipo desejado do manipulador de requisição e não uma instância de objeto. Dessa forma, o manipulador de requisição será instanciado pelo analisador do roteador. Você pode passar argumentos no construtor da classe com a propriedade [ConstructorArguments](/api/Sisk.Core.Routing.RequestHandlerAttribute.ConstructorArguments).

Exemplo:

```cs {title="Controller/MyController.cs"}
[RequestHandler<AuthenticateUserRequestHandler>("arg1", 123, ...)]
public HttpResponse Index(HttpRequest request)
{
    return res = new HttpResponse() {
        Content = new StringContent("Hello world!")
    };
}
```

Você também pode criar seu próprio atributo que implementa RequestHandler:

```cs {title="Middleware/Attributes/AuthenticateAttribute.cs"}
public class AuthenticateAttribute : RequestHandlerAttribute
{
    public AuthenticateAttribute() : base(typeof(AuthenticateUserRequestHandler), ConstructorArguments = new object?[] { "arg1", 123, ... })
    {
        ;
    }
}
```

E usá-lo assim:

```cs {title="Controller/MyController.cs"}
[Authenticate]
static HttpResponse Index(HttpRequest request)
{
    return res = new HttpResponse() {
        Content = new StringContent("Hello world!")
    };
}
```

## Ignorando um manipulador de requisição global

Depois de definir um manipulador de requisição global em uma rota, você pode ignorar esse manipulador de requisição em rotas específicas.

```cs {title="Router.cs"}
var myRequestHandler = new AuthenticateUserRequestHandler();
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    myRequestHandler
};

Route publicRoute = Route.Get("/", IndexPage);
publicRoute.Name = "My route";
publicRoute.BypassGlobalRequestHandlers = new IRequestHandler[]
{
    myRequestHandler,                    // ok: the same instance of what is in the global request handlers
    new AuthenticateUserRequestHandler() // wrong: will not skip the global request handler
};

mainRouter.Map(publicRoute);
```

> [!NOTE]
> Se você estiver ignorando um manipulador de requisição, deve usar a mesma referência da instância criada anteriormente para pular. Criar outra instância de manipulador de requisição não ignorará o manipulador global, pois sua referência mudará. Lembre-se de usar a mesma referência de manipulador de requisição usada tanto em GlobalRequestHandlers quanto em BypassGlobalRequestHandlers.
