# Suporte com AOT

Na .NET 7, foi introduzido o [Native AOT](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/), um modo de compilação .NET que permite exportar binários prontos para qualquer plataforma suportada, sem exigir que o runtime .NET seja instalado na máquina de destino.

Com o Native AOT, seu código é compilado para código nativo e já contém tudo o que precisa para ser executado. O Sisk tem experimentado o recurso desde a versão 0.9.1, que melhora o suporte para Native AOT com recursos para definir rotas dinâmicas por aplicativo sem afetar a compilação com mensagens de aviso.

O Sisk usa reflexão para obter os métodos que serão definidos a partir de tipos e objetos. Além disso, o Sisk usa reflexão para atributos como `RequestHandlerAttribute`, que são inicializados a partir de um tipo. Para funcionar corretamente, a compilação AOT usa o trimming, onde os tipos dinâmicos devem especificar o que será usado na montagem final.

Considerando o exemplo abaixo, é uma rota que chama um RequestHandler.

```cs
[Route(RouteMethod.Get, "/", LogMode = LogOutput.None)]
[RequestHandler(typeof(MyRequestHandler))]
static HttpResponse IndexPage(HttpRequest request)
{
    HttpResponse htmlResponse = new HttpResponse();
    htmlResponse.Content = new StringContent("Hello, world!", System.Text.Encoding.UTF8, "text/plain");
    return htmlResponse;
}
```

Este RequestHandler é invocado dinamicamente durante a execução, e essa invocação deve ser segmentada e essa segmentação deve ser explícita.

Para entender melhor o que o compilador considerará de `MyRequestHandler` deve ser mantido na compilação final é:

- Propriedades públicas;
- Campos públicos e privados;
- Construtor público e privado;
- Métodos públicos e privados;

Tudo o que você tiver em um RequestHandler que não seja mencionado acima será removido pelo compilador.

Lembre-se de que todos os outros componentes, classes e pacotes que você usar em seu aplicativo devem ser compatíveis com o AOT Trimming, ou seu código não funcionará como esperado. A propósito, o Sisk não vai te deixar na mão se você quiser construir algo onde o desempenho é uma prioridade.

Você pode ler mais sobre o Native AOT e como ele funciona na documentação oficial da [Microsoft](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/).
