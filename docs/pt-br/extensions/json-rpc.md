# Extensão JSON-RPC

Sisk tem um módulo experimental para uma API [JSON-RPC 2.0](https://www.jsonrpc.org/specification), que permite criar aplicações ainda mais simples. Essa extensão implementa estritamente a interface de transporte JSON-RPC 2.0 e oferece transporte via HTTP GET, POST e também web-sockets com Sisk.

Você pode instalar a extensão via Nuget com o comando abaixo. Observe que, em versões experimentais/beta, você deve habilitar a opção para procurar pacotes de pré-lançamento no Visual Studio.

```bash
dotnet add package Sisk.JsonRpc
```

## Interface de Transporte

JSON-RPC é um protocolo de execução remota de procedimento sem estado e assíncrono que usa JSON para comunicação de dados unidirecional. Uma solicitação JSON-RPC é normalmente identificada por um ID e uma resposta é entregue pelo mesmo ID que foi enviado na solicitação. Nem todas as solicitações exigem uma resposta, que são chamadas de "notificações".

A [especificação JSON-RPC 2.0](https://www.jsonrpc.org/specification) explica em detalhes como o transporte funciona. Esse transporte é agnóstico de onde será usado. Sisk implementa esse protocolo por meio do HTTP, seguindo as conformidades do [JSON-RPC sobre HTTP](https://www.jsonrpc.org/historical/json-rpc-over-http.html), que suporta parcialmente solicitações GET, mas suporta completamente solicitações POST. Web-sockets também são suportados, fornecendo comunicação de mensagem assíncrona.

Uma solicitação JSON-RPC parece semelhante a:

```json
{
    "jsonrpc": "2.0",
    "method": "Soma",
    "params": [1, 2, 4],
    "id": 1
}
```

E uma resposta bem-sucedida parece semelhante a:

```json
{
    "jsonrpc": "2.0",
    "result": 7,
    "id": 1
}
```

## Métodos JSON-RPC

O exemplo a seguir mostra como criar uma API JSON-RPC usando Sisk. Uma classe de operações matemáticas executa as operações remotas e entrega a resposta serializada ao cliente.

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
using var app = HttpServer.CreateBuilder(port: 5555)
    .UseJsonRPC((sender, args) =>
    {
        // adiciona todos os métodos marcados com WebMethod ao manipulador JSON-RPC
        args.Handler.Methods.AddMethodsFromType(new OperacoesMatematicas());
        
        // mapeia a rota /service para lidar com solicitações JSON-RPC POST e GET
        args.Router.MapPost("/service", args.Handler.Transport.HttpPost);
        args.Router.MapGet("/service", args.Handler.Transport.HttpGet);
        
        // cria um manipulador de web-socket em GET /ws
        args.Router.MapGet("/ws", request =>
        {
            var ws = request.GetWebSocket();
            ws.OnReceive += args.Handler.Transport.WebSocket;

            ws.WaitForClose(timeout: TimeSpan.FromSeconds(30));
            return ws.Close();
        });
    })
    .Build();

await app.StartAsync();
```

<div class="script-header">
    <span>
        OperacoesMatematicas.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public class OperacoesMatematicas
{
    [WebMethod]
    public float Soma(float a, float b)
    {
        return a + b;
    }
    
    [WebMethod]
    public double RaizQuadrada(float a)
    {
        return Math.Sqrt(a);
    }
}
```

O exemplo acima mapeará os métodos `Soma` e `RaizQuadrada` para o manipulador JSON-RPC e esses métodos estarão disponíveis em `GET /service`, `POST /service` e `GET /ws`. Os nomes dos métodos são insensíveis a letras maiúsculas e minúsculas.

Os parâmetros dos métodos são deserializados automaticamente para seus tipos específicos. Usar uma solicitação com parâmetros nomeados também é suportado. A serialização JSON é feita pela biblioteca [LightJson](https://github.com/CypherPotato/LightJson). Quando um tipo não é deserializado corretamente, você pode criar um conversor JSON específico para esse tipo e associá-lo às opções [JsonSerializerOptions](?) posteriormente.

Você também pode obter o objeto `$.params` bruto da solicitação JSON-RPC diretamente no seu método.

<div class="script-header">
    <span>
        OperacoesMatematicas.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[WebMethod]
public float Soma(JsonArray|JsonObject @params)
{
    ...
}
```

Para que isso ocorra, `@params` deve ser o **único** parâmetro no seu método, com exatamente o nome `params` (em C#, o `@` é necessário para escapar esse nome de parâmetro).

A deserialização dos parâmetros ocorre tanto para objetos nomeados quanto para matrizes posicionais. Por exemplo, o seguinte método pode ser chamado remotamente por ambas as solicitações:

```csharp
[WebMethod]
public float AdicionarUsuarioAoArmazenamento(string apiKey, Usuario usuario, ArmazenamentoDeUsuarios armazenamento)
{
    ...
}
```

Para uma matriz, a ordem dos parâmetros deve ser seguida.

```json
{
    "jsonrpc": "2.0",
    "method": "AdicionarUsuarioAoArmazenamento",
    "params": [
        "1234567890",
        {
            "nome": "João Doe",
            "email": "joao@example.com"
        },
        {
            "nome": "Minha Loja"
        }
    ],
    "id": 1

}
```

## Personalizando o serializador

Você pode personalizar o serializador JSON na propriedade [JsonRpcHandler.JsonSerializerOptions](/api/Sisk.JsonRPC.JsonRpcHandler.JsonSerializerOptions). Nessa propriedade, você pode habilitar o uso de [JSON5](https://json5.org/) para deserializar mensagens. Embora não seja uma conformidade com JSON-RPC 2.0, JSON5 é uma extensão do JSON que permite uma escrita mais legível e humana.

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
using var host = HttpServer.CreateBuilder ( 5556 )
    .UseJsonRPC ( ( o, e ) => {

        // usa um comparador de nome sanitizado. esse comparador compara apenas letras
        // e dígitos em um nome e descarta outros símbolos. ex:
        // foo_bar10 == FooBar10
        e.Handler.JsonSerializerOptions.PropertyNameComparer = new JsonSanitizedComparer ();

        // habilita JSON5 para o interpretador JSON. mesmo ativando isso, o JSON simples ainda é permitido
        e.Handler.JsonSerializerOptions.SerializationFlags = LightJson.Serialization.JsonSerializationFlags.Json5;

        // mapeia a rota POST /service para o manipulador JSON-RPC
        e.Router.MapPost ( "/service", e.Handler.Transport.HttpPost );
    } )
    .Build ();

host.Start ();
```