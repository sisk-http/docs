# 詳細

Source: https://docs.sisk-framework.org/ja/docs/advanced/index.html



## 詳細

- [手動（上級）セットアップ](https://docs.sisk-framework.org/ja/docs/advanced/manual-setup.md): サーバーの部品を自分で組み立てる必要がある場合、たとえば 1 つのプロセスが複数のホスト、ポート、ルーター、またはカスタムサーバー構成を公開しなければならない場合に手動設定を使用します。ほとんどのアプリケーションでは、ビルダー API の方が短く、優先すべきです。手動設定は、Router、1 つ以上の …
- [リクエストのライフサイクル](https://docs.sisk-framework.org/ja/docs/advanced/request-lifecycle.md): 以下では、HTTP リクエストの例を通して、リクエストの全ライフサイクルについて説明します。
リクエストの受信: 各リクエストは、リクエスト自体とクライアントに配信されるレスポンスとの間に HTTP コンテキストを作成します。このコンテキストは Sisk の組み込みリスナーから提供され …
- [フォワーディングリゾルバ](https://docs.sisk-framework.org/ja/docs/advanced/forwarding-resolvers.md): フォワーディングリゾルバは、リクエスト、プロキシ、CDN、ロードバランサーを通じてクライアントを識別する情報をデコードするのに役立つヘルパーです。Sisk サービスがリバースプロキシまたはフォワードプロキシを介して実行される場合、クライアントの IP アドレス、ホスト、プロトコルは元のリクエストとは異なることがあります …
- [Http server handlers](https://docs.sisk-framework.org/ja/docs/advanced/http-server-handlers.md): Sisk バージョン 0.16 では、HttpServerHandler クラスを導入しました。このクラスは Sisk の全体的な動作を拡張し、Http リクエストの処理、ルーター、コンテキストバッグなど、追加のイベントハンドラを Sisk に提供することを目的としています。
このクラスは、HTTP サーバ全体および個 …
- [サーバーあたり複数のリスニングホスト](https://docs.sisk-framework.org/ja/docs/advanced/multi-host-setup.md): Sisk Framework は常にサーバーあたり複数のホストの使用をサポートしており、つまり単一の HTTP サーバーが複数のポートでリッスンでき、各ポートはそれぞれ独自のルーターとサービスを実行します。
このように、Sisk を使用すると単一の HTTP サーバー上で責務を分離し、サービスを管理することが容易になり …
- [HTTPサーバーエンジン](https://docs.sisk-framework.org/ja/docs/advanced/server-engines.md): Sisk Frameworkは複数のパッケージに分割されており、主なパッケージ（Sisk.HttpServer）は基本的なHTTPサーバーを含んでいません。デフォルトでは、HttpListenerがSiskの主なエンジンとして使用され、低レベルのサーバーの役割を果たします。
HTTPエンジンは、Siskが提供するアプリ …


