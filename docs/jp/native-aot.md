# ネイティブAOTのサポート

.NET 7では、[ネイティブAOT](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/)が導入されました。これは、.NETランタイムをターゲットマシンにインストールする必要なく、任意のサポートプラットフォームで実行可能なバイナリをエクスポートできる、.NETのコンパイルモードです。

ネイティブAOTでは、コードはネイティブコードにコンパイルされ、実行するために必要なすべてを含みます。Siskはバージョン0.9.1からこの機能を実験しており、ダイナミックルートをアプリケーションで定義する機能を追加し、警告メッセージでコンパイルを影響しないようにしています。

Siskは、タイプとオブジェクトから定義されるメソッドを取得するためにリフレクションを使用します。さらに、Siskは、タイプから初期化される`RequestHandlerAttribute`などの属性に対してリフレクションを使用します。適切に機能するために、AOTコンパイルではトリミングを使用し、ダイナミックタイプは最終的なアセンブリで使用されるものを指定する必要があります。

以下の例を考えてみましょう。これは、RequestHandlerを呼び出すルートです。

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

このRequestHandlerは、ランタイム中に動的に呼び出されます。この呼び出しは、明示的にセグメント化する必要があります。

コンパイラーが`MyRequestHandler`から最終的なコンパイルに保持するものをよりよく理解するには、以下の点を考慮する必要があります。

- パブリックプロパティ;
- パブリックおよびプライベートフィールド;
- パブリックおよびプライベートコンストラクター;
- パブリックおよびプライベートメソッド;

上記に記載されていないRequestHandler内のすべてのものは、コンパイラーによって削除されます。

その他のコンポーネント、クラス、およびパッケージは、AOTトリミングと互換性がある必要があります。そうでない場合、コードは予想どおりに機能しません。ただし、Siskは、パフォーマンスが優先されるものを構築したい場合でも、ユーザーを置き去りにしません。

ネイティブAOTとその動作については、公式の[Microsoftドキュメント](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/)を参照してください。