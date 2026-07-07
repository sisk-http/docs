# Respostas

Respostas representam objetos que são respostas HTTP a requisições HTTP. Elas são enviadas pelo servidor ao cliente como uma indicação da solicitação de um recurso, página, documento, arquivo ou outro objeto.

Uma resposta HTTP é composta por status, cabeçalhos e conteúdo.

Neste documento, ensinaremos como arquitetar respostas HTTP com o Sisk.

## Definindo um status HTTP

A lista de status HTTP é a mesma desde o HTTP/1.0, e o Sisk suporta todos eles.

```cs
HttpResponse res = new HttpResponse();
res.Status = System.Net.HttpStatusCode.Accepted; // 202
```

Ou com Sintaxe Fluent:

```cs
new HttpResponse()
    .WithStatus(200) // or
    .WithStatus(HttpStatusCode.Ok) // or
    .WithStatus(HttpStatusInformation.Ok);
```

Você pode ver a lista completa de HttpStatusCode disponíveis [aqui](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httpstatuscode). Você também pode fornecer seu próprio código de status usando a estrutura [HttpStatusInformation](/api/Sisk.Core.Http.HttpStatusInformation).

## Corpo e content-type

Sisk suporta objetos de conteúdo nativos do .NET para enviar corpo nas respostas. Você pode usar a classe [StringContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.stringcontent) para enviar uma resposta JSON, por exemplo:

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

O servidor sempre tentará calcular o `Content-Length` a partir do que você definiu no conteúdo se você não o definiu explicitamente em um cabeçalho. Se o servidor não conseguir obter implicitamente o cabeçalho Content-Length do conteúdo da resposta, a resposta será enviada com Chunked-Encoding.

Você também pode transmitir a resposta enviando um [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent) ou usando o método [GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream).

## Cabeçalhos de resposta

Você pode adicionar, editar ou remover cabeçalhos que está enviando na resposta. O exemplo abaixo mostra como enviar uma resposta de redirecionamento ao cliente.

```cs
HttpResponse res = new HttpResponse();
res.Status = HttpStatusCode.Moved;
res.Headers.Add(HttpKnownHeaderNames.Location, "/login");
```

Ou com Sintaxe Fluent:

```cs
new HttpResponse(301)
    .WithHeader("Location", "/login");
```

Quando você usa o método [Add](/api/Sisk.Core.Entity.HttpHeaderCollection.Add) de HttpHeaderCollection, está adicionando um cabeçalho à requisição sem alterar os que já foram enviados. O método [Set](/api/Sisk.Core.Entity.HttpHeaderCollection.Set) substitui os cabeçalhos com o mesmo nome pelo valor indicado. O indexador de HttpHeaderCollection chama internamente o método Set para substituir os cabeçalhos.

Você também pode recuperar valores de cabeçalhos usando o método [GetHeaderValue](/api/Sisk.Core.Entity.HttpHeaderCollection.GetHeaderValue). Esse método ajuda a obter valores tanto dos cabeçalhos da resposta quanto dos cabeçalhos de conteúdo (se houver conteúdo definido).

```cs
// Retorna o valor do cabeçalho "Content-Type", verificando tanto response.Headers quanto response.Content.Headers
string? contentType = response.GetHeaderValue("Content-Type");
```

## Enviando cookies

O Sisk possui métodos que facilitam a definição de cookies no cliente. Cookies definidos por este método já são codificados em URL e atendem ao padrão RFC-6265.

```cs
HttpResponse res = new HttpResponse();
res.SetCookie("cookie-name", "cookie-value");
```

Ou com Sintaxe Fluent:

```cs
new HttpResponse(301)
    .WithCookie("cookie-name", "cookie-value", expiresAt: DateTime.Now.Add(TimeSpan.FromDays(7)));
```

Existem outras [versões mais completas](/api/Sisk.Core.Helpers.CookieHelper.SetCookie) do mesmo método.

## Respostas em chunked

Você pode definir o transfer encoding como chunked para enviar respostas grandes.

```cs
HttpResponse res = new HttpResponse();
res.SendChunked = true;
```

Ao usar chunked-encoding, o cabeçalho Content-Length é omitido automaticamente.

## Stream de resposta

Streams de resposta são uma forma gerenciada que permite enviar respostas de maneira segmentada. É uma operação de nível mais baixo que usar objetos HttpResponse, pois requer que você envie os cabeçalhos e o conteúdo manualmente, e então feche a conexão.

Este exemplo abre um stream somente leitura para o arquivo, copia o stream para o stream de saída da resposta e não carrega o arquivo inteiro na memória. Isso pode ser útil para servir arquivos médios ou grandes.

```cs
// obtém o stream de saída da resposta
using var fileStream = File.OpenRead("my-big-file.zip");
var responseStream = request.GetResponseStream();

// define a codificação da resposta para usar chunked-encoding
// também você não deve enviar o cabeçalho content-length ao usar
// chunked encoding
responseStream.SendChunked = true;
responseStream.SetStatus(200);
responseStream.SetHeader(HttpKnownHeaderNames.ContentType, contentType);

// copia o stream do arquivo para o stream de saída da resposta
fileStream.CopyTo(responseStream.ResponseStream);

// fecha o stream
return responseStream.Close();
```

## Compressão GZip, Deflate e Brotli

Você pode enviar respostas com conteúdo comprimido no Sisk comprimindo conteúdos HTTP. Primeiro, encapsule seu [HttpContent](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.httpcontent) em um dos compressores abaixo para enviar a resposta comprimida ao cliente.

```cs
router.MapGet("/hello.html", request => {
    string myHtml = "...";
    
    return new HttpResponse () {
        Content = new GZipContent(new HtmlContent(myHtml)),
        // ou Content = new BrotliContent(new HtmlContent(myHtml)),
        // ou Content = new DeflateContent(new HtmlContent(myHtml)),
    };
});
```

Você também pode usar esses conteúdos comprimidos com streams.

```cs
router.MapGet("/archive.zip", request => {
    
    // não aplique "using" aqui. o HttpServer descartará seu conteúdo
    // após enviar a resposta.
    var archive = File.OpenRead("/path/to/big-file.zip");
    
    return new HttpResponse () {
        Content = new GZipContent(archive)
    }
});
```

Os cabeçalhos Content-Encoding são definidos automaticamente ao usar esses conteúdos.

## Compressão automática

É possível comprimir automaticamente respostas HTTP com a propriedade [EnableAutomaticResponseCompression](/api/Sisk.Core.Http.HttpServerConfiguration.EnableAutomaticResponseCompression). Essa propriedade encapsula automaticamente o conteúdo da resposta do roteador em um conteúdo compressível que é aceito pela requisição, desde que a resposta não herde de um [CompressedContent](/api/Sisk.Core.Http.CompressedContent).

Apenas um conteúdo compressível é escolhido para uma requisição, escolhido de acordo com o cabeçalho Accept-Encoding, que segue a ordem:

- [BrotliContent](/api/Sisk.Core.Http.BrotliContent) (br)
- [GZipContent](/api/Sisk.Core.Http.GZipContent) (gzip)
- [DeflateContent](/api/Sisk.Core.Http.DeflateContent) (deflate)

Se a requisição especificar que aceita qualquer um desses métodos de compressão, a resposta será comprimida automaticamente.

## Tipos de resposta implícitos

Você pode usar outros tipos de retorno além de HttpResponse, mas é necessário configurar o roteador sobre como ele lidará com cada tipo de objeto.

O conceito é sempre retornar um tipo de referência e transformá-lo em um objeto HttpResponse válido. Rotas que retornam HttpResponse não passam por nenhuma conversão.

Tipos de valor (structures) não podem ser usados como tipo de retorno porque não são compatíveis com o [RouterCallback](/api/Sisk.Core.Routing.RouterCallback), portanto devem ser encapsulados em um ValueResult para poderem ser usados em manipuladores.

Considere o exemplo a seguir de um módulo de roteador que não usa HttpResponse no tipo de retorno:

```cs
[RoutePrefix("/users")]
public class UsersController : RouterModule
{
    public List<User> Users = new List<User>();

    [RouteGet]
    public IEnumerable<User> Index(HttpRequest request)
    {
        return Users.ToArray();
    }

    [RouteGet("<id>")]
    public User View(HttpRequest request)
    {
        int id = request.RouteParameters["id"].GetInteger();
        User dUser = Users.First(u => u.Id == id);

        return dUser;
    }

    [RoutePost]
    public ValueResult<bool> Create(HttpRequest request)
    {
        User fromBody = request.GetJsonContent<User>()!;
        Users.Add(fromBody);
        
        return true;
    }
}
```

Com isso, agora é necessário definir no roteador como ele lidará com cada tipo de objeto. Objetos são sempre o primeiro argumento do manipulador e o tipo de saída deve ser um HttpResponse válido. Além disso, os objetos de saída de uma rota nunca devem ser nulos.

Para tipos ValueResult não é necessário indicar que o objeto de entrada é um ValueResult e apenas T, já que ValueResult é um objeto refletido de seu componente original.

A associação de tipos não compara o que foi registrado com o tipo do objeto retornado do callback do roteador. Em vez disso, verifica se o tipo do resultado do roteador é atribuível ao tipo registrado.

Registrar um manipulador do tipo Object será um fallback para todos os tipos previamente não validados. A ordem de inserção dos manipuladores de valor também importa, portanto registrar um manipulador Object ignorará todos os outros manipuladores específicos de tipo. Sempre registre manipuladores de valor específicos primeiro para garantir a ordem.

```cs
Router r = new Router();
r.MapInstance(new UsersController());

r.RegisterValueHandler<ApiResult>(apiResult =>
{
    return new HttpResponse() {
        Status = apiResult.Success ? HttpStatusCode.OK : HttpStatusCode.BadRequest,
        Content = apiResult.GetHttpContent(),
        Headers = apiResult.GetHeaders()
    };
});
r.RegisterValueHandler<bool>(bvalue =>
{
    return new HttpResponse() {
        Status = bvalue ? HttpStatusCode.OK : HttpStatusCode.BadRequest
    };
});
r.RegisterValueHandler<IEnumerable<object>>(enumerableValue =>
{
    return new HttpResponse(string.Join("\n", enumerableValue));
});

// registering an value handler of object must be the last
// value handler which will be used as an fallback
r.RegisterValueHandler<object>(fallback =>
{
    return new HttpResponse() {
        Status = HttpStatusCode.OK,
        Content = JsonContent.Create(fallback)
    };
});
```

## Ações Diferidas

Quando uma requisição chega ao roteador, ela primeiro passa pelos [request handlers](/docs/pt-br/fundamentals/request-handlers), é processada na ação do roteador e depois pelos manipuladores de requisição pós-execução. O resultado da ação do roteador é o que é passado para os manipuladores de valor, e o resultado do manipulador de valor é o que é enviado ao cliente como resposta.

Esse ciclo de vida ocorre dentro de um contexto assíncrono. Esse contexto assíncrono expõe variáveis que o usuário pode adicionar ao [HttpContext Bag](/api/Sisk.Core.Http.HttpContext) para compartilhar dados entre manipuladores e a ação do roteador. O valor retornado pela ação do roteador é adicionado a esse contexto assíncrono e pode ser acessado pelos manipuladores de valor.

Ações diferidas são ações que sempre serão executadas ao final do ciclo, após entregar a resposta ao cliente, mas ainda dentro do mesmo contexto assíncrono. Essas ações podem ser usadas para executar tarefas de longa duração que não precisam ser concluídas para enviar uma resposta ao cliente, como salvar logs, atualizar o banco de dados, enviar e‑mails, etc.

Exceções ainda são capturadas em ações diferidas e serão tratadas da mesma forma que uma exceção lançada em qualquer ponto do ciclo de vida da requisição. A diferença é que o cliente já terá uma resposta, portanto a exceção é tratada pelo tratamento de erro padrão.

Adie a execução de uma ação usando o método [HttpContext.EnqueueDeferredAction](/api/Sisk.Core.Http.HttpContext.EnqueueDeferredAction). O método recebe uma função assíncrona que representa a ação a ser executada e um timeout opcional para limitar o tempo de execução da ação. Se a ação não for concluída dentro do limite de tempo, ela será cancelada.

```csharp
[RoutePost("/send-mail")]
public HttpResponse SendMail(HttpRequest request)
{
    string to = request.Query["to"].GetString();
    string subject = request.Query["subject"].GetString();
    string body = request.Query["body"].GetString();
    if (string.IsNullOrWhiteSpace(to) || string.IsNullOrWhiteSpace(subject) || string.IsNullOrWhiteSpace(body))
    {
        throw new ApiException("Missing required parameters.");
    }

    // agenda uma ação de longa duração que será executada após enviar a resposta ao cliente, mas ainda dentro do mesmo contexto assíncrono da requisição
    request.Context.EnqueueDeferredAction(async (ct) =>
    {
        await EmailService.SendEmailAsync(to, subject, body);
    }, timeout: TimeSpan.FromSeconds(30));

    return new HttpResponse()
    {
        Status = 200,
        Content = new StringContent("Sending the email...")
    };
}
```

## Observação sobre objetos enumeráveis e arrays

Objetos de resposta implícitos que implementam [IEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.ienumerable?view=net-8.0) são lidos na memória através do método `ToArray()` antes de serem convertidos por um manipulador de valor definido. Para que isso ocorra, o objeto `IEnumerable` é convertido em um array de objetos, e o conversor de resposta sempre receberá um `Object[]` em vez do tipo original.

Considere o seguinte cenário:

```csharp
using var host = HttpServer.CreateBuilder(12300)
    .UseRouter(r =>
    {
        r.RegisterValueHandler<IEnumerable<string>>(stringEnumerable =>
        {
            return new HttpResponse("String array:\n" + string.Join("\n", stringEnumerable));
        });
        r.RegisterValueHandler<IEnumerable<object>>(stringEnumerable =>
        {
            return new HttpResponse("Object array:\n" + string.Join("\n", stringEnumerable));
        });
        r.MapGet("/", request =>
        {
            return (IEnumerable<string>)["hello", "world"];
        });
    })
    .Build();
```

No exemplo acima, o conversor `IEnumerable<string>` **nunca será chamado**, porque o objeto de entrada será sempre um `Object[]` e não é convertível para `IEnumerable<string>`. No entanto, o conversor abaixo que recebe um `IEnumerable<object>` receberá sua entrada, já que seu valor é compatível.

Se você precisar realmente lidar com o tipo do objeto que será enumerado, precisará usar reflexão para obter o tipo do elemento da coleção. Todos os objetos enumeráveis (listas, arrays e coleções) são convertidos em um array de objetos pelo conversor de resposta HTTP.

Valores que implementam [IAsyncEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.generic.iasyncenumerable-1?view=net-8.0) são tratados automaticamente pelo servidor se a propriedade [ConvertIAsyncEnumerableIntoEnumerable](/api/Sisk.Core.Http.HttpServerConfiguration.ConvertIAsyncEnumerableIntoEnumerable) estiver habilitada, similar ao que acontece com `IEnumerable`. Essa opção está habilitada por padrão em `HttpServerConfiguration`; uma enumeração assíncrona é convertida em um enumerador bloqueante e então convertida em um array síncrono de objetos. Desative-a somente quando você fornecer seu próprio manipulador de valor ou estratégia de resposta em streaming para sequências assíncronas.