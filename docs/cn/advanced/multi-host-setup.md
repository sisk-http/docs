Sisk 框架一直以来都支持每个服务器使用多个主机，也就是说，单个 HTTP 服务器可以监听多个端口，每个端口都有其自己的路由器和运行在其上的服务。

这样，使用 Sisk 在单个 HTTP 服务器上轻松分离职责并管理服务。以下示例展示了创建两个监听主机，每个主机监听不同的端口，具有不同的路由器和操作。

阅读 [手动创建应用程序](/v1/getting-started.md#manually-creating-your-app) 了解有关此抽象的详细信息。

```cs
static void Main(string[] args)
{
    // 创建两个监听主机，每个主机都有自己的路由器，并监听自己的端口
    //
    ListeningHost hostA = new ListeningHost();
    hostA.Ports = [new ListeningPort(12000)];
    hostA.Router = new Router();
    hostA.Router.SetRoute(RouteMethod.Get, "/", request => new HttpResponse().WithContent("Hello from the host A!"));

    ListeningHost hostB = new ListeningHost();
    hostB.Ports = [new ListeningPort(12001)];
    hostB.Router = new Router();
    hostB.Router.SetRoute(RouteMethod.Get, "/", request => new HttpResponse().WithContent("Hello from the host B!"));

    // 创建服务器配置并添加两个监听主机
    //
    HttpServerConfiguration configuration = new HttpServerConfiguration();
    configuration.ListeningHosts.Add(hostA);
    configuration.ListeningHosts.Add(hostB);

    // 创建一个使用指定配置的 HTTP 服务器
    //
    HttpServer server = new HttpServer(configuration);

    // 启动服务器
    server.Start();

    Console.WriteLine("尝试访问主机 A 在 {0}", server.ListeningPrefixes[0]);
    Console.WriteLine("尝试访问主机 B 在 {0}", server.ListeningPrefixes[1]);

    Thread.Sleep(-1);
}
```