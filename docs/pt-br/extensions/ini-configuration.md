# Fornecedor de configuração INI

O Sisk possui um método para obter configurações de inicialização além do JSON. Na verdade, qualquer pipeline que implemente [IConfigurationReader](/api/Sisk.Core.Http.Hosting.IConfigurationReader) pode ser usado com [PortableConfigurationBuilder.WithConfigurationPipeline](/api/Sisk.Core.Http.Hosting.PortableConfigurationBuilder), lendo a configuração do servidor de qualquer tipo de arquivo.

O pacote [Sisk.IniConfiguration](https://www.nuget.org/packages/Sisk.IniConfiguration/) fornece um leitor de arquivos INI baseados em stream que não lança exceções para erros de sintaxe comuns e possui uma sintaxe de configuração simples. Este pacote pode ser usado fora do framework Sisk, oferecendo flexibilidade para projetos que exigem um leitor de documentos INI eficiente.

## Instalando

Para instalar o pacote, você pode começar com:

```bash
$ dotnet add package Sisk.IniConfiguration
```

e usá-lo em seu código como mostrado no exemplo abaixo:

```cs
class Program
{
    static HttpServerHostContext Host = null!;

    static void Main(string[] args)
    {
        Host = HttpServer.CreateBuilder()
            .UsePortableConfiguration(config =>
            {
                config.WithConfigFile("app.ini", createIfDontExists: true);

                // adiciona o IniConfigurationPipeline ao leitor de configuração
                config.WithConfigurationPipeline<IniConfigurationPipeline>();
            })
            .UseRouter(r =>
            {
                r.MapGet("/", SayHello);
            })
            .Build();

        Host.Start();
    }

    static HttpResponse SayHello(HttpRequest request)
    {
        string? name = Host.Parameters["name"] ?? "world";
        return new HttpResponse($"Hello, {name}!");
    }
}
```

O código acima procurará por um arquivo app.ini no diretório atual do processo (CurrentDirectory). O arquivo INI parece este:

```ini
[Server]
# Múltiplas endereços de escuta são suportados
Listen = http://localhost:5552/
Listen = http://localhost:5553/
ThrowExceptions = false
AccessLogsStream = console

[Cors]
AllowMethods = GET, POST
AllowHeaders = Content-Type, Authorization
AllowOrigin = *

[Parameters]
Name = "Kanye West"
```

## Sabor INI e sintaxe

Sabor de implementação atual:

- Nomes de propriedades e seções são **insensíveis a maiúsculas e minúsculas**.
- Nomes de propriedades e valores são **recortados**.
- Os valores podem ser entre aspas simples ou duplas. As aspas podem ter quebras de linha dentro delas.
- Comentários são suportados com `#` e `;`. Também são permitidos **comentários de trailling**.
- As propriedades podem ter vários valores.

Em detalhes, a documentação para o "sabor" do parser INI usado no Sisk está [disponível no GitHub](https://github.com/sisk-http/archive/blob/master/ext/ini-reader-syntax.md).

Usando o seguinte código ini como exemplo:

```ini
One = 1
Value = this is an value
Another value = "this value
    has an line break on it"

; the code below has some colors
[some section]
Color = Red
Color = Blue
Color = Yellow ; do not use yellow
```

Analise-o com:

```csharp
// analisa o texto ini da string
IniDocument doc = IniDocument.FromString(iniText);

// obtém um valor
string? one = doc.Global.GetOne("one");
string? anotherValue = doc.Global.GetOne("another value");

// obtém vários valores
string[]? colors = doc.GetSection("some section")?.GetMany("color");
```

## Parâmetros de configuração

| Seção e nome | Permitir vários valores | Descrição |
| ------------- | --------------------- | ----------- |
| `Server.Listen` | Sim | Os endereços/portos de escuta do servidor. |
| `Server.Encoding` | Não | A codificação padrão do servidor. |
| `Server.MaximumContentLength` | Não | O tamanho máximo de conteúdo do servidor em bytes. |
| `Server.IncludeRequestIdHeader` | Não | Especifica se o servidor HTTP deve enviar o cabeçalho X-Request-Id. |
| `Server.ThrowExceptions` | Não | Especifica se exceções não tratadas devem ser lançadas. |
| `Server.AccessLogsStream` | Não | Especifica o fluxo de saída do log de acesso. |
| `Server.ErrorsLogsStream` | Não | Especifica o fluxo de saída do log de erros. |
| `Cors.AllowMethods` | Não | Especifica o valor do cabeçalho CORS Allow-Methods. |
| `Cors.AllowHeaders` | Não | Especifica o valor do cabeçalho CORS Allow-Headers. |
| `Cors.AllowOrigins` | Não | Especifica múltiplos cabeçalhos Allow-Origin, separados por vírgulas. [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins) para mais informações. |
| `Cors.AllowOrigin` | Não | Especifica um cabeçalho Allow-Origin. |
| `Cors.ExposeHeaders` | Não | Especifica o valor do cabeçalho CORS Expose-Headers. |
| `Cors.AllowCredentials` | Não | Especifica o valor do cabeçalho CORS Allow-Credentials. |
| `Cors.MaxAge` | Não | Especifica o valor do cabeçalho CORS Max-Age. |