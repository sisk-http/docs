# Logging

Você pode configurar o Sisk para escrever logs de acesso e erro automaticamente. É possível definir rotação de logs, extensões e frequência.

A classe [LogStream](/api/Sisk.Core.Http.LogStream) fornece uma maneira assíncrona de escrever logs e mantê‑los em uma fila de escrita aguardável.

Neste artigo mostraremos como configurar o logging para sua aplicação.

## Logs de acesso baseados em arquivo

Logs para arquivos abrem o arquivo, escrevem o texto da linha e depois fecham o arquivo para cada linha escrita. Esse procedimento foi adotado para manter a responsividade de escrita nos logs.

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

O código acima escreverá todas as requisições recebidas no arquivo `logs/access.log`. Observe que, o arquivo é criado automaticamente se não existir, porém a pasta antes dele não. Não é necessário criar o diretório `logs/` pois a classe LogStream cria-o automaticamente.

## Logging baseado em stream

Você pode escrever arquivos de log em instâncias de objetos TextWriter, como `Console.Out`, passando um objeto TextWriter no construtor:

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

## Formatação do log de acesso

Você pode customizar o formato do log de acesso por variáveis predefinidas. Considere a seguinte linha:

```cs
config.AccessLogsFormat = "%dd/%dmm/%dy %tH:%ti:%ts %tz %ls %ri %rs://%ra%rz%rq [%sc %sd] %lin -> %lou in %lmsms [%{user-agent}]";
```

Ele escreverá uma mensagem como:

    29/mar./2023 15:21:47 -0300 Executed ::1 http://localhost:5555/ [200 OK] 689B -> 707B in 84ms [Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/111.0.0.0 Safari/537.36]

Você pode formatar seu arquivo de log pelo formato descrito na tabela:

| Valor  | O que representa                                                                 | Exemplo                               |
|--------|-----------------------------------------------------------------------------------|---------------------------------------|
| %dd    | Dia do mês (formatado como dois dígitos)                                        | 05                                    |
| %dmmm  | Nome completo do mês                                                            | Julho                                  |
| %dmm   | Nome abreviado do mês (três letras)                                            | Jul                                    |
| %dm    | Número do mês (formatado como dois dígitos)                                      | 07                                    |
| %dy    | Ano (formatado como quatro dígitos)                                             | 2023                                 |
| %th    | Hora em formato 12‑horas                                                        | 03                                    |
| %tH    | Hora em formato 24‑horas (HH)                                                    | 15                                    |
| %ti    | Minutos (formatado como dois dígitos)                                           | 30                                    |
| %ts    | Segundos (formatado como dois dígitos)                                           | 45                                    |
| %tm    | Milissegundos (formatado como três dígitos)                                      | 123                                   |
| %tz    | Deslocamento de fuso horário (horas totais em UTC)                              | +03:00                               |
| %ri    | Endereço IP remoto do cliente                                                  | 192.168.1.100                        |
| %rm    | Método HTTP (maiúsculas)                                                        | GET                                   |
| %rs    | Esquema URI (http/https)                                                       | https                                |
| %ra    | Autoridade URI (domínio)                                                       | example.com                          |
| %rh    | Host da requisição                                                             | www.example.com                       |
| %rp    | Porta da requisição                                                            | 443                                  |
| %rz    | Caminho da requisição                                                          | /path/to/resource                    |
| %rq    | String de consulta                                                             | ?key=value&another=123               |
| %sc    | Código de status da resposta HTTP                                            | 200                                  |
| %sd    | Descrição do status da resposta HTTP                                        | OK                                   |
| %lin   | Tamanho legível do pedido                                                     | 1.2 KB                               |
| %linr  | Tamanho bruto do pedido (bytes)                                               | 1234                                |
| %lou   | Tamanho legível da resposta                                                   | 2.5 KB                               |
| %lour  | Tamanho bruto da resposta (bytes)                                             | 2560                                |
| %lms   | Tempo decorrido em milissegundos                                                | 120                                  |
| %ls    | Status de execução                                                             | Executed                |
| %{header-name}    | Representa o cabeçalho `header-name` da requisição.                                                                | `Mozilla/5.0 (platform; rv:gecko [...]`                |
| %{:res-name}    | Representa o cabeçalho `res-name` da resposta. | |

## Rotação de logs

Você pode configurar o servidor HTTP para rotacionar os arquivos de log para um arquivo .gz comprimido quando atingirem um certo tamanho. O tamanho é verificado periodicamente pelo limite que você definir.

```cs
LogStream errorLog = new LogStream("logs/error.log")
    .ConfigureRotatingPolicy(
        maximumSize: 64 * SizeHelper.UnitMb,
        dueTime: TimeSpan.FromHours(6));
```

O código acima verificará a cada seis horas se o arquivo do LogStream atingiu seu limite de 64 MB. Se sim, o arquivo será comprimido para um arquivo .gz e então o `access.log` será limpo.

Durante esse processo, a escrita no arquivo fica bloqueada até que o arquivo seja comprimido e limpo. Todas as linhas que entrarem para serem escritas nesse período ficarão em uma fila aguardando o fim da compressão.

Esta função funciona apenas com LogStreams baseados em arquivo.

## Logging de erros

Quando um servidor não lança erros para o depurador, ele encaminha os erros para escrita de logs quando houver algum. Você pode configurar a escrita de erros com:

```cs
config.ThrowExceptions = false;
config.ErrorsLogsStream = new LogStream("error.log");
```

Esta propriedade escreverá algo no log apenas se o erro não for capturado pelo callback ou pela propriedade [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler).

O erro escrito pelo servidor sempre grava a data e hora, os cabeçalhos da requisição (não o corpo), a trilha de erro e a trilha da exceção interna, se houver.

## Outras instâncias de logging

Sua aplicação pode ter zero ou múltiplos LogStreams, não há limite para quantos canais de log ela pode ter. Portanto, é possível direcionar o log da sua aplicação para um arquivo diferente do AccessLog ou ErrorLog padrão.

```cs
LogStream appMessages = new LogStream("messages.log");
appMessages.WriteLine("Application started at {0}", DateTime.Now);
```

## Extensão do LogStream

Você pode estender a classe `LogStream` para escrever formatos personalizados, compatíveis com o motor de log atual do Sisk. O exemplo abaixo permite escrever mensagens coloridas no Console através da biblioteca Spectre.Console:

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

Outra forma de escrever logs personalizados automaticamente para cada requisição/resposta é criar um [HttpServerHandler](/api/Sisk.Core.Http.Handlers.HttpServerHandler). O exemplo abaixo é um pouco mais completo. Ele grava o corpo da requisição e resposta em JSON no Console. Pode ser útil para depurar requisições em geral. Este exemplo usa ContextBag e HttpServerHandler.

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
            // que o conteúdo é JSON. A linha abaixo lê o conteúdo e o deixa armazenado na requisição.
            //
            // Se o conteúdo não for lido na ação da requisição, o GC provavelmente coletará o conteúdo
            // após enviar a resposta ao cliente, então o conteúdo pode não estar disponível após a resposta ser fechada.
            //
            _ = request.RawBody;

            // adiciona dica no contexto para indicar que esta requisição tem um corpo JSON
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
            // reformatta o JSON usando a biblioteca CypherPotato.LightJson
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
            // obtém o status interno de tratamento do servidor
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