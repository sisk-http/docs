# Autenticação Básica

O pacote de Autenticação Básica adiciona um manipulador de solicitações capaz de lidar com o esquema de autenticação básica em seu aplicativo Sisk com muito pouca configuração e esforço.
A autenticação HTTP básica é uma forma minimalista de autenticar solicitações por um ID de usuário e senha, onde a sessão é controlada exclusivamente pelo cliente e não há tokens de autenticação ou acesso.

![Autenticação Básica](/assets/img/basic-auth.svg)

Leia mais sobre o esquema de autenticação básica na [especificação MDN](https://developer.mozilla.org/pt-BR/docs/pt-br/Web/HTTP/Authentication).

## Instalando

Para começar, instale o pacote Sisk.BasicAuth em seu projeto:

    > dotnet add package Sisk.BasicAuth

Você pode ver mais maneiras de instalá-lo em seu projeto no [repositório Nuget](https://www.nuget.org/packages/Sisk.BasicAuth/0.15.0).

## Criando seu manipulador de autenticação

Você pode controlar o esquema de autenticação para um módulo inteiro ou para rotas individuais. Para isso, vamos primeiro escrever nosso primeiro manipulador de autenticação básica.

No exemplo abaixo, uma conexão é feita com o banco de dados, verifica se o usuário existe e se a senha é válida, e após isso, armazena o usuário na bolsa de contexto.

```cs
public class UserAuthHandler : BasicAuthenticateRequestHandler
{
    public UserAuthHandler() : base()
    {
        Realm = "Para entrar nesta página, por favor, informe suas credenciais.";
    }

    public override HttpResponse? OnValidating(BasicAuthenticationCredentials credentials, HttpContext context)
    {
        DbContext db = new DbContext();

        // nesse caso, estamos usando o e-mail como o campo de ID do usuário, então vamos
        // procurar por um usuário usando seu e-mail.
        User? user = db.Users.FirstOrDefault(u => u.Email == credentials.UserId);
        if (user == null)
        {
            return base.CreateUnauthorizedResponse("Desculpe! Nenhum usuário foi encontrado por este e-mail.");
        }

        // valida que a senha das credenciais é válida para este usuário.
        if (!user.ValidatePassword(credentials.Password))
        {
            return base.CreateUnauthorizedResponse("Credenciais inválidas.");
        }

        // adiciona o usuário conectado ao contexto HTTP
        // e continua a execução
        context.Bag.Add("loggedUser", user);
        return null;
    }
}
```

Então, basta associar este manipulador de solicitação com nossa rota ou classe.

```cs
public class UsersController
{
    [RouteGet("/")]
    [RequestHandler(typeof(UserAuthHandler))]
    public string Index(HttpRequest request)
    {
        User loggedUser = request.Bag.Get<User>();
        return $"Olá, {loggedUser.Name}!";
    }
}
```

Ou usando a classe [RouterModule](/api/Sisk.Core.Routing.RouterModule):

```cs
public class UsersController : RouterModule
{
    public ClientModule()
    {
        // todas as rotas dentro desta classe serão manipuladas por
        // UserAuthHandler.
        base.HasRequestHandler(new UserAuthHandler());
    }
    
    [RouteGet("/")]
    public string Index(HttpRequest request)
    {
        User loggedUser = request.Bag.Get<User>();
        return $"Olá, {loggedUser.Name}!";
    }
}
```

## Observações

A responsabilidade principal da autenticação básica é realizada no lado do cliente. Armazenamento, controle de cache e criptografia são todos tratados localmente no cliente. O servidor apenas recebe as credenciais e valida se o acesso é permitido ou não.

Observe que este método não é um dos mais seguros, pois coloca uma grande responsabilidade no cliente, que pode ser difícil de rastrear e manter a segurança de suas credenciais. Além disso, é crucial que as senhas sejam transmitidas em um contexto de conexão segura (SSL), pois elas não têm criptografia inerente. Uma breve interceptação nos cabeçalhos de uma solicitação pode expor as credenciais de acesso do seu usuário.

Opte por soluções de autenticação mais robustas para aplicativos em produção e evite usar muitos componentes prontos, pois eles podem não se adaptar às necessidades do seu projeto e acabar expô-lo a riscos de segurança.