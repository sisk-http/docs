# Cadente

Cadenteは、Sisk用の実験的なマネージドHTTP/1.1リスナー実装です。デフォルトの`System.Net.HttpListener`の代替として機能し、特に非Windowsプラットフォームでより大きな制御と柔軟性を提供します。

## 概要

デフォルトでは、Siskは`HttpListener`（`System.Net`から）をその基礎となるHTTPサーバーエンジンとして使用します。`HttpListener`はWindows（ där でカーネルモードのHTTP.sysドライバーを使用する）では安定してパフォーマンスが高いですが、LinuxおよびmacOSでの実装はマネージドであり、歴史的に制限があります。たとえば、ネイティブのSSLサポートが不足している（NginxやSisk.SslProxyなどのリバースプロキシが必要）ことや、パフォーマンス特性が異なることなどです。

Cadenteは、これらの問題を解決するために、C#で書かれた完全にマネージドなHTTP/1.1サーバーを提供します。主な目標は次のとおりです。

- **ネイティブSSLサポート:** 外部プロキシや複雑な設定を必要とせずにすべてのプラットフォームで動作します。
- **クロスプラットフォームの整合性:** Windows、Linux、macOSで同じ動作を提供します。
- **パフォーマンス:** マネージド`HttpListener`の高パフォーマンスな代替として設計されています。
- **独立性:** `System.Net.HttpListener`から切り離されており、.NETでのそのコンポーネントの将来の廃止またはメンテナンス不足からSiskを保護します。

> [!WARNING]
> **実験的なステータス**
> 
> Cadenteは現在、実験的な段階（ベータ）にあります。重要なプロダクション環境ではまだ推奨されていません。APIと動作は変更される可能性があります。

## インストール

Cadenteは、別個のパッケージとして利用可能です。Siskで使用するには、`Sisk.Cadente.CoreEngine`パッケージが必要です。

```bash
dotnet add package Sisk.Cadente.CoreEngine --prerelease
```

## Siskでの使用

CadenteをSiskアプリケーションのHTTPエンジンとして使用するには、`HttpServer`を`CadenteHttpServerEngine`を使用するように構成する必要があります。

`CadenteHttpServerEngine`は、Cadenteの`HttpHost`をSiskが要求する`HttpServerEngine`抽象化に適応させます。

```csharp
using Sisk.Core.Http;
using Sisk.Cadente.CoreEngine;

using var host = HttpServer.CreateBuilder()
    .UseEngine<CadenteHttpServerEngine>()
    .UseSsl(certificate: CertificateHelper.CreateTrustedDevelopmentCertificate("localhost"))
    .Build();

await host.StartAsync();
```

### 詳細な構成

`CadenteHttpServerEngine`コンストラクターにセットアップアクションを渡すことで、基礎となる`HttpHost`インスタンスをカスタマイズできます。これは、タイムアウトやその他の低レベルの設定を構成するのに役立ちます。

```csharp
using var engine = new CadenteHttpServerEngine(host =>
{
    // クライアントの読み取り/書き込みタイムアウトを構成
    host.TimeoutManager.ClientReadTimeout = TimeSpan.FromSeconds(30);
    host.TimeoutManager.ClientWriteTimeout = TimeSpan.FromSeconds(30);
});
```

## 独立した使用

主にSiskのために設計されていますが、Cadenteは独立したHTTPサーバー（`HttpListener`と同様）として使用できます。

```csharp
using Sisk.Cadente;

var host = new HttpHost(15000)
{
    Handler = new MyHostHandler()
};

host.Start();
Thread.Sleep(-1);

class MyHostHandler : HttpHostHandler
{
    public override async Task OnContextCreatedAsync(HttpHost host, HttpHostContext context)
    {
        context.Response.StatusCode = 200;
        using var writer = new StreamWriter(context.Response.GetResponseStream());
        await writer.WriteLineAsync("Hello, world!");
    }
}
```