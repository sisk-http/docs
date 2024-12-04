# Eventos Server-Sent-Events

O Sisk suporta o envio de mensagens através de Eventos Envio de Servidor (SSE) diretamente. Você pode criar conexões descartáveis e persistentes, obter as conexões durante a execução e usá-las.

Este recurso possui algumas limitações impostas por navegadores, como o envio apenas de mensagens de texto e a impossibilidade de fechar permanentemente uma conexão. Uma conexão fechada do lado do servidor terá um cliente tentando reconectar periodicamente a cada 5 segundos (3 para alguns navegadores).

Essas conexões são úteis para enviar eventos do servidor para o cliente sem que o cliente precise solicitar a informação a cada vez.

## Criando uma conexão SSE

Uma conexão SSE funciona como uma solicitação HTTP regular, mas em vez de enviar uma resposta e fechar a conexão imediatamente, a conexão é mantida aberta para enviar mensagens.

Ao chamar o método [HttpRequest.GetEventSource()](/api/Sisk.Core.Http.HttpRequest.GetEventSource), a solicitação é colocada em estado de espera enquanto a instância SSE é criada.

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
    var sse = req.GetEventSource();

    sse.Send("Olá, mundo!");

    return sse.Close();
});
```

No código acima, criamos uma conexão SSE e enviamos uma mensagem "Olá, mundo!", então fechamos a conexão SSE do lado do servidor.

> [!NOTE]
> Ao fechar uma conexão do lado do servidor, por padrão o cliente tentará se reconectar e a conexão será reiniciada, executando o método novamente, para sempre.
>
> É comum encaminhar uma mensagem de término do servidor sempre que a conexão é fechada do lado do servidor para evitar que o cliente tente se reconectar novamente.

## Adicionando cabeçalhos

Se você precisar enviar cabeçalhos, pode usar o método [HttpRequestEventSource.AppendHeader](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.AppendHeader) antes de enviar qualquer mensagem.

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
    var sse = req.GetEventSource();
    sse.AppendHeader("Header-Key", "Header-value");

    sse.Send("Olá!");

    return sse.Close();
});
```

Observe que é necessário enviar os cabeçalhos antes de enviar qualquer mensagem.

## Conexões Wait-For-Fail

As conexões são normalmente terminadas quando o servidor não consegue mais enviar mensagens devido a uma possível desconexão do cliente. Com isso, a conexão é automaticamente encerrada e a instância da classe é descartada.

Mesmo com uma reconexão, a instância da classe não funcionará, pois está vinculada à conexão anterior. Em algumas situações, você pode precisar dessa conexão posteriormente e não deseja gerenciá-la através do método de callback da rota.

Para isso, podemos identificar as conexões SSE com um identificador e obtê-las usando-o posteriormente, mesmo fora do callback da rota. Além disso, marcamos a conexão com [WaitForFail](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.WaitForFail) para não terminar a rota e terminar a conexão automaticamente.

Uma conexão SSE em KeepAlive aguardará um erro de envio (causado por desconexão) para recomeçar a execução do método. Também é possível definir um Timeout para isso. Após o tempo, se nenhuma mensagem foi enviada, a conexão é encerrada e a execução é retomada.

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
    var sse = req.GetEventSource("my-index-connection");

    sse.WaitForFail(TimeSpan.FromSeconds(15)); // aguardar 15 segundos sem nenhuma mensagem antes de terminar a conexão

    return sse.Close();
});
```

O método acima criará a conexão, a manejará e aguardará uma desconexão ou erro.

```cs
HttpRequestEventSource? evs = server.EventSources.GetByIdentifier("my-index-connection");
if (evs != null)
{
    // a conexão ainda está ativa
    evs.Send("Olá novamente!");
}
```

E o trecho acima tentará procurar a conexão recém-criada e, se ela existir, enviará uma mensagem para ela.

Todas as conexões ativas do servidor que forem identificadas estarão disponíveis na coleção [HttpServer.EventSources](/api/Sisk.Core.Http.HttpServer.EventSources). Esta coleção armazena apenas conexões ativas e identificadas. Conexões fechadas são removidas da coleção.

> [!NOTE]
> É importante notar que o keep alive possui um limite estabelecido por componentes que podem estar conectados ao Sisk de forma não controlada, como um proxy web, um kernel HTTP ou um driver de rede, e eles fecham conexões inativas após um determinado período de tempo.
>
> Portanto, é importante manter a conexão aberta enviando pings periódicos ou estendendo o tempo máximo antes que a conexão seja fechada. Leia a próxima seção para entender melhor o envio de pings periódicos.

## Configuração da política de ping de conexões

A Política de Ping é uma maneira automatizada de enviar mensagens periódicas para seu cliente. Essa função permite que o servidor entenda quando o cliente se desconectou dessa conexão sem precisar manter a conexão aberta indefinidamente.

```cs
[RouteGet("/sse")]
public HttpResponse Events(HttpRequest request)
{
    var sse = request.GetEventSource();
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

No código acima, a cada 5 segundos, uma nova mensagem de ping será enviada para o cliente. Isso manterá a conexão TCP ativa e impedirá que ela seja fechada devido à inatividade. Além disso, quando uma mensagem falha em ser enviada, a conexão é automaticamente fechada, liberando os recursos usados pela conexão.

## Consultando conexões

Você pode pesquisar conexões ativas usando um predicado no identificador da conexão, para poder transmitir, por exemplo.

```cs
HttpRequestEventSource[] evs = server.EventSources.Find(es => es.StartsWith("my-connection-"));
foreach (HttpRequestEventSource e in evs)
{
    e.Send("Transmissão para todos os eventos que começam com 'my-connection-'");
}
```

Você também pode usar o método [All](/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.All) para obter todas as conexões SSE ativas.