# JSON-RPC 扩展

Sisk 提供了一个实验性的 [JSON-RPC 2.0](https://www.jsonrpc.org/specification) API 模块，帮助你创建更简洁的应用程序。此扩展严格实现 JSON-RPC 2.0 传输接口，并提供通过 HTTP GET、POST 请求以及 Sisk 的 WebSocket 进行传输。

你可以使用下面的命令通过 Nuget 安装此扩展。请注意，在实验/测试版中，需要在 Visual Studio 中启用搜索预发布包的选项。

```bash
dotnet add package Sisk.JsonRpc
```

## 传输接口

JSON-RPC 是一种无状态、异步的远程过程调用（RPC）协议，使用 JSON 进行数据通信。JSON-RPC 请求通常通过 ID 标识，响应则使用相同的 ID 返回。并非所有请求都需要响应，这类请求称为“通知”。

[JSON-RPC 2.0 规范](https://www.jsonrpc.org/specification) 详细说明了传输的工作方式。该传输方式与使用场景无关。Sisk 通过 HTTP 实现此协议，遵循 [JSON-RPC over HTTP](https://www.jsonrpc.org/historical/json-rpc-over-http.html) 的规范，部分支持 GET 请求，完全支持 POST 请求。WebSocket 也得到支持，提供异步消息通信。

JSON-RPC 请求示例：

```json
{
    "jsonrpc": "2.0",
    "method": "Sum",
    "params": [1, 2, 4],
    "id": 1
}
```

成功响应示例：

```json
{
    "jsonrpc": "2.0",
    "result": 7,
    "id": 1
}
```

## JSON-RPC 方法

下面的示例展示了如何使用 Sisk 创建 JSON-RPC API。一个数学运算类执行远程操作并将序列化后的响应返回给客户端。

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
        // 将所有标记了 WebMethod 的方法添加到 JSON-RPC 处理器
        args.Handler.Methods.AddMethodsFromType(new MathOperations());
        
        // 将 /service 路由映射为处理 JSON-RPC POST 与 GET 请求
        args.Router.MapPost("/service", args.Handler.Transport.HttpPost);
        args.Router.MapGet("/service", args.Handler.Transport.HttpGet);
        
        // 将 JSON-RPC WebSocket 传输映射到 GET /ws
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

上述示例会将 `Sum` 和 `Sqrt` 方法映射到 JSON-RPC 处理器，这些方法可通过 `GET /service`、`POST /service` 和 `GET /ws` 访问。方法名不区分大小写。

方法参数会自动反序列化为对应的类型。也支持使用具名参数的请求。JSON 序列化由 [LightJson](https://github.com/CypherPotato/LightJson) 库完成。当类型未能正确反序列化时，你可以为该类型创建特定的 [JSON 转换器](https://github.com/CypherPotato/LightJson?tab=readme-ov-file#json-converters)，并将其关联到 [JsonRpcHandler.JsonSerializerOptions](/api/Sisk.JsonRPC.JsonRpcHandler.JsonSerializerOptions)。

你还可以直接在方法中获取 JSON-RPC 请求的 `$.params` 原始对象。

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

为实现上述功能，`@params` 必须是方法中的 **唯一** 参数，且名称必须恰好为 `params`（在 C# 中，需要使用 `@` 来转义该参数名）。

参数反序列化同时支持具名对象和位置数组。例如，下面的方法可以通过两种请求方式远程调用：

```csharp
[WebMethod]
public float AddUserToStore(string apiKey, User user, UserStore store)
{
    ...
}
```

对于数组请求，必须遵循参数顺序。

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

你可以在 [JsonRpcHandler.JsonSerializerOptions](/api/Sisk.JsonRPC.JsonRpcHandler.JsonSerializerOptions) 属性中自定义 JSON 序列化器。通过该属性可以启用使用 [JSON5](https://json5.org/) 进行消息反序列化。虽然这并非 JSON-RPC 2.0 的规范要求，JSON5 作为 JSON 的扩展，允许更易读、书写更友好的格式。

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

        // 使用已清理的名称比较器。该比较器仅比较名称中的字母和数字，忽略其他符号。例如：
        // foo_bar10 == FooBar10
        e.Handler.JsonSerializerOptions.PropertyNameComparer = new JsonSanitizedComparer ( );

        // 为 JSON 解释器启用 JSON5。即使启用此功能，仍然支持普通 JSON
        e.Handler.JsonSerializerOptions.SerializationFlags = LightJson.Serialization.JsonSerializationFlags.Json5;

        // 将 POST /service 路由映射到 JSON RPC 处理器
        e.Router.MapPost ( "/service", e.Handler.Transport.HttpPost );
    } )
    .Build ( );

host.Start ( );
```