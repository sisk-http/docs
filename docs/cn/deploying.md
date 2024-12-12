部署您的 Sisk 应用程序的过程包括将您的项目发布到生产环境。虽然这个过程相对简单，但需要注意一些细节，这些细节对于部署基础设施的安全性和稳定性至关重要。

理想情况下，在完成所有可能的测试并准备好应用程序后，您应该能够将应用程序部署到云端。

## 发布您的应用程序

发布您的 Sisk 应用程序或服务是指生成针对生产环境进行优化和准备就绪的二进制文件。在本例中，我们将编译生产环境的二进制文件，以便在安装了 .NET Runtime 的机器上运行。

为了构建您的应用程序，您需要在计算机上安装 .NET SDK，并在目标服务器上安装 .NET Runtime 才能运行应用程序。您可以了解如何在 Linux 服务器 [此处](https://learn.microsoft.com/en-us/dotnet/core/install/linux)、[Windows](https://learn.microsoft.com/en-us/dotnet/core/install/windows?tabs=net70) 和 [Mac OS](https://learn.microsoft.com/en-us/dotnet/core/install/macos) 上安装 .NET Runtime。

在项目所在的文件夹中，打开一个终端并使用 .NET publish 命令：

```shell
dotnet publish -r linux-x64 -c Release
```

这将在 `bin/Release/publish/linux-x64` 目录中生成您的二进制文件。

> [!NOTE]
> 如果您的应用程序使用 Sisk.ServiceProvider 包运行，您应该将 `service-config.json` 文件复制到您的主机服务器，以及 `dotnet publish` 生成的所有二进制文件。
> 您可以保留预配置的文件，其中包含环境变量、侦听端口和主机以及其他服务器配置。

下一步是将这些文件传输到将托管您的应用程序的服务器。

之后，为您的二进制文件授予执行权限。在本例中，假设我们的项目名称为“my-app”：

```shell
cd /home/htdocs
chmod +x my-app
./my-app
```

运行应用程序后，检查它是否产生任何错误消息。如果没有产生错误消息，则表示您的应用程序正在运行。

此时，由于尚未配置防火墙等访问规则，您可能无法通过服务器外部的网络访问您的应用程序。我们将在后续步骤中考虑这一点。

您应该知道虚拟主机的地址，您的应用程序正在侦听该地址。这在应用程序中手动设置，取决于您如何实例化 Sisk 服务。

如果您 **未** 使用 Sisk.ServiceProvider 包，则应该在您定义 HttpServer 实例的地方找到它：

```cs
HttpServer server = HttpServer.Emit(5000, out HttpServerConfiguration config, out var host, out var router);
// sisk 应该侦听 http://localhost:5000/
```

手动关联侦听主机：

```cs
config.ListeningHosts.Add(new ListeningHost("https://localhost:5000/", router));
```

或者，如果您使用 Sisk.ServiceProvider 包，请在 `service-config.json` 中：

```json
{
  "Server": { },
  "ListeningHost": {
    "Ports": [
      "http://localhost:5000/"
    ]
  }
}
```

由此，我们可以创建一个反向代理来侦听您的服务，并使流量可通过开放网络访问。

## 代理您的应用程序

代理您的服务意味着不直接将您的 Sisk 服务公开到外部网络。这种做法对于服务器部署非常常见，因为：

- 允许您在应用程序中关联 SSL 证书；
- 在访问服务之前创建访问规则，避免过载；
- 控制带宽和请求限制；
- 为您的应用程序设置独立的负载均衡器；
- 防止安全损坏不可恢复的基础设施。

您可以通过反向代理（例如 [Nginx](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-nginx?view=aspnetcore-7.0&tabs=linux-ubuntu#install-nginx) 或 [Apache](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-apache?view=aspnetcore-7.0)）或使用类似 [Cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-and-setup/tunnel-guide/) 的 HTTP-over-DNS 隧道来提供您的应用程序。

另外，请务必正确解析代理的转发标头，以便通过 [转发解析器](/docs/advanced/forwarding-resolvers) 获取客户端信息，例如 IP 地址和主机。

在创建隧道、防火墙配置并使应用程序运行之后，下一步是为您的应用程序创建服务。

> [!NOTE]
> 在非 Windows 系统上直接在 Sisk 服务中使用 SSL 证书是不可能的。这是 HttpListener 实现的一个要点，HttpListener 是 Sisk 中 HTTP 队列管理的核心模块，而这种实现在不同的操作系统之间有所不同。如果您使用反向代理，则可以将 SSL 证书与虚拟主机关联，从而在 Sisk 服务中使用 SSL。对于其他系统，强烈建议使用反向代理。



## 创建一个服务

创建服务将使您的应用程序始终可用，即使在重新启动服务器实例或发生不可恢复的崩溃后也是如此。

在本简短的教程中，我们将使用先前教程的内容作为展示，以使您的服务始终处于活动状态。

1. 访问服务配置文件所在的文件夹：

    ```sh
    cd /etc/systemd/system
    ```

2. 创建您的 `my-app.service` 文件并包含以下内容：

    ```ini
    [Unit]
    Description=<关于您的应用程序的描述>

    [Service]
    # 设置将启动服务的用户
    User=<将启动服务的用户>

    # ExecStart 路径不是相对于 WorkingDirectory 的。
    # 将其设置为可执行文件的完整路径
    WorkingDirectory=/home/htdocs
    ExecStart=/home/htdocs/my-app

    # 设置服务在崩溃时始终重新启动
    Restart=always
    RestartSec=3

    [Install]
    WantedBy=multi-user.target
    ```

3. 重新启动您的服务管理器模块：

    ```sh
    sudo systemctl daemon-reload
    ```

4. 从您设置的文件名开始启动您的新创建的服务，并检查它们是否正在运行：

    ```sh
    sudo systemctl start my-app
    sudo systemctl status my-app
    ```

5. 现在，如果您的应用程序正在运行（“Active: active”），请启用您的服务，以便在系统重新启动后保持运行：

    ```sh
    sudo systemctl enable my-app
    ```

现在，您已经准备好向所有人展示您的 Sisk 应用程序。