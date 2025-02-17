# Configuração INI

O Sisk tem um método para obter configurações de inicialização além do JSON. Na verdade, qualquer pipeline que implemente [IConfigurationReader](/api/Sisk.Core.Http.Hosting.IConfigurationReader) pode ser usado com [PortableConfigurationBuilder.WithConfigurationPipeline](/api/Sisk.Core.Http.Hosting.PortableConfigurationBuilder), lendo a configuração do servidor de qualquer tipo de arquivo.

O pacote [Sisk.IniConfiguration](https://www.nuget.org/packages/Sisk.IniConfiguration/) fornece um leitor de arquivos INI baseado em fluxo que não lança exceções para erros de sintaxe comuns e tem uma sintaxe de configuração simples. Esse pacote pode ser usado fora do framework Sisk, oferecendo flexibilidade para projetos que requerem um leitor de documentos INI eficiente.

## Instalando

Para instalar o pacote, você pode começar com:

```bash
$ dotnet add package Sisk.IniConfiguration
```

Você também pode instalar o pacote core, que não inclui o [IConfigurationReader](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.IConfigurationReader) INI, nem a dependência do Sisk, apenas os serializadores INI:

```bash
$ dotnet add package Sisk.IniConfiguration.Core
```

Com o pacote principal, você pode usá-lo em seu código como mostrado no exemplo abaixo:

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
                
                // usa o leitor de configuração IniConfigurationReader
                config.WithConfigurationPipeline<IniConfigurationReader>();
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

O código acima procurará por um arquivo app.ini no diretório atual do processo (CurrentDirectory). O arquivo INI tem a seguinte aparência:

```ini
[Server]
# Múltiplos endereços de escuta são suportados
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

## Sabor e sintaxe INI

Implementação atual do sabor:

- Nomes de propriedades e seções são **insensíveis a letras maiúsculas e minúsculas**.
- Nomes de propriedades e valores são **recortados**, a menos que os valores sejam citados.
- Valores podem ser citados com aspas simples ou duplas. Aspas podem ter quebras de linha dentro delas.
- Comentários são suportados com `#` e `;`. Além disso, **comentários de tralha são permitidos**.
- Propriedades podem ter múltiplos valores.

Em detalhe, a documentação para o "sabor" do analisador INI usado no Sisk está [disponível neste documento](https://github.com/sisk-http/archive/blob/master/ext/ini-reader-syntax.md).

Usando o seguinte código INI como exemplo:

```ini
One = 1
Value = este é um valor
Another value = "este valor
    tem uma quebra de linha nele"

; o código abaixo tem algumas cores
[some section]
Color = Red
Color = Blue
Color = Yellow ; não use amarelo
```

Analisá-lo com:

```csharp
// analisa o texto INI da string
IniDocument doc = IniDocument.FromString(iniText);

// obtenha um valor
string? one = doc.Global.GetOne("one");
string? anotherValue = doc.Global.GetOne("another value");

// obtenha múltiplos valores
string[]? colors = doc.GetSection("some section")?.GetMany("color");
```

## Parâmetros de configuração

| Seção e nome | Permite múltiplos valores | Descrição |
| ---------------- | --------------------- | ----------- |
| `Server.Listen` | Sim | Os endereços/ports de escuta do servidor. |
| `Server.Encoding` | Não | A codificação padrão do servidor. |
| `Server.MaximumContentLength` | Não | O tamanho máximo do conteúdo em bytes. |
| `Server.IncludeRequestIdHeader` | Não | Especifica se o servidor HTTP deve enviar o cabeçalho X-Request-Id. |
| `Server.ThrowExceptions` | Não |  Especifica se as exceções não tratadas devem ser lançadas.  |
| `Server.AccessLogsStream` | Não |  Especifica o fluxo de saída do log de acesso. |
| `Server.ErrorsLogsStream` | Não |  Especifica o fluxo de saída do log de erros. |
| `Cors.AllowMethods` | Não |  Especifica o valor do cabeçalho Allow-Methods CORS. |
| `Cors.AllowHeaders` | Não |  Especifica o valor do cabeçalho Allow-Headers CORS. |
| `Cors.AllowOrigins` | Não |  Especifica múltiplos cabeçalhos Allow-Origin, separados por vírgulas. [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins) para mais informações. |
| `Cors.AllowOrigin` | Não |  Especifica um cabeçalho Allow-Origin. |
| `Cors.ExposeHeaders` | Não |  Especifica o valor do cabeçalho Expose-Headers CORS. |
| `Cors.AllowCredentials` | Não |  Especifica o valor do cabeçalho Allow-Credentials CORS. |
| `Cors.MaxAge` | Não |  Especifica o valor do cabeçalho Max-Age CORS. |