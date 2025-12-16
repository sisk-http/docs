# Registro de Logs

Você pode configurar o Sisk para escrever logs de acesso e erro automaticamente. É possível definir rotação de logs, extensões e frequência.

A classe [LogStream](/api/Sisk.Core.Http.LogStream) fornece uma maneira assíncrona de escrever logs e mantê-los em uma fila de escrita aguardável. A classe `LogStream` implementa `IAsyncDisposable`, garantindo que todos os logs pendentes sejam escritos antes que o stream seja fechado.

Neste artigo, mostraremos como configurar o registro de logs para sua aplicação.

## Logs de acesso baseados em arquivos

Os logs de acesso baseados em arquivos abrem o arquivo, escrevem o texto da linha e, em seguida, fecham o arquivo para cada linha escrita. Esse procedimento foi adotado para manter a responsividade da escrita nos logs.

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
class Program
{
    static async Task Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseConfiguration(config => {
                config.AccessLogsStream = new LogStream("logs/access.log");
            })
            .Build();
        
        ...
        
        await app.StartAsync();
    }
}
```

O código acima escreverá todas as solicitações recebidas no arquivo `logs/access.log`. Observe que o arquivo é criado automaticamente se não existir, no entanto, o diretório anterior a ele não é. Não é necessário criar o diretório `logs/` porque a classe `LogStream` o cria automaticamente.

## Registro de logs baseado em streams

Você pode escrever logs de arquivo para objetos `TextWriter`, como `Console.Out`, passando um objeto `TextWriter` no construtor:

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
using var app = HttpServer.CreateBuilder()
    .UseConfiguration(config => {
        config.AccessLogsStream = new LogStream(Console.Out);
    })
    .Build();
```

Para cada mensagem escrita no log baseado em stream, o método `TextWriter.Flush()` é chamado.

## Formatação de logs de acesso

Você pode personalizar o formato do log de acesso por meio de variáveis pré-definidas. Considere a seguinte linha:

```cs
config.AccessLogsFormat = "%dd/%dmm/%dy %tH:%ti:%ts %tz %ls %ri %rs://%ra%rz%rq [%sc %sd] %lin -> %lou in %lmsms [%{user-agent}]";
```

Ela escreverá uma mensagem como:

    29/mar./2023 15:21:47 -0300 Executed ::1 http://localhost:5555/ [200 OK] 689B -> 707B in 84ms [Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/111.0.0.0 Safari/537.36]

Você pode formatar seu log de arquivo pelo formato descrito pela tabela:

| Valor  | O que representa                                                                 | Exemplo                               |
|--------|-----------------------------------------------------------------------------------|---------------------------------------|
| %dd    | Dia do mês (formatado como dois dígitos)                                        | 05                                    |
| %dmmm  | Nome completo do mês                                                            | Julho                                 |
| %dmm   | Nome abreviado do mês (três letras)                                          | Jul                                  |
| %dm    | Número do mês (formatado como dois dígitos)                                  | 07                                    |
| %dy    | Ano (formatado como quatro dígitos)                                                 | 2023                                 |
| %th    | Hora no formato de 12 horas                                                          | 03                                    |
| %tH    | Hora no formato de 24 horas (HH)                                                    | 15                                    |
| %ti    | Minutos (formatados como dois dígitos)                                               | 30                                    |
| %ts    | Segundos (formatados como dois dígitos)                                               | 45                                    |
| %tm    | Milissegundos (formatados como três dígitos)                                        | 123                                   |
| %tz    | Deslocamento de fuso horário (total de horas em UTC)                                         | +03:00                               |
| %ri    | Endereço IP remoto do cliente                                                       | 192.168.1.100                        |
| %rm    | Método HTTP (em maiúsculas)                                                          | GET                                   |
| %rs    | Esquema de URI (http/https)                                                          | https                                |
| %ra    | Autoridade de URI (domínio)                                                           | example.com                          |
| %rh    | Host da solicitação                                                             | www.example.com                       |
| %rp    | Porta da solicitação                                                             | 443                                  |
| %rz    | Caminho da solicitação                                                             | /path/to/resource                    |
| %rq    | String de consulta                                                                    | ?key=value&another=123               |
| %sc    | Código de status de resposta HTTP                                                      | 200                                  |
| %sd    | Descrição do status de resposta HTTP                                              | OK                                   |
| %lin   | Tamanho do pedido em formato legível para humanos                                             | 1.2 KB                               |
| %linr  | Tamanho do pedido em bytes (bruto)                                                | 1234                                |
| %lou   | Tamanho da resposta em formato legível para humanos                                            | 2.5 KB                               |
| %lour  | Tamanho da resposta em bytes (bruto)                                               | 2560                                |
| %lms   | Tempo decorrido em milissegundos                                                   | 120                                  |
| %ls    | Status de execução                                                                | Executed                |
| %{header-name}    | Representa o cabeçalho `header-name` da solicitação.                                                                | `Mozilla/5.0 (platform; rv:gecko [...]`                |
| %{:header-name}    | Representa o cabeçalho `header-name` da resposta. | `application/json` |

Você também pode usar `HttpServerConfiguration.DefaultAccessLogFormat` para usar o formato de log de acesso padrão.

## Logs rotativos

Você pode configurar o servidor HTTP para rotacionar os arquivos de log para um arquivo comprimido .gz quando atingirem um determinado tamanho. O tamanho é verificado periodicamente pelo limiar que você define.

```cs
LogStream errorLog = new LogStream("logs/error.log")
    .ConfigureRotatingPolicy(
        maximumSize: 64 * SizeHelper.UnitMb,
        dueTime: TimeSpan.FromHours(6));
```

O código acima verificará a cada seis horas se o arquivo do LogStream atingiu o limite de 64MB. Se sim, o arquivo será comprimido em um arquivo .gz e, em seguida, o `access.log` será limpo.

Durante esse processo, a escrita no arquivo é bloqueada até que o arquivo seja comprimido e limpo. Todas as linhas que forem escritas nesse período ficarão em uma fila aguardando o fim da compressão.

Essa função só funciona com LogStreams baseados em arquivos.

## Registro de erros

Quando um servidor não está lançando erros para o depurador, ele encaminha os erros para a escrita de logs quando houver algum. Você pode configurar a escrita de erros com:

```cs
config.ThrowExceptions = false;
config.ErrorsLogsStream = new LogStream("error.log");
```

Essa propriedade só escreverá algo no log se o erro não for capturado pelo callback ou pela propriedade [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler).

O erro escrito pelo servidor sempre escreve a data e hora, os cabeçalhos da solicitação (não o corpo), a trilha do erro e a trilha da exceção interna, se houver.

## Outras instâncias de registro de logs

Sua aplicação pode ter zero ou múltiplas instâncias de LogStream, não há limite para quantos canais de log ela pode ter. Portanto, é possível direcionar o log da aplicação para um arquivo diferente do AccessLog ou ErrorLog padrão.

```cs
LogStream appMessages = new LogStream("messages.log");
appMessages.WriteLine("Aplicação iniciada em {0}", DateTime.Now);
```

## Estendendo LogStream

Você pode estender a classe `LogStream` para escrever formatos personalizados, compatíveis com o mecanismo de log do Sisk atual. O exemplo abaixo permite escrever mensagens coloridas no Console por meio da biblioteca Spectre.Console:

<div class="script-header">
    <span>
        CustomLogStream.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class CustomLogStream : LogStream
{
    protected override void WriteLineInternal(string line)
    {
        base.WriteLineInternal($"[{DateTime.Now:g}] {line}");
    }
}
```

Outra maneira de escrever logs personalizados para cada solicitação/resposta é criar um [HttpServerHandler](/api/Sisk.Core.Http.Handlers.HttpServerHandler). O exemplo abaixo é um pouco mais completo. Ele escreve o corpo da solicitação e da resposta em JSON no Console. Pode ser útil para depurar solicitações em geral. Esse exemplo usa ContextBag e HttpServerHandler.

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
class Program
{
    static async Task Main(string[] args)
    {
        var app = HttpServer.CreateBuilder(host =>
        {
            host.UseListeningPort(5555);
            host.UseHandler<JsonMessageHandler>();
        });

        app.Router += new Route(RouteMethod.Any, "/json", request =>
        {
            return new HttpResponse()
                .WithContent(JsonContent.Create(new
                {
                    method = request.Method.Method,
                    path = request.Path,
                    specialMessage = "Hello, world!!"
                }));
        });

        await app.StartAsync();
    }
}
```

<div class="script-header">
    <span>
        JsonMessageHandler.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
class JsonMessageHandler : HttpServerHandler
{
    protected override void OnHttpRequestOpen(HttpRequest request)
    {
        if (request.Method != HttpMethod.Get && request.Headers["Content-Type"]?.Contains("json", StringComparison.InvariantCultureIgnoreCase) == true)
        {
            // Neste ponto, a conexão está aberta e o cliente enviou o cabeçalho especificando
            // que o conteúdo é JSON. A linha abaixo lê o conteúdo e deixa armazenado na solicitação.
            //
            // Se o conteúdo não for lido na ação da solicitação, o GC pode coletar o conteúdo
            // após enviar a resposta ao cliente, então o conteúdo pode não estar disponível após a resposta ser fechada.
            //
            _ = request.RawBody;

            // adiciona dica no contexto para informar que esta solicitação tem um corpo JSON
            request.Bag.Add("IsJsonRequest", true);
        }
    }

    protected override async void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        string? requestJson = null,
                responseJson = null,
                responseMessage;

        if (result.Request.Bag.ContainsKey("IsJsonRequest"))
        {
            // reformata o JSON usando a biblioteca CypherPotato.LightJson
            var content = result.Request.Body;
            requestJson = JsonValue.Deserialize(content, new JsonOptions() { WriteIndented = true }).ToString();
        }
        
        if (result.Response is { } response)
        {
            var content = response.Content;
            responseMessage = $"{(int)response.Status} {HttpStatusInformation.GetStatusCodeDescription(response.Status)}";
            
            if (content is HttpContent httpContent &&
                // verifica se a resposta é JSON
                httpContent.Headers.ContentType?.MediaType?.Contains("json", StringComparison.InvariantCultureIgnoreCase) == true)
            {
                string json = await httpContent.ReadAsStringAsync();
                responseJson = JsonValue.Deserialize(json, new JsonOptions() { WriteIndented = true }).ToString();
            }
        }
        else
        {
            // obtém o status de tratamento interno do servidor
            responseMessage = result.Status.ToString();
        }
        
        StringBuilder outputMessage = new StringBuilder();

        if (requestJson != null)
        {
            outputMessage.AppendLine("-----");
            outputMessage.AppendLine($">>> {result.Request.Method} {result.Request.Path}");

            if (requestJson is not null)
                outputMessage.AppendLine(requestJson);
        }

        outputMessage.AppendLine($"<<< {responseMessage}");

        if (responseJson is not null)
            outputMessage.AppendLine(responseJson);

        outputMessage.AppendLine("-----");

        await Console.Out.WriteLineAsync(outputMessage.ToString());
    }
}
```