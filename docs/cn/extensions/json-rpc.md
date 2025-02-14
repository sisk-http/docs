# JSON-RPC 扩展

Sisk 有一个实验性的 JSON-RPC 2.0 API 模块，允许您创建更简单的应用程序。该扩展严格实现了 JSON-RPC 2.0 传输接口，并提供通过 HTTP GET、POST 请求和 WebSockets 的传输。

您可以通过 Nuget 安装该扩展，使用以下命令。请注意，在实验/测试版本中，您需要在 Visual Studio 中启用搜索预发布包的选项。

```bash
dotnet add package Sisk.JsonRpc
```

## 传输接口

JSON-RPC 是一种无状态、异步的远程过程调用（RDP）协议，使用 JSON 进行单向数据通信。JSON-RPC 请求通常由一个 ID 标识，响应由相同的 ID 发送。并非所有请求都需要响应，这些被称为“通知”。

[JSON-RPC 2.0 规范](https://www.jsonrpc.org/specification) 详细解释了传输的工作原理。该传输与其使用位置无关。Sisk 通过 HTTP 实现该协议，遵循 [JSON-RPC over HTTP](https://www.jsonrpc.org/historical/json-rpc-over-http.html) 的规定，部分支持 GET 请求，完全支持 POST 请求。WebSockets 也被支持，提供异步消息通信。

JSON-RPC 请求类似于：

```json
{
    "jsonrpc": "2.0",
    "method": "Sum",
    "params": [1, 2, 4],
    "id": 1
}
```

成功响应类似于：

```json
{
    "jsonrpc": "2.0",
    "result": 7,
    "id": 1
}
```

## JSON-RPC 方法

以下示例显示如何使用 Sisk 创建 JSON-RPC API。一个数学运算类执行远程操作并将序列化的响应发送给客户端。

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
        // 添加所有标记为 WebMethod 的方法到 JSON-RPC 处理器
        args.Handler.Methods.AddMethodsFromType(new MathOperations());
        
        // 将 /service 路由映射到处理 JSON-RPC POST 和 GET 请求
        args.Router.MapPost("/service", args.Handler.Transport.HttpPost);
        args.Router.MapGet("/service", args.Handler.Transport.HttpGet);
        
        // 在 GET /ws 创建一个 WebSocket 处理器
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

上面的示例将 `Sum` 和 `Sqrt` 方法映射到 JSON-RPC 处理器，这些方法将在 `GET /service`、`POST /service` 和 `GET /ws` 中可用。方法名称不区分大小写。

方法参数将自动反序列化为其特定类型。使用带有命名参数的请求也是支持的。JSON 序列化由 [LightJson](https://github.com/CypherPotato/LightJson) 库执行。当类型不能正确反序列化时，您可以为该类型创建一个特定的 [JSON 转换器](https://github.com/CypherPotato/LightJson?tab=readme-ov-file#json-converters) 并稍后将其与 [JsonSerializerOptions](?) 关联起来。

您还可以直接在方法中获取 JSON-RPC 请求的原始 `$.params` 对象。

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

为此，`@params` 必须是方法中唯一的参数，且名称必须为 `params`（在 C# 中，`@` 用于转义此参数名称）。

参数反序列化适用于命名对象和位置数组。例如，以下方法可以通过以下两种请求调用：

```csharp
[WebMethod]
public float AddUserToStore(string apiKey, User user, UserStore store)
{
    ...
}
```

对于数组，参数的顺序必须遵循。

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

## 自定义序列化器

您可以在 [JsonRpcHandler.JsonSerializerOptions](/api/Sisk.JsonRPC.JsonRpcHandler.JsonSerializerOptions) 属性中自定义 JSON 序列化器。在此属性中，您可以启用 [JSON5](https://json5.org/) 以用于反序列化消息。虽然这不是 JSON-RPC 2.0 的一部分，但 JSON5 是 JSON 的一个扩展，允许更易读和更具可读性的写作。

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

        // 使用一个标准化的名称比较器。该比较器仅比较名称中的字母和数字，并丢弃其他符号。例如：
        // foo_bar10 == FooBar10
        e.Handler.JsonSerializerOptions.PropertyNameComparer = new JsonSanitizedComparer ();

        // 启用 JSON5 以用于 JSON 解释器。即使激活此选项，普通 JSON 仍然被允许
        e.Handler.JsonSerializerOptions.SerializationFlags = LightJson.Serialization.JsonSerializationFlags.Json5;

        // 将 POST /service 路由映射到 JSON-RPC 处理器
        e.Router.MapPost ( "/service", e.Handler.Transport.HttpPost );
    } )
    .Build ();

host.Start ();
```