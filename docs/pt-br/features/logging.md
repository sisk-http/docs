# Log

Você pode configurar o Sisk para escrever logs de acesso e erros automaticamente. É possível definir rotação de logs, extensões e frequência.

A classe [LogStream](/api/Sisk.Core.Http.LogStream) fornece uma maneira assíncrona de escrever logs e mantê-los em uma fila de escrita aguarda.

Neste artigo, mostraremos como configurar o log para seu aplicativo.

## Logs de acesso baseados em arquivo

Logs para arquivos abrem o arquivo, escrevem o texto da linha e, em seguida, fecham o arquivo para cada linha escrita. Este procedimento foi adotado para manter a responsividade de escrita nos logs.

```cs
config.AccessLogsStream = new LogStream("logs/access.log");
```

O código acima escreverá todas as solicitações recebidas no arquivo `logs/access.log`. Observe que o arquivo é criado automaticamente se não existir, mas a pasta anterior não. Não é necessário criar o diretório `logs/` pois a classe LogStream o cria automaticamente.

## Logamento baseado em stream

Você pode escrever arquivos de log para instâncias de objetos TextWriter, como `Console.Out`, passando um objeto TextWriter no construtor:

```cs
config.AccessLogsStream = new LogStream(Console.Out);
```

Para cada mensagem escrita no log baseado em stream, o método `TextWriter.Flush()` é chamado.

## Formatação do log de acesso

Você pode personalizar o formato do log de acesso usando variáveis predefinidas. Considere a seguinte linha:

```cs
config.AccessLogsFormat = "%dd/%dmm/%dy %tH:%ti:%ts %tz %ls %ri %rs://%ra%rz%rq [%sc %sd] %lin -> %lou in %lmsms [%{user-agent}]";
```

Ele escreverá uma mensagem como:

    29/mar./2023 15:21:47 -0300 Executed ::1 http://localhost:5555/ \[200 OK\] 689B -> 707B in 84ms \[Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/111.0.0.0 Safari/537.36\]

Você pode formatar seu arquivo de log de acordo com a tabela descrita:

|Variável|Descrição|Exemplo|
|---|---|---|
|%dd|O dia do timestamp atual, no formato 00.|25|
|%dm|O mês do timestamp atual, no formato 00.|03|
|%dmm|O mês do timestamp atual, no formato abreviado.|mar.|
|%dmmm|O mês do timestamp atual, no formato completo.|Março|
|%dy|O ano do timestamp atual, no formato 0000.|2023|
|%th|A hora atual do timestamp, no formato de 12 horas.|03|
|%tH|A hora atual do timestamp, no formato de 24 horas.|15|
|%ti|Os minutos atuais do timestamp, no formato 00.|25|
|%ts|Os segundos atuais do timestamp, no formato 00.|32|
|%tm|Os milissegundos atuais do timestamp, no formato 000.|633|
|%tz|A diferença de fuso horário atual, no formato +/- 0000.| +0300, -0500, +0000|
|%ri|O endereço IP do usuário solicitante (pode ser IPv4 ou IPv6).|192.168.0.1|
|%rm|O método de solicitação em maiúsculas.|GET|
|%rs|O esquema do URL do usuário solicitante.|https, http|
|%ra|A autoridade do URL do usuário solicitante.|my.contorso.com:8080|
|%rh|O host do URL do usuário solicitante.|my.contorso.com|
|%rp|A porta do URL do usuário solicitante.|8080|
|%rz|O caminho absoluto do URL do usuário solicitante.|/index.html|
|%rq|A cadeia de consulta do URL do usuário solicitante.|?foo=bar&aaa=bbb|
|%sc|O código de status da resposta, no formato 000.|404|
|%sd|A descrição do código de status da resposta.|Não encontrado|
|%lin|O tamanho do conteúdo da solicitação entrante, em uma forma legível por humanos.|12,5kb|
|%lou|O tamanho do conteúdo da resposta saindo, em uma forma legível por humanos.|65,8kb|
|%lms|O tempo de processamento do servidor da solicitação e entrega da resposta, em milissegundos (000).|18|
|%{header}|Obtém o valor de um cabeçalho HTTP, onde o cabeçalho é o nome do cabeçalho, ou um valor vazio se o cabeçalho não estiver presente. Este campo é insensível a maiúsculas e minúsculas.|%{user-agent}|


## Rotação de logs

> [!TIP]
> Em Sisk 0.15 e versões anteriores, essa função está disponível apenas com o pacote Sisk.ServiceProvider. Em Sisk 0.16 e versões posteriores, essa função é implementada no pacote principal.

Você pode configurar o servidor HTTP para rotar os arquivos de log para um arquivo .gz compactado quando eles atingirem um determinado tamanho. O tamanho é verificado periodicamente pelo limiar que você define.

```cs
config.AccessLogsStream = new LogStream("access.log");

var rotater = new RotatingLogPolicy(config.AccessLogsStream);
rotater.Configure(1024 * 1024, TimeSpan.FromHours(6));
```

O código acima verificará a cada seis horas se o arquivo do LogStream tenha atingido o limite de 1 MB. Se sim, o arquivo é compactado para um arquivo .gz e, em seguida, `access.log` é limpo.

Durante esse processo, a escrita no arquivo é bloqueada até que o arquivo seja compactado e limpo. Todas as linhas que entram para serem escritas neste período ficarão em uma fila aguardando o final da compactação.

Essa função funciona apenas com LogStreams baseados em arquivos.

## Log de erros

Quando um servidor não está lançando erros para o depurador, ele encaminha os erros para o log de escrita quando houver algum. Você pode configurar a escrita de erros com:

```cs
config.ThrowExceptions = false;
config.ErrorsLogsStream = new LogStream("error.log");
```

Essa propriedade só escreverá algo no log se o erro não for capturado pelo callback ou pela propriedade [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler).

O erro escrito pelo servidor sempre escreve a data e hora, os cabeçalhos da solicitação (não o corpo), o rastreamento de erros e o rastreamento de exceções internas, se houver.

## Outras instâncias de log

Seu aplicativo pode ter zero ou várias LogStreams, não há limite para o número de canais de log que ele pode ter. Portanto, é possível direcionar o log do seu aplicativo para um arquivo diferente do log de acesso padrão ou do log de erros.

```cs
LogStream appMessages = new LogStream("messages.log");
appMessages.WriteLine("Application started at {0}", DateTime.Now);
```

## Extensão de LogStream

Você pode estender a classe `LogStream` para escrever formatos personalizados, compatíveis com o mecanismo de log atual do Sisk. O exemplo abaixo permite escrever mensagens coloridas no Console usando a biblioteca Spectre.Console.

```cs
public class CustomLogStream : LogStream
{
    protected override void WriteLineInternal(string line)
    {
        base.WriteLineInternal($"[{DateTime.Now:g}] {line}");
    }
}
```

Outra maneira de escrever automaticamente logs personalizados para cada solicitação/resposta é criar um [HttpServerHandler](/api/Sisk.Core.Http.Handlers.HttpServerHandler). O exemplo abaixo é um pouco mais completo. Ele escreve o corpo da solicitação e a resposta em JSON para o Console. Pode ser útil para depurar solicitações em geral. Este exemplo usa ContextBag e HttpServerHandler.

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
                    specialMessage = "Hello, world!! "
                }));
        });

        await app.StartAsync();
    }
}

class JsonMessageHandler : HttpServerHandler
{
    protected override async void OnHttpRequestOpen(HttpRequest request)
    {
        if (request.Method != HttpMethod.Get && request.Headers["Content-Type"]?.Contains("json", StringComparison.InvariantCultureIgnoreCase) == true)
        {
            // Neste ponto, a conexão está aberta e o cliente enviou o cabeçalho especificando que o conteúdo é JSON.
            // O conteúdo é lido e armazenado na solicitação.
            //
            // Se o conteúdo não for lido na ação da solicitação, o GC provavelmente coletará o conteúdo após o envio da resposta para o cliente, então o conteúdo pode não estar disponível após o fechamento da resposta.
            //
            _ = request.RawBody;

            // adicionar uma dica no contexto para indicar que esta solicitação tem um corpo JSON.
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
            // reformatted the JSON using the CypherPotato.LightJson library
            var content = result.Request.Body;
            requestJson = JsonValue.Deserialize(content, new JsonOptions() { WriteIndented = true }).ToString();
        }

        if (result.Response is { } response)
        {
            var content = response.Content;
            responseMessage = $"{(int)response.Status {HttpStatusInformation.GetStatusCodeDescription(response.Status)}";

            if (content is HttpContent httpContent &&
                // check if the response is JSON
                httpContent.Headers.ContentType?.MediaType?.Contains("json", StringComparison.InvariantCultureIgnoreCase) == true)
            {
                string json = await httpContent.ReadAsStringAsync();
                responseJson = JsonValue.Deserialize(json, new JsonOptions() { WriteIndented = true }).ToString();
            }
        }
        else
        {
            // gets the internal server handling status
            responseMessage = result.Status.ToString();
        }

        StringBuilder outputMessage = new StringBuilder();

        if (requestJson is not null)
        {
            outputMessage.AppendLine("-----");
            outputMessage.AppendLine($">>> {result.Request.Method} {result.Request.Path}");

            if (requestJson is not null)
                outputMessage.AppendLine(requestJson);
        }

        outputMessage.AppendLine("<<< {responseMessage}");

        if (responseJson is not null)
            outputMessage.AppendLine(responseJson);

        outputMessage.AppendLine("-----");

        await Console.Out.WriteLineAsync(outputMessage.ToString());
    }
}
```
