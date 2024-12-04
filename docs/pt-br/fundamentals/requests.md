# Requisições

Solicitações são estruturas que representam uma mensagem de solicitação HTTP. O objeto [HttpRequest](/api/Sisk.Core.Http.HttpRequest) contém funções úteis para lidar com mensagens HTTP em todo o seu aplicativo.

Uma solicitação HTTP é formada pelo método, caminho, versão, cabeçalhos e corpo.

Neste documento, ensinaremos como obter cada um desses elementos.

## Obtendo o método da solicitação

Para obter o método da solicitação recebida, você pode usar a propriedade Method:

```cs
static HttpResponse Index(HttpRequest request)
{
    HttpMethod requestMethod = request.Method;
    ...
}
```

Esta propriedade retorna o método da solicitação representado por um objeto [HttpMethod](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.httpmethod).

> [!NOTE]
> Ao contrário dos métodos de rota, esta propriedade não serve o item [RouteMethod.Any](/api/Sisk.Core.Routing.RouteMethod). Em vez disso, ele retorna o verdadeiro método da solicitação.

## Obtendo os componentes do URL da solicitação

Você pode obter vários componentes de um URL através de certas propriedades de uma solicitação. Para este exemplo, vamos considerar o URL:

```
http://localhost:5000/user/login?email=foo@bar.com
```

| Nome do componente | Descrição | Valor do componente |
|---|---|---|
| [Path](/api/Sisk.Core.Http.HttpRequest.Path) | Obtém o caminho da solicitação. | `/user/login` |
| [FullPath](/api/Sisk.Core.Http.HttpRequest.FullPath) | Obtém o caminho da solicitação e a string de consulta. | `/user/login?email=foo@bar.com` |
| [FullUrl](/api/Sisk.Core.Http.HttpRequest.FullUrl) | Obtém a string completa da solicitação HTTP. | `http://localhost:5000/user/login?email=foo@bar.com` |
| [Host](/api/Sisk.Core.Http.HttpRequest.Host) | Obtém o host da solicitação. | `localhost` |
| [Authority](/api/Sisk.Core.Http.HttpRequest.Authority) | Obtém o host e a porta da solicitação. | `localhost:5000` |
| [QueryString](/api/Sisk.Core.Http.HttpRequest.QueryString) | Obtém a consulta da solicitação. | `?email=foo@bar.com` |
| [Query](/api/Sisk.Core.Http.HttpRequest.Query) | Obtém a consulta da solicitação em uma coleção de valores nomeados. | `{StringValueCollection object}` |
| [IsSecure](/api/Sisk.Core.Http.HttpRequest.IsSecure) | Determina se a solicitação está usando SSL (true) ou não (false). | `false` |

Você também pode optar por usar a propriedade [HttpRequest.Uri](/api/Sisk.Core.Http.HttpRequest.Uri), que inclui tudo acima em um único objeto.

## Obtendo o corpo da solicitação

Algumas solicitações incluem um corpo, como formulários, arquivos ou transações de API. Você pode obter o corpo de uma solicitação a partir da propriedade:

```cs
// obtém o corpo da solicitação como uma string, usando o codificador de solicitação como o codificador
string body = request.Body;

// ou obtém como um array de bytes
byte[] bodyBytes = request.RawBody;

// ou, caso contrário, você pode transmiti-lo.
Stream requestStream = request.GetRequestStream();
```

Também é possível determinar se há um corpo na solicitação e se ele foi carregado com as propriedades [HasContents](/api/Sisk.Core.Http.HttpRequest.HasContents), que determina se a solicitação possui conteúdo e [IsContentAvailable](/api/Sisk.Core.Http.HttpRequest.IsContentAvailable), que indica que o servidor HTTP recebeu completamente o conteúdo do ponto remoto.

Não é possível ler o conteúdo da solicitação através de `GetRequestStream` mais de uma vez. Se você ler com este método, os valores em `RawBody` e `Body` também não estarão disponíveis. Não é necessário descartar o fluxo de solicitação no contexto da solicitação HTTP, pois ele é descartado no final da sessão HTTP em que é criado.

Você também pode usar a propriedade [HttpRequest.RequestEncoding](/api/Sisk.Core.Http.HttpRequest.RequestEncoding) para obter o melhor codificador para decodificar a solicitação manualmente.

O servidor tem limites para ler o conteúdo da solicitação, o que se aplica a ambos [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body) e [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.RawBody). Essas propriedades copiam todo o fluxo de entrada para um buffer local do mesmo tamanho de [HttpRequest.ContentLength](/api/Sisk.Core.Http.HttpRequest.ContentLength).

Uma resposta com status 413 Content Too Large é retornada ao cliente se o conteúdo enviado for maior que [HttpServerConfiguration.MaximumContentLength](/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength) definido na configuração do usuário. Além disso, se não houver um limite configurado ou se for muito grande, o servidor lançará uma exceção [OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception?view=net-8.0) quando o conteúdo enviado pelo cliente exceder [Int32.MaxValue](https://learn.microsoft.com/en-us/dotnet/api/system.int32.maxvalue) (2 GB) e se o conteúdo for tentado ser acessado através de uma das propriedades mencionadas acima. Você ainda pode lidar com o conteúdo através de streaming.

> [!NOTE]
> Sisk segue a RFC 9110 "HTTP Semantics", que não permite que certos métodos de solicitação tenham corpo. Essas solicitações descartarão imediatamente um 400 (Bad Request) com o status `ContentServedOnIllegalMethod`.
> Você pode desabilitar esse recurso definindo [ThrowContentOnNonSemanticMethods](/api/Sisk.Core.Http.HttpServerFlags.ThrowContentOnNonSemanticMethods) para `false`.

## Obtendo o contexto da solicitação


O HTTP Context é um objeto exclusivo do Sisk que armazena informações do servidor HTTP, rota, roteador e manipulador de solicitação. Você pode usá-lo para se organizar em um ambiente onde esses objetos são difíceis de organizar.

O objeto [RequestBag](/api/Sisk.Core.Http.HttpContext.RequestBag) contém informações armazenadas que são passadas de um manipulador de solicitação para outro ponto, e pode ser consumido no destino final. Este objeto também pode ser usado por manipuladores de solicitação que executam após o callback da rota.

> [!TIP]
> Esta propriedade também é acessível por [HttpRequest.Bag](/api/Sisk.Core.Http.HttpRequest.Bag) propriedade.


```cs
public class AuthenticateUserRequestHandler : IRequestHandler
{
    public string Identifier { get; init; } = Guid.NewGuid().ToString();
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;

    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers["Authorization"] != null)
        {
            context.RequestBag.Add("AuthenticatedUser", "Bob");
            return null;
        }
        else
        {
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}
```


```cs
public class MyController
{
    [Route(RouteMethod.Get, "/")
    [RequestHandler(typeof(AuthenticateUserRequestHandler))
    static HttpResponse Index(HttpRequest request)
    {
        var authUser = request.Context.RequestBag["AuthenticatedUser"];
        res.Content = new StringContent($"Hello, {authUser}!
        return res;
    }
}




```

You can also use the `Bag.Set()` and `Bag.Get()` helper methods to get or set objects by their type singletons.

```cs
public class Authenticate : RequestHandler
    public override HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        request.Bag.Set<User>(authUser);
    }
    [RouteGet("/")
    [RequestHandler<Authenticate>
    public static HttpResponse Test(HttpRequest request)
    {
        var user = request.Bag.Get<User>.
    }


## Obtendo dados do formulário

You can get the values of a form data in a [NameValueCollection](https://learn.microsoft.
```cs
static HttpResponse Index(HttpRequest request)
    var form = request.GetFormContent();
    string? username = form["username"];
    string? password = form["password"];
    if (AttempLogin(username, password) == true
    {
        ...
    }
## Obtendo dados de formulário multipart
Sisk's HTTP request lets you get uploaded multipart contents, such as a files, form fields, or any binary content.
```cs
static HttpResponse Index(HttpRequest request)
    var multipartFormDataObjects = request.GetMultipartFormContent();
    foreach (MultipartObject uploadedObject in multipartFormDataObjects
    {
        Console.WriteLine("File name       : " + uploadedObject.Filename);
        Console.WriteLine("Field name      : " + uploadedObject.Name);
        Console.WriteLine("Content length  : " + uploadedObject.ContentLength);
        Console.WriteLine("Common format   : " + uploadedObject.GetCommonFileFormat());
    }

## Suporte de eventos do servidor
Sisk supports Server-side events, which allows sending chunks as an stream and keeping the connection between the server and the client alive.
    public class MyController
    [Route(RouteMethod.Get, "/event-source
    static HttpResponse ServerEventsResponse(HttpRequest request)
    var serverEvents = request.GetEventSource();
    string[] fruits = new[] { "Apple", "Banana", "Watermelon", "Tomato
    foreach (fruit in fruits
        serverEvents.Send(fruit);
    Thread.Sleep(15000
