# サーバーあたり複数のリスニングホスト

Source: https://docs.sisk-framework.org/ja/docs/advanced/multi-host-setup.html

Sisk Framework は常にサーバーあたり複数のホストの使用をサポートしており、つまり単一の HTTP サーバーが複数のポートでリッスンでき、各ポートはそれぞれ独自のルーターとサービスを実行します。

このように、Sisk を使用すると単一の HTTP サーバー上で責務を分離し、サービスを管理することが容易になります。以下の例は、異なるポートでリッスンする 2 つの ListeningHost を作成し、異なるルーターとアクションを持たせる方法を示しています。

[アプリを手動で作成する](https://docs.sisk-framework.org/ja/docs/advanced/manual-setup.md) を参照してください。

```cs
static void Main(string[] args)
{
    // 2 つのリスニングホストを作成し、それぞれが独自のルーターを持ち
    // 各自のポートでリッスンします
    //
    ListeningHost hostA = new ListeningHost();
    hostA.Ports = [new ListeningPort(12000)];
    hostA.Router = new Router();
    hostA.Router.MapGet("/", request => new HttpResponse().WithContent("Hello from the host A!"));

    ListeningHost hostB = new ListeningHost();
    hostB.Ports = [new ListeningPort(12001)];
    hostB.Router = new Router();
    hostB.Router.MapGet("/", request => new HttpResponse().WithContent("Hello from the host B!"));
 
    // サーバー構成を作成し、両方のリスニングホストを追加します
    // それにリスニングホストを設定します
    //
    HttpServerConfiguration configuration = new HttpServerConfiguration();
    configuration.ListeningHosts.Add(hostA);
    configuration.ListeningHosts.Add(hostB);

    // 指定された構成を使用する HTTP サーバーを作成します
    //
    HttpServer server = new HttpServer(configuration);

    // サーバーを開始します
    server.Start();

    Console.WriteLine("Try to reach host A in {0}", server.ListeningPrefixes[0]);
    Console.WriteLine("Try to reach host B in {0}", server.ListeningPrefixes[1]);

    Thread.Sleep(-1);
}
```
