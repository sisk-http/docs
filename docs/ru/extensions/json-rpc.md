# Расширение JSON-RPC

Sisk имеет экспериментальный модуль для API [JSON-RPC 2.0](https://www.jsonrpc.org/specification), который позволяет создавать ещё более простые приложения. Это расширение строго реализует транспортный интерфейс JSON-RPC 2.0 и предлагает транспорт через HTTP GET, POST запросы, а также веб‑сокеты с Sisk.

Вы можете установить расширение через NuGet с помощью команды ниже. Обратите внимание, что в экспериментальных/бета‑версиях следует включить опцию поиска предрелизных пакетов в Visual Studio.

```bash
dotnet add package Sisk.JsonRpc
```

## Транспортный интерфейс

JSON-RPC — это безсостояний, асинхронный протокол удалённого вызова процедур (RPC), использующий JSON для передачи данных. Запрос JSON‑RPC обычно идентифицируется по ID, а ответ возвращается с тем же ID, который был отправлен в запросе. Не все запросы требуют ответа; такие запросы называются «уведомлениями».

Спецификация [JSON-RPC 2.0](https://www.jsonrpc.org/specification) подробно объясняет, как работает транспорт. Этот транспорт не зависит от места применения. Sisk реализует протокол через HTTP, следуя требованиям [JSON-RPC over HTTP](https://www.jsonrpc.org/historical/json-rpc-over-http.html), который частично поддерживает GET‑запросы, но полностью поддерживает POST‑запросы. Веб‑сокеты также поддерживаются, обеспечивая асинхронную передачу сообщений.

Запрос JSON‑RPC выглядит примерно так:

```json
{
    "jsonrpc": "2.0",
    "method": "Sum",
    "params": [1, 2, 4],
    "id": 1
}
```

А успешный ответ выглядит примерно так:

```json
{
    "jsonrpc": "2.0",
    "result": 7,
    "id": 1
}
```

## Методы JSON-RPC

В следующем примере показано, как создать API JSON‑RPC с помощью Sisk. Класс математических операций выполняет удалённые операции и возвращает сериализованный ответ клиенту.

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
        // добавить все методы, помеченные атрибутом WebMethod, в обработчик JSON‑RPC
        args.Handler.Methods.AddMethodsFromType(new MathOperations());
        
        // сопоставляет маршрут /service для обработки JSON‑RPC POST и GET запросов
        args.Router.MapPost("/service", args.Handler.Transport.HttpPost);
        args.Router.MapGet("/service", args.Handler.Transport.HttpGet);
        
        // сопоставляет транспорт JSON‑RPC WebSocket на GET /ws
        args.Router.MapGet("/ws", args.Handler.Transport.WebSocket);
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

Приведённый пример сопоставит методы `Sum` и `Sqrt` с обработчиком JSON‑RPC, и эти методы будут доступны по `GET /service`, `POST /service` и `GET /ws`. Имена методов нечувствительны к регистру.

Параметры методов автоматически десериализуются в их конкретные типы. Также поддерживается запрос с именованными параметрами. Сериализация JSON выполняется библиотекой [LightJson](https://github.com/CypherPotato/LightJson). Если тип десериализуется некорректно, вы можете создать специальный [JSON‑конвертер](https://github.com/CypherPotato/LightJson?tab=readme-ov-file#json-converters) для этого типа и связать его с [JsonRpcHandler.JsonSerializerOptions](/api/Sisk.JsonRPC.JsonRpcHandler.JsonSerializerOptions).

Вы также можете получить необработанный объект `$.params` из запроса JSON‑RPC непосредственно в вашем методе.

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

Для этого `@params` должен быть **единственным** параметром вашего метода и иметь точно имя `params` (в C# символ `@` необходим для экранирования этого имени параметра).

Десериализация параметров происходит как для именованных объектов, так и для позиционных массивов. Например, следующий метод можно вызвать удалённо обоими типами запросов:

```csharp
[WebMethod]
public float AddUserToStore(string apiKey, User user, UserStore store)
{
    ...
}
```

Для массива порядок параметров должен соблюдаться.

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

Вы можете настроить JSON‑сериализатор в свойстве [JsonRpcHandler.JsonSerializerOptions](/api/Sisk.JsonRPC.JsonRpcHandler.JsonSerializerOptions). В этом свойстве можно включить использование [JSON5](https://json5.org/) для десериализации сообщений. Хотя это не соответствует спецификации JSON‑RPC 2.0, JSON5 является расширением JSON, позволяющим писать более человекочитаемый и удобный код.

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

        // использует сравниватель имён с очисткой. этот сравниватель сравнивает только буквы
        // и цифры в имени, игнорируя другие символы. пример:
        // foo_bar10 == FooBar10
        e.Handler.JsonSerializerOptions.PropertyNameComparer = new JsonSanitizedComparer ();

        // включает поддержку JSON5 для JSON‑интерпретатора. даже при включении этого, обычный JSON по‑прежнему разрешён
        e.Handler.JsonSerializerOptions.SerializationFlags = LightJson.Serialization.JsonSerializationFlags.Json5;

        // сопоставляет маршрут POST /service с обработчиком JSON RPC
        e.Router.MapPost ( "/service", e.Handler.Transport.HttpPost );
    } )
    .Build ();

host.Start ();
```