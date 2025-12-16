# HTTPサーバーエンジン

Sisk Frameworkは複数のパッケージに分割されており、主なパッケージ（Sisk.HttpServer）は基本的なHTTPサーバーを含んでいません。デフォルトでは、[HttpListener](https://learn.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-9.0)がSiskの主なエンジンとして使用され、低レベルのサーバーの役割を果たします。

HTTPエンジンは、Siskが提供するアプリケーション層の下の層を果たします。この層は、接続管理、メッセージのシリアライズとデシリアライズ、メッセージキューの制御、およびマシンのソケットとの通信を担当します。

[HttpServerEngine](/api/Sisk.Core.Http.Engine.HttpServerEngine)クラスは、ルーティング、SSE、ミドルウェアなど、Siskで使用するためのHTTPエンジンの必要な機能を実装するAPIを公開します。これらの機能は、HTTPエンジンの責任ではなく、HTTPエンジンを基盤として実行するサブセットのライブラリの責任です。

この抽象化により、Siskを他のHTTPエンジン（.NETで書かれたものやそうでないもの）で使用できるように移植することができます。たとえば、Kestrelなどです。現在、Siskはネイティブの.NET [HttpListener](https://learn.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-9.0)の抽象化をデフォルトとして使用しています。このデフォルトの抽象化は、いくつかの特定の問題を引き起こします。たとえば、異なるプラットフォームでの未指定の動作（HttpListenerにはWindows用と他のプラットフォーム用の実装が別々にある）、SSLのサポートの欠如、Windows以外でのパフォーマンスがあまり良くないことなどです。

Sisk用のHTTPエンジンとして、C#で書かれた高性能サーバーの実験的な実装も利用可能です。[Cadente](https://github.com/sisk-http/core/tree/main/cadente)プロジェクトと呼ばれます。これは、Siskと組み合わせて使用できるマネージドサーバーの実験です。

## Sisk用のHTTPエンジンの実装

既存のHTTPサーバーとSiskの間の接続ブリッジを作成することで、[HttpServerEngine](/api/Sisk.Core.Http.Engine.HttpServerEngine)クラスを拡張することができます。このクラスに加えて、コンテキスト、リクエスト、レスポンスの抽象化も実装する必要があります。

完了した抽象化の例は、[GitHub](https://github.com/sisk-http/core/blob/main/src/Http/Engine/HttpListenerAbstractEngine.cs)で参照できます。以下のようになります。

```csharp
/// <summary>
/// <see cref="HttpServerEngine"/>の<see cref="HttpListener"/>を使用した実装を提供します。
/// </summary>
public sealed class HttpListenerAbstractEngine : HttpServerEngine {
    private HttpListener _listener;
    private static Lazy<HttpListenerAbstractEngine> shared = new Lazy<HttpListenerAbstractEngine> ( () => new HttpListenerAbstractEngine () );

    /// <summary>
    /// <see cref="HttpListenerAbstractEngine"/>クラスの共有インスタンスを取得します。
    /// </summary>
    public static HttpListenerAbstractEngine Shared => shared.Value;

    /// <summary>
    /// <see cref="HttpListenerAbstractEngine"/>クラスの新しいインスタンスを初期化します。
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

## イベントループの選択

HTTPエンジンの作成中に、サーバーはリクエストを待ち受けるループで実行され、各リクエストを処理するコンテキストを別々のスレッドで作成します。したがって、[HttpServerEngineContextEventLoopMechanism](/api/Sisk.Core.Http.Engine.HttpServerEngineContextEventLoopMechanism)を選択する必要があります。

- `InlineAsynchronousGetContext` イベントループは線形です。HTTPコンテキストの処理は非同期ループで発生します。
- `UnboundAsynchronousGetContext` イベントループは、`BeginGetContext`と`EndGetContext`メソッドを介して伝達されます。

```csharp
public override HttpServerEngineContextEventLoopMechanism EventLoopMechanism => HttpServerEngineContextEventLoopMechanism.UnboundAsynchronousGetContext;
```

両方のイベントループを実装する必要はありません。HTTPエンジンに最も適したものを選択してください。

## テスト

HTTPエンジンをリンクした後、Siskのすべての機能が他のエンジンを使用して同じ動作を示すことを確認するためにテストを実行することが重要です。**非常に重要**なことは、Siskの動作が異なるHTTPエンジンで同じであることを確認することです。

テストリポジトリは、[GitHub](https://github.com/sisk-http/core/tree/main/tests)で参照できます。