# Fornecedores de Serviços

Fornecedores de Serviços é uma forma de portar seu aplicativo Sisk para diferentes ambientes com um arquivo de configuração portátil. Essa funcionalidade permite alterar a porta do servidor, parâmetros e outras opções sem precisar modificar o código do aplicativo para cada ambiente. Esse módulo depende da sintaxe de construção do Sisk e pode ser configurado por meio do método UsePortableConfiguration.

Um provedor de configuração é implementado com IConfigurationProvider, que fornece um leitor de configuração e pode receber qualquer implementação. Por padrão, o Sisk fornece um leitor de configuração JSON, mas também há um pacote para arquivos INI. Você também pode criar seu próprio provedor de configuração e registrá-lo com:

```csharp
using var app = HttpServer.CreateBuilder()
    .UsePortableConfiguration(config =>
    {
        config.WithConfigReader<MyConfigurationReader>();
    })
    .Build();
```

Como mencionado anteriormente, o provedor padrão é um arquivo JSON. Por padrão, o nome do arquivo procurado é service-config.json, e ele é procurado no diretório atual do processo em execução, não no diretório do executável.

Você pode escolher alterar o nome do arquivo, bem como onde o Sisk deve procurar o arquivo de configuração, com:

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

O código acima procurará o arquivo config.toml no diretório atual do processo em execução. Se não for encontrado, ele procurará no diretório onde o executável está localizado. Se o arquivo não existir, o parâmetro createIfDontExists será honrado, criando o arquivo, sem conteúdo, no último caminho testado (com base em lookupDirectories), e um erro será lançado no console, impedindo que o aplicativo seja inicializado.

> [!TIP]
> 
> Você pode olhar o código-fonte do leitor de configuração INI e do leitor de configuração JSON para entender como um IConfigurationProvider é implementado.

## Lendo configurações de um arquivo JSON

Por padrão, o Sisk fornece um provedor de configuração que lê configurações de um arquivo JSON. Esse arquivo segue uma estrutura fixa e é composto pelos seguintes parâmetros:

```json
{
    "Server": {
        "DefaultEncoding": "UTF-8",
        "ThrowExceptions": true,
        "IncludeRequestIdHeader": true
    },
    "ListeningHost": {
        "Label": "Meu aplicativo Sisk",
        "Ports": [
            "http://localhost:80/",
            "https://localhost:443/",  // Arquivos de configuração também suportam comentários
        ],
        "CrossOriginResourceSharingPolicy": {
            "AllowOrigin": "*",
            "AllowOrigins": [ "*" ],   // Novo no 0.14
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

Os parâmetros criados a partir de um arquivo de configuração podem ser acessados no construtor do servidor:

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

Cada leitor de configuração fornece uma forma de ler os parâmetros de inicialização do servidor. Algumas propriedades são indicadas para estar no ambiente do processo em vez de serem definidas no arquivo de configuração, como dados de API sensíveis, chaves de API, etc.

## Estrutura do arquivo de configuração

O arquivo de configuração JSON é composto pelas seguintes propriedades:

<table>
    <thead>
        <tr>
            <th>Propriedade</th>
            <th>Obrigatório</th>
            <th>Descrição</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Server</td>
            <td>Obrigatório</td>
            <td>Representa o servidor em si com suas configurações.</td>
        </tr>
        <tr>
            <td>Server.AccessLogsStream</td>
            <td>Opcional</td>
            <td>Padrão para <code>console</code>. Especifica o fluxo de saída do log de acesso. Pode ser um nome de arquivo,
                <code>null</code> ou <code>console</code>.
            </td>
        </tr>
        <tr>
            <td>Server.ErrorsLogsStream</td>
            <td>Opcional</td>
            <td>Padrão para <code>null</code>. Especifica o fluxo de saída do log de erros. Pode ser um nome de arquivo,
                <code>null</code> ou <code>console</code>.
            </td>
        </tr>
        <tr>
            <td>Server.MaximumContentLength</td>
            <td>Opcional</td>
            <tr>
            <td>Server.MaximumContentLength</td>
            <td>Opcional</td>
            <td>Padrão para <code>0</code>. Especifica o comprimento máximo de conteúdo em bytes. Zero significa infinito.</td>
        </tr>
        <tr>
            <td>Server.IncludeRequestIdHeader</td>
            <td>Opcional</td>
            <td>Padrão para <code>false</code>. Especifica se o servidor HTTP deve enviar o cabeçalho <code>X-Request-Id</code>.</td>
        </tr>
        <tr>
            <td>Server.ThrowExceptions</td>
            <td>Opcional</td>
            <td>Padrão para <code>true</code>. Especifica se as exceções não tratadas devem ser lançadas. Defina como <code>false</code> quando em produção e <code>true</code> quando em depuração.</td>
        </tr>
        <tr>
            <td>ListeningHost</td>
            <td>Obrigatório</td>
            <td>Representa o host de escuta do servidor.</td>
        </tr>
        <tr>
            <td>ListeningHost.Label</td>
            <td>Opcional</td>
            <td>Representa o rótulo do aplicativo.</td>
        </tr>
        <tr>
            <td>ListeningHost.Ports</td>
            <td>Obrigatório</td>
            <td>Representa uma matriz de strings, correspondendo à sintaxe <a href="/api/Sisk.Core.Http.ListeningPort">ListeningPort</a>.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy</td>
            <td>Opcional</td>
            <td>Configura os cabeçalhos CORS para o aplicativo.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowCredentials</td>
            <td>Opcional</td>
            <td>Padrão para <code>false</code>. Especifica o cabeçalho <code>Allow-Credentials</code>.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.ExposeHeaders</td>
            <td>Opcional</td>
            <td>Padrão para <code>null</code>. Essa propriedade espera uma matriz de strings. Especifica o cabeçalho <code>Expose-Headers</code>.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowOrigin</td>
            <td>Opcional</td>
            <td>Padrão para <code>null</code>. Essa propriedade espera uma string. Especifica o cabeçalho <code>Allow-Origin</code>.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowOrigins</td>
            <td>Opcional</td>
            <td>Padrão para <code>null</code>. Essa propriedade espera uma matriz de strings. Especifica vários cabeçalhos <code>Allow-Origin</code>. Veja <a href="/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins">AllowOrigins</a> para mais informações.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowMethods</td>
            <td>Opcional</td>
            <td>Padrão para <code>null</code>. Essa propriedade espera uma matriz de strings. Especifica o cabeçalho <code>Allow-Methods</code>.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowHeaders</td>
            <td>Opcional</td>
            <td>Padrão para <code>null</code>. Essa propriedade espera uma matriz de strings. Especifica o cabeçalho <code>Allow-Headers</code>.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.MaxAge</td>
            <td>Opcional</td>
            <td>Padrão para <code>null</code>. Essa propriedade espera um inteiro. Especifica o cabeçalho <code>Max-Age</code> em segundos.</td>
        </tr>
        <tr>
            <td>ListeningHost.Parameters</td>
            <td>Opcional</td>
            <td>Especifica as propriedades fornecidas ao método de configuração do aplicativo.</td>
        </tr>
    </tbody>
</table>