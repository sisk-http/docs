Sisk有一个实验性模块用于JSON-RPC 2.0 API，它允许您创建更简单的应用程序。此扩展严格实现JSON-RPC 2.0传输接口，并通过HTTP GET、POST请求以及与Sisk的WebSockets提供传输。

您可以通过以下命令使用Nuget安装扩展。请注意，在实验/测试版中，您应该在Visual Studio中启用搜索预发布包的选项。

```bash
dotnet add package Sisk.JsonRpc
```

## 传输接口

JSON-RPC是一种无状态的、异步远程过程执行（RDP）协议，它使用JSON进行单向数据通信。JSON-RPC请求通常由一个ID标识，响应通过与请求中发送的相同ID传递。并非所有请求都需要响应，这些称为“通知”。

[JSON-RPC 2.0规范](https://www.jsonrpc.org/specification)详细解释了传输方式。此传输与其使用位置无关。Sisk通过HTTP实现此协议，遵循[JSON-RPC over HTTP](https://www.jsonrpc.org/historical/json-rpc-over-http.html)的规范，该规范部分支持GET请求，但完全支持POST请求。WebSockets也得到支持，提供异步消息通信。

一个JSON-RPC请求看起来类似于：

```json
{
    "jsonrpc": "2.0",
    "method": "Sum",
    "params": [1, 2, 4],
    "id": 1
}
```

一个成功的响应看起来类似于：

```json
{
    "jsonrpc": "2.0",
    "result": 7,
    "id": 1
}
```

## JSON-RPC 方法

以下示例演示了如何使用Sisk创建JSON-RPC API。一个数学运算类执行远程操作并将序列化响应传递给客户端。

```csharp
using var app = HttpServer.CreateBuilder(port: 5555)
    .UseJsonRPC((sender, args) =>
    {
        // 将带有WebMethod标签的所有方法添加到JSON-RPC 处理器
        args.Handler.Methods.AddMethodsFromType(new MathOperations());
        
        // 将 /service 路由映射到处理JSON-RPC POST 和GET请求
        args.Router.MapPost("/service", args.Handler.Transport.HttpPost);
        args.Router.MapGet("/service", args.Handler.Transport.HttpGet);
        
        // 在GET /ws 上创建一个 WebSocket 处理器
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

上述示例将`Sum`和`Sqrt`方法映射到JSON-RPC 处理器，这些方法将在`GET /service`、`POST /service`和`GET /ws`上可用。方法名称不区分大小写。

方法参数将自动反序列化为其特定类型。也支持使用命名参数的请求。JSON序列化由[LightJson](https://github.com/CypherPotato/LightJson)库完成。当类型无法正确反序列化时，您可以为该类型创建特定的[JSON转换器](https://github.com/CypherPotato/LightJson?tab=readme-ov-file#json-converters)并将其与您的[JsonSerializerOptions](?)关联。

您还可以直接在方法中获取JSON-RPC 请求中的`$.params`原始对象。

```csharp
[WebMethod]
public float Sum(JsonArray|JsonObject @params)
{
    ...
}
```

为此，`@params`必须是方法中的**唯一**参数，名称必须为`params`（在C#中，`@`是必要的，以转义此参数名称）。

对于命名对象或位置数组，都会对参数进行反序列化。例如，以下方法可以通过以下两种请求远程调用：

```csharp
[WebMethod]
public float AddUserToStore(string apiKey, User user, UserStore store)
{
    ...
}
```

对于数组，必须遵循参数的顺序。

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

您可以在[JsonRpcHandler.JsonSerializerOptions](/api/Sisk.JsonRPC.JsonRpcHandler.JsonSerializerOptions)属性中自定义JSON序列化器。在此属性中，您可以启用使用[JSON5](https://json5.org/)反序列化消息。尽管JSON5不是JSON-RPC 2.0的规范，但JSON5是JSON的扩展，允许更易于阅读和理解的编写。

```C#
using var host = HttpServer.CreateBuilder(5556)
    .UseJsonRPC((o, e) => {

        // 使用经过消毒的名称比较器。此比较器仅比较名称中的字母和数字，并丢弃其他符号。例如：
        // foo_bar10 == FooBar10
        e.Handler.JsonSerializerOptions.PropertyNameComparer = new JsonSanitizedComparer();

        // 为JSON解释器启用JSON5。即使激活此选项，也仍然允许使用纯JSON
        e.Handler.JsonSerializerOptions.SerializationFlags = LightJson.Serialization.JsonSerializationFlags.Json5;

        // 将POST /service 路由映射到JSON RPC 处理器
        e.Router.MapPost("/service", e.Handler.Transport.HttpPost);
    })
    .Build();

host.Start();
```



