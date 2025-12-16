# 每个服务器多个监听主机

Sisk Framework 一直支持在一个服务器上使用多个主机，即一个 HTTP 服务器可以监听多个端口，每个端口都有自己的路由器和服务运行在上面。

这样，很容易在单个 HTTP 服务器上使用 Sisk 分离责任并管理服务。下面的示例显示了创建两个 ListeningHosts，每个监听不同的端口，具有不同的路由器和操作。

阅读 [手动创建您的应用](/v1/getting-started.md#manually-creating-your-app) 以了解有关此抽象的详细信息。

```cs
static void Main(string[] args)
{
    // 创建两个监听主机，每个都有自己的路由器和
    // 监听自己的端口
    //
    ListeningHost hostA = new ListeningHost();
    hostA.Ports = [new ListeningPort(12000)];
    hostA.Router = new Router();
    hostA.Router.SetRoute(RouteMethod.Get, "/", request => new HttpResponse().WithContent("来自主机 A 的问候！"));

    ListeningHost hostB = new ListeningHost();
    hostB.Ports = [new ListeningPort(12001)];
    hostB.Router = new Router();
    hostB.Router.SetRoute(RouteMethod.Get, "/", request => new HttpResponse().WithContent("来自主机 B 的问候！"));

    // 创建一个服务器配置并添加两个
    // 监听主机到它
    //
    HttpServerConfiguration configuration = new HttpServerConfiguration();
    configuration.ListeningHosts.Add(hostA);
    configuration.ListeningHosts.Add(hostB);

    // 创建一个使用指定的
    // 配置的 HTTP 服务器
    //
    HttpServer server = new HttpServer(configuration);

    // 启动服务器
    server.Start();

    Console.WriteLine("尝试访问主机 A 在 {0}", server.ListeningPrefixes[0]);
    Console.WriteLine("尝试访问主机 B 在 {0}", server.ListeningPrefixes[1]);

    Thread.Sleep(-1);
}
```