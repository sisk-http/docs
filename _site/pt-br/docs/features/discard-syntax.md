# Sintaxe de descarte

Source: https://docs.sisk-framework.org/pt-br/docs/features/discard-syntax.html

O servidor HTTP pode ser usado para ouvir uma solicitação de callback de uma ação, como autenticação OAuth, e pode ser descartado após receber essa solicitação. Isso pode ser útil em casos em que você precisa de uma ação em segundo plano, mas não deseja configurar um aplicativo HTTP completo para isso.

O exemplo a seguir mostra como criar um servidor HTTP de escuta na porta 5555 com [CreateListener](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.CreateListener.md) e aguardar o próximo contexto:

```csharp
using (var server = HttpServer.CreateListener(5555))
{
    // aguarde a próxima solicitação HTTP
    var context = await server.WaitNextAsync();
    Console.WriteLine($"Caminho solicitado: {context.Request.Path}");
}
```

A função [WaitNext](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.WaitNext.md) aguarda o próximo contexto de processamento de solicitação concluída. Uma vez que o resultado dessa operação é obtido, o servidor já lidou completamente com a solicitação e enviou a resposta para o cliente.
