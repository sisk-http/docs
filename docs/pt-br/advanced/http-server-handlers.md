# Tratadores de servidor HTTP

Na versão 0.16 do Sisk, introduzimos a classe `HttpServerHandler`, que visa estender o comportamento geral do Sisk e fornecer tratadores de eventos adicionais ao Sisk, como tratamento de solicitações HTTP, roteadores, sacos de contexto e muito mais.

A classe concentra eventos que ocorrem durante a vida útil de todo o servidor HTTP e também de uma solicitação. O protocolo HTTP não tem sessões, e portanto, não é possível preservar informações de uma solicitação para outra. O Sisk, por enquanto, fornece uma maneira para você implementar sessões, contextos, conexões de banco de dados e outros provedores úteis para ajudar seu trabalho.

Por favor, consulte [esta página](/api/Sisk.Core.Http.Handlers.HttpServerHandler) para ler onde cada evento é acionado e qual é seu propósito. Você também pode visualizar o [ciclo de vida de uma solicitação HTTP](/v1/advanced/request-lifecycle) para entender o que acontece com uma solicitação e onde os eventos são disparados. O servidor HTTP permite usar vários tratadores ao mesmo tempo. Cada chamada de evento é síncrona, ou seja, ela bloqueará a thread atual para cada solicitação ou contexto até que todos os tratadores associados a essa função sejam executados e concluídos.

Ao contrário dos `RequestHandlers`, eles não podem ser aplicados a grupos de rotas ou rotas específicas. Em vez disso, eles são aplicados a todo o servidor HTTP. Você pode aplicar condições dentro do seu `HttpServerHandler`. Além disso, singles de cada `HttpServerHandler` são definidos para cada aplicativo Sisk, então apenas uma instância por `HttpServerHandler` é definida.

Um exemplo prático de uso do `HttpServerHandler` é dispor automaticamente uma conexão de banco de dados no final da solicitação.

```cs
// DatabaseConnectionHandler.cs

public class DatabaseConnectionHandler : HttpServerHandler
{
    public override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        var requestBag = result.Request.Context.RequestBag;

        // verifica se a solicitação definiu um DbContext
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
    // permite que o usuário crie um contexto de banco de dados a partir de uma solicitação HTTP
    // e armazene-o em seu saco de contexto
    public static DbContext GetDbContext(this HttpRequest request)
    {
        var db = new DbContext();
        return request.SetContextBag<DbContext>(db);
    }
}
```

Com o código acima, a extensão `GetDbContext` permite criar um contexto de conexão diretamente a partir do objeto `HttpRequest`. Uma conexão não disposta pode causar problemas ao executar com o banco de dados, então ela é encerrada em `OnHttpRequestClose`.

Você pode registrar um tratador em um servidor HTTP no seu construtor ou diretamente com [HttpServer.RegisterHandler](/api/Sisk.Core.Http.HttpServer.RegisterHandler).

```cs
// Program.cs

class Program
{
    static void Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseHandler<DatabaseConnectionHandler>()
            .Build();

        app.Router.SetObject(new UserController());
        app.Start();
    }
}
```

Com isso, a classe `UsersController` pode usar o contexto de banco de dados como:

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

        var userId = request.GetQueryValue<int>("id");
        var user = db.Users.FirstOrDefault(u => u.Id == userId);

        return JsonOk(user);
    }

    [RoutePost]
    public async Task<HttpResponse> Create(HttpRequest request)
    {
        var db = request.GetDbContext();
        var user = JsonSerializer.Deserialize<User>(request.Body);

        ArgumentNullException.ThrowIfNull(user);

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return JsonMessage("Usuário adicionado.");
    }
}
```

O código acima usa métodos como `JsonOk` e `JsonMessage` que são integrados à `ApiController`, que é herdada de um `RouterController`:

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

Desenvolvedores podem implementar sessões, contextos e conexões de banco de dados usando essa classe. O código fornecido mostra um exemplo prático com o `DatabaseConnectionHandler`, automatizando a disposição da conexão de banco de dados no final de cada solicitação.

A integração é direta, com tratadores registrados durante a configuração do servidor. A classe `HttpServerHandler` oferece um conjunto poderoso de ferramentas para gerenciar recursos e estender o comportamento do Sisk em aplicações HTTP.