# Instanciando membros por solicitação

É comum dedicar membros e instâncias que duram por toda a vida de uma solicitação, como uma conexão com banco de dados, um usuário autenticado ou um token de sessão. Uma das possibilidades é através do [HttpContext.RequestBag](/api/Sisk.Core.Http.HttpContext), que cria um dicionário que dura por toda a vida de uma solicitação.

Este dicionário pode ser acessado por [tratadores de solicitação](/docs/fundamentals/request-handlers) e definir variáveis ​​durante toda a solicitação. Por exemplo, um tratador de solicitação que autentica um usuário define esse usuário dentro do `HttpContext.RequestBag`, e dentro da lógica da solicitação, esse usuário pode ser recuperado com `HttpContext.RequestBag.Get<User>()`.

Aqui está um exemplo:

```csharp
public class AuthenticateUser : IRequestHandler
{
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;

    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        User authenticatedUser = AuthenticateUser(request);
        context.RequestBag.Set(authenticatedUser);
        return null; // avançar para o próximo tratador de solicitação ou lógica da solicitação
    }
}

[RouteGet("/hello")]
[RequestHandler<AuthenticateUser>]
public static HttpResponse SayHello(HttpRequest request)
{
    var authenticatedUser = request.Bag.Get<User>();
    return new HttpResponse()
    {
        Content = new StringContent($"Olá {authenticatedUser.Name}!")
    };
}
```

Este é um exemplo preliminar dessa operação. A instância de `User` foi criada dentro do tratador de solicitação dedicado à autenticação, e todas as rotas que usam esse tratador de solicitação terão a garantia de que haverá um `User` em sua instância de `HttpContext.RequestBag`.

É possível definir lógica para obter instâncias quando não definidas anteriormente no `RequestBag` através de métodos como [GetOrAdd](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAdd) ou [GetOrAddAsync](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAddAsync).

Desde a versão 1.3, a propriedade estática [HttpContext.Current](/api/Sisk.Core.Http.HttpContext.Current) foi introduzida, permitindo o acesso ao `HttpContext` atualmente em execução do contexto da solicitação. Isso permite expor membros do `HttpContext` fora do contexto da solicitação atual e definir instâncias em objetos de rota.

O exemplo abaixo define um controlador que possui membros comumente acessados pelo contexto de uma solicitação.

```csharp
public abstract class Controller : RouterModule
{
    public DbContext Database
    {
        get
        {
            // criar um DbContext ou obter o existente
            return HttpContext.Current.RequestBag.GetOrAdd(() => new DbContext());
        }
    }

    // a linha seguinte lançará uma exceção se a propriedade for acessada quando o User não
    // estiver definido no bag da solicitação
    public User AuthenticatedUser { get => HttpContext.Current.RequestBag.Get<User>(); }

    // Expor a instância HttpRequest também é suportado
    public HttpRequest Request { get => HttpContext.Current.Request; }
}
```

E definir tipos que herdam do controlador:

```csharp
[RoutePrefix("/api/posts")]
public class PostsController : Controller
{
    [RouteGet]
    public IEnumerable<Blog> ListPosts()
    {
        return Database.Posts
            .Where(post => post.AuthorId == AuthenticatedUser.Id)
            .ToList();
    }

    [RouteGet("<id>")]
    public Post GetPost()
    {
        int blogId = Request.RouteParameters["id"].GetInteger();

        Post? post = Database.Posts
            .FirstOrDefault(post => post.Id == blogId && post.AuthorId == AuthenticatedUser.Id);

        return post ?? new HttpResponse(404);
    }
}
```

Para o exemplo acima, você precisará configurar um [tratador de valor](/docs/fundamentals/responses.html#implicit-response-types) no seu roteador para que os objetos retornados pelo roteador sejam transformados em um [HttpResponse](/api/Sisk.Core.Http.HttpResponse) válido.

Observe que os métodos não têm um argumento `HttpRequest request` como presente em outros métodos. Isso ocorre porque, desde a versão 1.3, o roteador suporta dois tipos de delegados para roteamento de respostas: [RouteAction](/api/Sisk.Core.Routing.RouteAction), que é o delegado padrão que recebe um argumento `HttpRequest`, e [ParameterlessRouteAction](/api/Sisk.Core.Routing.ParameterlessRouteAction). O objeto `HttpRequest` ainda pode ser acessado por ambos os delegados através da propriedade [Request](/api/Sisk.Core.Http.HttpContext.Request) do `HttpContext` estático no thread.

No exemplo acima, definimos um objeto descartável, o `DbContext`, e precisamos garantir que todas as instâncias criadas em um `DbContext` sejam descartadas quando a sessão HTTP terminar. Para isso, podemos usar duas maneiras de alcançar isso. Uma é criar um [tratador de solicitação](/docs/fundamentals/request-handlers) que é executado após a ação do roteador, e a outra maneira é através de um [tratador de servidor](/docs/advanced/http-server-handlers) personalizado.

Para o primeiro método, podemos criar o tratador de solicitação inline diretamente no método [OnSetup](/api/Sisk.Core.Routing.RouterModule.OnSetup) herdado de `RouterModule`:

```csharp
public abstract class Controller : RouterModule
{
    ...

    protected override void OnSetup(Router parentRouter)
    {
        base.OnSetup(parentRouter);

        HasRequestHandler(RequestHandler.Create(
            execute: (req, ctx) =>
            {
                // obter um DbContext definido no contexto do tratador de solicitação e
                // descartá-lo
                ctx.RequestBag.GetOrDefault<DbContext>()?.Dispose();
                return null;
            },
            executionMode: RequestHandlerExecutionMode.AfterResponse));
    }
}
```

O método acima garantirá que o `DbContext` seja descartado quando a sessão HTTP for finalizada. Você pode fazer isso para mais membros que precisam ser descartados no final de uma resposta.

Para o segundo método, você pode criar um [tratador de servidor](/docs/advanced/http-server-handlers) personalizado que descartará o `DbContext` quando a sessão HTTP for finalizada.

```csharp
public class ObjectDisposerHandler : HttpServerHandler
{
    protected override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        result.Context.RequestBag.GetOrDefault<DbContext>()?.Dispose();
    }
}
```

E usá-lo no seu construtor:

```csharp
using var host = HttpServer.CreateBuilder()
    .UseHandler<ObjectDisposerHandler>()
    .Build();
```

Esta é uma maneira de lidar com a limpeza de código e manter as dependências de uma solicitação separadas pelo tipo de módulo que será usado, reduzindo a quantidade de código duplicado dentro de cada ação de um roteador. É uma prática semelhante ao que a injeção de dependência é usada em frameworks como ASP.NET.