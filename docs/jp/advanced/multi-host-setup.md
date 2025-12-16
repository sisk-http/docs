# 複数のリスニングホストをサーバーごとに

Sisk Frameworkは、常に1つのサーバーに複数のホストを使用することをサポートしています。つまり、単一のHTTPサーバーは複数のポートをリスニングし、各ポートには独自のルーターとサービスが実行されます。

この方法により、責任を簡単に分離し、Siskを使用した単一のHTTPサーバーでサービスを管理できます。以下の例は、2つのListeningHostsの作成を示しており、各ホストは異なるポートをリスニングし、異なるルーターとアクションを実行しています。

[アプリの手動作成](/v1/getting-started.md#manually-creating-your-app)を読んで、この抽象化の詳細を理解してください。

```cs
static void Main(string[] args)
{
    // 2つのリスニングホストを作成します。各ホストには独自のルーターと
    // 独自のポートがあります
    //
    ListeningHost hostA = new ListeningHost();
    hostA.Ports = [new ListeningPort(12000)];
    hostA.Router = new Router();
    hostA.Router.SetRoute(RouteMethod.Get, "/", request => new HttpResponse().WithContent("ホストAからこんにちは！"));

    ListeningHost hostB = new ListeningHost();
    hostB.Ports = [new ListeningPort(12001)];
    hostB.Router = new Router();
    hostB.Router.SetRoute(RouteMethod.Get, "/", request => new HttpResponse().WithContent("ホストBからこんにちは！"));

    // サーバー構成を作成し、両方の
    // リスニングホストを追加します
    //
    HttpServerConfiguration configuration = new HttpServerConfiguration();
    configuration.ListeningHosts.Add(hostA);
    configuration.ListeningHosts.Add(hostB);

    // 指定された構成を使用するHTTPサーバーを作成します
    //
    HttpServer server = new HttpServer(configuration);

    // サーバーを起動します
    server.Start();

    Console.WriteLine("ホストAに{0}でアクセスしてみてください", server.ListeningPrefixes[0]);
    Console.WriteLine("ホストBに{0}でアクセスしてみてください", server.ListeningPrefixes[1]);

    Thread.Sleep(-1);
}
```