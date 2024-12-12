# Service Providers

Service Providers é uma forma de portar sua aplicação Sisk para diferentes ambientes com um arquivo de configuração portátil. Este recurso possibilita alterar funcionamento de portas, parâmetros e demais opções do servidor sem ter que alterar o código do aplicativo para cada ambiente. Este módulo depende da sintaxe de [construção do Sisk](/docs/getting-started) e pode ser configurada através do método [UsePortableConfiguration](/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.UsePortableConfiguration).

Um provedor de configuração é implementado com [IConfigurationProvider](/api/Sisk.Core.Http.Hosting.IConfigurationReader), o que provê um leitor de configurações e pode receber qualquer implementação. Por padrão, o Sisk fornece um leitor de configurações em JSON, mas também existe um pacote para [arquivos INI](/docs/extensions/ini-configuration). Você também pode criar seu próprio provedor de configurações e registrar com:

```csharp
using var app = HttpServer.CreateBuilder()
    .UsePortableConfiguration(config =>
    {
        config.WithConfigReader<MyConfigurationReader>();
    })
    .Build();
```

Como mencionado anteriormente, o provedor padrão é de um arquivo JSON. Por padrão, o nome do arquivo buscado é `service-config.json`, e é buscado na pasta atual (Current Directory) do processo em execução, e não do diretório do executável.

Você pode optar em alterar o nome do arquivo, bem como onde o Sisk deve procurar pelo arquivo de configuração, com:

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

O código acima irá procurar o arquivo `config.toml` na pasta atual do processo em execução. Se não encontrado o arquivo, irá então buscar no diretório de onde o executável está localizado. Caso o arquivo não exista, o parâmetro `createIfDontExists` é honrado, criando o arquivo, sem nenhum conteúdo, no último caminho testado (com base em `lookupDirectories`), e um erro é lançado no console, impedindo a inicialização do aplicativo.

> [!TIP]
> 
> Você pode olhar no código fonte do [leitor de configurações de arquivos INI](https://github.com/sisk-http/core/blob/main/extensions/Sisk.IniConfiguration/IniConfigurationReader.cs) e no [de JSON](https://github.com/sisk-http/core/blob/main/src/Internal/ServiceProvider/JsonConfigParser.cs) para entender como um [IConfigurationProvider](/api/Sisk.Core.Http.Hosting.IConfigurationReader) é implementado.

## Lendo configurações de um arquivo JSON

Por padrão, o Sisk fornece um provedor de configuração que lê configurações em um arquivo JSON. Este arquivo segue uma estrutura fixa e é composto pelos parâmetros:

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
            "https://localhost:443/",  // Configuration files also supports comments
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

Os parâmetros criados a partir de um arquivo de configurações pode ser acessado no construtor do servidor:

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

Cada leitor de configurações fornece uma forma de ler os parâmetros de inicialização do servidor. Algumas propriedades são indicadas a ficarem no [ambiente do processo](https://learn.microsoft.com/pt-br/dotnet/api/system.environment?view=net-8.0) ao invés de serem definidas no arquivo de configuração, como por exemplo, dados sensíveis de API, chaves de API, etc.

## Estrutura de arquivo de configuração

O arquivo de configuração JSON é composto pelas propriedades:

<table>
    <thead>
        <tr>
            <th>Property</th>
            <th>Mandatory</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Server</td>
            <td>Required</td>
            <td>Represents the server itself with their settings.</td>
        </tr>
        <tr>
            <td>Server.AccessLogsStream</td>
            <td>Optional</td>
            <td>Default to <code>console</code>. Specifies the access log output stream. Can be an filename,
                <code>null</code> or <code>console</code>.
            </td>
        </tr>
        <tr>
            <td>Server.ErrorsLogsStream</td>
            <td>Optional</td>
            <td>Default to <code>null</code>. Specifies the error log output stream. Can be an filename,
                <code>null</code> or <code>console</code>.
            </td>
        </tr>
        <tr>
            <td>Server.MaximumContentLength</td>
            <td>Optional</td>
            <td>Default to <code>0</code>. Specifies the maximum content length in bytes. Zero means
                infinite.</td>
        </tr>
        <tr>
            <td>Server.IncludeRequestIdHeader</td>
            <td>Optional</td>
            <td>Default to <code>false</code>. Specifies if the HTTP server should send the
                <code>X-Request-Id</code> header.
            </td>
        </tr>
        <tr>
            <td>Server.ThrowExceptions</td>
            <td>Optional</td>
            <td>Default to <code>true</code>. Specifies if unhandled exceptions should be thrown. Set to
                <code>false</code> when production and <code>true</code> when debugging.
            </td>
        </tr>
        <tr>
            <td>ListeningHost</td>
            <td>Required</td>
            <td>Represents the server listening host.</td>
        </tr>
        <tr>
            <td>ListeningHost.Label</td>
            <td>Optional</td>
            <td>Represents the application label.</td>
        </tr>
        <tr>
            <td>ListeningHost.Ports</td>
            <td>Required</td>
            <td>Represents an array of strings, matching the <a href="/api/Sisk.Core.Http.ListeningPort">ListeningPort</a> syntax.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy</td>
            <td>Optional</td>
            <td>Setup the CORS headers for the application.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowCredentials</td>
            <td>Optional</td>
            <td>Defaults to <code>false</code>. Specifies the <code>Allow-Credentials</code> header.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.ExposeHeaders</td>
            <td>Optional</td>
            <td>Defaults to <code>null</code>. This property expects an array of strings. Specifies the
                <code>Expose-Headers</code> header.
            </td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowOrigin</td>
            <td>Optional</td>
            <td>Defaults to <code>null</code>. This property expects an string. Specifies the
                <code>Allow-Origin</code> header.
            </td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowOrigins</td>
            <td>Optional</td>
            <td>Defaults to <code>null</code>. This property expects an array of strings.
                Specifies multiples <code>Allow-Origin</code> headers. See <a href="/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins">
                    AllowOrigins
                </a> for more information.
            </td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowMethods</td>
            <td>Optional</td>
            <td>Defaults to <code>null</code>. This property expects an array of strings. Specifies the
                <code>Allow-Methods</code> header.
            </td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowHeaders</td>
            <td>Optional</td>
            <td>Defaults to <code>null</code>. This property expects an array of strings. Specifies the
                <code>Allow-Headers</code> header.
            </td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.MaxAge</td>
            <td>Optional</td>
            <td>Defaults to <code>null</code>. This property expects an interger. Specifies the
                <code>Max-Age</code> header in seconds.
            </td>
        </tr>
        <tr>
            <td>ListeningHost.Parameters</td>
            <td>Optional</td>
            <td>Specifies the properties provided to the application setup method.</td>
        </tr>
    </tbody>
</table>