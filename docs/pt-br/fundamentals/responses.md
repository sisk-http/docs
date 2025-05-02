# Respostas

Respostas representam objetos que são respostas HTTP para solicitações HTTP. Elas são enviadas pelo servidor ao cliente como uma indicação da solicitação de um recurso, página, documento, arquivo ou outro objeto.

Uma resposta HTTP é formada por status, cabeçalhos e conteúdo.

Neste documento, ensinaremos como arquitetar respostas HTTP com Sisk.

## Definindo um status HTTP

A lista de status HTTP é a mesma desde o HTTP/1.0, e Sisk suporta todos eles.

```cs
HttpResponse res = new HttpResponse();
res.Status = System.Net.HttpStatusCode.Accepted; //202
```

Ou com Sintaxe Fluente:

```cs
new HttpResponse()
 .WithStatus(200) // ou
 .WithStatus(HttpStatusCode.Ok) // ou
 .WithStatus(HttpStatusInformation.Ok);
```

Você pode ver a lista completa de HttpStatusCode disponíveis [aqui](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httpstatuscode). Você também pode fornecer seu próprio código de status usando a estrutura [HttpStatusInformation](/api/Sisk.Core.Http.HttpStatusInformation).

## Corpo e tipo de conteúdo

Sisk suporta objetos de conteúdo .NET nativos para enviar corpos em respostas. Você pode usar a classe [StringContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.stringcontent) para enviar uma resposta JSON, por exemplo:

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

O servidor sempre tentará calcular o `Content-Length` do que você definiu no conteúdo se você não o definiu explicitamente em um cabeçalho. Se o servidor não puder obter implicitamente o cabeçalho Content-Length do conteúdo da resposta, a resposta será enviada com Chunked-Encoding.

Você também pode transmitir a resposta enviando um [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent) ou usando o método [GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream).

## Cabeçalhos de resposta

Você pode adicionar, editar ou remover cabeçalhos que está enviando na resposta. O exemplo abaixo mostra como enviar uma resposta de redirecionamento para o cliente.

```cs
HttpResponse res = new HttpResponse();
res.Status = HttpStatusCode.Moved;
res.Headers.Add(HttpKnownHeaderNames.Location, "/login");
```

Ou com Sintaxe Fluente:

```cs
new HttpResponse(301)
 .WithHeader("Location", "/login");
```

Quando você usa o método [Add](/api/Sisk.Core.Entity.HttpHeaderCollection.Add) de HttpHeaderCollection, você está adicionando um cabeçalho à solicitação sem alterar os que já foram enviados. O método [Set](/api/Sisk.Core.Entity.HttpHeaderCollection.Set) substitui os cabeçalhos com o mesmo nome pelo valor instruído. O indexador de HttpHeaderCollection chama internamente o método Set para substituir os cabeçalhos.

## Enviando cookies

Sisk tem métodos que facilitam a definição de cookies no cliente. Cookies definidos por este método já estão codificados em URL e atendem ao padrão RFC-6265.

```cs
HttpResponse res = new HttpResponse();
res.SetCookie("nome-do-cookie", "valor-do-cookie");
```

Ou com Sintaxe Fluente:

```cs
new HttpResponse(301)
 .WithCookie("nome-do-cookie", "valor-do-cookie", expiresAt: DateTime.Now.Add(TimeSpan.FromDays(7)));
```

Existem outras [versões mais completas](/api/Sisk.Core.Http.CookieHelper.SetCookie) do mesmo método.

## Respostas chunked

Você pode definir a codificação de transferência como chunked para enviar respostas grandes.

```cs
HttpResponse res = new HttpResponse();
res.SendChunked = true;
```

Quando usar chunked-encoding, o cabeçalho Content-Length é automaticamente omitido.

## Fluxo de resposta

Os fluxos de resposta são uma maneira gerenciada que permite enviar respostas de forma segmentada. É uma operação de nível mais baixo do que usar objetos HttpResponse, pois exigem que você envie os cabeçalhos e o conteúdo manualmente e, em seguida, feche a conexão.

Este exemplo abre um fluxo de leitura somente para o arquivo, copia o fluxo para o fluxo de saída da resposta e não carrega o arquivo inteiro na memória. Isso pode ser útil para servir arquivos médios ou grandes.

```cs
// obtém o fluxo de saída da resposta
using var fileStream = File.OpenRead("meu-arquivo-grande.zip");
var responseStream = request.GetResponseStream();

// define a codificação de resposta para usar chunked-encoding
// também você não deve enviar o cabeçalho content-length quando usar
// chunked encoding
responseStream.SendChunked = true;
responseStream.SetStatus(200);
responseStream.SetHeader(HttpKnownHeaderNames.ContentType, contentType);

// copia o fluxo do arquivo para o fluxo de saída da resposta
fileStream.CopyTo(responseStream.ResponseStream);

// fecha o fluxo
return responseStream.Close();
```

## Compressão GZip, Deflate e Brotli

Você pode enviar respostas com conteúdo comprimido em Sisk com conteúdos HTTP comprimidos. Primeiramente, encapsule seu objeto [HttpContent](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.httpcontent) dentro de um dos compressores abaixo para enviar a resposta comprimida ao cliente.

```cs
router.MapGet("/hello.html", request => {
 string meuHtml = "...";
    
 return new HttpResponse () {
 Content = new GZipContent(new HtmlContent(meuHtml)),
 // ou Content = new BrotliContent(new HtmlContent(meuHtml)),
 // ou Content = new DeflateContent(new HtmlContent(meuHtml)),
 };
});
```

Você também pode usar esses conteúdos comprimidos com fluxos.

```cs
router.MapGet("/archive.zip", request => {
    
 // não aplique "using" aqui. o HttpServer irá descartar seu conteúdo
 // após enviar a resposta.
 var arquivo = File.OpenRead("/caminho/para/arquivo-grande.zip");
    
 return new HttpResponse () {
 Content = new GZipContent(arquivo)
 }
});
```

Os cabeçalhos Content-Encoding são automaticamente definidos quando usados esses conteúdos.

## Compressão automática

É possível comprimir automaticamente respostas HTTP com a propriedade [EnableAutomaticResponseCompression](/api/Sisk.Core.Http.HttpServerConfiguration.EnableAutomaticResponseCompression). Essa propriedade encapsula automaticamente o conteúdo da resposta do roteador em um conteúdo comprimido que é aceito pela solicitação, desde que a resposta não seja herdada de um [CompressedContent](/api/Sisk.Core.Http.CompressedContent).

Apenas um conteúdo comprimido é escolhido para uma solicitação, escolhido de acordo com o cabeçalho Accept-Encoding, que segue a ordem:

- [BrotliContent](/api/Sisk.Core.Http.BrotliContent) (br)
- [GZipContent](/api/Sisk.Core.Http.GZipContent) (gzip)
- [DeflateContent](/api/Sisk.Core.Http.DeflateContent) (deflate)

Se a solicitação especificar que aceita qualquer um desses métodos de compressão, a resposta será automaticamente comprimida.

## Tipos de resposta implícitos

Você pode usar outros tipos de retorno além de HttpResponse, mas é necessário configurar o roteador para lidar com cada tipo de objeto.

O conceito é sempre retornar um tipo de referência e transformá-lo em um objeto HttpResponse válido. Rotas que retornam HttpResponse não passam por nenhuma conversão.

Tipos de valor (estruturas) não podem ser usados como tipo de retorno porque não são compatíveis com o [RouterCallback](/api/Sisk.Core.Routing.RouterCallback), portanto, devem ser encapsulados em um ValueResult para poderem ser usados em manipuladores.

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
 User fromBody = JsonSerializer.Deserialize<User>(request.Body)!;
 Users.Add(fromBody);
        
 return true;
 }
}
```

Com isso, agora é necessário definir no roteador como ele lidará com cada tipo de objeto. Objetos são sempre o primeiro argumento do manipulador e o tipo de saída deve ser um HttpResponse válido. Além disso, os objetos de saída de uma rota nunca devem ser nulos.

Para tipos ValueResult, não é necessário indicar que o objeto de entrada é um ValueResult e apenas T, pois ValueResult é um objeto refletido de seu componente original.

A associação de tipos não compara o que foi registrado com o tipo do objeto retornado do callback do roteador. Em vez disso, verifica se o tipo do resultado do roteador é atribuível ao tipo registrado.

Registrar um manipulador do tipo Object será um fallback para todos os tipos não validados anteriormente. A ordem de inserção dos manipuladores de valor também importa, portanto, registrar um manipulador de objeto primeiro ignorará todos os outros manipuladores específicos de tipo. Sempre registre manipuladores de valor específicos primeiro para garantir a ordem.

```cs
Router r = new Router();
r.SetObject(new UsersController());

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

// registrando um manipulador de valor de objeto deve ser o último
// manipulador de valor que será usado como fallback
r.RegisterValueHandler<object>(fallback =>
{
 return new HttpResponse() {
 Status = HttpStatusCode.OK,
 Content = JsonContent.Create(fallback)
 };
});
```

## Nota sobre objetos enumeráveis e arrays

Objetos de resposta implícitos que implementam [IEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.ienumerable?view=net-8.0) são lidos na memória através do método `ToArray()` antes de serem convertidos através de um manipulador de valor definido. Para que isso ocorra, o objeto `IEnumerable` é convertido em uma matriz de objetos, e o conversor de resposta sempre receberá um `Object[]` em vez do tipo original.

Considere o cenário a seguir:

```csharp
using var host = HttpServer.CreateBuilder(12300)
 .UseRouter(r =>
 {
 r.RegisterValueHandler<IEnumerable<string>>(stringEnumerable =>
 {
 return new HttpResponse("Matriz de string:\n" + string.Join("\n", stringEnumerable));
 });
 r.RegisterValueHandler<IEnumerable<object>>(stringEnumerable =>
 {
 return new HttpResponse("Matriz de objeto:\n" + string.Join("\n", stringEnumerable));
 });
 r.MapGet("/", request =>
 {
 return (IEnumerable<string>)["hello", "world"];
 });
 })
 .Build();
```

No exemplo acima, o conversor `IEnumerable<string>` **nunca será chamado**, porque o objeto de entrada sempre será um `Object[]` e não é conversível para um `IEnumerable<string>`. No entanto, o conversor abaixo que recebe um `IEnumerable<object>` receberá sua entrada, pois seu valor é compatível.

Se você precisar lidar com o tipo de objeto que será enumerado, você precisará usar reflexão para obter o tipo do elemento da coleção. Todos os objetos enumeráveis (listas, arrays e coleções) são convertidos em uma matriz de objetos pelo conversor de resposta HTTP.

Valores que implementam [IAsyncEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.generic.iasyncenumerable-1?view=net-8.0) são tratados automaticamente pelo servidor se a propriedade [ConvertIAsyncEnumerableIntoEnumerable](/api/Sisk.Core.Http.HttpServerConfiguration.ConvertIAsyncEnumerableIntoEnumerable) estiver habilitada, semelhante ao que acontece com `IEnumerable`. Uma enumeração assíncrona é convertida em um enumerador bloqueador e, em seguida, convertida em uma matriz de objetos síncronos.