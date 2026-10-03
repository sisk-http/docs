---
title: "Registro de logs"
linkTitle: "Registro"
weight: 10
aliases:
  - "/docs/pt-br/features/logging.html"
sourceHash: "c5946923afeff3b7"
---

Você pode configurar o Sisk para gravar logs de acesso e de erro automaticamente. É possível definir rotação de logs, extensões e frequência.

A classe [LogStream](/api/Sisk.Core.Http.LogStream) fornece uma maneira assíncrona de escrever logs e mantê‑los em uma fila de escrita aguardável. A classe `LogStream` implementa `IAsyncDisposable`, garantindo que todos os logs pendentes sejam gravados antes que o stream seja fechado.

Neste artigo mostraremos como configurar o registro de logs para sua aplicação.

## Logs de acesso baseados em arquivo

Logs para arquivos abrem o arquivo, escrevem a linha de texto e então fecham o arquivo para cada linha escrita. Esse procedimento foi adotado para manter a responsividade de escrita nos logs.

```cs {title="Program.cs"}
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

O código acima gravará todas as requisições recebidas no arquivo `logs/access.log`. Observe que o arquivo é criado automaticamente se não existir, porém a pasta anterior não é. Não é necessário criar o diretório `logs/` pois a classe LogStream o cria automaticamente.

## Registro de logs baseado em stream

Você pode gravar arquivos de log em instâncias de objetos `TextWriter`, como `Console.Out`, passando um objeto `TextWriter` no construtor:

```cs {title="Program.cs"}
using var app = HttpServer.CreateBuilder()
    .UseConfiguration(config => {
        config.AccessLogsStream = new LogStream(Console.Out);
    })
    .Build();
```

Para cada mensagem gravada no log baseado em stream, o método `TextWriter.Flush()` é chamado.

## Formatação do log de acesso

Você pode personalizar o formato do log de acesso por variáveis predefinidas. Considere a linha a seguir:

```cs
config.AccessLogsFormat = "%dd/%dmm/%dy %tH:%ti:%ts %tz %ls %ri %rs://%ra%rz%rq [%sc %sd] %lin -> %lou in %lmsms [%{user-agent}]";
```

Ela gravará uma mensagem como:

    29/mar./2023 15:21:47 -0300 Executed ::1 http://localhost:5555/ [200 OK] 689B -> 707B in 84ms [Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/111.0.0.0 Safari/537.36]

Você pode formatar seu arquivo de log conforme a tabela descrita abaixo:

| Valor | O que representa | Exemplo |
|-------|-------------------|---------|
| %dd   | Dia do mês (formatado com dois dígitos) | 05 |
| %dmmm | Nome completo do mês | Julho |
| %dmm  | Nome abreviado do mês (três letras) | Jul |
| %dm   | Número do mês (formatado com dois dígitos) | 07 |
| %dy   | Ano (formatado com quatro dígitos) | 2023 |
| %th   | Hora no formato de 12 horas | 03 |
| %tH   | Hora no formato de 24 horas (HH) | 15 |
| %ti   | Minutos (formatado com dois dígitos) | 30 |
| %ts   | Segundos (formatado com dois dígitos) | 45 |
| %tm   | Milissegundos (formatado com três dígitos) | 123 |
| %tz   | Deslocamento de fuso horário (horas totais em UTC) | +03:00 |
| %ri   | Endereço IP remoto do cliente | 192.168.1.100 |
| %rm   | Método HTTP (maiúsculas) | GET |
| %rs   | Esquema da URI (http/https) | https |
| %ra   | Autoridade da URI (domínio) | example.com |
| %rh   | Host da requisição | www.example.com |
| %rp   | Porta da requisição | 443 |
| %rz   | Caminho da requisição | /path/to/resource |
| %rq   | String de consulta | ?key=value&another=123 |
| %sc   | Código de status da resposta HTTP | 200 |
| %sd   | Descrição do status da resposta HTTP | OK |
| %lin  | Tamanho da requisição legível por humanos | 1.2 KB |
| %linr | Tamanho bruto da requisição (bytes) | 1234 |
| %lou  | Tamanho da resposta legível por humanos | 2.5 KB |
| %lour | Tamanho bruto da resposta (bytes) | 2560 |
| %lms  | Tempo decorrido em milissegundos | 120 |
| %ls   | Status de execução | Executado |
| %{header-name} | Representa o cabeçalho `header-name` da requisição. | `Mozilla/5.0 (platform; rv:gecko [...]` |
| %{:header-name} | Representa o cabeçalho `header-name` da resposta. | `application/json` |

Você também pode usar `HttpServerConfiguration.DefaultAccessLogFormat` para utilizar o formato padrão de log de acesso.

## Rotação de logs

Você pode configurar o servidor HTTP para rotacionar os arquivos de log para um arquivo comprimido .gz quando eles atingirem determinado tamanho. O tamanho é verificado periodicamente pelo limiar que você definir.

```cs
LogStream errorLog = new LogStream("logs/error.log")
    .ConfigureRotatingPolicy(
        maximumSize: 64 * SizeHelper.UnitMb,
        dueTime: TimeSpan.FromHours(6));
```

O código acima verificará a cada seis horas se o arquivo do LogStream atingiu o limite de 64 MB. Caso positivo, o arquivo será comprimido para um .gz e então `access.log` será limpo.

Durante esse processo, a escrita no arquivo fica bloqueada até que a compressão e limpeza terminem. Todas as linhas que chegarem para ser escritas nesse período ficarão em uma fila aguardando o fim da compressão.

Esta função funciona apenas com LogStreams baseados em arquivo.

## Registro de erros

Quando o servidor não lança erros para o depurador, ele encaminha os erros para gravação de log quando houver algum. Você pode configurar a gravação de erros com:

```cs
config.ThrowExceptions = false;
config.ErrorsLogsStream = new LogStream("error.log");
```

Esta propriedade gravará algo no log somente se o erro não for capturado pelo callback ou pela propriedade [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler).

O erro gravado pelo servidor sempre inclui a data e hora, os cabeçalhos da requisição (não o corpo), o rastreamento do erro e o rastreamento da exceção interna, se houver.

## Outras instâncias de registro

Sua aplicação pode ter zero ou múltiplos LogStreams, não há limite para a quantidade de canais de log que ela pode ter. Portanto, é possível direcionar o log da sua aplicação para um arquivo diferente do AccessLog ou ErrorLog padrão.

```cs
LogStream appMessages = new LogStream("messages.log");
appMessages.WriteLine("Application started at {0}", DateTime.Now);
```

## Estendendo LogStream

Você pode estender a classe `LogStream` para gravar formatos personalizados, compatíveis com o mecanismo de logs atual do Sisk. O exemplo abaixo permite escrever mensagens coloridas no Console através da biblioteca Spectre.Console:

```cs {title="CustomLogStream.cs"}
public class CustomLogStream : LogStream
{
    protected override void WriteLineInternal(string line)
    {
        base.WriteLineInternal($"[{DateTime.Now:g}] {line}");
    }
}
```

Outra forma de gravar automaticamente logs personalizados para cada requisição/resposta é criar um [HttpServerHandler](/api/Sisk.Core.Http.Handlers.HttpServerHandler). O exemplo abaixo é um pouco mais completo. Ele grava o corpo da requisição e da resposta em JSON no Console. Pode ser útil para depurar requisições em geral. Este exemplo faz uso de ContextBag e HttpServerHandler.

```cs {title="Program.cs"}
class Program
{
    static async Task Main(string[] args)
    {
        var app = HttpServer.CreateBuilder(host =>
        {
            host.UseListeningPort(5555);
            host.UseHandler<JsonMessageHandler>();
        });

        app.Router.MapAny("/json", request =>
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

```cs {title="JsonMessageHandler.cs"}
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
            // após o envio da resposta ao cliente, portanto o conteúdo pode não estar disponível após a resposta ser fechada.
            //
            _ = request.RawBody;

            // adiciona uma dica no contexto para indicar que esta requisição possui um corpo JSON
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
            // obtém o status interno de manipulação do servidor
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
