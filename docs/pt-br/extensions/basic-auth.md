# Autenticação Básica

O pacote Basic Auth adiciona um processador de solicitações capaz de lidar com o esquema de autenticação básica em seu aplicativo Sisk com pouca configuração e esforço.
A autenticação HTTP básica é uma forma mínima de entrada de autenticação de solicitações por um ID de usuário e senha, onde a sessão é controlada exclusivamente
pelo cliente e não há tokens de autenticação ou acesso.

<img src="https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Authentication/httpauth.png">

Leia mais sobre o esquema de autenticação básica na [especificação MDN](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Authentication).

## Instalando

Para começar, instale o pacote Sisk.BasicAuth em seu projeto:

    > dotnet add package Sisk.BasicAuth

Você pode visualizar mais maneiras de instalá-lo em seu projeto no [repositório Nuget](https://www.nuget.org/packages/Sisk.BasicAuth/0.15.0).

## Criando seu manipulador de autenticação

Você pode controlar o esquema de autenticação para um módulo inteiro ou para rotas individuais. Para isso, primeiro vamos escrever nosso primeiro manipulador de autenticação básica.

No exemplo abaixo, uma conexão é feita com o banco de dados, verifica se o usuário existe e se a senha é válida e, em seguida, armazena o usuário na bolsa de contexto.

```cs
public class UserAuthHandler : BasicAuthenticateRequestHandler
{
    public UserAuthHandler() : base()
    {
        Realm = "Para entrar nesta página, informe suas credenciais.";
    }

    public override HttpResponse? OnValidating(BasicAuthenticationCredentials credentials, HttpContext context)
    {
        DbContext db = new DbContext();

        // neste caso, estamos usando o email como campo de ID de usuário, então vamos
        // procurar um usuário usando seu email.
        User? user = db.Users.FirstOrDefault(u => u.Email == credentials.UserId);
        if (user == null)
        {
            return base.CreateUnauthorizedResponse("Desculpe! Nenhum usuário foi encontrado por este email.");
        }

        // valida que a senha das credenciais é válida para este usuário.
        if (!user.ValidatePassword(credentials.Password))
        {
            return base.CreateUnauthorizedResponse("Credenciais inválidas.");
        }

        // adiciona o usuário logado ao contexto HTTP
        // e continua a execução
        context.Bag.Add("loggedUser", user);
        return null;
    }
}
```

Então, basta associar este manipulador de solicitações à nossa rota ou classe.

```cs
public class UsersController
{
    [RouteGet("/")]
    [RequestHandler(typeof(UserAuthHandler))]
    public string Index(HttpRequest request)
    {
        User loggedUser = (User)request.Context.RequestBag["loggedUser"];
        return "Olá, " + loggedUser.Name + "!";
    }
}
```

Ou usando a classe [RouterModule](/api/Sisk.Core.Routing.RouterModule):

```cs
public class UsersController : RouterModule
{
    public ClientModule()
    {
        // agora todas as rotas dentro desta classe serão tratadas por
        // UserAuthHandler.
        base.HasRequestHandler(new UserAuthHandler());
    }

    [RouteGet("/")]
    public string Index(HttpRequest request)
    {
        User loggedUser = (User)request.Context.RequestBag["loggedUser"];
        return "Olá, " + loggedUser.Name + "!";
    }
}
```

## Observações

A principal responsabilidade da autenticação básica é realizada no lado do cliente. Armazenamento, controle de cache e
criptografia são todos gerenciados localmente no cliente. O servidor apenas recebe as
credenciais e valida se o acesso é permitido ou não.

Observe que este método não é uma das soluções mais seguras porque coloca uma responsabilidade significativa no
cliente, o que pode ser difícil de rastrear e manter a segurança de suas credenciais. Além disso, é
essencial que as senhas sejam transmitidas em um contexto de conexão segura (SSL), pois elas não possuem nenhuma
criptografia inerente. Uma breve interceptação nos cabeçalhos de uma solicitação pode expor as credenciais de acesso do seu usuário.

Opte por soluções de autenticação mais robustas para aplicativos em produção e evite usar muitos componentes prontos para uso,
pois eles podem não se adaptar às necessidades do seu projeto e acabar expondo-o a riscos de segurança.