# Motores de Servidor HTTP

O Sisk Framework é dividido em vários pacotes, onde o principal (Sisk.HttpServer) não inclui um servidor HTTP base - por padrão, o [HttpListener](https://learn.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-9.0) é usado como o motor principal do Sisk para desempenhar o papel de baixo nível do servidor.

O motor HTTP cumpre o papel da camada abaixo da camada de aplicação oferecida pelo Sisk. Essa camada é responsável pela gestão de conexões, serialização e desserialização de mensagens, controle da fila de mensagens e comunicação com o socket da máquina.

A classe [HttpServerEngine](/api/Sisk.Core.Http.Engine.HttpServerEngine) expõe uma API para implementar todas as funcionalidades necessárias de um motor HTTP a ser usado em camadas superiores com o Sisk, como roteamento, SSE, middlewares, etc. Essas funções não são responsabilidade do motor HTTP, mas sim do subconjunto de bibliotecas que utilizarão o motor HTTP como base para execução.

Com essa abstração, é possível portar o Sisk para ser usado com qualquer outro motor HTTP, escrito em .NET ou não, como o Kestrel, por exemplo. Atualmente, o Sisk continua usando uma abstração do [HttpListener](https://learn.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-9.0) nativo do .NET como padrão para novos projetos. Essa abstração padrão traz alguns problemas específicos, como comportamento não especificado em diferentes plataformas (o HttpListener tem uma implementação para Windows e outra para outras plataformas), falta de suporte a SSL e desempenho não muito agradável fora do Windows.

Uma implementação experimental de um servidor de alto desempenho escrito puramente em C# também está disponível como motor HTTP para o Sisk, chamado projeto [Cadente](https://github.com/sisk-http/core/tree/main/cadente), que é um experimento de servidor gerenciado que pode ser usado com ou sem o Sisk.

## Implementando um Motor HTTP para o Sisk

Você pode criar uma ponte de conexão entre um servidor HTTP existente e o Sisk estendendo a classe [HttpServerEngine](/api/Sisk.Core.Http.Engine.HttpServerEngine). Além dessa classe, você também terá que implementar abstrações para contextos, requisições e respostas.

Um exemplo completo de abstração está [disponível no GitHub](https://github.com/sisk-http/core/blob/main/src/Http/Engine/HttpListenerAbstractEngine.cs) para visualização. Ele fica assim:

```csharp
/// <summary>
/*  Fornece uma implementação de <see cref="HttpServerEngine"/> usando <see cref="HttpListener"/>.
*/
public sealed class HttpListenerAbstractEngine : HttpServerEngine {
    private HttpListener _listener;
    private static Lazy<HttpListenerAbstractEngine> shared = new Lazy<HttpListenerAbstractEngine> ( () => new HttpListenerAbstractEngine () );

    /// <summary>
    /// Obtém a instância compartilhada da classe <see cref="HttpListenerAbstractEngine"/>.
    /// </summary>
    public static HttpListenerAbstractEngine Shared => shared.Value;

    /// <summary>
    /// Inicializa uma nova instância da classe <see cref="HttpListenerAbstractEngine"/>.
    /// </summary>
    public HttpListenerAbstractEngine () {
        _listener = new HttpListener {
            IgnoreWriteExceptions = true
        };
    }

    /// <inheritdoc/>
    public override TimeSpan IdleConnectionTimeout {
        get => _listener.TimeoutManager.IdleConnection;
        set => _listener.TimeoutManager.IdleConnection = value;
    }
    
    // ...
}
```

## Escolhendo um Loop de Eventos

Durante a criação de um motor HTTP, o servidor ouvirá requisições em um loop e criará contextos para tratar cada uma delas em threads separadas. Para isso, você terá que escolher um [HttpServerEngineContextEventLoopMechanism](/api/Sisk.Core.Http.Engine.HttpServerEngineContextEventLoopMechanism):

- `InlineAsynchronousGetContext` o loop de eventos é linear - as chamadas de tratamento de contexto HTTP ocorrem em um loop assíncrono.
- `UnboundAsynchronousGetContext` o loop de eventos é transmitido através dos métodos `BeginGetContext` e `EndGetContext`.

```csharp
public override HttpServerEngineContextEventLoopMechanism EventLoopMechanism => HttpServerEngineContextEventLoopMechanism.UnboundAsynchronousGetContext;
```

Você não precisa implementar ambos os loops de eventos. Escolha o que fizer mais sentido para o seu motor HTTP.

## Testes

Após vincular seu motor HTTP, é essencial realizar testes para garantir que todas as funcionalidades do Sisk tenham comportamento idêntico ao usar outros motores. **É extremamente importante** ter o mesmo comportamento do Sisk para diferentes motores HTTP.

Você pode visitar o repositório de testes no [GitHub](https://github.com/sisk-http/core/tree/main/tests).