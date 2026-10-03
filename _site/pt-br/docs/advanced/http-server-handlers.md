# Manipuladores de servidor HTTP

Source: https://docs.sisk-framework.org/pt-br/docs/advanced/http-server-handlers.html

Na versão 0.16 do Sisk, introduzimos a classe `HttpServerHandler`, que tem como objetivo estender o comportamento geral do Sisk e fornecer manipuladores de eventos adicionais ao Sisk, como tratamento de requisições HTTP, roteadores, sacos de contexto e muito mais.

A classe concentra eventos que ocorrem durante a vida útil de todo o servidor HTTP e também de uma requisição. O protocolo HTTP não possui sessões e, portanto, não é possível preservar informações de uma requisição para outra. O Sisk, por enquanto, oferece uma forma de você implementar sessões, contextos, conexões de banco de dados e outros provedores úteis para auxiliar seu trabalho.

Consulte [esta página](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.md) para ler onde cada evento é disparado e qual é seu propósito. Você também pode visualizar o [ciclo de vida de uma requisição HTTP](https://docs.sisk-framework.org/pt-br/docs/advanced/request-lifecycle.md) para entender o que acontece com uma requisição e onde os eventos são disparados. O servidor HTTP permite que você use múltiplos manipuladores ao mesmo tempo. Cada chamada de evento é síncrona, ou seja, bloqueará a thread atual para cada requisição ou contexto até que todos os manipuladores associados àquela função sejam executados e concluídos.

Ao contrário dos RequestHandlers, eles não podem ser aplicados a alguns grupos de rotas ou rotas específicas. Em vez disso, são aplicados a todo o servidor HTTP. Você pode aplicar condições dentro do seu Http Server Handler. Além disso, singletons de cada HttpServerHandler são definidos para cada aplicação Sisk, de modo que apenas uma instância por `HttpServerHandler` é criada.

Um exemplo prático de uso do HttpServerHandler é descartar automaticamente uma conexão de banco de dados ao final da requisição.

```cs
// DatabaseConnectionHandler.cs

public class DatabaseConnectionHandler : HttpServerHandler
{
    protected override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        var requestBag = result.Request.Context.RequestBag;

        // verifica se a requisição definiu um DbContext
        // em seu saco de contexto
        if (requestBag.IsSet<DbContext>())
        {
            var db = requestBag.Get<DbContext>();
            db.Dispose();
        }
    }
}

public static class DatabaseConnectionHandlerExtensions
{
    public static DbContext GetDbContext(this HttpRequest request)
    {
        return request.Bag.GetOrAdd(() => new DbContext());
    }
}
```

Com o código acima, a extensão `GetDbContext` permite que um contexto de conexão seja criado diretamente a partir do objeto HttpRequest. Uma conexão não descartada pode causar problemas ao operar com o banco de dados, por isso ela é encerrada em `OnHttpRequestClose`.

Você pode registrar um manipulador em um servidor HTTP no seu builder ou diretamente com [HttpServer.RegisterHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.RegisterHandler.md).

```cs
// Program.cs

class Program
{
    static void Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseHandler<DatabaseConnectionHandler>()
            .Build();

        app.Router.MapInstance(new UserController());
        app.Start();
    }
}
```

Com isso, a classe `UsersController` pode usar o contexto de banco de dados da seguinte forma:

```cs
// UserController.cs

[RoutePrefix("/users")]
public class UserController : ApiController
{
    [RouteGet()]
    public async Task<HttpResponse> List(HttpRequest request)
    {
        var db = request.GetDbContext();
        var users = db.Users.ToArray();

        return JsonOk(users);
    }

    [RouteGet("<id>")]
    public async Task<HttpResponse> View(HttpRequest request)
    {
        var db = request.GetDbContext();

        int userId = request.RouteParameters["id"].GetInteger();
        var user = db.Users.FirstOrDefault(u => u.Id == userId);

        return JsonOk(user);
    }

    [RoutePost]
    public async Task<HttpResponse> Create(HttpRequest request)
    {
        var db = request.GetDbContext();
        var user = await request.GetJsonContentAsync<User>();

        ArgumentNullException.ThrowIfNull(user);

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return JsonMessage("Usuário adicionado.");
    }
}
```

O código acima usa métodos como `JsonOk` e `JsonMessage` que são incorporados ao `ApiController`, que herda de um `RouterController`:

```cs
// ApiController.cs

public class ApiController : RouterModule
{
    public HttpResponse JsonOk(object value)
    {
        return new HttpResponse(200)
            .WithContent(JsonContent.Create(value, null, new JsonSerializerOptions()
            {
                PropertyNameCaseInsensitive = true
            }));
    }

    public HttpResponse JsonMessage(string message, int statusCode = 200)
    {
        return new HttpResponse(statusCode)
            .WithContent(JsonContent.Create(new
            {
                Message = message
            }));
    }
}
```

Desenvolvedores podem implementar sessões, contextos e conexões de banco de dados usando esta classe. O código fornecido demonstra um exemplo prático com o `DatabaseConnectionHandler`, automatizando o descarte da conexão de banco de dados ao final de cada requisição.

A integração é simples, com os manipuladores registrados durante a configuração do servidor. A classe `HttpServerHandler` oferece um conjunto de ferramentas poderoso para gerenciar recursos e estender o comportamento do Sisk em aplicações HTTP.
