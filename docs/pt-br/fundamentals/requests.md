# Requests

Requests são estruturas que representam uma mensagem de solicitação HTTP. O objeto [HttpRequest](/api/Sisk.Core.Http.HttpRequest) contém funções úteis para lidar com mensagens HTTP em toda a sua aplicação.

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
> Ao contrário dos métodos de rota, esta propriedade não serve o item [RouteMethod.Any](/api/Sisk.Core.Routing.RouteMethod). Em vez disso, ela retorna o método real da solicitação.

## Obtendo componentes da URL da solicitação

Você pode obter vários componentes de uma URL através de certas propriedades de uma solicitação. Para este exemplo, considere a URL:

```
http://localhost:5000/user/login?email=foo@bar.com
```

| Nome do componente | Descrição | Valor do componente |
| --- | --- | --- |
| [Path](/api/Sisk.Core.Http.HttpRequest.Path) | Obtém o caminho da solicitação. | `/user/login` |
| [FullPath](/api/Sisk.Core.Http.HttpRequest.FullPath) | Obtém o caminho da solicitação e a string de consulta. | `/user/login?email=foo@bar.com` |
| [FullUrl](/api/Sisk.Core.Http.HttpRequest.FullUrl) | Obtém a string completa da URL da solicitação. | `http://localhost:5000/user/login?email=foo@bar.com` |
| [Host](/api/Sisk.Core.Http.HttpRequest.Host) | Obtém o host da solicitação. | `localhost` |
| [Authority](/api/Sisk.Core.Http.HttpRequest.Authority) | Obtém o host e a porta da solicitação. | `localhost:5000` |
| [QueryString](/api/Sisk.Core.Http.HttpRequest.QueryString) | Obtém a consulta da solicitação. | `?email=foo@bar.com` |
| [Query](/api/Sisk.Core.Http.HttpRequest.Query) | Obtém a consulta da solicitação em uma coleção de valores nomeados. | `{StringValueCollection object}` |
| [IsSecure](/api/Sisk.Core.Http.HttpRequest.IsSecure) | Determina se a solicitação está usando SSL (true) ou não (false). | `false` |

Você também pode optar por usar a propriedade [HttpRequest.Uri](/api/Sisk.Core.Http.HttpRequest.Uri), que inclui tudo o que está acima em um único objeto.

## Obtendo o corpo da solicitação

Algumas solicitações incluem corpo, como formulários, arquivos ou transações de API. Você pode obter o corpo de uma solicitação a partir da propriedade:

```cs
// obtém o corpo da solicitação como uma string, usando a codificação da solicitação como codificador
string body = request.Body;

// ou obtém-o em um array de bytes
byte[] bodyBytes = request.RawBody;

// ou, ainda, você pode transmitir.
Stream requestStream = request.GetRequestStream();
```

Também é possível determinar se há um corpo na solicitação e se ele está carregado com as propriedades [HasContents](/api/Sisk.Core.Http.HttpRequest.HasContents), que determina se a solicitação tem conteúdos, e [IsContentAvailable](/api/Sisk.Core.Http.HttpRequest.IsContentAvailable), que indica que o servidor HTTP recebeu totalmente o conteúdo do ponto remoto.

Não é possível ler o conteúdo da solicitação através de `GetRequestStream` mais de uma vez. Se você ler com esse método, os valores em `RawBody` e `Body` também não estarão disponíveis. Não é necessário descartar o fluxo de solicitação no contexto da solicitação, pois ele é descartado no final da sessão HTTP em que foi criado. Além disso, você pode usar a propriedade [HttpRequest.RequestEncoding](/api/Sisk.Core.Http.HttpRequest.RequestEncoding) para obter a melhor codificação para decodificar a solicitação manualmente.

O servidor tem limites para leitura do conteúdo da solicitação, que se aplica tanto a [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body) quanto a [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.Body). Essas propriedades copiam todo o fluxo de entrada para um buffer local do mesmo tamanho de [HttpRequest.ContentLength](/api/Sisk.Core.Http.HttpRequest.ContentLength).

Uma resposta com status 413 Content Too Large é retornada ao cliente se o conteúdo enviado for maior que [HttpServerConfiguration.MaximumContentLength](/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength) definido na configuração do usuário. Além disso, se não houver limite configurado ou se for muito grande, o servidor lançará uma [OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception?view=net-8.0) quando o conteúdo enviado pelo cliente exceder [Int32.MaxValue](https://learn.microsoft.com/en-us/dotnet/api/system.int32.maxvalue) (2 GB) e se o conteúdo for tentado acessar através de uma das propriedades mencionadas acima. Você ainda pode lidar com o conteúdo por meio de streaming.

> [!NOTE]
> Embora o Sisk permita isso, é sempre uma boa ideia seguir a Semântica HTTP para criar sua aplicação e não obter ou servir conteúdo em métodos que não permitem. Leia sobre [RFC 9110 "HTTP Semantics"](https://httpwg.org/spec/rfc9110.html).

## Obtendo o contexto da solicitação

O HTTP Context é um objeto exclusivo do Sisk que armazena informações do servidor HTTP, rota, roteador e manipulador de solicitação. Você pode usá-lo para se organizar em um ambiente onde esses objetos são difíceis de organizar.

O objeto [RequestBag](/api/Sisk.Core.Http.HttpContext.RequestBag) contém informações armazenadas que são passadas de um manipulador de solicitação para outro ponto, e pode ser consumido no destino final. Este objeto também pode ser usado por manipuladores de solicitação que executam após o callback da rota.

> [!TIP]
> Esta propriedade também é acessível pela propriedade [HttpRequest.Bag](/api/Sisk.Core.Http.HttpRequest.Bag).

<div class="script-header">
    <span>
        Middleware/AuthenticateUserRequestHandler.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class AuthenticateUserRequestHandler : IRequestHandler
{
    public string Identifier { get; init; } = Guid.NewGuid().ToString();
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;
    
    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization != null)
        {
            context.RequestBag.Add("AuthenticatedUser", new User("Bob"));
            return null;
        }
        else
        {
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}
```

O manipulador de solicitação acima definirá `AuthenticatedUser` no request bag, e pode ser consumido mais tarde no callback final:

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class MyController
{
    [RouteGet("/")]
    [RequestHandler<AuthenticateUserRequestHandler>]
    static HttpResponse Index(HttpRequest request)
    {
        User authUser = request.Context.RequestBag["AuthenticatedUser"];
        
        return new HttpResponse() {
            Content = new StringContent($"Hello, {authUser.Name}!")
        };
    }
}
```

Você também pode usar os métodos auxiliares `Bag.Set()` e `Bag.Get()` para obter ou definir objetos por seus singletons de tipo.

<div class="script-header">
    <span>
        Middleware/Authenticate.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class Authenticate : RequestHandler
{
    public override HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        request.Bag.Set<User>(authUser);
    }
}
```

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RouteGet("/")]
[RequestHandler<Authenticate>]
public static HttpResponse GetUser(HttpRequest request)
{
    var user = request.Bag.Get<User>();
    ...
}
```

## Obtendo dados de formulário

Você pode obter os valores de dados de formulário em uma [NameValueCollection](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.specialized.namevaluecollection) com o exemplo abaixo:

<div class="script-header">
    <span>
        Controller/Auth.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RoutePost("/auth")]
public HttpResponse Index(HttpRequest request)
{
    var form = request.GetFormContent();

    string? username = form["username"];
    string? password = form["password"];

    if (AttempLogin(username, password))
    {
        ...
    }
}
```

## Obtendo dados de formulário multipart

A solicitação HTTP do Sisk permite obter conteúdos multipart carregados, como arquivos, campos de formulário ou qualquer conteúdo binário.

<div class="script-header">
    <span>
        Controller/Auth.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RoutePost("/upload-contents")]
public HttpResponse Index(HttpRequest request)
{
    // o método seguinte lê todo o input da solicitação em
    // um array de MultipartObjects
    var multipartFormDataObjects = request.GetMultipartFormContent();
    
    foreach (MultipartObject uploadedObject in multipartFormDataObjects)
    {
        // O nome do arquivo fornecido pelos dados de formulário multipart.
        // Retorna nulo se o objeto não for um arquivo.
        Console.WriteLine("File name       : " + uploadedObject.Filename);

        // O nome do campo do objeto de dados de formulário multipart.
        Console.WriteLine("Field name      : " + uploadedObject.Name);

        // O comprimento do conteúdo do formulário multipart.
        Console.WriteLine("Content length  : " + uploadedObject.ContentLength);

        // Determina o formato da imagem baseado no cabeçalho do arquivo para cada
        // tipo de conteúdo conhecido. Se o conteúdo não for um formato de arquivo comum reconhecido, este método abaixo retornará MultipartObjectCommonFormat.Unknown
        Console.WriteLine("Common format   : " + uploadedObject.GetCommonFileFormat());
    }
}
```

Você pode ler mais sobre os objetos de formulário multipart do Sisk [Multipart form objects](/api/Sisk.Core.Entity.MultipartObject) e seus métodos, propriedades e funcionalidades.

## Detectando desconexão do cliente

Desde a versão v1.15 do Sisk, o framework fornece um CancellationToken que é lançado quando a conexão entre o cliente e o servidor é fechada prematuramente antes de receber a resposta. Este token pode ser útil para detectar quando o cliente não deseja mais a resposta e cancelar operações de longa duração.

```csharp
router.MapGet("/connect", async (HttpRequest req) =>
{
    // obtém o token de desconexão da solicitação
    var dc = req.DisconnectToken;

    await LongOperationAsync(dc);

    return new HttpResponse();
});
```

Este token não é compatível com todos os motores HTTP, e cada um requer uma implementação.

## Suporte a eventos enviados pelo servidor

O Sisk suporta [Server-sent events](https://developer.mozilla.org/en-US/docs/pt-br/Web/API/Server-sent_events), que permite enviar pedaços como um fluxo e manter a conexão entre o servidor e o cliente viva.

Chamar o método [HttpRequest.GetEventSource](/api/Sisk.Core.Http.HttpRequest.GetEventSource) colocará o HttpRequest em seu estado de ouvinte. A partir daí, o contexto desta solicitação HTTP não esperará um HttpResponse, pois irá sobrepor os pacotes enviados por eventos do lado do servidor.

Após enviar todos os pacotes, o callback deve retornar o método [Close](/api/Sisk.Core.Http.HttpRequestEventSource.Close), que enviará a resposta final ao servidor e indicará que o streaming terminou.

Não é possível prever qual será o comprimento total de todos os pacotes que serão enviados, então não é possível determinar o fim da conexão com o cabeçalho `Content-Length`.

Por padrão, a maioria dos navegadores não suporta enviar cabeçalhos HTTP ou métodos diferentes do método GET. Portanto, tenha cuidado ao usar manipuladores de solicitação com requisições event-source que exigem cabeçalhos específicos na solicitação, pois provavelmente eles não terão.

Além disso, a maioria dos navegadores reinicia streams se o método [EventSource.close](https://developer.mozilla.org/en-US/docs/pt-br/Web/API/EventSource/close) não for chamado no lado do cliente após receber todos os pacotes, causando processamento adicional infinito no lado do servidor. Para evitar esse tipo de problema, é comum enviar um pacote final indicando que a fonte de eventos terminou de enviar todos os pacotes.

O exemplo abaixo mostra como o navegador pode comunicar ao servidor que suporta eventos do lado do servidor.

<div class="script-header">
    <span>
        sse-example.html
    </span>
    <span>
        HTML
    </span>
</div>

```html
<html>
    <body>
        <b>Fruits:</b>
        <ul></ul>
    </body>
    <script>
        const evtSource = new EventSource('http://localhost:5555/event-source');
        const eventList = document.querySelector('ul');
        
        evtSource.onmessage = (e) => {
            const newElement = document.createElement("li");

            newElement.textContent = `message: ${e.data}`;
            eventList.appendChild(newElement);

            if (e.data == "Tomato") {
                evtSource.close();
            }
        }
    </script>
</html>
```

E enviar progressivamente as mensagens para o cliente:

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class MyController
{
    [RouteGet("/event-source")]
    public async Task<HttpResponse> ServerEventsResponse(HttpRequest request)
    {
        var sse = await request.GetEventSourceAsync ();
        
        string[] fruits = new[] { "Apple", "Banana", "Watermelon", "Tomato" };
        
        foreach (string fruit in fruits)
        {
            await serverEvents.SendAsync(fruit);
            await Task.Delay(1500);
        }

        return serverEvents.Close();
    }
}
```

Ao executar este código, esperamos um resultado semelhante a este:

<img src="/assets/img/server side events demo.gif" />

## Resolvendo IPs e hosts proxy

O Sisk pode ser usado com proxies, e portanto endereços IP podem ser substituídos pelo endpoint do proxy na transação de um cliente para o proxy.

Você pode definir seus próprios resolvers no Sisk com [forwarding resolvers](/docs/pt-br/advanced/forwarding-resolvers).

## Codificação de cabeçalhos

A codificação de cabeçalhos pode ser um problema para algumas implementações. No Windows, cabeçalhos UTF-8 não são suportados, então ASCII é usado. O Sisk possui um conversor de codificação embutido, que pode ser útil para decodificar cabeçalhos incorretamente codificados.

Esta operação é custosa e desativada por padrão, mas pode ser habilitada sob o sinalizador [NormalizeHeadersEncodings](/specification/spec/Sisk.Core.Http.HttpServerFlags.NormalizeHeadersEncodings).