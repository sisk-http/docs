---
title: "Eventos Enviados pelo Servidor"
linkTitle: "Eventos enviados pelo servidor"
weight: 20
aliases:
  - "/docs/pt-br/features/server-sent-events.html"
sourceHash: "18ad303896f08f69"
---

O Sisk oferece suporte ao envio de mensagens através de Server Sent Events nativamente. Você pode criar conexões descartáveis e persistentes, obter as conexões em tempo de execução e utilizá‑las.

Esse recurso tem algumas limitações impostas pelos navegadores, como o envio apenas de mensagens de texto e a impossibilidade de fechar permanentemente uma conexão. Uma conexão fechada do lado do servidor fará com que o cliente tente reconectar periodicamente a cada 5 segundos (3 em alguns navegadores).

Essas conexões são úteis para enviar eventos do servidor ao cliente sem que o cliente precise solicitar a informação a cada vez.

## Criando uma conexão SSE

Uma conexão SSE funciona como uma requisição HTTP normal, mas ao invés de enviar uma resposta e fechar a conexão imediatamente, a conexão permanece aberta para enviar mensagens.

Ao chamar o método [HttpRequest.GetEventSource()](/api/Sisk.Core.Http.HttpRequest.GetEventSource), a requisição fica em estado de espera enquanto a instância SSE é criada.

```cs
r.MapGet("/", (req) =>
{
    using var sse = req.GetEventSource();

    sse.Send("Hello, world!");

    return sse.Close();
});
```

No código acima, criamos uma conexão SSE e enviamos a mensagem "Hello, world", em seguida fechamos a conexão SSE do lado do servidor.

> [!NOTE]
> Ao fechar uma conexão do lado do servidor, por padrão o cliente tentará se conectar novamente naquele ponto e a conexão será reiniciada, executando o método novamente, indefinidamente.
>
> É comum encaminhar uma mensagem de término do servidor sempre que a conexão for fechada pelo servidor para impedir que o cliente tente reconectar novamente.

## Anexando cabeçalhos

Se precisar enviar cabeçalhos, você pode usar o método [HttpRequestEventSource.AppendHeader](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.AppendHeader) antes de enviar quaisquer mensagens.

```cs
r.MapGet("/", (req) =>
{
    using var sse = req.GetEventSource();
    sse.AppendHeader("Header-Key", "Header-value");

    sse.Send("Hello!");

    return sse.Close();
});
```

Observe que é necessário enviar os cabeçalhos antes de enviar quaisquer mensagens.

## Conexões Wait-For-Fail

As conexões são normalmente terminadas quando o servidor não consegue mais enviar mensagens devido a uma possível desconexão do cliente. Com isso, a conexão é encerrada automaticamente e a instância da classe é descartada.

Mesmo com uma reconexão, a instância da classe não funcionará, pois está vinculada à conexão anterior. Em algumas situações, você pode precisar dessa conexão mais tarde e não quer gerenciá‑la via método de callback da rota.

Para isso, podemos identificar as conexões SSE com um identificador e obtê‑las posteriormente usando‑o, mesmo fora do callback da rota. Além disso, marcamos a conexão com [WaitForFail](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.WaitForFail) para que a rota não seja terminada e a conexão seja encerrada automaticamente.

Uma conexão SSE em `WaitForFail` aguarda um erro de envio causado por desconexão, ou que a tolerância de ociosidade configurada expire, antes que a rota retome e feche a conexão.

```cs
r.MapGet("/", (req) =>
{
    using var sse = req.GetEventSource("my-index-connection");

    sse.WaitForFail(TimeSpan.FromSeconds(15)); // wait for 15 seconds without any message before terminating the connection

    return sse.Close();
});
```

O método acima criará a conexão, a manipulará e aguardará uma desconexão ou erro.

```cs
HttpRequestEventSource? evs = server.EventSources.GetByIdentifier("my-index-connection");
if (evs != null)
{
    // the connection is still alive
    evs.Send("Hello again!");
}
```

E o trecho acima tentará localizar a conexão recém‑criada e, se existir, enviará uma mensagem para ela.

Todas as conexões de servidor ativas que forem identificadas ficarão disponíveis na coleção [HttpServer.EventSources](/api/Sisk.Core.Http.HttpServer.EventSources). Essa coleção armazena apenas conexões ativas e identificadas. Conexões fechadas são removidas da coleção.

> [!NOTE]
> É importante observar que o keep‑alive tem um limite estabelecido por componentes que podem estar conectados ao Sisk de forma incontrolável, como um proxy web, um kernel HTTP ou um driver de rede, e eles fecham conexões ociosas após um determinado período de tempo.
>
> Portanto, é importante manter a conexão aberta enviando pings periódicos ou estendendo o tempo máximo antes que a conexão seja fechada. Leia a próxima seção para entender melhor o envio de pings periódicos.

## Configurando política de ping de conexões

A Política de Ping é uma forma automatizada de enviar mensagens periódicas ao seu cliente. Essa função permite que o servidor detecte quando o cliente se desconectou daquela conexão sem precisar mantê‑la aberta indefinidamente.

```cs
[RouteGet("/sse")]
public async Task<HttpResponse> Events(HttpRequest request)
{
    using var sse = await request.GetEventSourceAsync("user-events");
    sse.WithPing(ping =>
    {
        ping.DataMessage = "ping-message";
        ping.Interval = TimeSpan.FromSeconds(5);
        ping.Start();
    });
    
    await sse.WaitForFailAsync(TimeSpan.FromMinutes(10));
    return await sse.CloseAsync();
}
```

No código acima, a cada 5 segundos, uma nova mensagem de ping será enviada ao cliente. Isso manterá a conexão TCP viva e impedirá que ela seja fechada por inatividade. Além disso, quando uma mensagem falha ao ser enviada, a conexão é fechada automaticamente, liberando os recursos usados pela conexão.

Use [SendAsync](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.SendAsync) e [CloseAsync](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.CloseAsync) em rotas assíncronas. Se precisar descartar eventos enfileirados antes de fechar, chame [Cancel](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.Cancel).

## Consultando conexões

Você pode buscar conexões ativas usando um predicado sobre o identificador da conexão, para poder fazer broadcast, por exemplo.

```cs
HttpRequestEventSource[] evs = server.EventSources.Find(es => es.StartsWith("my-connection-"));
foreach (HttpRequestEventSource e in evs)
{
    e.Send("Broadcasting to all event sources that starts with 'my-connection-'");
}
```

Você também pode usar o método [All](/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.All) para obter todas as conexões SSE ativas.
