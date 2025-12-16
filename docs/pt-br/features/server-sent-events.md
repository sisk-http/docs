# Eventos Enviados pelo Servidor

Sisk suporta o envio de mensagens por meio de Eventos Enviados pelo Servidor (Server Sent Events) de forma integrada. Você pode criar conexões descartáveis e persistentes, obtê-las durante a execução e usá-las.

Essa funcionalidade tem algumas limitações impostas pelos navegadores, como o envio apenas de mensagens de texto e a impossibilidade de fechar permanentemente uma conexão. Uma conexão fechada pelo servidor terá o cliente tentando se reconectar periodicamente a cada 5 segundos (3 para alguns navegadores).

Essas conexões são úteis para enviar eventos do servidor para o cliente sem que o cliente precise solicitar as informações a cada vez.

## Criando uma Conexão SSE

Uma conexão SSE funciona como uma solicitação HTTP regular, mas em vez de enviar uma resposta e fechar a conexão imediatamente, a conexão é mantida aberta para enviar mensagens.

Chamando o método [HttpRequest.GetEventSource()](/api/Sisk.Core.Http.HttpRequest.GetEventSource), a solicitação é colocada em um estado de espera enquanto a instância SSE é criada.

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
    using var sse = req.GetEventSource();

    sse.Send("Olá, mundo!");

    return sse.Close();
});
```

No código acima, criamos uma conexão SSE e enviamos uma mensagem "Olá, mundo", então fechamos a conexão SSE do lado do servidor.

> [!NOTE]
> Quando fechamos uma conexão do lado do servidor, por padrão, o cliente tentará se conectar novamente e a conexão será reiniciada, executando o método novamente, indefinidamente.
>
> É comum encaminhar uma mensagem de término do servidor sempre que a conexão for fechada do lado do servidor para evitar que o cliente tente se reconectar novamente.

## Anexando Cabeçalhos

Se você precisar enviar cabeçalhos, pode usar o método [HttpRequestEventSource.AppendHeader](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.AppendHeader) antes de enviar qualquer mensagem.

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
    using var sse = req.GetEventSource();
    sse.AppendHeader("Header-Key", "Header-value");

    sse.Send("Olá!");

    return sse.Close();
});
```

Observe que é necessário enviar os cabeçalhos antes de enviar qualquer mensagem.

## Conexões de Espera por Falha

Conexões são normalmente terminadas quando o servidor não consegue mais enviar mensagens devido a uma possível desconexão do cliente. Com isso, a conexão é automaticamente terminada e a instância da classe é descartada.

Mesmo com uma reconexão, a instância da classe não funcionará, pois está vinculada à conexão anterior. Em algumas situações, você pode precisar dessa conexão mais tarde e não quer gerenciá-la por meio do método de callback da rota.

Para isso, podemos identificar as conexões SSE com um identificador e obtê-las usando-o mais tarde, mesmo fora do callback da rota. Além disso, marcamos a conexão com [WaitForFail](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.WaitForFail) para não terminar a rota e a conexão automaticamente.

Uma conexão SSE em KeepAlive aguardará um erro de envio (causado por desconexão) para retomar a execução do método. Também é possível definir um Tempo de Esgotamento para isso. Após o tempo, se nenhuma mensagem for enviada, a conexão é terminada e a execução é retomada.

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
    using var sse = req.GetEventSource("my-index-connection");

    sse.WaitForFail(TimeSpan.FromSeconds(15)); // aguarde 15 segundos sem nenhuma mensagem antes de terminar a conexão

    return sse.Close();
});
```

O método acima criará a conexão, gerenciá-la e aguardará uma desconexão ou erro.

```cs
HttpRequestEventSource? evs = server.EventSources.GetByIdentifier("my-index-connection");
if (evs != null)
{
    // a conexão ainda está viva
    evs.Send("Olá novamente!");
}
```

E o trecho de código acima tentará encontrar a conexão recém-criada e, se existir, enviará uma mensagem para ela.

Todas as conexões de servidor ativas identificadas estarão disponíveis na coleção [HttpServer.EventSources](/api/Sisk.Core.Http.HttpServer.EventSources). Essa coleção armazena apenas conexões ativas e identificadas. Conexões fechadas são removidas da coleção.

> [!NOTE]
> É importante notar que o keep alive tem um limite estabelecido por componentes que podem estar conectados ao Sisk de forma incontrolável, como um proxy web, um kernel HTTP ou um driver de rede, e eles fecham conexões ociosas após um determinado período de tempo.
>
> Portanto, é importante manter a conexão aberta enviando ping periódicos ou estendendo o tempo máximo antes que a conexão seja fechada. Leia a próxima seção para entender melhor o envio de ping periódicos.

## Configurando a Política de Ping das Conexões

A Política de Ping é uma forma automatizada de enviar mensagens periódicas para o seu cliente. Essa função permite que o servidor entenda quando o cliente se desconectou da conexão sem precisar manter a conexão aberta indefinidamente.

```cs
[RouteGet("/sse")]
public HttpResponse Events(HttpRequest request)
{
    using var sse = request.GetEventSource();
    sse.WithPing(ping =>
    {
        ping.DataMessage = "ping-message";
        ping.Interval = TimeSpan.FromSeconds(5);
        ping.Start();
    });
    
    sse.KeepAlive();
    return sse.Close();
}
```

No código acima, a cada 5 segundos, uma nova mensagem de ping será enviada para o cliente. Isso manterá a conexão TCP ativa e evitará que ela seja fechada devido à inatividade. Além disso, quando uma mensagem falhar ao ser enviada, a conexão será fechada automaticamente, liberando os recursos utilizados pela conexão.

## Consultando Conexões

Você pode procurar conexões ativas usando um predicado no identificador da conexão, para poder transmitir, por exemplo.

```cs
HttpRequestEventSource[] evs = server.EventSources.Find(es => es.StartsWith("my-connection-"));
foreach (HttpRequestEventSource e in evs)
{
    e.Send("Transmitindo para todas as fontes de eventos que começam com 'my-connection-'");
}
```

Você também pode usar o método [All](/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.All) para obter todas as conexões SSE ativas.