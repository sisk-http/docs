服务提供程序是一种将您的 Sisk 应用程序移植到不同环境的可移植配置文件的方式。此功能允许您更改服务器的端口、参数和其他选项，而无需为每个环境修改应用程序代码。此模块依赖于 Sisk 的构建语法，可以通过 UsePortableConfiguration 方法进行配置。

配置提供程序使用 IConfigurationProvider 实现，它提供了一个配置读取器，可以接收任何实现。默认情况下，Sisk 提供了一个 JSON 配置读取器，但还有一个用于 INI 文件的包。您还可以创建自己的配置提供程序并使用以下方法注册它：

```csharp
using var app = HttpServer.CreateBuilder()
    .UsePortableConfiguration(config =>
    {
        config.WithConfigReader<MyConfigurationReader>();
    })
    .Build();
```

如前所述，默认提供程序是一个 JSON 文件。默认情况下，搜索的文件名为 service-config.json，并且它在运行进程的当前目录中搜索，而不是可执行文件目录。

您可以选择更改文件名以及 Sisk 应该在哪里查找配置文件，方法如下：

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

上面的代码将查找当前运行进程的 config.toml 文件。如果找不到，它将搜索可执行文件所在的目录。如果文件不存在，则会 honored createIfDontExists 参数，在最后一个测试路径（基于 lookupDirectories）中创建一个文件（没有内容），并在控制台中抛出一个错误，阻止应用程序初始化。

> [!TIP]
> 
> 您可以查看 INI 配置读取器和 JSON 配置读取器的源代码，以了解如何实现 IConfigurationProvider。

## 从 JSON 文件读取配置

默认情况下，Sisk 提供了一个从 JSON 文件读取配置的配置提供程序。此文件遵循固定结构，由以下参数组成：

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
            "AllowOrigins": [ "*" ],   // new on 0.14
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

可以从配置文件中访问的配置参数可以在服务器构造函数中：

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

每个配置读取器都提供了一种读取服务器初始化参数的方法。某些属性指示应在进程环境中而不是在配置文件中定义，例如敏感的 API 数据、API 密钥等。

## 配置文件结构

JSON 配置文件由以下属性组成：

<table>
    <thead>
        <tr>
            <th>属性</th>
            <th>必填</th>
            <th>描述</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Server</td>
            <td>是</td>
            <td>表示服务器本身及其设置。</td>
        </tr>
        <tr>
            <td>Server.AccessLogsStream</td>
            <td>可选</td>
            <td>默认为<code>console</code>。指定访问日志输出流。可以是文件名、
                <code>null</code> 或 <code>console</code>。
            </td>
        </tr>
        <tr>
            <td>Server.ErrorsLogsStream</td>
            <td>可选</td>
            <td>默认为<code>null</code>。指定错误日志输出流。可以是文件名、
                <code>null</code> 或 <code>console</code>。
            </td>
        </tr>
        <tr>
            <td>Server.MaximumContentLength</td>
            <td>可选</td>
            <td>默认为<code>0</code>。指定最大内容长度（以字节为单位）。零表示无限。</td>
        </tr>
        <tr>
            <td>Server.IncludeRequestIdHeader</td>
            <td>可选</td>
            <td>默认为<code>false</code>。指定 HTTP 服务器是否应发送 <code>X-Request-Id</code> 标头。</td>
        </tr>
        <tr>
            <td>Server.ThrowExceptions</td>
            <td>可选</td>
            <td>默认为<code>true</code>。指定未处理的异常是否应抛出。设置为 <code>false</code> 用于生产环境，设置为 <code>true</code> 用于调试环境。</td>
        </tr>
        <tr>
            <td>ListeningHost</td>
            <td>必填</td>
            <td>表示服务器侦听主机。</td>
        </tr>
        <tr>
            <td>ListeningHost.Label</td>
            <td>可选</td>
            <td>表示应用程序标签。</td>
        </tr>
        <tr>
            <td>ListeningHost.Ports</td>
            <td>必填</td>
            <td>表示一个字符串数组，与 <a href="/api/Sisk.Core.Http.ListeningPort">ListeningPort</a> 语法匹配。</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy</td>
            <td>可选</td>
            <td>设置应用程序的 CORS 标头。</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowCredentials</td>
            <td>可选</td>
            <td>默认为<code>false</code>。指定 <code>Allow-Credentials</code> 标头。</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.ExposeHeaders</td>
            <td>可选</td>
            <td>默认为<code>null</code>。此属性期望一个字符串数组。指定 <code>Expose-Headers</code> 标头。</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowOrigin</td>
            <td>可选</td>
            <td>默认为<code>null</code>。此属性期望一个字符串。指定 <code>Allow-Origin</code> 标头。</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowOrigins</td>
            <td>可选</td>
            <td>默认为<code>null</code>。此属性期望一个字符串数组。指定多个 <code>Allow-Origin</code> 标头。有关详细信息，请参阅 <a href="/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins">AllowOrigins</a>。</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowMethods</td>
            <td>可选</td>
            <td>默认为<code>null</code>。此属性期望一个字符串数组。指定 <code>Allow-Methods</code> 标头。</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowHeaders</td>
            <td>可选</td>
            <td>默认为<code>null</code>。此属性期望一个字符串数组。指定 <code>Allow-Headers</code> 标头。</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.MaxAge</td>
            <td>可选</td>
            <td>默认为<code>null</code>。此属性期望一个整数。指定 <code>Max-Age</code> 标头（以秒为单位）。</td>
        </tr>
        <tr>
            <td>ListeningHost.Parameters</td>
            <td>可选</td>
            <td>指定传递给应用程序设置方法的属性。</td>
        </tr>
    </tbody>
</table>