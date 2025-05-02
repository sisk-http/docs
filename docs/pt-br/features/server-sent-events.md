# Eventos Enviados pelo Servidor

O Sisk suporta o envio de mensagens por meio de Eventos Enviados pelo Servidor fora da caixa. Você pode criar conexões descartáveis e persistentes, obter as conexões durante a execução e usá-las.

Essa funcionalidade tem algumas limitações impostas pelos navegadores, como enviar apenas mensagens de texto e não ser capaz de fechar permanentemente uma conexão. Uma conexão fechada pelo servidor terá um cliente tentando se reconectar periodicamente a cada 5 segundos (3 para alguns navegadores).

Essas conexões são úteis para enviar eventos do servidor para o cliente sem que o cliente solicite as informações todas as vezes.

## Criando uma conexão SSE

Uma conexão SSE funciona como uma solicitação HTTP regular, mas em vez de enviar uma resposta e fechar imediatamente a conexão, a conexão é mantida aberta para enviar mensagens.

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
> Ao fechar uma conexão do lado do servidor, por padrão o cliente tentará se conectar novamente naquele ponto e a conexão será reiniciada, executando o método novamente, para sempre.
>
> É comum encaminhar uma mensagem de término do servidor sempre que a conexão for fechada do lado do servidor para evitar que o cliente tente se reconectar novamente.

## Anexando cabeçalhos

Se você precisar enviar cabeçalhos, você pode usar o método [HttpRequestEventSource.AppendHeader](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.AppendHeader) antes de enviar quaisquer mensagens.

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
 using var sse = req.GetEventSource();
 sse.AppendHeader("Chave-Do-Cabeçalho", "Valor-Do-Cabeçalho");

 sse.Send("Olá!");

 return sse.Close();
});
```

Observe que é necessário enviar os cabeçalhos antes de enviar quaisquer mensagens.

## Conexões Wait-For-Fail

As conexões normalmente são encerradas quando o servidor não é mais capaz de enviar mensagens devido a uma possível desconexão do lado do cliente. Com isso, a conexão é automaticamente encerrada e a instância da classe é descartada.

Mesmo com uma reconexão, a instância da classe não funcionará, pois está vinculada à conexão anterior. Em algumas situações, você pode precisar dessa conexão posteriormente e não deseja gerenciá-la por meio do método de retorno de chamada da rota.

Para isso, podemos identificar as conexões SSE com um identificador e obtê-las usando-o posteriormente, até mesmo fora do retorno de chamada da rota. Além disso, marcamos a conexão com [WaitForFail](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.WaitForFail) para não encerrar a rota e encerrar a conexão automaticamente.

Uma conexão SSE em KeepAlive aguardará um erro de envio (causado por desconexão) para retomar a execução do método. Também é possível definir um tempo limite para isso. Após o tempo, se nenhuma mensagem tiver sido enviada, a conexão será encerrada e a execução será retomada.

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
 using var sse = req.GetEventSource("minha-conexao-index");

 sse.WaitForFail(TimeSpan.FromSeconds(15)); // aguarde 15 segundos sem nenhuma mensagem antes de encerrar a conexão

 return sse.Close();
});
```

O método acima criará a conexão, manipulará-la e aguardará uma desconexão ou erro.

```cs
HttpRequestEventSource? evs = server.EventSources.GetByIdentifier("minha-conexao-index");
if (evs != null)
{
 // a conexão ainda está ativa
 evs.Send("Olá novamente!");
}
```

E o trecho acima tentará procurar a conexão recém-criada e, se existir, enviará uma mensagem para ela.

Todas as conexões ativas do servidor que são identificadas estarão disponíveis na coleção [HttpServer.EventSources](/api/Sisk.Core.Http.HttpServer.EventSources). Essa coleção armazena apenas conexões ativas e identificadas. Conexões fechadas são removidas da coleção.

> [!NOTE]
> É importante notar que o keep alive tem um limite estabelecido por componentes que podem estar conectados ao Sisk de forma incontrolável, como um proxy da web, um kernel HTTP ou um driver de rede, e eles fecham conexões ociosas após um determinado período de tempo.
>
> Portanto, é importante manter a conexão aberta enviando pings periódicos ou estendendo o tempo máximo antes que a conexão seja fechada. Leia a próxima seção para entender melhor o envio de pings periódicos.

## Configurar política de ping da conexão

A Política de Ping é uma maneira automatizada de enviar mensagens periódicas para o cliente. Essa função permite que o servidor entenda quando o cliente foi desconectado dessa conexão sem ter que manter a conexão aberta indefinidamente.

```cs
[RouteGet("/sse")]
public HttpResponse Events(HttpRequest request)
{
 using var sse = request.GetEventSource();
 sse.WithPing(ping =>
 {
 ping.DataMessage = "mensagem-ping";
 ping.Interval = TimeSpan.FromSeconds(5);
 ping.Start();
 });
    
 sse.KeepAlive();
 return sse.Close();
}
```

No código acima, a cada 5 segundos, uma nova mensagem de ping será enviada para o cliente. Isso manterá a conexão TCP ativa e evitará que ela seja fechada devido à inatividade. Além disso, quando uma mensagem falhar ao ser enviada, a conexão será automaticamente fechada, liberando os recursos usados pela conexão.

## Consultando conexões

Você pode pesquisar conexões ativas usando um predicado no identificador da conexão, para poder transmitir, por exemplo.

```cs
HttpRequestEventSource[] evs = server.EventSources.Find(es => es.StartsWith("minha-conexao-"));
foreach (HttpRequestEventSource e in evs)
{
 e.Send("Transmitindo para todas as fontes de eventos que começam com 'minha-conexao-'");
}
```

Você também pode usar o método [All](/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.All) para obter todas as conexões SSE ativas.