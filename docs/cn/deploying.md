# 部署 Sisk 应用

部署 Sisk 应用的过程包括将您的项目发布到生产环境中。虽然这个过程相对简单，但有一些细节需要注意，以避免对部署的基础设施造成安全和稳定性的问题。

理想情况下，在进行所有可能的测试后，您应该准备好将应用程序部署到云端。

## 发布您的应用

发布 Sisk 应用或服务是生成适合生产环境的二进制文件。在这个例子中，我们将编译二进制文件以便在安装了 .NET Runtime 的机器上运行。

您需要在机器上安装 .NET SDK 来构建应用程序，并在目标服务器上安装 .NET Runtime 来运行应用程序。您可以在 [这里](https://learn.microsoft.com/en-us/dotnet/core/install/linux) 学习如何在 Linux 服务器上安装 .NET Runtime，[这里](https://learn.microsoft.com/en-us/dotnet/core/install/windows?tabs=net70) 学习如何在 Windows 上安装，[这里](https://learn.microsoft.com/en-us/dotnet/core/install/macos) 学习如何在 Mac OS 上安装。

在项目所在的文件夹中，打开终端并使用 .NET 发布命令：

```shell
$ dotnet publish -r linux-x64 -c Release
```

这将在 `bin/Release/publish/linux-x64` 中生成二进制文件。

> [!NOTE]
> 如果您的应用程序使用 Sisk.ServiceProvider 包，您应该将 `service-config.json` 文件复制到主机服务器中，连同 `dotnet publish` 生成的所有二进制文件。
> 您可以预先配置文件，包括环境变量、监听端口和主机，以及其他服务器配置。

下一步是将这些文件传输到将要托管应用程序的服务器。

之后，给二进制文件授予执行权限。假设我们的项目名称是 "my-app"：

```shell
$ cd /home/htdocs
$ chmod +x my-app
$ ./my-app
```

运行应用程序后，检查是否有任何错误消息。如果没有产生错误消息，那么您的应用程序正在运行。

此时，应用程序可能无法从外部网络访问，因为尚未配置访问规则，例如防火墙。我们将在下一步中考虑这一点。

您应该有应用程序监听的虚拟主机地址。这是手动在应用程序中设置的，并取决于您如何实例化 Sisk 服务。

如果您 **不** 使用 Sisk.ServiceProvider 包，您应该在定义 HttpServer 实例的地方找到它：

```cs
HttpServer server = HttpServer.Emit(5000, out HttpServerConfiguration config, out var host, out var router);
// sisk 应该监听 http://localhost:5000/
```

手动关联 ListeningHost：

```cs
config.ListeningHosts.Add(new ListeningHost("https://localhost:5000/", router));
```

或者，如果您使用 Sisk.ServiceProvider 包，在您的 `service-config.json` 中：

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

从这里，我们可以创建一个反向代理来监听您的服务并使流量在开放网络上可用。

## 代理您的应用

代理您的服务意味着不直接将 Sisk 服务暴露在外部网络中。这是一种常见的服务器部署做法，因为：

- 允许您在应用程序中关联 SSL 证书；
- 创建访问规则以避免过载；
- 控制带宽和请求限制；
- 为您的应用程序分离负载均衡器；
- 防止基础设施故障造成的安全损害。

您可以通过反向代理服务器，如 [Nginx](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-nginx?view=aspnetcore-7.0&tabs=linux-ubuntu#install-nginx) 或 [Apache](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-apache?view=aspnetcore-7.0)，或使用 HTTP-over-DNS 隧道，如 [Cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-and-setup/tunnel-guide/)，来提供您的应用程序。

另外，请记得正确解析代理的转发头，以便通过 [转发解析器](/docs/advanced/forwarding-resolvers) 获取客户端信息，例如 IP 地址和主机。

创建隧道、配置防火墙并运行应用程序后，下一步是为您的应用程序创建一个服务。

> [!NOTE]
> 在非 Windows 系统上，直接在 Sisk 服务中使用 SSL 证书是不可能的。这是 HttpListener 的实现方式，这是 Sisk 中 HTTP 队列管理的核心模块，这种实现方式在操作系统之间有所不同。如果您 [将证书与 IIS 中的虚拟主机关联](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis)，则可以在 Sisk 服务中使用 SSL。对于其他系统，强烈推荐使用反向代理。

## 创建服务

创建服务将使您的应用程序始终可用，即使在服务器实例重启或发生不可恢复的崩溃后。

在这个简单的教程中，我们将使用前一个教程的内容作为示例，以保持服务始终活跃。

1. 访问服务配置文件所在的文件夹：

    ```sh
    cd /etc/systemd/system
    ```

2. 创建您的 `my-app.service` 文件并包含以下内容：
    
    <div class="script-header">
        <span>
            my-app.service
        </span>
        <span>
            INI
        </span>
    </div>
    
    ```ini
    [Unit]
    Description=<description about your app>

    [Service]
    # 设置将启动服务的用户
    User=<user which will launch the service>

    # ExecStart 路径不是相对于 WorkingDirectory 的。
    # 将其设置为可执行文件的完整路径
    WorkingDirectory=/home/htdocs
    ExecStart=/home/htdocs/my-app

    # 设置服务在崩溃后始终重启
    Restart=always
    RestartSec=3

    [Install]
    WantedBy=multi-user.target
    ```

3. 重启服务管理器模块：

    ```sh
    $ sudo systemctl daemon-reload
    ```

4. 从文件名启动新创建的服务并检查是否正在运行：

    ```sh
    $ sudo systemctl start my-app
    $ sudo systemctl status my-app
    ```

5. 现在，如果您的应用程序正在运行 ("Active: active")，请启用服务以便在系统重启后继续运行：
    
    ```sh
    $ sudo systemctl enable my-app
    ```

现在，您已经准备好向所有人展示您的 Sisk 应用。