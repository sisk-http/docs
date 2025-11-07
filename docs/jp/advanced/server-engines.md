# HTTP サーバーエンジン

Sisk Framework は複数のパッケージに分かれており、主要なもの（Sisk.HttpServer）にはデフォルトでベースとなる HTTP サーバーは含まれていません。デフォルトでは、[HttpListener](https://learn.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-9.0) が Sisk のメインエンジンとして使用され、サーバーの低レベルの役割を担います。

HTTP エンジンは、Sisk が提供するアプリケーション層の下に位置するレイヤーの役割を果たします。このレイヤーは、接続管理、メッセージのシリアライズとデシリアライズ、メッセージキュー制御、およびマシンのソケットとの通信を担当します。

[HttpServerEngine](/api/Sisk.Core.Http.Engine.HttpServerEngine) クラスは、Sisk の上位層（ルーティング、SSE、ミドルウェアなど）で使用される HTTP エンジンのすべての必要機能を実装するための API を公開します。これらの機能は HTTP エンジンの責任ではなく、HTTP エンジンを実行基盤として使用するライブラリのサブセットの責任です。

この抽象化により、Sisk を .NET で書かれた他の HTTP エンジン（例：Kestrel）や .NET 以外のエンジンでも使用できるように移植することが可能です。現在、Sisk は新しいプロジェクトのデフォルトとしてネイティブ .NET の [HttpListener](https://learn.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-9.0) の抽象化を使用し続けています。このデフォルト抽象化は、異なるプラットフォームでの未定義の動作（HttpListener は Windows 用と他のプラットフォーム用で実装が異なる）、SSL のサポート不足、Windows 以外でのあまり快適でないパフォーマンスなど、いくつかの特定の問題を抱えています。

純粋に C# で書かれた高性能サーバーの実験的実装も、Sisk 用の HTTP エンジンとして利用可能です。これは [Cadente](https://github.com/sisk-http/core/tree/main/cadente) プロジェクトと呼ばれ、Sisk で使用するかどうかに関わらず利用できるマネージドサーバーの実験です。

## Sisk 用の HTTP エンジンを実装する

既存の HTTP サーバーと Sisk の間に接続ブリッジを作成するには、[HttpServerEngine](/api/Sisk.Core.Http.Engine.HttpServerEngine) クラスを拡張します。このクラスに加えて、コンテキスト、リクエスト、レスポンスの抽象化も実装する必要があります。

完全な抽象化の例は、[GitHub](https://github.com/sisk-http/core/blob/main/src/Http/Engine/HttpListenerAbstractEngine.cs) で確認できます。以下のようになります：

```csharp
/// <summary>
/* Provides an implementation of <see cref="HttpServerEngine"/> using <see cref="HttpListener"/>. */
/// </summary>
public sealed class HttpListenerAbstractEngine : HttpServerEngine {
    private HttpListener _listener;
    private static Lazy<HttpListenerAbstractEngine> shared = new Lazy<HttpListenerAbstractEngine> ( () => new HttpListenerAbstractEngine () );

    /// <summary>
    /* Gets the shared instance of the <see cref="HttpListenerAbstractEngine"/> class. */
    /// </summary>
    public static HttpListenerAbstractEngine Shared => shared.Value;

    /// <summary>
    /* Initializes a new instance of the <see cref="HttpListenerAbstractEngine"/> class. */
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

HTTP エンジンを作成する際、サーバーはループでリクエストをリッスンし、各リクエストを別々のスレッドで処理するコンテキストを作成します。これには、[HttpServerEngineContextEventLoopMechanism](/api/Sisk.Core.Http.Engine.HttpServerEngineContextEventLoopMechanism) を選択する必要があります：

- `InlineAsynchronousGetContext`：イベントループは線形で、HTTP コンテキスト処理は非同期ループで発生します。
- `UnboundAsynchronousGetContext`：イベントループは `BeginGetContext` と `EndGetContext` メソッドを介して伝搬されます。

```csharp
public override HttpServerEngineContextEventLoopMechanism EventLoopMechanism => HttpServerEngineContextEventLoopMechanism.UnboundAsynchronousGetContext;
```

両方のイベントループを実装する必要はありません。HTTP エンジンに最も適したものを選択してください。

## テスト

HTTP エンジンをリンクした後、他のエンジンを使用した際にすべての Sisk 機能が同一の振る舞いをすることを確認するためにテストを実施することが不可欠です。**非常に重要**なのは、異なる HTTP エンジンでも Sisk の振る舞いが同じであることです。

テストリポジトリは [GitHub](https://github.com/sisk-http/core/tree/main/tests) で確認できます。