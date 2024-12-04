# Sintaxe de descarte

O servidor HTTP pode ser usado para escutar uma solicitação de retorno de uma ação, como autenticação OAuth, e pode ser descartado após receber essa solicitação. Isso pode ser útil em casos em que você precisa de uma ação em segundo plano, mas não deseja configurar um aplicativo HTTP inteiro para isso.

O exemplo a seguir mostra como criar um servidor HTTP ouvindo na porta 5555 com [CreateListener](/api/Sisk.Core.Http.HttpServer.CreateListener) e aguardar o próximo contexto:

```csharp
using (var server = HttpServer.CreateListener(5555))
{
    // aguardar a próxima solicitação HTTP
    var context = await server.WaitNextAsync();
    Console.WriteLine($"Caminho solicitado: {context.Request.Path}");
}
```

A função [WaitNext](/api/Sisk.Core.Http.HttpServer.WaitNext) aguarda o próximo contexto de um processamento de solicitação concluído. Uma vez que o resultado dessa operação é obtido, o servidor já tratou completamente a solicitação e enviou a resposta para o cliente.
