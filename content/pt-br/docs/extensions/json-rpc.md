---
title: "Extensão JSON-RPC"
linkTitle: "JSON-RPC"
weight: 20
aliases:
  - "/docs/pt-br/extensions/json-rpc.html"
sourceHash: "8c2b3c5223e980ce"
---

Sisk possui um módulo experimental para uma API [JSON-RPC 2.0](https://www.jsonrpc.org/specification), que permite criar aplicações ainda mais simples. Esta extensão implementa estritamente a interface de transporte JSON-RPC 2.0 e oferece transporte via requisições HTTP GET, POST, e também web-sockets com Sisk.

Você pode instalar a extensão via Nuget com o comando abaixo. Observe que, em versões experimentais/beta, você deve habilitar a opção de buscar pacotes pré‑lançamento no Visual Studio.

```bash
dotnet add package Sisk.JsonRpc
```

## Interface de Transporte

JSON-RPC é um protocolo de chamada de procedimento remoto (RPC) assíncrono e sem estado que usa JSON para comunicação de dados. Uma requisição JSON-RPC é tipicamente identificada por um ID, e uma resposta é entregue com o mesmo ID que foi enviado na requisição. Nem todas as requisições exigem uma resposta, sendo chamadas de "notificações".

A [especificação JSON-RPC 2.0](https://www.jsonrpc.org/specification) explica em detalhes como o transporte funciona. Esse transporte é agnóstico quanto ao local onde será usado. Sisk implementa esse protocolo via HTTP, seguindo as conformidades de [JSON-RPC over HTTP](https://www.jsonrpc.org/historical/json-rpc-over-http.html), que suporta parcialmente requisições GET, mas suporta completamente requisições POST. Web-sockets também são suportados, fornecendo comunicação assíncrona de mensagens.

Uma requisição JSON-RPC se parece com:

```json
{
    "jsonrpc": "2.0",
    "method": "Sum",
    "params": [1, 2, 4],
    "id": 1
}
```

E uma resposta bem‑sucedida se parece com:

```json
{
    "jsonrpc": "2.0",
    "result": 7,
    "id": 1
}
```

## Métodos JSON-RPC

O exemplo a seguir mostra como criar uma API JSON-RPC usando Sisk. Uma classe de operações matemáticas executa as operações remotas e entrega a resposta serializada ao cliente.

```csharp {title="Program.cs"}
using var app = HttpServer.CreateBuilder(port: 5555)
    .UseJsonRPC((sender, args) =>
    {
        // adiciona todos os métodos marcados com WebMethod ao manipulador JSON-RPC
        args.Handler.Methods.AddMethodsFromType(new MathOperations());
        
        // mapeia a rota /service para lidar com requisições JSON-RPC POST e GET
        args.Router.MapPost("/service", args.Handler.Transport.HttpPost);
        args.Router.MapGet("/service", args.Handler.Transport.HttpGet);
        
        // mapeia o transporte JSON-RPC WebSocket em GET /ws
        args.Router.MapGet("/ws", args.Handler.Transport.WebSocket);
    })
    .Build();

await app.StartAsync();
```

```csharp {title="MathOperations.cs"}
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

O exemplo acima mapeará os métodos `Sum` e `Sqrt` para o manipulador JSON-RPC, e esses métodos estarão disponíveis em `GET /service`, `POST /service` e `GET /ws`. Os nomes dos métodos não diferenciam maiúsculas de minúsculas.

Os parâmetros dos métodos são automaticamente desserializados para seus tipos específicos. O uso de uma requisição com parâmetros nomeados também é suportado. A serialização JSON é feita pela biblioteca [LightJson](https://github.com/CypherPotato/LightJson). Quando um tipo não é desserializado corretamente, você pode criar um [conversor JSON](https://github.com/CypherPotato/LightJson?tab=readme-ov-file#json-converters) específico para esse tipo e associá‑lo a [JsonRpcHandler.JsonSerializerOptions](/api/Sisk.JsonRPC.JsonRpcHandler.JsonSerializerOptions).

Você também pode obter o objeto bruto `$.params` da requisição JSON-RPC diretamente no seu método.

```csharp {title="MathOperations.cs"}
[WebMethod]
public float Sum(JsonArray|JsonObject @params)
{
    ...
}
```

Para que isso ocorra, `@params` deve ser o **único** parâmetro do seu método, com exatamente o nome `params` (em C#, o `@` é necessário para escapar esse nome de parâmetro).

A desserialização de parâmetros ocorre tanto para objetos nomeados quanto para arrays posicionais. Por exemplo, o método a seguir pode ser chamado remotamente por ambas as requisições:

```csharp
[WebMethod]
public float AddUserToStore(string apiKey, User user, UserStore store)
{
    ...
}
```

Para um array, a ordem dos parâmetros deve ser respeitada.

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

## Personalizando o serializador

Você pode personalizar o serializador JSON na propriedade [JsonRpcHandler.JsonSerializerOptions](/api/Sisk.JsonRPC.JsonRpcHandler.JsonSerializerOptions). Nessa propriedade, você pode habilitar o uso de [JSON5](https://json5.org/) para desserializar mensagens. Embora não seja uma conformidade com JSON-RPC 2.0, JSON5 é uma extensão do JSON que permite uma escrita mais legível e compreensível.

```csharp {title="Program.cs"}
using var host = HttpServer.CreateBuilder ( 5556 )
    .UseJsonRPC ( ( o, e ) => {

        // usa um comparador de nomes sanitizado. este comparador compara apenas letras
        // e dígitos em um nome, e descarta outros símbolos. ex:
        // foo_bar10 == FooBar10
        e.Handler.JsonSerializerOptions.PropertyNameComparer = new JsonSanitizedComparer ( );

        // habilita JSON5 para o interpretador JSON. mesmo ativando isso, JSON puro ainda é permitido
        e.Handler.JsonSerializerOptions.SerializationFlags = LightJson.Serialization.JsonSerializationFlags.Json5;

        // mapeia a rota POST /service para o manipulador JSON RPC
        e.Router.MapPost ( "/service", e.Handler.Transport.HttpPost );
    } )
    .Build ( );

host.Start ( );
```
