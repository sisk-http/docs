# Sisk + JSON-RPC

Sisk possui um módulo experimental de uma API [JSON-RPC 2.0](https://www.jsonrpc.org/specification), o que possibilita criar aplicações ainda mais simples. Essa extensão implementa extritamente a interface de transporte JSON-RPC 2.0, e oferece transporte via requisições HTTP GET, POST e também web-sockets com Sisk.

Você pode instalar a extensão pelo Nuget com o comando abaixo. Note que, em versões experimentais/betas, deverá ser ativado a opção de buscar por pacotes em pré-lançamento pelo Visual Studio.

```bash
dotnet add package Sisk.JsonRpc
```

## Interface de transporte

O JSON-RPC é um protocolo de execução remota de procedimentos (RDP) sem estado, assíncrono, e utiliza o JSON para comunicação unilateral dos dados. Uma requisição JSON-RPC é normalmente identificada por um ID, e uma resposta é entregue pelo mesmo ID que foi enviado na requisição. Nem todas as requisições são necessárias de resposta, o que são chamadas de "notificações".

Na [especificação do JSON-RPC 2.0](https://www.jsonrpc.org/specification) é explicado com detalhes como o transporte funciona. Este transporte é agnóstico de onde será usado. O Sisk implementa esse protocolo através do HTTP, seguindo as conformidades do [JSON-RPC over HTTP](https://www.jsonrpc.org/historical/json-rpc-over-http.html), que suporta parcialmente requisições GET, mas completamente requisições POST. Também é suportado o uso de web-sockets, o que provê uma comunicação assíncrona de mensagens.

Uma requisição JSON-RPC é parecida com:

```json
{
    "jsonrpc": "2.0",
    "method": "Sum",
    "params": [1, 2, 4],
    "id": 1
}
```

E uma resposta, quando bem-sucedida, é semelhante:

```json
{
    "jsonrpc": "2.0",
    "result": 7,
    "id": 1
}
```

## Métodos JSON-RPC

O exemplo a seguir mostra como criar uma API JSON-RPC usando o Sisk. Uma classe de operações matemáticas realiza as operações remotas e entrega a resposta serializada ao cliente.

```csharp
using var app = HttpServer.CreateBuilder(port: 5555)
    .UseJsonRPC((sender, args) =>
    {
        // add all methods tagged with WebMethod to the JSON-RPC handler
        args.Handler.Methods.AddMethodsFromType(new MathOperations());
        
        // maps the /service route to handle JSON-RPC POST and GET requests
        args.Router.MapPost("/service", args.Handler.Transport.HttpPost);
        args.Router.MapGet("/service", args.Handler.Transport.HttpGet);
        
        // creates an websocket handler on GET /ws
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

public class MathOperations
{
    [WebMethod]
    public float Sum(float a, float b)
    {
        return a + b;
    }
    
    [WebMethod]
    public double Sqrt(float a)
    {
        return Math.Sqrt(a);
    }
}
```

O exemplo acima irá mapear os métodos `Sum` e `Sqrt` para o handler JSON-RPC, e estes métodos ficarão disponíveis no `GET /service`, `POST /service` e `GET /ws`. O nome dos métodos não são sensíveis a caso.

Os parâmetros dos métodos são deserializados automaticamente para seus tipos específicos. Usar uma requisição com parâmetros nomeados também é suportado. A serialização JSON é feita pela biblioteca [LightJson](https://github.com/CypherPotato/LightJson). Quando um tipo não é corretamente deserializado, você poderá criar um [conversor JSON](https://github.com/CypherPotato/LightJson?tab=readme-ov-file#json-converters) específico para aquele tipo e associar ele em seu [JsonSerializerOptions](?) posteriormente.

Você também pode obter o objeto `$.params` cru da requisição JSON-RPC diretamente no seu método.

```csharp
[WebMethod]
public float Sum(JsonArray|JsonObject @params)
{
    ...
}
```

Para isso ocorrer, `@params` deve ser o **único** parâmetro no seu método, com exatamente o nome `params` (em C#, o `@` é necessário para escapar o nome deste parâmetro).

A deserialização dos parâmetros ocorre tanto para objetos nomeados ou para arrays posicionais. Por exemplo, o método abaixo pode ser chamado remotamente por ambas requisições:

```csharp
[WebMethod]
public float AddUserToStore(string apiKey, User user, UserStore store)
{
    ...
}
```

Por um objeto em `params` não é necessário seguir a ordem dos parâmetros:

```json
{
    "jsonrpc": "2.0",
    "method": "AddUserToStore",
    "params": {
        "apiKey": "1234567890",
        "store": {
            "name": "My Store"
        },
        "user": {
            "name": "John Doe",
            "email": "john@example.com"
        }
    },
    "id": 1

}
```

Por array é necessário seguir a ordem dos parâmetros.

```json
{
    "jsonrpc": "2.0",
    "method": "AddUserToStore",
    "params": [
        "1234567890",
        {
            "name": "John Doe",
            "email": "john@example.com"
        },
        {
            "name": "My Store"
        }
    ],
    "id": 1

}
```

## Personalizando o serializer

Você pode personalizar o serializador JSON na propriedade [JsonRpcHandler.JsonSerializerOptions](/api/Sisk.JsonRPC.JsonRpcHandler.JsonSerializerOptions). Nessa propriedade, você pode ativar o uso de [JSON5](https://json5.org/) para deserialização de mensagens. Por mais que não é conformidade com o JSON-RPC 2.0, JSON5 é uma extensão do JSON que permite uma escrita mais humanizada e legível.

```C#
using var host = HttpServer.CreateBuilder ( 5556 )
    .UseJsonRPC ( ( o, e ) => {

        // usa um comparador de nomes sanitizado. esse comparador compara apenas letras
        // e dígitos em um nome, e descarta outros símbolos. ex:
        // foo_bar10 == FooBar10
        e.Handler.JsonSerializerOptions.PropertyNameComparer = new JsonSanitizedComparer ();

        // habilita JSON5 para o interpretador JSON. mesmo ativando isso, JSON plano ainda é permitido
        e.Handler.JsonSerializerOptions.SerializationFlags = LightJson.Serialization.JsonSerializationFlags.Json5;

        // mapeia a rota POST /service para o handler JSON RPC
        e.Router.MapPost ( "/service", e.Handler.Transport.HttpPost );
    } )
    .Build ();

host.Start ();
```