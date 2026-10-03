---
title: "每个服务器的多个监听主机"
linkTitle: "多主机设置"
weight: 50
aliases:
  - "/docs/cn/advanced/multi-host-setup.html"
sourceHash: "a22de6cfeb6a02de"
---

Sisk Framework 一直支持在每个服务器上使用多个主机，也就是说，一个 HTTP 服务器可以监听多个端口，每个端口都有自己的路由器和在其上运行的服务。

这样，就可以轻松地在单个 HTTP 服务器上使用 Sisk 分离职责并管理服务。下面的示例展示了创建两个 ListeningHost，每个监听不同的端口，使用不同的路由器和操作。

阅读 [manually creating your app](/docs/advanced/manual-setup) 以了解此抽象的细节。

```cs
static void Main(string[] args)
{
    // 创建两个监听主机，每个都有自己的路由器并
    // 监听各自的端口
    //
    ListeningHost hostA = new ListeningHost();
    hostA.Ports = [new ListeningPort(12000)];
    hostA.Router = new Router();
    hostA.Router.MapGet("/", request => new HttpResponse().WithContent("来自主机 A 的问候！"));

    ListeningHost hostB = new ListeningHost();
    hostB.Ports = [new ListeningPort(12001)];
    hostB.Router = new Router();
    hostB.Router.MapGet("/", request => new HttpResponse().WithContent("来自主机 B 的问候！"));
 
    // 创建服务器配置并将两个
    // 监听主机添加进去
    //
    HttpServerConfiguration configuration = new HttpServerConfiguration();
    configuration.ListeningHosts.Add(hostA);
    configuration.ListeningHosts.Add(hostB);

    // 创建使用指定配置的 HTTP 服务器
    //
    HttpServer server = new HttpServer(configuration);

    // 启动服务器
    server.Start();

    Console.WriteLine("尝试访问主机 A：{0}", server.ListeningPrefixes[0]);
    Console.WriteLine("尝试访问主机 B：{0}", server.ListeningPrefixes[1]);

    Thread.Sleep(-1);
}
```
