# Requisições

Requisições são estruturas que representam uma mensagem de requisição HTTP. O objeto [HttpRequest](/api/Sisk.Core.Http.HttpRequest) contém funções úteis para manipular mensagens HTTP em toda a sua aplicação.

Uma requisição HTTP é formada pelo método, caminho, versão, cabeçalhos e corpo.

Neste documento, vamos ensinar como obter cada um desses elementos.

## Obtendo o método da requisição

Para obter o método da requisição recebida, você pode usar a propriedade Method:

```cs
static HttpResponse Index(HttpRequest request)
{
    HttpMethod requestMethod = request.Method;
    ...
}
```

Essa propriedade retorna o método da requisição representado por um objeto [HttpMethod](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.httpmethod).

> [!NOTE]
> Ao contrário dos métodos de rota, essa propriedade não atende ao item [RouteMethod.Any](/api/Sisk.Core.Routing.RouteMethod). Em vez disso, ela retorna o método de requisição real.

## Obtendo componentes da URL da requisição

Você pode obter vários componentes de uma URL por meio de certas propriedades de uma requisição. Para este exemplo, vamos considerar a URL:

``` 
http://localhost:5000/user/login?email=foo@bar.com
```

| Nome do componente | Descrição | Valor do componente |
| --- | --- | --- |
| [Path](/api/Sisk.Core.Http.HttpRequest.Path) | Obtém o caminho da requisição. | `/user/login` |
| [FullPath](/api/Sisk.Core.Http.HttpRequest.FullPath) | Obtém o caminho da requisição e a string de consulta. | `/user/login?email=foo@bar.com` |
| [FullUrl](/api/Sisk.Core.Http.HttpRequest.FullUrl) | Obtém a string de requisição URL completa. | `http://localhost:5000/user/login?email=foo@bar.com` |
| [Host](/api/Sisk.Core.Http.HttpRequest.Host) | Obtém o host da requisição. | `localhost` |
| [Authority](/api/Sisk.Core.Http.HttpRequest.Authority) | Obtém o host e a porta da requisição. | `localhost:5000` |
| [QueryString](/api/Sisk.Core.Http.HttpRequest.QueryString) | Obtém a consulta da requisição. | `?email=foo@bar.com` |
| [Query](/api/Sisk.Core.Http.HttpRequest.Query) | Obtém a consulta da requisição em uma coleção de valores nomeados. | `{StringValueCollection object}` |
| [IsSecure](/api/Sisk.Core.Http.HttpRequest.IsSecure) | Determina se a requisição está usando SSL (true) ou não (false). | `false` |

Você também pode optar por usar a propriedade [HttpRequest.Uri](/api/Sisk.Core.Http.HttpRequest.Uri), que inclui tudo acima em um objeto.

## Obtendo o corpo da requisição

Algumas requisições incluem corpo, como formulários, arquivos ou transações de API. Você pode obter o corpo de uma requisição da propriedade:

```cs
// obtém o corpo da requisição como uma string, usando o codificador de requisição
string body = request.Body;

// ou obtém em um array de bytes
byte[] bodyBytes = request.RawBody;

// ou pode transmiti-lo.
Stream requestStream = request.GetRequestStream();
```

Também é possível determinar se há um corpo na requisição e se ele está carregado com as propriedades [HasContents](/api/Sisk.Core.Http.HttpRequest.HasContents), que determina se a requisição tem conteúdo e [IsContentAvailable](/api/Sisk.Core.Http.HttpRequest.IsContentAvailable) que indica que o servidor HTTP recebeu totalmente o conteúdo do ponto remoto.

Não é possível ler o conteúdo da requisição por `GetRequestStream` mais de uma vez. Se você ler com este método, os valores em `RawBody` e `Body` também não estarão disponíveis. Não é necessário descartar o fluxo de requisição no contexto da requisição, pois ele é descartado no final da sessão HTTP em que é criado. Além disso, você pode usar a propriedade [HttpRequest.RequestEncoding](/api/Sisk.Core.Http.HttpRequest.RequestEncoding) para obter o melhor codificador para decodificar a requisição manualmente.

O servidor tem limites para ler o conteúdo da requisição, que se aplica a ambos [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body) e [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.Body). Essas propriedades copiam o fluxo de entrada inteiro para um buffer local do mesmo tamanho de [HttpRequest.ContentLength](/api/Sisk.Core.Http.HttpRequest.ContentLength).

Uma resposta com status 413 Conteúdo Muito Grande é retornada ao cliente se o conteúdo enviado for maior que [HttpServerConfiguration.MaximumContentLength](/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength) definido na configuração do usuário. Além disso, se não houver limite configurado ou se for muito grande, o servidor lançará uma [OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception?view=net-8.0) quando o conteúdo enviado pelo cliente exceder [Int32.MaxValue](https://learn.microsoft.com/en-us/dotnet/api/system.int32.maxvalue) (2 GB) e se o conteúdo for acessado por meio de uma das propriedades mencionadas acima. Você ainda pode lidar com o conteúdo por meio de transmissão.

> [!NOTE]
> Embora o Sisk permita, é sempre uma boa ideia seguir a Semântica HTTP para criar sua aplicação e não obter ou servir conteúdo em métodos que não o permitam. Leia sobre [RFC 9110 "HTTP Semantics"](https://httpwg.org/spec/rfc9110.html).

## Obtendo o contexto da requisição

O Contexto HTTP é um objeto exclusivo do Sisk que armazena informações do servidor HTTP, rota, roteador e manipulador de requisição. Você pode usá-lo para se organizar em um ambiente onde esses objetos são difíceis de organizar.

Você pode obter o contexto de execução atual [HttpContext](/api/Sisk.Core.Http.HttpContext) usando o método estático `HttpContext.GetCurrentContext()`. Este método retorna o contexto da requisição que está sendo processada na thread atual.

```cs
HttpContext context = HttpContext.GetCurrentContext();
```

### Modo de registro

A propriedade [HttpContext.LogMode](/api/Sisk.Core.Http.HttpContext.LogMode) permite controlar o comportamento de registro para a requisição atual. Você pode habilitar ou desabilitar o registro para requisições específicas, substituindo a configuração padrão do servidor.

```cs
// Desabilita o registro para esta requisição
context.LogMode = LogOutputMode.None;
```

### Bolsa de requisição

O objeto [RequestBag](/api/Sisk.Core.Http.HttpContext.RequestBag) contém informações armazenadas que são passadas de um manipulador de requisição para outro ponto e podem ser consumidas no destino final. Este objeto também pode ser usado por manipuladores de requisição que são executados após o callback da rota.

> [!TIP]
> Essa propriedade também é acessível pela propriedade [HttpRequest.Bag](/api/Sisk.Core.Http.HttpRequest.Bag).

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

O manipulador de requisição acima definirá `AuthenticatedUser` na bolsa de requisição e pode ser consumido posteriormente no callback final:

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

Você também pode usar os métodos de ajuda `Bag.Set()` e `Bag.Get()` para obter ou definir objetos por seus tipos singleton.

A classe `TypedValueDictionary` também fornece métodos `GetValue` e `SetValue` para um controle mais preciso.

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

A requisição HTTP do Sisk permite obter conteúdos multipart, como arquivos, campos de formulário ou qualquer conteúdo binário.

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
    // o método a seguir lê a entrada de requisição inteira em um
    // array de MultipartObjects
    var multipartFormDataObjects = request.GetMultipartFormContent();
    
    foreach (MultipartObject uploadedObject in multipartFormDataObjects)
    {
        // O nome do arquivo fornecido pelo Multipart form data.
        // Nulo é retornado se o objeto não for um arquivo.
        Console.WriteLine("Nome do arquivo       : " + uploadedObject.Filename);

        // O nome do campo do formulário de dados multipart.
        Console.WriteLine("Nome do campo      : " + uploadedObject.Name);

        // O comprimento do conteúdo de dados multipart.
        Console.WriteLine("Comprimento do conteúdo  : " + uploadedObject.ContentLength);

        // Determina o formato do arquivo com base no cabeçalho do arquivo para cada
        // tipo de conteúdo conhecido. Se o conteúdo não for um formato de arquivo comum
        // reconhecido, o método abaixo retornará MultipartObjectCommonFormat.Unknown
        Console.WriteLine("Formato comum   : " + uploadedObject.GetCommonFileFormat());
    }
}
```

Você pode ler mais sobre objetos de formulário multipart do Sisk [Multipart form objects](/api/Sisk.Core.Entity.MultipartObject) e seus métodos, propriedades e funcionalidades.

## Detectando desconexão do cliente

Desde a versão v1.15 do Sisk, o framework fornece um CancellationToken que é lançado quando a conexão entre o cliente e o servidor é fechada prematuramente antes de receber a resposta. Esse token pode ser útil para detectar quando o cliente não deseja mais a resposta e cancelar operações de longa execução.

```csharp
router.MapGet("/connect", async (HttpRequest req) =>
{
    // obtém o token de desconexão da requisição
    var dc = req.DisconnectToken;

    await LongOperationAsync(dc);

    return new HttpResponse();
});
```

Esse token não é compatível com todos os motores HTTP, e cada um requer uma implementação.

## Suporte a eventos enviados pelo servidor

O Sisk suporta [Eventos enviados pelo servidor](https://developer.mozilla.org/en-US/docs/pt-br/Web/API/Server-sent_events), que permite enviar pedaços como um fluxo e manter a conexão entre o servidor e o cliente viva.

Chamar o método [HttpRequest.GetEventSource](/api/Sisk.Core.Http.HttpRequest.GetEventSource) colocará a HttpRequest em seu estado de ouvinte. A partir disso, o contexto desta requisição HTTP não esperará uma HttpResponse, pois ela sobreporá os pacotes enviados por eventos do servidor.

Depois de enviar todos os pacotes, o callback deve retornar o método [Close](/api/Sisk.Core.Http.HttpRequestEventSource.Close), que enviará a resposta final ao servidor e indicará que o streaming foi concluído.

Não é possível prever o comprimento total de todos os pacotes que serão enviados, portanto, não é possível determinar o fim da conexão com o cabeçalho `Content-Length`.

Por padrão da maioria dos navegadores, eventos do servidor não suportam o envio de cabeçalhos HTTP ou métodos diferentes do método GET. Portanto, tenha cuidado ao usar manipuladores de requisição com solicitações de evento de origem que exigem cabeçalhos específicos na requisição, pois eles provavelmente não os terão.

Além disso, a maioria dos navegadores reinicia os fluxos se o método [EventSource.close](https://developer.mozilla.org/en-US/docs/pt-br/Web/API/EventSource/close) não for chamado no lado do cliente após receber todos os pacotes, causando processamento adicional infinito no lado do servidor. Para evitar esse tipo de problema, é comum enviar um pacote final que indica que a origem do evento concluiu o envio de todos os pacotes.

O exemplo abaixo mostra como o navegador pode se comunicar com o servidor que suporta Eventos enviados pelo servidor.

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
        <b>Frutas:</b>
        <ul></ul>
    </body>
    <script>
        const evtSource = new EventSource('http://localhost:5555/event-source');
        const eventList = document.querySelector('ul');
        
        evtSource.onmessage = (e) => {
            const newElement = document.createElement("li");

            newElement.textContent = `mensagem: ${e.data}`;
            eventList.appendChild(newElement);

            if (e.data == "Tomate") {
                evtSource.close();
            }
        }
    </script>
</html>
```

E envie progressivamente as mensagens para o cliente:

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
        
        string[] frutas = new[] { "Maçã", "Banana", "Melancia", "Tomate" };
        
        foreach (string fruta in frutas)
        {
            await serverEvents.SendAsync(fruta);
            await Task.Delay(1500);
        }

        return serverEvents.Close();
    }
}
```

Ao executar esse código, esperamos um resultado semelhante a este:

<img src="/assets/img/server side events demo.gif" />

## Resolvendo IPs e hosts proxy

O Sisk pode ser usado com proxies, e, portanto, os endereços IP podem ser substituídos pelo endpoint do proxy na transação de um cliente para o proxy.

Você pode definir seus próprios resolvidores no Sisk com [resolvidores de encaminhamento](/docs/pt-br/advanced/forwarding-resolvers).

## Codificação de cabeçalhos

A codificação de cabeçalhos pode ser um problema para algumas implementações. No Windows, cabeçalhos UTF-8 não são suportados, então ASCII é usado. O Sisk tem um conversor de codificação incorporado, que pode ser útil para decodificar cabeçalhos codificados incorretamente.

Essa operação é custosa e está desabilitada por padrão, mas pode ser habilitada sob a flag [NormalizeHeadersEncodings](/specification/spec/Sisk.Core.Http.HttpServerFlags.NormalizeHeadersEncodings).