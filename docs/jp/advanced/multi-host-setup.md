# 複数のホストをサーバーに設定する

Sisk Frameworkは、常に1つのサーバーに複数のホストを設定することをサポートしています。つまり、1つのHTTPサーバーが複数のポートでリスニングできます。各ポートには独自のルーターとサービスが実行されます。

この方法により、Siskを使用して、1つのHTTPサーバーでサービスを簡単に分離して管理できます。以下の例では、2つのListeningHostsを作成します。各ホストは異なるポートでリスニングし、異なるルーターとアクションを持ちます。

[アプリの手動作成](/v1/getting-started.md#manually-creating-your-app)を読んで、この抽象化の詳細を理解してください。

```cs
static void Main(string[] args)
{
    // 2つのリスニングホストを作成します。各ホストは独自のルーターと
    // 独自のポートでリスニングします
    //
    ListeningHost hostA = new ListeningHost();
    hostA.Ports = [new ListeningPort(12000)];
    hostA.Router = new Router();
    hostA.Router.SetRoute(RouteMethod.Get, "/", request => new HttpResponse().WithContent("ホストAからこんにちは！"));

    ListeningHost hostB = new ListeningHost();
    hostB.Ports = [new ListeningPort(12001)];
    hostB.Router = new Router();
    hostB.Router.SetRoute(RouteMethod.Get, "/", request => new HttpResponse().WithContent("ホストBからこんにちは！"));

    // サーバー設定を作成し、両方のリスニングホストを追加します
    //
    HttpServerConfiguration configuration = new HttpServerConfiguration();
    configuration.ListeningHosts.Add(hostA);
    configuration.ListeningHosts.Add(hostB);

    // 指定された設定を使用するHTTPサーバーを作成します
    //
    HttpServer server = new HttpServer(configuration);

    // サーバーを起動します
    server.Start();

    Console.WriteLine("ホストAに{0}でアクセスしてみてください", server.ListeningPrefixes[0]);
    Console.WriteLine("ホストBに{0}でアクセスしてみてください", server.ListeningPrefixes[1]);

    Thread.Sleep(-1);
}
```