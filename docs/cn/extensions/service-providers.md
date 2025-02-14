# 服务提供者

服务提供者是一种将 Sisk 应用程序移植到不同环境的方式，使用一个可移植的配置文件。该功能允许您在不修改应用程序代码的情况下更改服务器的端口、参数和其他选项。该模块依赖于 Sisk 构造语法，可以通过 `UsePortableConfiguration` 方法进行配置。

一个配置提供者是通过 `IConfigurationProvider` 实现的，它提供了一个配置读取器，可以接受任何实现。默认情况下，Sisk 提供了一个 JSON 配置读取器，但也存在一个用于 INI 文件的包。您也可以创建自己的配置提供者并将其注册为：

```csharp
using var app = HttpServer.CreateBuilder()
    .UsePortableConfiguration(config =>
    {
        config.WithConfigReader<MyConfigurationReader>();
    })
    .Build();
```

如前所述，默认的提供者是一个 JSON 文件。默认情况下，文件名为 `service-config.json`，并在运行进程的当前目录中搜索，而不是可执行文件目录。

您可以选择更改文件名，以及 Sisk 应该在哪里查找配置文件，使用：

```csharp
using Sisk.Core.Http;
using Sisk.Core.Http.Hosting;

using var app = HttpServer.CreateBuilder()
    .UsePortableConfiguration(config =>
    {
        config.WithConfigFile("config.toml",
            createIfDontExists: true,
            lookupDirectories:
                ConfigurationFileLookupDirectory.CurrentDirectory |
                ConfigurationFileLookupDirectory.AppDirectory);
    })
    .Build();
```

上面的代码将在运行进程的当前目录中查找 `config.toml` 文件。如果找不到，它将在可执行文件所在的目录中搜索。如果文件不存在，`createIfDontExists` 参数将被尊重，创建一个空文件在最后测试的路径（基于 `lookupDirectories`），并在控制台中抛出一个错误，防止应用程序初始化。

> [!TIP]
> 
> 您可以查看 INI 配置读取器和 JSON 配置读取器的源代码，以了解如何实现 `IConfigurationProvider`。

## 从 JSON 文件读取配置

默认情况下，Sisk 提供了一个配置提供者，用于从 JSON 文件读取配置。该文件遵循一个固定的结构，包含以下参数：

```json
{
    "Server": {
        "DefaultEncoding": "UTF-8",
        "ThrowExceptions": true,
        "IncludeRequestIdHeader": true
    },
    "ListeningHost": {
        "Label": "My sisk application",
        "Ports": [
            "http://localhost:80/",
            "https://localhost:443/",  // 配置文件也支持注释
        ],
        "CrossOriginResourceSharingPolicy": {
            "AllowOrigin": "*",
            "AllowOrigins": [ "*" ],   // 新增于 0.14
            "AllowMethods": [ "*" ],
            "AllowHeaders": [ "*" ],
            "MaxAge": 3600
        },
        "Parameters": {
            "MySqlConnection": "server=localhost;user=root;"
        }
    }
}
```

从配置文件创建的参数可以在服务器构造函数中访问：

```csharp
using var app = HttpServer.CreateBuilder()
    .UsePortableConfiguration(config =>
    {
        config.WithParameters(paramCollection =>
        {
            string databaseConnection = paramCollection.GetValueOrThrow("MySqlConnection");
        });
    })
    .Build();
```

每个配置读取器提供了一种读取服务器初始化参数的方式。一些属性被指示在进程环境中而不是在配置文件中定义，例如敏感的 API 数据、API 密钥等。

## 配置文件结构

JSON 配置文件由以下属性组成：

<table>
    <thead>
        <tr>
            <th>属性</th>
            <th>必需</th>
            <th>描述</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Server</td>
            <td>必需</td>
            <td>代表服务器本身及其设置。</td>
        </tr>
        <tr>
            <td>Server.AccessLogsStream</td>
            <td>可选</td>
            <td>默认为 <code>console</code>。指定访问日志输出流。可以是文件名、<code>null</code> 或 <code>console</code>。</td>
        </tr>
        <tr>
            <td>Server.ErrorsLogsStream</td>
            <td>可选</td>
            <td>默认为 <code>null</code>。指定错误日志输出流。可以是文件名、<code>null</code> 或 <code>console</code>。</td>
        </tr>
        <tr>
            <td>Server.MaximumContentLength</td>
            <td>可选</td>
            <td>默认为 <code>0</code>。指定最大内容长度（以字节为单位）。零表示无限。</td>
        </tr>
        <tr>
            <td>Server.IncludeRequestIdHeader</td>
            <td>可选</td>
            <td>默认为 <code>false</code>。指定是否应发送 <code>X-Request-Id</code> 标头。</td>
        </tr>
        <tr>
            <td>Server.ThrowExceptions</td>
            <td>可选</td>
            <td>默认为 <code>true</code>。指定是否应抛出未处理的异常。设置为 <code>false</code> 时为生产环境，<code>true</code> 时为调试环境。</td>
        </tr>
        <tr>
            <td>ListeningHost</td>
            <td>必需</td>
            <td>代表服务器监听主机。</td>
        </tr>
        <tr>
            <td>ListeningHost.Label</td>
            <td>可选</td>
            <td>代表应用程序标签。</td>
        </tr>
        <tr>
            <td>ListeningHost.Ports</td>
            <td>必需</td>
            <td>代表一个字符串数组，匹配 <a href="/api/Sisk.Core.Http.ListeningPort">ListeningPort</a> 语法。</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy</td>
            <td>可选</td>
            <td>设置应用程序的 CORS 标头。</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowCredentials</td>
            <td>可选</td>
            <td>默认为 <code>false</code>。指定 <code>Allow-Credentials</code> 标头。</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.ExposeHeaders</td>
            <td>可选</td>
            <td>默认为 <code>null</code>。此属性期望一个字符串数组。指定 <code>Expose-Headers</code> 标头。</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowOrigin</td>
            <td>可选</td>
            <td>默认为 <code>null</code>。此属性期望一个字符串。指定 <code>Allow-Origin</code> 标头。</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowOrigins</td>
            <td>可选</td>
            <td>默认为 <code>null</code>。此属性期望一个字符串数组。指定多个 <code>Allow-Origin</code> 标头。请参阅 <a href="/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins">AllowOrigins</a> 以获取更多信息。</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowMethods</td>
            <td>可选</td>
            <td>默认为 <code>null</code>。此属性期望一个字符串数组。指定 <code>Allow-Methods</code> 标头。</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowHeaders</td>
            <td>可选</td>
            <td>默认为 <code>null</code>。此属性期望一个字符串数组。指定 <code>Allow-Headers</code> 标头。</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.MaxAge</td>
            <td>可选</td>
            <td>默认为 <code>null</code>。此属性期望一个整数。指定 <code>Max-Age</code> 标头（以秒为单位）。</td>
        </tr>
        <tr>
            <td>ListeningHost.Parameters</td>
            <td>可选</td>
            <td>指定提供给应用程序设置方法的属性。</td>
        </tr>
    </tbody>
</table>