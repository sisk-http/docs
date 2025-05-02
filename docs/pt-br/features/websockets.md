# Web Sockets

O Sisk também suporta web sockets, permitindo receber e enviar mensagens para os clientes.

Esta funcionalidade funciona bem na maioria dos navegadores, mas no Sisk ainda é experimental. Por favor, se encontrar algum bug, reporte no github.

## Aceitando e recebendo mensagens assincronamente

O exemplo abaixo mostra como funciona o websocket na prática, com um exemplo de abrir uma conexão, receber uma mensagem e exibir no console.

Todas as mensagens recebidas pelo WebSocket são recebidas em bytes, então você terá que decodificá-las ao recebê-las.

Por padrão, as mensagens são fragmentadas em pedaços e o último pedaço é enviado como o pacote final da mensagem. Você pode configurar o tamanho do pacote com a flag [WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize). Este buffer é o mesmo para enviar e receber mensagens.

```cs
router.MapGet("/connect", req =>
{
 using var ws = req.GetWebSocket();
        
 ws.OnReceive += (sender, msg) =>
 {
 string msgText = Encoding.UTF8.GetString(msg.MessageBytes);
 Console.WriteLine("Mensagem recebida: " + msgText);

 // obtém o contexto do HttpWebSocket que recebeu a mensagem
 HttpWebSocket senderWebSocket = (HttpWebSocket)sender!;
 senderWebSocket.Send("Resposta!");
 };

 ws.WaitForClose();
        
 return ws.Close();
});
```

> [!NOTE]
>
> Não use eventos assíncronos desta forma. Você pode ter exceções lançadas fora do domínio do servidor HTTP e elas podem travar sua aplicação.

Se você precisar lidar com código assíncrono e lidar com várias mensagens ao mesmo tempo, você pode usar o loop de mensagens:

```csharp
router.MapGet("/", async delegate (HttpRequest request)
{
 using var ws = await request.GetWebSocketAsync();
    
 WebSocketMessage? message;
 while ((message = ws.WaitNext(timeout: TimeSpan.FromSeconds(30))) != null)
 {
 var messageText = message.GetString();
 Console.WriteLine($"Mensagem recebida: {messageText}");

 await ws.SendAsync("Olá do servidor!");
 }

 return ws.Close();
});
```

## Aceitando e recebendo mensagens sincronicamente

O exemplo abaixo contém uma maneira de usar um websocket síncrono, sem um contexto assíncrono, onde você recebe as mensagens, lida com elas e termina de usar o socket.

```cs
router.MapGet("/connect", req =>
{
 using var ws = req.GetWebSocket();
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
        
 ws.Send($"Você é {name} e tem {age} anos.");

 return ws.Close();
});
```

## Enviando mensagens

O método Send tem três sobrecargas, que permitem enviar texto, um array de bytes ou um span de bytes. Todas elas são fragmentadas se o tamanho do pacote do servidor [WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize) for maior que o tamanho total da carga.

```cs
static ListeningHost BuildLhA()
{
 Router r = new Router();

 r += new Route(RouteMethod.Get, "/", (req) =>
 {
 var ws = req.GetWebSocket();

 byte[] myByteArrayContent = ...;

 ws.Send("Olá, mundo"); // será codificado como um array de bytes UTF-8
 ws.Send(myByteArrayContent);

 return ws.Close();
 });

 return new ListeningHost("localhost",5551, r);
}
```

## Esperando o fechamento do websocket

O método [WaitForClose()](/api/Sisk.Core.Http.Streams.HttpWebSocket.WaitForClose) bloqueia a pilha de chamadas atual até que a conexão seja terminada pelo cliente ou pelo servidor.

Com isso, a execução do callback da solicitação será bloqueada até que o cliente ou o servidor desconecte.

Você também pode fechar a conexão manualmente com o método [Close()](/api/Sisk.Core.Http.Streams.HttpWebSocket.Close). Este método retorna um objeto [HttpResponse](/api/Sisk.Core.Http.HttpResponse) vazio, que não é enviado ao cliente, mas funciona como um retorno da função onde a solicitação HTTP foi recebida.

```cs
static ListeningHost BuildLhA()
{
 Router r = new Router();

 r += new Route(RouteMethod.Get, "/", (req) =>
 {
 var ws = req.GetWebSocket();

 // espera o cliente fechar a conexão
 ws.WaitForClose();

 // espera até que não haja mensagens trocadas em 60 segundos
 // ou até que alguma parte feche a conexão
 ws.WaitForClose(TimeSpan.FromSeconds(60));

 return ws.Close();
 });

 return new ListeningHost("localhost",5551, r);
}
```

## Política de Ping

Semelhante a como a política de ping em Server Side Events funciona, você também pode configurar uma política de ping para manter a conexão TCP aberta se houver inatividade nela.

```cs
ws.WithPing(ping =>
{
 ping.DataMessage = "mensagem-ping";
 ping.Interval = TimeSpan.FromSeconds(5);
 ping.Start();
});
```