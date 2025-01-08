Sisk has an experimental module for a [JSON-RPC 2.0](https://www.jsonrpc.org/specification) API, which allows you to create even simpler applications. This extension strictly implements the JSON-RPC 2.0 transport interface and offers transport via HTTP GET, POST requests, and also web-sockets with Sisk.

You can install the extension via Nuget with the command below. Note that, in experimental/beta versions, you should enable the option to search for pre-release packages in Visual Studio.

```bash
dotnet add package Sisk.JsonRpc
```

## Transport Interface

JSON-RPC is a stateless, asynchronous remote procedure execution (RDP) protocol that uses JSON for unilateral data communication. A JSON-RPC request is typically identified by an ID, and a response is delivered by the same ID that was sent in the request. Not all requests require a response, which are called "notifications".

The [JSON-RPC 2.0 specification](https://www.jsonrpc.org/specification) explains in detail how the transport works. This transport is agnostic of where it will be used. Sisk implements this protocol through HTTP, following the conformities of [JSON-RPC over HTTP](https://www.jsonrpc.org/historical/json-rpc-over-http.html), which partially supports GET requests, but completely supports POST requests. Web-sockets are also supported, providing asynchronous message communication.

A JSON-RPC request looks similar to:

```json
{
    "jsonrpc": "2.0",
    "method": "Sum",
    "params": [1, 2, 4],
    "id": 1
}
```

And a successful response looks similar to:

```json
{
    "jsonrpc": "2.0",
    "result": 7,
    "id": 1
}
```

## JSON-RPC Methods

The following example shows how to create a JSON-RPC API using Sisk. A mathematical operations class performs the remote operations and delivers the serialized response to the client.

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

The above example will map the `Sum` and `Sqrt` methods to the JSON-RPC handler, and these methods will be available at `GET /service`, `POST /service` and `GET /ws`. Method names are case-insensitive.

Method parameters are automatically deserialized to their specific types. Using a request with named parameters is also supported. JSON serialization is done by the [LightJson](https://github.com/CypherPotato/LightJson) library. When a type is not correctly deserialized, you can create a specific [JSON converter](https://github.com/CypherPotato/LightJson?tab=readme-ov-file#json-converters) for that type and associate it with your [JsonSerializerOptions](?) later.

You can also get the `$.params` raw object from the JSON-RPC request directly in your method.

```csharp
[WebMethod]
public float Sum(JsonArray|JsonObject @params)
{
    ...
}
```

For this to occur, `@params` must be the **only** parameter in your method, with exactly the name `params` (in C#, the `@` is necessary to escape this parameter name).

Parameter deserialization occurs for both named objects or positional arrays. For example, the following method can be called remotely by both requests:

```csharp
[WebMethod]
public float AddUserToStore(string apiKey, User user, UserStore store)
{
    ...
}
```

For an array, the order of the parameters must be followed.

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

## Customizing the serializer

You can customize the JSON serializer in the [JsonRpcHandler.JsonSerializerOptions](/api/Sisk.JsonRPC.JsonRpcHandler.JsonSerializerOptions) property. In this property, you can enable the use of [JSON5](https://json5.org/) for deserializing messages. Although not a conformity with JSON-RPC 2.0, JSON5 is an extension of JSON that allows for more human-readable and legible writing.

```C#
using var host = HttpServer.CreateBuilder ( 5556 )
    .UseJsonRPC ( ( o, e ) => {

        // uses a sanitized name comparer. this comparer compares only letters
        // and digits in a name, and discards other symbols. ex:
        // foo_bar10 == FooBar10
        e.Handler.JsonSerializerOptions.PropertyNameComparer = new JsonSanitizedComparer ();

        // enables JSON5 for the JSON interpreter. even activating this, plain JSON is still allowed
        e.Handler.JsonSerializerOptions.SerializationFlags = LightJson.Serialization.JsonSerializationFlags.Json5;

        // maps the POST /service route to the JSON RPC handler
        e.Router.MapPost ( "/service", e.Handler.Transport.HttpPost );
    } )
    .Build ();

host.Start ();
```
