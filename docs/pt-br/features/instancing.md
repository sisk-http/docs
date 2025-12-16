# Injeção de Dependência

É comum dedicar membros e instâncias que duram por toda a vida de uma solicitação, como uma conexão de banco de dados, um usuário autenticado ou um token de sessão. Uma das possibilidades é através do [HttpContext.RequestBag](/api/Sisk.Core.Http.HttpContext), que cria um dicionário que dura por toda a vida de uma solicitação.

Este dicionário pode ser acessado por [tratadores de solicitação](/docs/pt-br/fundamentals/request-handlers) e definir variáveis ao longo da solicitação. Por exemplo, um tratador de solicitação que autentica um usuário define este usuário dentro do `HttpContext.RequestBag`, e dentro da lógica da solicitação, este usuário pode ser recuperado com `HttpContext.RequestBag.Get<User>()`.

Os objetos definidos neste dicionário são limitados ao ciclo de vida da solicitação. Eles são descartados no final da solicitação. Não necessariamente, o envio de uma resposta define o fim do ciclo de vida da solicitação. Quando [tratadores de solicitação](/docs/pt-br/fundamentals/request-handlers) que são executados após o envio de uma resposta são executados, os objetos `RequestBag` ainda existem e não foram descartados.

Aqui está um exemplo:

<div class="script-header">
    <span>
        RequestHandlers/AuthenticateUser.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public class AuthenticateUser : IRequestHandler
{
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;
    
    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        User authenticatedUser = AuthenticateUser(request);
        context.RequestBag.Set(authenticatedUser);
        return null; // avançar para o próximo tratador de solicitação ou lógica de solicitação
    }
}
```

<div class="script-header">
    <span>
        Controllers/HelloController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RouteGet("/hello")]
[RequestHandler<AuthenticateUser>]
public HttpResponse SayHello(HttpRequest request)
{
    var authenticatedUser = request.Bag.Get<User>();
    return new HttpResponse()
    {
        Content = new StringContent($"Hello {authenticatedUser.Name}!")
    };
}
```

Este é um exemplo preliminar desta operação. A instância de `User` foi criada dentro do tratador de solicitação dedicado à autenticação, e todas as rotas que usam este tratador de solicitação terão a garantia de que haverá um `User` em sua instância de `HttpContext.RequestBag`.

É possível definir lógica para obter instâncias quando não previamente definidas no `RequestBag` por meio de métodos como [GetOrAdd](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAdd) ou [GetOrAddAsync](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAddAsync).

Desde a versão 1.3, a propriedade estática [HttpContext.Current](/api/Sisk.Core.Http.HttpContext.Current) foi introduzida, permitindo o acesso ao `HttpContext` atualmente em execução do contexto da solicitação. Isso permite expor membros do `HttpContext` fora da solicitação atual e definir instâncias em objetos de rota.

O exemplo abaixo define um controlador que tem membros comumente acessados pelo contexto de uma solicitação.

<div class="script-header">
    <span>
        Controllers/Controller.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public abstract class Controller : RouterModule
{
    // Obter a instância existente ou criar uma nova instância de banco de dados para esta solicitação
    protected DbContext Database => HttpContext.Current.RequestBag.GetOrAdd(() => new DbContext());

    // Carregar repositórios de forma preguiçosa também é comum
    protected IUserRepository Users => HttpContext.Current.RequestBag.GetOrAdd(() => new UserRepository(Database));
    protected IBlogRepository Blogs => HttpContext.Current.RequestBag.GetOrAdd(() => new BlogRepository(Database));
    protected IBlogPostRepository BlogPosts => HttpContext.Current.RequestBag.GetOrAdd(() => new BlogPostRepository(Database));

    // a seguinte linha lançará uma exceção se a propriedade for acessada quando o User não
    // estiver definido no request bag
    protected User AuthenticatedUser => => HttpContext.Current.RequestBag.Get<User>();

    // Expor a instância de HttpRequest também é suportado
    protected HttpRequest Request => HttpContext.Current.Request
}
```

E definir tipos que herdam do controlador:

<div class="script-header">
    <span>
        Controllers/PostsController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RoutePrefix("/api/posts/{author}")]
sealed class PostsController : Controller
{
    protected Guid AuthorId => Request.RouteParameters["author"].GetInteger();

    [RouteGet]
    public IAsyncEnumerable<BlogPost> ListPosts()
    {
        return BlogPosts.GetPostsAsync(authorId: AuthorId);
    }

    [RouteGet("<id>")]
    public async Task<BlogPost?> GetPost()
    {
        int postId = Request.RouteParameters["id"].GetInteger();

        Post? post = await BlogPosts
            .FindPostAsync(post => post.Id == postId && post.AuthorId == AuthorId);

        return post;
    }
}
```

Para o exemplo acima, você precisará configurar um [tratador de valor](/docs/pt-br/fundamentals/responses.html#implicit-response-types) em seu roteador para que os objetos retornados pelo roteador sejam transformados em uma resposta [HttpResponse](/api/Sisk.Core.Http.HttpResponse) válida.

Observe que os métodos não têm um argumento `HttpRequest request` presente em outros métodos. Isso ocorre porque, desde a versão 1.3, o roteador suporta dois tipos de delegados para respostas de rota: [RouteAction](/api/Sisk.Core.Routing.RouteAction), que é o delegado padrão que recebe um argumento `HttpRequest`, e [ParameterlessRouteAction](/api/Sisk.Core.Routing.ParameterlessRouteAction). O objeto `HttpRequest` ainda pode ser acessado por ambos os delegados através da propriedade [Request](/api/Sisk.Core.Http.HttpContext.Request) do `HttpContext` estático na thread.

No exemplo acima, definimos um objeto descartável, o `DbContext`, e precisamos garantir que todas as instâncias criadas em um `DbContext` sejam descartadas quando a sessão HTTP for finalizada. Para isso, podemos usar duas maneiras de alcançar isso. Uma é criar um [tratador de solicitação](/docs/pt-br/fundamentals/request-handlers) que seja executado após a ação do roteador, e a outra maneira é através de um [tratador de servidor personalizado](/docs/pt-br/advanced/http-server-handlers).

Para o primeiro método, podemos criar o tratador de solicitação inline diretamente no método [OnSetup](/api/Sisk.Core.Routing.RouterModule.OnSetup) herdado de `RouterModule`:

<div class="script-header">
    <span>
        Controllers/PostsController.cs
    </span>
    <span>
        C#
    </span>
</div>

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
                // obter uma instância de DbContext definida no contexto do tratador de solicitação e
                // descartá-la
                ctx.RequestBag.GetOrDefault<DbContext>()?.Dispose();
                return null;
            },
            executionMode: RequestHandlerExecutionMode.AfterResponse));
    }
}
```

> [!TIP]
>
> Desde a versão 1.4 do Sisk, a propriedade [HttpServerConfiguration.DisposeDisposableContextValues](/api/Sisk.Core.Http.HttpServerConfiguration.DisposeDisposableContextValues) foi introduzida e habilitada por padrão, que define se o servidor HTTP deve descartar todos os valores `IDisposable` no saco de contexto quando uma sessão HTTP for fechada.

O método acima garantirá que o `DbContext` seja descartado quando a sessão HTTP for finalizada. Você pode fazer isso para mais membros que precisam ser descartados no final de uma resposta.

Para o segundo método, você pode criar um [tratador de servidor personalizado](/docs/pt-br/advanced/http-server-handlers) que descartará o `DbContext` quando a sessão HTTP for finalizada.

<div class="script-header">
    <span>
        Server/Handlers/ObjectDisposerHandler.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public class ObjectDisposerHandler : HttpServerHandler
{
    protected override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        result.Context.RequestBag.GetOrDefault<DbContext>()?.Dispose();
    }
}
```

E usá-lo em seu construtor de aplicativo:

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
using var host = HttpServer.CreateBuilder()
    .UseHandler<ObjectDisposerHandler>()
    .Build();
```

Essa é uma maneira de lidar com a limpeza de código e manter as dependências de uma solicitação separadas pelo tipo de módulo que será usado, reduzindo a quantidade de código duplicado dentro de cada ação de um roteador. É uma prática semelhante ao que a injeção de dependência é usada para em frameworks como o ASP.NET.