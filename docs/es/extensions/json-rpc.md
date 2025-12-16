# Extensión JSON-RPC

Sisk tiene un módulo experimental para una API [JSON-RPC 2.0](https://www.jsonrpc.org/specification), que permite crear aplicaciones aún más simples. Esta extensión implementa estrictamente la interfaz de transporte JSON-RPC 2.0 y ofrece transporte a través de solicitudes HTTP GET, POST y también web-sockets con Sisk.

Puedes instalar la extensión a través de Nuget con el comando a continuación. Ten en cuenta que, en versiones experimentales/beta, debes habilitar la opción para buscar paquetes prelanzamiento en Visual Studio.

```bash
dotnet add package Sisk.JsonRpc
```

## Interfaz de transporte

JSON-RPC es un protocolo de ejecución remota de procedimientos (RDP) sin estado y asíncrono que utiliza JSON para la comunicación de datos unidireccional. Una solicitud JSON-RPC generalmente se identifica por un ID, y una respuesta se entrega con el mismo ID que se envió en la solicitud. No todas las solicitudes requieren una respuesta, que se llaman "notificaciones".

La [especificación JSON-RPC 2.0](https://www.jsonrpc.org/specification) explica en detalle cómo funciona el transporte. Este transporte es agnóstico de dónde se utilizará. Sisk implementa este protocolo a través de HTTP, siguiendo las conformidades de [JSON-RPC sobre HTTP](https://www.jsonrpc.org/historical/json-rpc-over-http.html), que admite parcialmente las solicitudes GET, pero admite completamente las solicitudes POST. También se admiten los web-sockets, que proporcionan una comunicación de mensajes asíncrona.

Una solicitud JSON-RPC se parece a:

```json
{
    "jsonrpc": "2.0",
    "method": "Sum",
    "params": [1, 2, 4],
    "id": 1
}
```

Y una respuesta exitosa se parece a:

```json
{
    "jsonrpc": "2.0",
    "result": 7,
    "id": 1
}
```

## Métodos JSON-RPC

El siguiente ejemplo muestra cómo crear una API JSON-RPC utilizando Sisk. Una clase de operaciones matemáticas realiza las operaciones remotas y entrega la respuesta serializada al cliente.

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
        // agregar todos los métodos con la etiqueta WebMethod al controlador JSON-RPC
        args.Handler.Methods.AddMethodsFromType(new MathOperations());
        
        // asigna la ruta /service para manejar solicitudes JSON-RPC POST y GET
        args.Router.MapPost("/service", args.Handler.Transport.HttpPost);
        args.Router.MapGet("/service", args.Handler.Transport.HttpGet);
        
        // crea un controlador de web-sockets en GET /ws
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
        MathOperations.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
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

El ejemplo anterior asignará los métodos `Sum` y `Sqrt` al controlador JSON-RPC, y estos métodos estarán disponibles en `GET /service`, `POST /service` y `GET /ws`. Los nombres de los métodos son insensibles a mayúsculas y minúsculas.

Los parámetros de los métodos se deserializan automáticamente en sus tipos específicos. También se admite el uso de parámetros con nombre en las solicitudes. La serialización JSON se realiza mediante la biblioteca [LightJson](https://github.com/CypherPotato/LightJson). Cuando un tipo no se deserializa correctamente, puedes crear un convertidor JSON personalizado para ese tipo y asociarlo con tus opciones de serializador JSON más adelante.

También puedes obtener el objeto `$.params` raw de la solicitud JSON-RPC directamente en tu método.

<div class="script-header">
    <span>
        MathOperations.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[WebMethod]
public float Sum(JsonArray|JsonObject @params)
{
    ...
}
```

Para que esto ocurra, `@params` debe ser el **único** parámetro en tu método, con exactamente el nombre `params` (en C#, el `@` es necesario para escapar este nombre de parámetro).

La deserialización de parámetros ocurre tanto para objetos con nombre como para matrices posicionales. Por ejemplo, el siguiente método se puede llamar de forma remota mediante ambas solicitudes:

```csharp
[WebMethod]
public float AddUserToStore(string apiKey, User user, UserStore store)
{
    ...
}
```

Para una matriz, el orden de los parámetros debe seguirse.

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

## Personalización del serializador

Puedes personalizar el serializador JSON en la propiedad [JsonRpcHandler.JsonSerializerOptions](/api/Sisk.JsonRPC.JsonRpcHandler.JsonSerializerOptions). En esta propiedad, puedes habilitar el uso de [JSON5](https://json5.org/) para deserializar mensajes. Aunque no es una conformidad con JSON-RPC 2.0, JSON5 es una extensión de JSON que permite una escritura más legible y humana.

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

        // utiliza un comparador de nombres sanitizado. este comparador compara solo letras
        // y dígitos en un nombre, y descarta otros símbolos. por ejemplo:
        // foo_bar10 == FooBar10
        e.Handler.JsonSerializerOptions.PropertyNameComparer = new JsonSanitizedComparer ();

        // habilita JSON5 para el intérprete JSON. incluso activando esto, el JSON plano todavía se permite
        e.Handler.JsonSerializerOptions.SerializationFlags = LightJson.Serialization.JsonSerializationFlags.Json5;

        // asigna la ruta POST /service al controlador JSON RPC
        e.Router.MapPost ( "/service", e.Handler.Transport.HttpPost );
    } )
    .Build ();

host.Start ();
```