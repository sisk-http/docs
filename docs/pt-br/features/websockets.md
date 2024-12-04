# WebSockets

O Sisk suporta websockets, como receber e enviar mensagens para seus clientes.

Este recurso funciona bem na maioria dos navegadores, mas no Sisk ainda está em fase experimental. Por favor, se encontrar algum bug, denuncie-o no github.

## Aceitando e recebendo mensagens assincronamente

O exemplo abaixo mostra como o websocket funciona na prática, com um exemplo de abertura de uma conexão, recebimento de uma mensagem e exibição na console.

Todas as mensagens recebidas pelo WebSocket são recebidas em bytes, então você terá que decodificá-las após o recebimento.

Por padrão, as mensagens são fragmentadas em pedaços e o último pedaço é enviado como o pacote final da mensagem. Você pode configurar o tamanho do pacote com a bandeira [WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize). Este buffer é o mesmo para enviar e receber mensagens.

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        ws.OnReceive += (sender, msg) =>
        {
            string msgText = Encoding.UTF8.GetString(msg.MessageBytes);
            Console.WriteLine("Mensagem recebida: " + msgText);

            // obtém o contexto HttpWebSocket que recebeu a mensagem
            HttpWebSocket senderWebSocket = (HttpWebSocket)sender!;
            senderWebSocket.Send("Resposta!");
        };

        ws.WaitForClose();

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## Aceitando e recebendo mensagens sincronicamente

O exemplo abaixo contém uma maneira de você usar um websocket síncrono, sem um contexto assíncrono, onde você recebe as mensagens, lida com elas e finaliza o uso do socket.

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/connect", (req) =>
    {
        var ws = req.GetWebSocket();
        WebSocketMessage? msg;

    askName:
        ws.Send("Qual é o seu nome?");
        msg = ws.WaitNext();

        string? name = msg?.GetString();

        if (string.IsNullOrEmpty(name))
        {
            ws.Send("Por favor, insira seu nome!");
            goto askName;
        }

    askAge:
        ws.Send("E sua idade?");
        msg = ws.WaitNext();

        if (!Int32.TryParse(msg?.GetString(), out int age))
        {
            ws.Send("Por favor, insira um número válido");
            goto askAge;
        }

        ws.Send($"Você é {name}, e você tem {age} anos.");

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## Envio de mensagens

O método Send possui três sobrecargas, que permitem enviar texto, uma matriz de bytes ou um intervalo de bytes. Todos eles são fragmentados se a bandeira [WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize) do servidor for maior que o tamanho total da carga útil.

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        byte[] myByteArrayContent = ...;

        ws.Send("Olá, mundo");     // será codificado como uma matriz de bytes UTF-8
        ws.Send(myByteArrayContent);

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## Aguardando o fechamento do websocket

O método [WaitForClose()](/api/Sisk.Core.Http.Streams.HttpWebSocket.WaitForClose) bloqueia a pilha de chamadas atuais até que a conexão seja encerrada por qualquer um dos lados (cliente ou servidor).

Com isso, a execução do callback da solicitação será bloqueada até que o cliente ou o servidor se desconecte.

Você também pode fechar a conexão manualmente com o método [Close()](/api/Sisk.Core.Http.Streams.HttpWebSocket.Close). Este método retorna um objeto [HttpResponse](/api/Sisk.Core.Http.HttpResponse) vazio, que não é enviado para o cliente, mas funciona como um retorno da função onde a solicitação HTTP foi recebida.

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        // aguarda o fechamento da conexão do cliente
        ws.WaitForClose();

        // aguarda até que não haja mais mensagens trocadas nos 60 segundos
        // ou até que alguma parte feche a conexão
        ws.WaitForClose(TimeSpan.FromSeconds(60));

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## Política de Ping

Similar ao funcionamento da política de ping em Eventos do Servidor, você também pode configurar uma política de ping para manter a conexão TCP aberta se houver inatividade nela.

```cs
ws.WithPing(ping =>
{
    ping.DataMessage = "ping-message";
    ping.Interval = TimeSpan.FromSeconds(5);
    ping.Start();
});
```