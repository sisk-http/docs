Экспериментальный модуль Sisk имеет API JSON-RPC 2.0, который позволяет создавать еще более простые приложения. Это расширение строго реализует интерфейс транспорта JSON-RPC 2.0 и предлагает транспорт через HTTP GET, POST-запросы и также WebSocket с Sisk.

Вы можете установить расширение с помощью Nuget с помощью следующей команды. Обратите внимание, что в экспериментальных/бета-версиях вам следует включить опцию поиска предварительных версий пакетов в Visual Studio.

```bash
dotnet add package Sisk.JsonRpc
```

## Интерфейс транспорта

JSON-RPC - это протокол асинхронного удаленного вызова процедуры (RDP), который использует JSON для односторонней передачи данных. Запрос JSON-RPC обычно идентифицируется ID, а ответ поставляется по тому же ID, который был отправлен в запросе. Не все запросы требуют ответа, которые называются "уведомлениями".

[Спецификация JSON-RPC 2.0](https://www.jsonrpc.org/specification) подробно объясняет, как работает транспорт. Этот транспорт независим от того, где он будет использоваться. Sisk реализует этот протокол через HTTP, следуя согласованностям [JSON-RPC over HTTP](https://www.jsonrpc.org/historical/json-rpc-over-http.html), которые частично поддерживают GET-запросы, но полностью поддерживают POST-запросы. Также поддерживаются WebSocket, обеспечивающие асинхронную передачу сообщений.

Запрос JSON-RPC похож на:

```json
{
    "jsonrpc": "2.0",
    "method": "Sum",
    "params": [1, 2, 4],
    "id": 1
}
```

А успешный ответ похож на:

```json
{
    "jsonrpc": "2.0",
    "result": 7,
    "id": 1
}
```

## Методы JSON-RPC

В следующем примере показано, как создать API JSON-RPC с использованием Sisk. Класс математических операций выполняет удаленные операции и доставляет сериализованный ответ клиенту.

```csharp
using var app = HttpServer.CreateBuilder(port: 5555)
    .UseJsonRPC((sender, args) =>
    {
        // добавляем все методы, помеченные WebMethod, в обработчик JSON-RPC
        args.Handler.Methods.AddMethodsFromType(new MathOperations());
        
        // связывает маршрут /service с обработчиком JSON-RPC для POST и GET-запросов
        args.Router.MapPost("/service", args.Handler.Transport.HttpPost);
        args.Router.MapGet("/service", args.Handler.Transport.HttpGet);
        
        // создает обработчик WebSocket на GET /ws
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

В приведенном выше примере методы `Sum` и `Sqrt` будут сопоставлены с обработчиком JSON-RPC, и эти методы будут доступны по `GET /service`, `POST /service` и `GET /ws`. Имена методов не чувствительны к регистру.

Параметры метода автоматически десериализуются в их конкретные типы. Поддерживается использование запроса с именованными параметрами. Сериализация JSON выполняется библиотекой [LightJson](https://github.com/CypherPotato/LightJson). При некорректной десериализации типа можно создать конкретный [преобразователь JSON](https://github.com/CypherPotato/LightJson?tab=readme-ov-file#json-converters) для этого типа и связать его с [JsonSerializerOptions](?) позже.

Вы также можете получить объект `$.params` из запроса JSON-RPC непосредственно в своем методе.

```csharp
[WebMethod]
public float Sum(JsonArray|JsonObject @params)
{
    ...
}
```

Для этого `@params` должен быть **единственным** параметром в вашем методе с именем `params` (на C#, необходимо использовать `@` для экранирования этого имени параметра).

Десериализация параметров выполняется как для именованных объектов, так и для позиционных массивов. Например, следующий метод может быть вызван удаленно как с помощью запросов:

```csharp
[WebMethod]
public float AddUserToStore(string apiKey, User user, UserStore store)
{
    ...
}
```

Для массива необходимо соблюдать порядок параметров.

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

## Настройка сериализатора

Вы можете настроить сериализатор JSON в свойстве [JsonRpcHandler.JsonSerializerOptions](/api/Sisk.JsonRPC.JsonRpcHandler.JsonSerializerOptions). В этом свойстве можно включить использование [JSON5](https://json5.org/) для десериализации сообщений. Хотя это не соответствует спецификации JSON-RPC 2.0, JSON5 является расширением JSON, которое позволяет писать более удобочитаемые и понятные тексты.

```C#
using var host = HttpServer.CreateBuilder ( 5556 )
    .UseJsonRPC ( ( o, e ) => {

        // использует компаратор имен, очищенный от символов
        e.Handler.JsonSerializerOptions.PropertyNameComparer = new JsonSanitizedComparer ();

        // включает JSON5 для интерпретатора JSON. даже при активации этого параметра, все равно разрешается использовать обычный JSON
        e.Handler.JsonSerializerOptions.SerializationFlags = LightJson.Serialization.JsonSerializationFlags.Json5;

        // связывает маршрут POST /service с обработчиком JSON-RPC
        e.Router.MapPost ( "/service", e.Handler.Transport.HttpPost );
    } )
    .Build ();

host.Start ();
```
