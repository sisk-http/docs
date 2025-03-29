# ネイティブAOTのサポート

.NET 7では、[ネイティブAOT](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/)が導入されました。これは、.NETランタイムをターゲットマシンにインストールすることなく、任意のサポートプラットフォームで実行可能なバイナリをエクスポートできる、.NETのコンパイルモードです。

ネイティブAOTでは、コードはネイティブコードにコンパイルされ、実行するために必要なすべてのものが含まれています。Siskはバージョン0.9.1からこの機能を実験しており、ダイナミックルートをアプリケーションで定義する機能を追加し、コンパイル時に警告メッセージが出ないようにしています。

Siskは、メソッドをタイプとオブジェクトから取得するためにリフレクションを使用します。さらに、Siskは、タイプから初期化される`RequestHandlerAttribute`などの属性に対してリフレクションを使用します。AOTコンパイルを正常に機能させるために、トリミングが使用され、ダイナミックタイプは最終的なアセンブリで使用されるものを指定する必要があります。

以下の例は、RequestHandlerを呼び出すルートです。

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

このRequestHandlerは、ランタイム中に動的に呼び出され、この呼び出しは明示的にセグメント化する必要があります。

コンパイラーが`MyRequestHandler`から最終的なコンパイルに保持するものを理解するために、以下の点が重要です。

- パブリックプロパティ;
- パブリックおよびプライベートフィールド;
- パブリックおよびプライベートコンストラクター;
- パブリックおよびプライベートメソッド;

上記に記載されていないものはすべて、コンパイラーによって削除されます。

また、アプリケーションで使用するすべての他のコンポーネント、クラス、およびパッケージは、AOTトリミングと互換性がある必要があります。そうでない場合、コードは予想どおりに機能しません。ただし、Siskは、パフォーマンスが優先されるものを構築したい場合でも、ユーザーを支援します。

ネイティブAOTとその動作についての詳細は、公式の[Microsoftドキュメント](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/)を参照してください。