# Расширение JSON-RPC

Sisk имеет экспериментальный модуль для API [JSON-RPC 2.0](https://www.jsonrpc.org/specification), который позволяет создавать еще более простые приложения. Это расширение строго реализует транспортный интерфейс JSON-RPC 2.0 и предлагает транспорт через HTTP GET, POST-запросы и также веб-сокеты с Sisk.

Вы можете установить расширение через Nuget с помощью команды ниже. Обратите внимание, что в экспериментальных/бета-версиях необходимо включить опцию поиска предварительных пакетов в Visual Studio.

```bash
dotnet add package Sisk.JsonRpc
```

## Транспортный Интерфейс

JSON-RPC - это бесстаточный, асинхронный протокол удаленного выполнения процедур (RDP), который использует JSON для односторонней передачи данных. Запрос JSON-RPC обычно идентифицируется по ID, и ответ доставляется с тем же ID, который был отправлен в запросе. Не все запросы требуют ответа, которые называются "уведомлениями".

[Спецификация JSON-RPC 2.0](https://www.jsonrpc.org/specification) подробно объясняет, как работает транспорт. Этот транспорт независим от того, где он будет использоваться. Sisk реализует этот протокол через HTTP, следуя соответствиям [JSON-RPC over HTTP](https://www.jsonrpc.org/historical/json-rpc-over-http.html), который частично поддерживает GET-запросы, но полностью поддерживает POST-запросы. Также поддерживаются веб-сокеты, которые обеспечивают асинхронную передачу сообщений.

Запрос JSON-RPC выглядит примерно так:

```json
{
    "jsonrpc": "2.0",
    "method": "Sum",
    "params": [1, 2, 4],
    "id": 1
}
```

И успешный ответ выглядит примерно так:

```json
{
    "jsonrpc": "2.0",
    "result": 7,
    "id": 1
}
```

## Методы JSON-RPC

Следующий пример показывает, как создать API JSON-RPC с помощью Sisk. Класс математических операций выполняет удаленные операции и доставляет сериализированный ответ клиенту.

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
        // добавляет все методы, помеченные как WebMethod, в обработчик JSON-RPC
        args.Handler.Methods.AddMethodsFromType(new MathOperations());
        
        // сопоставляет маршрут /service с обработчиком JSON-RPC POST и GET-запросов
        args.Router.MapPost("/service", args.Handler.Transport.HttpPost);
        args.Router.MapGet("/service", args.Handler.Transport.HttpGet);
        
        // создает обработчик веб-сокета на GET /ws
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

Вышеуказанный пример сопоставит методы `Sum` и `Sqrt` с обработчиком JSON-RPC, и эти методы будут доступны по адресам `GET /service`, `POST /service` и `GET /ws`. Имена методов регистронезависимы.

Параметры методов автоматически десериализуются в свои конкретные типы. Также поддерживается использование запросов с именованными параметрами. Сериализация JSON выполняется библиотекой [LightJson](https://github.com/CypherPotato/LightJson). Если тип не десериализуется правильно, вы можете создать специальный [конвертер JSON](https://github.com/CypherPotato/LightJson?tab=readme-ov-file#json-converters) для этого типа и связать его с вашими [JsonSerializerOptions](?) позже.

Вы также можете получить объект `$.params` из запроса JSON-RPC напрямую в вашем методе.

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

Для этого `@params` должен быть единственным параметром в вашем методе, с точным именем `params` (в C#, символ `@` необходим для экранирования этого имени параметра).

Десериализация параметров происходит как для именованных объектов, так и для позиционных массивов. Например, следующий метод можно вызвать удаленно как с помощью запроса с именованными параметрами, так и с помощью запроса с позиционными параметрами.

```csharp
[WebMethod]
public float AddUserToStore(string apiKey, User user, UserStore store)
{
    ...
}
```

Для массива порядок параметров должен быть соблюдён.

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

Вы можете настроить сериализатор JSON в свойстве [JsonRpcHandler.JsonSerializerOptions](/api/Sisk.JsonRPC.JsonRpcHandler.JsonSerializerOptions). В этом свойстве вы можете включить использование [JSON5](https://json5.org/) для десериализации сообщений. Хотя это не соответствует спецификации JSON-RPC 2.0, JSON5 является расширением JSON, которое позволяет писать более читаемые и понятные данные.

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

        // использует санитизированный компаратор имен. этот компаратор сравнивает только буквы
        // и цифры в имени, и игнорирует другие символы. например:
        // foo_bar10 == FooBar10
        e.Handler.JsonSerializerOptions.PropertyNameComparer = new JsonSanitizedComparer ();

        // включает JSON5 для интерпретатора JSON. даже активируя это, обычный JSON все еще поддерживается
        e.Handler.JsonSerializerOptions.SerializationFlags = LightJson.Serialization.JsonSerializationFlags.Json5;

        // сопоставляет маршрут POST /service с обработчиком JSON-RPC
        e.Router.MapPost ( "/service", e.Handler.Transport.HttpPost );
    } )
    .Build ();

host.Start ();
```