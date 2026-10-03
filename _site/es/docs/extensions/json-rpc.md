# Extensión JSON-RPC

Source: https://docs.sisk-framework.org/es/docs/extensions/json-rpc.html

Sisk tiene un módulo experimental para una API [JSON-RPC 2.0](https://www.jsonrpc.org/specification), que le permite crear aplicaciones aún más simples. Esta extensión implementa estrictamente la interfaz de transporte JSON-RPC 2.0 y ofrece transporte mediante solicitudes HTTP GET, POST, y también websockets con Sisk.

Puede instalar la extensión vía Nuget con el siguiente comando. Tenga en cuenta que, en versiones experimentales/beta, debe habilitar la opción de buscar paquetes prerelease en Visual Studio.

```bash
dotnet add package Sisk.JsonRpc
```

## Interfaz de Transporte

JSON-RPC es un protocolo de llamada a procedimiento remoto (RPC) asíncrono y sin estado que utiliza JSON para la comunicación de datos. Una solicitud JSON-RPC se identifica típicamente por un ID, y una respuesta se entrega con el mismo ID que se envió en la solicitud. No todas las solicitudes requieren una respuesta, las cuales se denominan "notificaciones".

La [especificación JSON-RPC 2.0](https://www.jsonrpc.org/specification) explica en detalle cómo funciona el transporte. Este transporte es agnóstico respecto a dónde se utilice. Sisk implementa este protocolo a través de HTTP, siguiendo las conformidades de [JSON-RPC over HTTP](https://www.jsonrpc.org/historical/json-rpc-over-http.html), que soporta parcialmente solicitudes GET, pero soporta completamente solicitudes POST. Los websockets también son compatibles, proporcionando comunicación de mensajes asíncrona.

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

El siguiente ejemplo muestra cómo crear una API JSON-RPC usando Sisk. Una clase de operaciones matemáticas realiza las operaciones remotas y entrega la respuesta serializada al cliente.

```csharp {title="Program.cs"}
using var app = HttpServer.CreateBuilder(port: 5555)
    .UseJsonRPC((sender, args) =>
    {
        // agrega todos los métodos etiquetados con WebMethod al manejador JSON-RPC
        args.Handler.Methods.AddMethodsFromType(new MathOperations());
        
        // asigna la ruta /service para manejar solicitudes JSON-RPC POST y GET
        args.Router.MapPost("/service", args.Handler.Transport.HttpPost);
        args.Router.MapGet("/service", args.Handler.Transport.HttpGet);
        
        // asigna el transporte WebSocket JSON-RPC en GET /ws
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

El ejemplo anterior asignará los métodos `Sum` y `Sqrt` al manejador JSON-RPC, y estos métodos estarán disponibles en `GET /service`, `POST /service` y `GET /ws`. Los nombres de los métodos no distinguen entre mayúsculas y minúsculas.

Los parámetros del método se deserializan automáticamente a sus tipos específicos. También se admite el uso de una solicitud con parámetros nombrados. La serialización JSON se realiza mediante la biblioteca [LightJson](https://github.com/CypherPotato/LightJson). Cuando un tipo no se deserializa correctamente, puede crear un [convertidor JSON](https://github.com/CypherPotato/LightJson?tab=readme-ov-file#json-converters) específico para ese tipo y asociarlo con [JsonRpcHandler.JsonSerializerOptions](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcHandler.JsonSerializerOptions.md).

También puede obtener el objeto bruto `$.params` de la solicitud JSON-RPC directamente en su método.

```csharp {title="MathOperations.cs"}
[WebMethod]
public float Sum(JsonArray|JsonObject @params)
{
    ...
}
```

Para que esto ocurra, `@params` debe ser el **único** parámetro en su método, con exactamente el nombre `params` (en C#, el `@` es necesario para escapar este nombre de parámetro).

La deserialización de parámetros ocurre tanto para objetos nombrados como para matrices posicionales. Por ejemplo, el siguiente método puede ser llamado remotamente por ambas solicitudes:

```csharp
[WebMethod]
public float AddUserToStore(string apiKey, User user, UserStore store)
{
    ...
}
```

Para una matriz, se debe seguir el orden de los parámetros.

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

## Personalizando el serializador

Puede personalizar el serializador JSON en la propiedad [JsonRpcHandler.JsonSerializerOptions](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcHandler.JsonSerializerOptions.md). En esta propiedad, puede habilitar el uso de [JSON5](https://json5.org/) para deserializar mensajes. Aunque no es una conformidad con JSON-RPC 2.0, JSON5 es una extensión de JSON que permite una escritura más legible y fácil de entender.

```csharp {title="Program.cs"}
using var host = HttpServer.CreateBuilder ( 5556 )
    .UseJsonRPC ( ( o, e ) => {

        // usa un comparador de nombres sanitizado. este comparador compara solo letras
        // y dígitos en un nombre, y descarta otros símbolos. ej:
        // foo_bar10 == FooBar10
        e.Handler.JsonSerializerOptions.PropertyNameComparer = new JsonSanitizedComparer ( );

        // habilita JSON5 para el intérprete JSON. incluso activándolo, JSON plano sigue siendo permitido
        e.Handler.JsonSerializerOptions.SerializationFlags = LightJson.Serialization.JsonSerializationFlags.Json5;

        // asigna la ruta POST /service al manejador JSON RPC
        e.Router.MapPost ( "/service", e.Handler.Transport.HttpPost );
    } )
    .Build ( );

host.Start ( );
```
