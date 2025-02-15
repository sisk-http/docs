# Respostas

Respostas representam objetos que são respostas HTTP para requisições HTTP. Elas são enviadas pelo servidor para o cliente como uma indicação da requisição de um recurso, página, documento, arquivo ou outro objeto.

Uma resposta HTTP é formada por status, headers e conteúdo.

Neste documento, vamos ensinar como arquitetar respostas HTTP com Sisk.

## Definindo um status HTTP

A lista de status HTTP é a mesma desde o HTTP/1.0, e Sisk suporta todos eles.

```cs
HttpResponse res = new HttpResponse();
res.Status = System.Net.HttpStatusCode.Accepted; // 202
```

Ou com sintaxe Fluent:

```cs
new HttpResponse()
    .WithStatus(200) // ou
    .WithStatus(HttpStatusCode.Ok) // ou
    .WithStatus(HttpStatusInformation.Ok);
```

Você pode ver a lista completa de HttpStatusCode disponíveis [aqui](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httpstatuscode). Você também pode fornecer seu próprio código de status usando a estrutura [HttpStatusInformation](/api/Sisk.Core.Http.HttpStatusInformation).

## Corpo e tipo de conteúdo

Sisk suporta objetos de conteúdo nativos do .NET para enviar corpo em respostas. Você pode usar a classe [StringContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.stringcontent) para enviar uma resposta JSON, por exemplo:

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

O servidor sempre tentará calcular o `Content-Length` a partir do que você definiu no conteúdo, se você não o definir explicitamente em um header. Se o servidor não puder obter implicitamente o header `Content-Length` do conteúdo da resposta, a resposta será enviada com Chunked-Encoding.

Você também pode transmitir a resposta enviando um [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent) ou usando o método `GetResponseStream`.

## Cabeçalhos de resposta

Você pode adicionar, editar ou remover cabeçalhos que estão sendo enviados na resposta. O exemplo abaixo mostra como enviar uma resposta de redirecionamento para o cliente.

```cs
HttpResponse res = new HttpResponse();
res.Status = HttpStatusCode.Moved;
res.Headers.Add(HttpKnownHeaderNames.Location, "/login");
```

Ou com sintaxe Fluent:

```cs
new HttpResponse(301)
    .WithHeader("Location", "/login");
```

Quando você usa o método [Add](/api/Sisk.Core.Entity.HttpHeaderCollection.Add) da HttpHeaderCollection, você está adicionando um cabeçalho à requisição sem alterar os que já foram enviados. O método [Set](/api/Sisk.Core.Entity.HttpHeaderCollection.Set) substitui os cabeçalhos com o mesmo nome pelo valor instruído. O indexador da HttpHeaderCollection internamente chama o método Set para substituir os cabeçalhos.

## Enviando cookies

Sisk tem métodos que facilitam a definição de cookies no cliente. Cookies definidos por este método já estão codificados em URL e atendem ao padrão RFC-6265.

```cs
HttpResponse res = new HttpResponse();
res.SetCookie("cookie-name", "cookie-value");
```

Ou com sintaxe Fluent:

```cs
new HttpResponse(301)
    .WithCookie("cookie-name", "cookie-value", expiresAt: DateTime.Now.Add(TimeSpan.FromDays(7)));
```

Há outras [versões mais completas](/api/Sisk.Core.Http.CookieHelper.SetCookie) do mesmo método.

## Respostas em chunk

Você pode definir o encoding de transferência como chunked para enviar respostas grandes.

```cs
HttpResponse res = new HttpResponse();
res.SendChunked = true;
```

Ao usar chunked-encoding, o header `Content-Length` é automaticamente omitido.

## Stream de resposta

Streams de resposta são uma maneira gerenciada de enviar respostas de forma segmentada. É uma operação de nível mais baixo do que usar objetos HttpResponse, pois requer que você envie os cabeçalhos e o conteúdo manualmente e, em seguida, feche a conexão.

Este exemplo abre um stream de leitura para o arquivo, copia o stream para o stream de saída da resposta e não carrega o arquivo inteiro na memória. Isso pode ser útil para servir arquivos de tamanho médio ou grande.

```cs
// obtém o stream de saída da resposta
using var fileStream = File.OpenRead("my-big-file.zip");
var responseStream = request.GetResponseStream();

// define o encoding de resposta para usar chunked-encoding
// também você não deve enviar o header content-length quando usar
// chunked encoding
responseStream.SendChunked = true;
responseStream.SetStatus(200);
responseStream.SetHeader(HttpKnownHeaderNames.ContentType, contentType);

// copia o stream do arquivo para o stream de saída da resposta
fileStream.CopyTo(responseStream.ResponseStream);

// fecha o stream
return responseStream.Close();
```

## Compactação GZip, Deflate e Brotli

Você pode enviar respostas com conteúdo compactado em Sisk compactando os conteúdos HTTP. Primeiramente, encapsule seu objeto [HttpContent](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.httpcontent) dentro de um dos compactadores abaixo para enviar a resposta compactada para o cliente.

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

Você também pode usar esses conteúdos compactados com streams.

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

Os headers `Content-Encoding` são definidos automaticamente ao usar esses conteúdos.

## Tipos de resposta implícitos

Desde a versão 0.15, você pode usar outros tipos de retorno além de HttpResponse, mas é necessário configurar o roteador para lidar com cada tipo de objeto.

O conceito é sempre retornar um tipo de referência e convertê-lo em um objeto HttpResponse válido. Rotas que retornam HttpResponse não passam por nenhuma conversão.

Tipos de valor (estruturas) não podem ser usados como tipo de retorno porque não são compatíveis com o [RouterCallback](/api/Sisk.Core.Routing.RouterCallback), então devem ser encapsulados em um ValueResult para serem usados em manipuladores.

Considere o exemplo abaixo de um módulo de roteador que não usa HttpResponse no tipo de retorno:

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

Para tipos ValueResult, não é necessário indicar que o objeto de entrada é um ValueResult e apenas T, pois ValueResult é um objeto refletido a partir de seu componente original.

A associação de tipos não compara o que foi registrado com o tipo do objeto retornado do callback do roteador. Em vez disso, verifica se o tipo do resultado do roteador é atribuível ao tipo registrado.

Registrar um manipulador de tipo Object fará com que todos os tipos anteriores sejam ignorados. A ordem de inserção dos manipuladores de valor também é importante, então registrar um manipulador de Object deve ser feito por último. Sempre registre manipuladores de valor específicos primeiro para garantir a ordem.

```cs
Router r = new Router();
r.SetObject(new UsersController());

r.RegisterValueHandler<bool>(bolVal =>
{
    HttpResponse res = new HttpResponse();
    res.Status = (bool)bolVal ? HttpStatusCode.OK : HttpStatusCode.BadRequest;
    return res;
});

r.RegisterValueHandler<IEnumerable>(enumerableValue =>
{
    return new HttpResponse();
    // faça algo com enumerableValue aqui
});

// registrar um manipulador de valor de objeto deve ser o último
// manipulador de valor que será usado como fallback
r.RegisterValueHandler<object>(fallback =>
{
    HttpResponse res = new HttpResponse();
    res.Status = HttpStatusCode.OK;
    res.Content = JsonContent.Create(fallback);
    return res;
});
```