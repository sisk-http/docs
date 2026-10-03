---
title: "Requisições"
weight: 30
aliases:
  - "/docs/pt-br/fundamentals/requests.html"
sourceHash: "420b8cb28dc547bf"
---

Requisições são estruturas que representam uma mensagem de requisição HTTP. O objeto [HttpRequest](/api/Sisk.Core.Http.HttpRequest) contém funções úteis para manipular mensagens HTTP em toda a sua aplicação.

Uma requisição HTTP é composta pelo método, caminho, versão, cabeçalhos e corpo.

Neste documento, ensinaremos como obter cada um desses elementos.

## Obtendo o método da requisição

Para obter o método da requisição recebida, você pode usar a propriedade Method:

```cs
static HttpResponse Index(HttpRequest request)
{
    HttpMethod requestMethod = request.Method;
    ...
}
```

Esta propriedade retorna o método da requisição representado por um objeto [HttpMethod](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.httpmethod).

> [!NOTE]
> Ao contrário dos métodos de rota, esta propriedade não serve ao item [RouteMethod.Any](/api/Sisk.Core.Routing.RouteMethod). Em vez disso, ela retorna o método real da requisição.

## Obtendo componentes da URL da requisição

Você pode obter vários componentes de uma URL através de determinadas propriedades de uma requisição. Para este exemplo, vamos considerar a URL:

```
http://localhost:5000/user/login?email=foo@bar.com
```

| Nome do componente | Descrição | Valor do componente |
| --- | --- | --- |
| [Path](/api/Sisk.Core.Http.HttpRequest.Path) | Obtém o caminho da requisição. | `/user/login` |
| [FullPath](/api/Sisk.Core.Http.HttpRequest.FullPath) | Obtém o caminho da requisição e a string de consulta. | `/user/login?email=foo@bar.com` |
| [FullUrl](/api/Sisk.Core.Http.HttpRequest.FullUrl) | Obtém a string completa da URL da requisição. | `http://localhost:5000/user/login?email=foo@bar.com` |
| [Host](/api/Sisk.Core.Http.HttpRequest.Host) | Obtém o host da requisição. | `localhost` |
| [Authority](/api/Sisk.Core.Http.HttpRequest.Authority) | Obtém o host e a porta da requisição. | `localhost:5000` |
| [QueryString](/api/Sisk.Core.Http.HttpRequest.QueryString) | Obtém a consulta da requisição. | `?email=foo@bar.com` |
| [Query](/api/Sisk.Core.Http.HttpRequest.Query) | Obtém a consulta da requisição em uma coleção de valores nomeados. | `{StringValueCollection object}` |
| [IsSecure](/api/Sisk.Core.Http.HttpRequest.IsSecure) | Determina se a requisição está usando SSL (true) ou não (false). | `false` |

Você também pode optar por usar a propriedade [HttpRequest.Uri](/api/Sisk.Core.Http.HttpRequest.Uri), que inclui tudo acima em um único objeto.

## Metadados da requisição e cancelamento

Sisk também anexa metadados operacionais a cada requisição. Essas propriedades são úteis para logs, rastreamento, localização, diagnósticos e operações de longa duração:

| Propriedade ou método | Uso |
| --- | --- |
| [RequestId](/api/Sisk.Core.Http.HttpRequest.RequestId) | Um identificador único para a requisição. Habilite [IncludeRequestIdHeader](/api/Sisk.Core.Http.HttpServerConfiguration.IncludeRequestIdHeader) para retorná-lo como `X-Request-Id`. |
| [RequestedAt](/api/Sisk.Core.Http.HttpRequest.RequestedAt) | O momento em que o Sisk criou o objeto de requisição. |
| [RemoteAddress](/api/Sisk.Core.Http.HttpRequest.RemoteAddress) | O endereço do cliente resolvido a partir da conexão, ou do seu [ForwardingResolver](/docs/advanced/forwarding-resolvers). |
| [Culture](/api/Sisk.Core.Http.HttpRequest.Culture) | A melhor cultura resolvida a partir de `Accept-Language`, recuando para a cultura atual. |
| [DisconnectToken](/api/Sisk.Core.Http.HttpRequest.DisconnectToken) | Um token de cancelamento sinalizado quando o cliente se desconecta, quando suportado pelo motor HTTP configurado. |
| [Bag](/api/Sisk.Core.Http.HttpRequest.Bag) | Um armazenamento tipado de chave/valor compartilhado entre manipuladores de requisição e a ação da rota. |
| [GetRawHttpRequest](/api/Sisk.Core.Http.HttpRequest.GetRawHttpRequest) | Uma representação textual da requisição para diagnóstico. |

## Obtendo o corpo da requisição

Algumas requisições incluem corpo, como formulários, arquivos ou transações de API. Você pode obter o corpo de uma requisição a partir da propriedade:

```cs
// obtém o corpo da requisição como uma string, usando a codificação da requisição como codificador
string body = request.Body;

// ou obtém em um array de bytes
byte[] bodyBytes = request.RawBody;

// ou então, você pode transmiti-lo como stream.
Stream requestStream = request.GetRequestStream();

// ou ler o corpo de forma assíncrona
Memory<byte> bodyMemory = await request.GetBodyContentsAsync();
```

Também é possível determinar se há um corpo na requisição e se ele está carregado com as propriedades [HasContents](/api/Sisk.Core.Http.HttpRequest.HasContents), que determina se a requisição tem conteúdo, e [IsContentAvailable](/api/Sisk.Core.Http.HttpRequest.IsContentAvailable) que indica que o servidor HTTP recebeu totalmente o conteúdo do ponto remoto.

Não é possível ler o conteúdo da requisição através de `GetRequestStream` mais de uma vez. Se você ler com este método, os valores em `RawBody` e `Body` também não ficarão disponíveis. Não é necessário descartar o stream da requisição no contexto da requisição, pois ele é descartado ao final da sessão HTTP em que foi criado. Além disso, você pode usar a propriedade [HttpRequest.RequestEncoding](/api/Sisk.Core.Http.HttpRequest.RequestEncoding) para obter a melhor codificação para decodificar a requisição manualmente.

O servidor tem limites para leitura do conteúdo da requisição, que se aplicam tanto a [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body) quanto a [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.Body). Essas propriedades copiam todo o stream de entrada para um buffer local do mesmo tamanho de [HttpRequest.ContentLength](/api/Sisk.Core.Http.HttpRequest.ContentLength).

Uma resposta com status 413 Content Too Large é retornada ao cliente se o conteúdo enviado for maior que [HttpServerConfiguration.MaximumContentLength](/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength) definido na configuração do usuário. Além disso, se não houver limite configurado ou se ele for muito grande, o servidor lançará uma [OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception?view=net-8.0) quando o conteúdo enviado pelo cliente exceder [Int32.MaxValue](https://learn.microsoft.com/en-us/dotnet/api/system.int32.maxvalue) (2 GB) e se o conteúdo for tentado ser acessado através de uma das propriedades mencionadas acima. Você ainda pode lidar com o conteúdo por streaming.

> [!NOTE]
> Embora o Sisk permita, é sempre uma boa ideia seguir a Semântica HTTP ao criar sua aplicação e não obter ou servir conteúdo em métodos que não o permitem. Leia sobre [RFC 9110 "HTTP Semantics"](https://httpwg.org/spec/rfc9110.html).

## Lendo requisições JSON

Para APIs JSON, prefira os auxiliares JSON embutidos em vez de ler `Body` e desserializar manualmente. Eles utilizam [System.Text.Json](https://learn.microsoft.com/en-us/dotnet/api/system.text.json) e, por padrão, [HttpRequest.DefaultJsonSerializerOptions](/api/Sisk.Core.Http.HttpRequest.DefaultJsonSerializerOptions).

```cs
public record CreateUserRequest(string Name, string Email);

router.MapPost("/users", (HttpRequest request) =>
{
    CreateUserRequest? body = request.GetJsonContent<CreateUserRequest>();
    if (body is null)
        return new HttpResponse(System.Net.HttpStatusCode.BadRequest);

    return new HttpResponse(System.Net.HttpStatusCode.Created);
});
```

Use a sobrecarga assíncrona quando você já está em uma rota async ou deseja que o cancelamento da requisição interrompa a desserialização:

```cs
router.MapPost("/users", async (HttpRequest request) =>
{
    CreateUserRequest? body =
        await request.GetJsonContentAsync<CreateUserRequest>(request.DisconnectToken);

    if (body is null)
        return new HttpResponse(System.Net.HttpStatusCode.BadRequest);

    return new HttpResponse(System.Net.HttpStatusCode.Created);
});
```

Você pode passar opções personalizadas de [JsonSerializerOptions](https://learn.microsoft.com/en-us/dotnet/api/system.text.json.jsonserializeroptions) para um endpoint específico:

```cs
var options = new JsonSerializerOptions(JsonSerializerDefaults.Web)
{
    PropertyNameCaseInsensitive = true
};

UserDto? user = request.GetJsonContent<UserDto>(options);
```

Para aplicações Native AOT ou sensíveis a trimming, use a sobrecarga `JsonTypeInfo<T>` gerada por um `JsonSerializerContext`:

```cs
[JsonSerializable(typeof(CreateUserRequest))]
public partial class AppJsonSerializerContext : JsonSerializerContext
{
}

CreateUserRequest? body =
    await request.GetJsonContentAsync(
        AppJsonSerializerContext.Default.CreateUserRequest,
        request.DisconnectToken);
```

A mesma regra de leitura única se aplica aos auxiliares JSON: depois que o Sisk lê o stream da requisição através de `GetJsonContent`, `GetJsonContentAsync`, `Body` ou `RawBody`, você não pode consumir novamente o mesmo corpo via `GetRequestStream()`.

## Obtendo o contexto da requisição

O HTTP Context é um objeto exclusivo do Sisk que armazena informações do servidor HTTP, rota, roteador e manipulador de requisição. Você pode usá-lo para organizar-se em um ambiente onde esses objetos são difíceis de organizar.

Você pode obter o [HttpContext](/api/Sisk.Core.Http.HttpContext) em execução usando o método estático `HttpContext.GetCurrentContext()`. Este método retorna o contexto da requisição que está sendo processada na thread atual.

```cs
HttpContext context = HttpContext.GetCurrentContext();
```

### Modo de Log

A propriedade [HttpContext.LogMode](/api/Sisk.Core.Http.HttpContext.LogMode) permite controlar o comportamento de logging para a requisição atual. Você pode habilitar ou desabilitar o logging para requisições específicas, sobrescrevendo a configuração padrão do servidor.

```cs
// Desabilitar logging para esta requisição
context.LogMode = LogOutputMode.None;
```

### Request Bag

O objeto [RequestBag](/api/Sisk.Core.Http.HttpContext.RequestBag) contém informações armazenadas que são passadas de um manipulador de requisição para outro ponto, e podem ser consumidas no destino final. Esse objeto também pode ser usado por manipuladores de requisição que são executados após o callback da rota.

> [!TIP]
> Esta propriedade também está acessível pela propriedade [HttpRequest.Bag](/api/Sisk.Core.Http.HttpRequest.Bag).

```cs {title="Middleware/AuthenticateUserRequestHandler.cs"}
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

O manipulador acima definirá `AuthenticatedUser` no request bag, e poderá ser consumido posteriormente no callback final:

```cs {title="Controller/MyController.cs"}
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

Você também pode usar os métodos auxiliares `Bag.Set()` e `Bag.Get()` para obter ou definir objetos pelos seus tipos singleton.

A classe `TypedValueDictionary` também fornece os métodos `GetValue` e `SetValue` para maior controle.

```cs {title="Middleware/Authenticate.cs"}
public class Authenticate : RequestHandler
{
    public override HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        request.Bag.Set<User>(authUser);
    }
}
```

```csharp {title="Controller/MyController.cs"}
[RouteGet("/")]
[RequestHandler<Authenticate>]
public static HttpResponse GetUser(HttpRequest request)
{
    var user = request.Bag.Get<User>();
    ...
}
```

## Obtendo dados de formulário

Você pode obter valores de dados de formulário em uma [StringKeyStoreCollection](/api/Sisk.Core.Entity.StringKeyStoreCollection) com o exemplo abaixo:

```cs {title="Controller/Auth.cs"}
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

A versão assíncrona é útil quando o corpo da requisição pode ser grande ou quando você deseja suporte a cancelamento:

```cs
var form = await request.GetFormContentAsync(request.DisconnectToken);
```

## Obtendo dados de formulário multipart

O HTTP request do Sisk permite obter conteúdos multipart enviados, como arquivos, campos de formulário ou qualquer conteúdo binário.

```cs {title="Controller/Auth.cs"}
[RoutePost("/upload-contents")]
public HttpResponse Index(HttpRequest request)
{
    // o método a seguir lê todo o input da requisição em
    // um array de MultipartObjects
    var multipartFormDataObjects = request.GetMultipartFormContent();
    
    foreach (MultipartObject uploadedObject in multipartFormDataObjects)
    {
        // O nome do arquivo fornecido pelo multipart form data.
        // Null é retornado se o objeto não for um arquivo.
        Console.WriteLine("File name       : " + uploadedObject.Filename);

        // O nome do campo do multipart form data.
        Console.WriteLine("Field name      : " + uploadedObject.Name);

        // O tamanho do conteúdo do multipart form data.
        Console.WriteLine("Content length  : " + uploadedObject.ContentLength);

        // Determina o formato da imagem baseado no cabeçalho do arquivo para cada
        // tipo de conteúdo conhecido. Se o conteúdo não for um formato de arquivo
        // comum reconhecido, este método abaixo retornará MultipartObjectCommonFormat.Unknown
        Console.WriteLine("Common format   : " + uploadedObject.GetCommonFileFormat());
    }
}
```

Use [GetMultipartFormContentAsync](/api/Sisk.Core.Http.HttpRequest.GetMultipartFormContentAsync) quando a rota for assíncrona:

```cs
var multipartFormDataObjects =
    await request.GetMultipartFormContentAsync(request.DisconnectToken);
```

Você pode ler mais sobre os [objetos multipart do Sisk](/api/Sisk.Core.Entity.MultipartObject) e seus métodos, propriedades e funcionalidades.

## Detectando desconexão do cliente

Desde a versão v1.15 do Sisk, o framework fornece um token de cancelamento através de [HttpRequest.DisconnectToken](/api/Sisk.Core.Http.HttpRequest.DisconnectToken). Quando o motor HTTP configurado suporta detecção de desconexão, esse token é cancelado quando a conexão do cliente é fechada antes que a resposta seja concluída. Isso é útil para interromper operações de longa duração quando o cliente não está mais aguardando o resultado.

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

O motor padrão do Sisk, baseado em `System.Net.HttpListener`, não suporta detecção de desconexão do cliente. Quando sua aplicação usa o motor padrão, `DisconnectToken` é `CancellationToken.None`; na prática, ele é um token que não pode ser cancelado e deve ser tratado como indisponível.

O [motor Cadente](/docs/cadente) suporta `DisconnectToken`. Se sua rota depende de cancelamento consciente de desconexão, use o Cadente ou outro motor que implemente explicitamente esse comportamento. Mesmo com um motor suportado, o cancelamento é cooperativo: passe o token para APIs assíncronas e verifique-o em seu próprio trabalho de longa duração.

## Suporte a eventos enviados pelo servidor

Sisk suporta [Server-sent events](https://developer.mozilla.org/en-US/docs/pt-br/Web/API/Server-sent_events), que permite enviar blocos como um stream e manter a conexão entre o servidor e o cliente viva.

Chamar o método [HttpRequest.GetEventSource](/api/Sisk.Core.Http.HttpRequest.GetEventSource) colocará o HttpRequest em seu estado de listener. A partir disso, o contexto desta requisição HTTP não esperará um HttpResponse, pois ele sobreporá os pacotes enviados pelos eventos do lado do servidor.

Após enviar todos os pacotes, o callback deve retornar o método [Close](/api/Sisk.Core.Http.HttpRequestEventSource.Close), que enviará a resposta final ao cliente e indicará que o streaming terminou.

Não é possível prever qual será o comprimento total de todos os pacotes que serão enviados, portanto não é possível determinar o fim da conexão com o cabeçalho `Content-Length`.

Pela maioria dos navegadores, eventos do lado do servidor não suportam o envio de cabeçalhos HTTP ou métodos diferentes de GET. Portanto, tenha cuidado ao usar manipuladores de requisição com solicitações de event‑source que exigem cabeçalhos específicos, pois provavelmente eles não estarão presentes.

Além disso, a maioria dos navegadores reinicia streams se o método [EventSource.close](https://developer.mozilla.org/en-US/docs/pt-br/Web/API/EventSource/close) não for chamado no cliente após receber todos os pacotes, causando processamento adicional infinito no lado do servidor. Para evitar esse tipo de problema, é comum enviar um pacote final indicando que a fonte de eventos terminou de enviar todos os pacotes.

O exemplo abaixo mostra como o navegador pode se comunicar com o servidor que suporta eventos do lado do servidor.

```html {title="sse-example.html"}
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

E enviar progressivamente as mensagens ao cliente:

```cs {title="Controller/MyController.cs"}
public class MyController
{
    [RouteGet("/event-source")]
    public async Task<HttpResponse> ServerEventsResponse(HttpRequest request)
    {
        var serverEvents = await request.GetEventSourceAsync ();
        
        string[] fruits = new[] { "Apple", "Banana", "Watermelon", "Tomato" };
        
        foreach (string fruit in fruits)
        {
            await serverEvents.SendAsync(fruit);
            await Task.Delay(1500);
        }

        return await serverEvents.CloseAsync();
    }
}
```

Ao executar este código, esperamos um resultado semelhante a este:

<img src="/assets/img/server side events demo.gif" />

## Resolvendo IPs e hosts proxyados

Sisk pode ser usado com proxies, e portanto endereços IP podem ser substituídos pelo endpoint do proxy na transação de um cliente para o proxy.

Você pode definir seus próprios resolvedores no Sisk com [forwarding resolvers](/docs/advanced/forwarding-resolvers).

## Codificação de cabeçalhos

A codificação de cabeçalhos pode ser um problema para algumas implementações. No Windows, cabeçalhos UTF‑8 não são suportados, então ASCII é usado. O Sisk possui um conversor de codificação embutido, que pode ser útil para decodificar cabeçalhos codificados incorretamente.

Essa operação é custosa e está desabilitada por padrão, mas pode ser habilitada com [HttpServerConfiguration.NormalizeHeadersEncodings](/api/Sisk.Core.Http.HttpServerConfiguration.NormalizeHeadersEncodings).
