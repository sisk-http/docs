# ドキュメント概要

## ようこそ

### [はじめに](/docs/jp/getting-started)

- [最初のステップ](/docs/jp/getting-started#first-steps)
- [プロジェクトの作成](/docs/jp/getting-started#creating-a-project)
- [HTTPサーバーの構築](/docs/jp/getting-started#building-the-http-server)
- [手動（高度）設定](/docs/jp/getting-started#manual-advanced-setup)

### [インストール](/docs/jp/installing)

### [Native AOT サポート](/docs/jp/native-aot)

- [サポートされていない機能](/docs/jp/native-aot#not-supported-features)

### [Sisk アプリケーションのデプロイ](/docs/jp/deploying)

- [アプリの公開](/docs/jp/deploying#publishing-your-app)
- [アプリケーションのプロキシ](/docs/jp/deploying#proxying-your-application)
- [サービスの作成](/docs/jp/deploying#creating-an-service)

### [SSL の使用](/docs/jp/ssl)

- [Sisk.Cadente.CoreEngine を介して](/docs/jp/ssl#through-the-siskcadentecoreengine)
- [Windows の IIS を介して](/docs/jp/ssl#through-iis-on-windows)
- [mitmproxy を介して](/docs/jp/ssl#through-mitmproxy)
- [Sisk.SslProxy パッケージを介して](/docs/jp/ssl#through-sisksslproxy-package)

### [Cadente](/docs/jp/cadente)

- [概要](/docs/jp/cadente#overview)
- [インストール](/docs/jp/cadente#installation)
- [Sisk での使用](/docs/jp/cadente#using-with-sisk)
- [スタンドアロン使用](/docs/jp/cadente#standalone-usage)

### [Windows での名前空間予約の構成](/docs/jp/registering-namespace)

### [変更履歴](/docs/jp/changelogs)

### [よくある質問](/docs/jp/faq)

- [Sisk はオープンソースですか？](/docs/jp/faq#is-sisk-open-source)
- [貢献は受け入れられますか？](/docs/jp/faq#are-contributions-accepted)
- [Sisk は資金提供されていますか？](/docs/jp/faq#is-sisk-funded)
- [本番環境で Sisk を使用できますか？](/docs/jp/faq#can-i-use-sisk-in-production)
- [Sisk には認証、監視、データベースサービスがありますか？](/docs/jp/faq#does-sisk-have-authentication-monitoring-and-database-services)
- [なぜ <framework> の代わりに Sisk を使うべきですか？](/docs/jp/faq#why-should-i-use-sisk-instead-of-framework)
- [Sisk を学ぶために何が必要ですか？](/docs/jp/faq#what-do-i-need-to-learn-sisk)
- [Sisk で商用アプリケーションを開発できますか？](/docs/jp/faq#can-i-develop-commercial-applications-with-sisk)

## 基礎

### [ルーティング](/docs/jp/fundamentals/routing)

- [ルートのマッチング](/docs/jp/fundamentals/routing#matching-routes)
- [正規表現ルート](/docs/jp/fundamentals/routing#regex-routes)
- [プレフィックス付きルート](/docs/jp/fundamentals/routing#prefixing-routes)
- [リクエストパラメータなしのルート](/docs/jp/fundamentals/routing#routes-without-request-parameter)
- [任意のメソッドルート](/docs/jp/fundamentals/routing#any-method-routes)
- [任意のパスルート](/docs/jp/fundamentals/routing#any-path-routes)
- [大文字小文字を無視したルートマッチング](/docs/jp/fundamentals/routing#ignore-case-route-matching)
- [見つかりません (404) コールバックハンドラ](/docs/jp/fundamentals/routing#not-found-404-callback-handler)
- [メソッド不許可 (405) コールバックハンドラ](/docs/jp/fundamentals/routing#method-not-allowed-405-callback-handler)
- [内部エラーハンドラ](/docs/jp/fundamentals/routing#internal-error-handler)

### [リクエスト処理](/docs/jp/fundamentals/request-handlers)

- [リクエストハンドラの作成](/docs/jp/fundamentals/request-handlers#creating-an-request-handler)
- [リクエストハンドラを単一ルートに関連付ける](/docs/jp/fundamentals/request-handlers#associating-a-request-handler-with-a-single-route)
- [リクエストハンドラをルーターに関連付ける](/docs/jp/fundamentals/request-handlers#associating-a-request-handler-with-a-router)
- [リクエストハンドラを属性に関連付ける](/docs/jp/fundamentals/request-handlers#associating-a-request-handler-with-an-attribute)
- [グローバルリクエストハンドラをバイパスする](/docs/jp/fundamentals/request-handlers#bypassing-an-global-request-handler)

### [リクエスト](/docs/jp/fundamentals/requests)

- [リクエストメソッドの取得](/docs/jp/fundamentals/requests#getting-the-request-method)
- [リクエスト URL コンポーネントの取得](/docs/jp/fundamentals/requests#getting-request-url-components)
- [リクエストボディの取得](/docs/jp/fundamentals/requests#getting-the-request-body)
- [リクエストコンテキストの取得](/docs/jp/fundamentals/requests#getting-the-request-context)
- [フォームデータの取得](/docs/jp/fundamentals/requests#getting-form-data)
- [マルチパートフォームデータの取得](/docs/jp/fundamentals/requests#getting-multipart-form-data)
- [クライアント切断の検出](/docs/jp/fundamentals/requests#detecting-client-disconnection)
- [サーバー送信イベントのサポート](/docs/jp/fundamentals/requests#server-sent-events-support)
- [プロキシされた IP とホストの解決](/docs/jp/fundamentals/requests#resolving-proxied-ips-and-hosts)
- [ヘッダーのエンコーディング](/docs/jp/fundamentals/requests#headers-encoding)

### [レスポンス](/docs/jp/fundamentals/responses)

- [HTTP ステータスの設定](/docs/jp/fundamentals/responses#setting-an-http-status)
- [ボディとコンテンツタイプ](/docs/jp/fundamentals/responses#body-and-content-type)
- [レスポンスヘッダー](/docs/jp/fundamentals/responses#response-headers)
- [クッキーの送信](/docs/jp/fundamentals/responses#sending-cookies)
- [チャンク化レスポンス](/docs/jp/fundamentals/responses#chunked-responses)
- [レスポンスストリーム](/docs/jp/fundamentals/responses#response-stream)
- [GZip、Deflate、Brotli 圧縮](/docs/jp/fundamentals/responses#gzip-deflate-and-brotli-compression)
- [自動圧縮](/docs/jp/fundamentals/responses#automatic-compression)
- [暗黙的レスポンスタイプ](/docs/jp/fundamentals/responses#implicit-response-types)
- [列挙可能オブジェクトと配列に関する注意](/docs/jp/fundamentals/responses#note-on-enumerable-objects-and-arrays)

## 機能

### [ロギング](/docs/jp/features/logging)

- [ファイルベースのアクセスログ](/docs/jp/features/logging#file-based-access-logs)
- [ストリームベースのロギング](/docs/jp/features/logging#stream-based-logging)
- [アクセスログのフォーマット](/docs/jp/features/logging#access-log-formatting)
- [ログのローテーション](/docs/jp/features/logging#rotating-logs)
- [エラーロギング](/docs/jp/features/logging#error-logging)
- [その他のロギングインスタンス](/docs/jp/features/logging#other-logging-instances)
- [LogStream の拡張](/docs/jp/features/logging#extending-logstream)

### [サーバー送信イベント](/docs/jp/features/server-sent-events)

- [SSE 接続の作成](/docs/jp/features/server-sent-events#creating-an-sse-connection)
- [ヘッダーの追加](/docs/jp/features/server-sent-events#appending-headers)
- [Wait-For-Fail 接続](/docs/jp/features/server-sent-events#wait-for-fail-connections)
- [接続の ping ポリシー設定](/docs/jp/features/server-sent-events#setup-connections-ping-policy)
- [接続のクエリ](/docs/jp/features/server-sent-events#querying-connections)

### [Web ソケット](/docs/jp/features/websockets)

- [メッセージの受信](/docs/jp/features/websockets#accepting-messages)
- [永続的接続](/docs/jp/features/websockets#persistent-connection)
- [Ping ポリシー](/docs/jp/features/websockets#ping-policy)

### [Discard 構文](/docs/jp/features/discard-syntax)

### [依存性注入](/docs/jp/features/instancing)

### [ストリーミングコンテンツ](/docs/jp/features/content-streaming)

- [リクエストコンテンツストリーム](/docs/jp/features/content-streaming#request-content-stream)
- [レスポンスコンテンツストリーム](/docs/jp/features/content-streaming#response-content-stream)

### [Sisk における CORS（クロスオリジンリソースシェアリング）の有効化](/docs/jp/features/cors)

- [同一オリジン](/docs/jp/features/cors#same-origin)
- [CORS の有効化](/docs/jp/features/cors#enabling-cors)
- [CORS を適用するその他の方法](/docs/jp/features/cors#other-ways-to-apply-cors)
- [特定ルートでの CORS 無効化](/docs/jp/features/cors#disabling-cors-on-specific-routes)
- [レスポンス内の値の置換](/docs/jp/features/cors#replacing-values-in-the-response)
- [プリフライトリクエスト](/docs/jp/features/cors#preflight-requests)
- [全体的な CORS 無効化](/docs/jp/features/cors#disabling-cors-globally)

### [ファイルサーバー](/docs/jp/features/file-server)

- [静的ファイルの提供](/docs/jp/features/file-server#serving-static-files)
- [HttpFileServerHandler](/docs/jp/features/file-server#httpfileserverhandler)
- [ディレクトリ一覧](/docs/jp/features/file-server#directory-listing)
- [ファイルコンバータ](/docs/jp/features/file-server#file-converters)

## 拡張機能

### [モデルコンテキストプロトコル](/docs/jp/extensions/mcp)

- [MCP の開始](/docs/jp/extensions/mcp#getting-started-with-mcp)
- [関数用 JSON スキーマの作成](/docs/jp/extensions/mcp#creating-json-schemas-for-functions)
- [関数呼び出しの処理](/docs/jp/extensions/mcp#handling-function-calls)
- [関数結果](/docs/jp/extensions/mcp#function-results)
- [作業の継続](/docs/jp/extensions/mcp#continuing-work)

### [JSON-RPC 拡張](/docs/jp/extensions/json-rpc)

- [トランスポートインターフェース](/docs/jp/extensions/json-rpc#transport-interface)
- [JSON-RPC メソッド](/docs/jp/extensions/json-rpc#json-rpc-methods)
- [シリアライザのカスタマイズ](/docs/jp/extensions/json-rpc#customizing-the-serializer)

### [SSL プロキシ](/docs/jp/extensions/ssl-proxy)

### [ベーシック認証](/docs/jp/extensions/basic-auth)

- [インストール](/docs/jp/extensions/basic-auth#installing)
- [認証ハンドラの作成](/docs/jp/extensions/basic-auth#creating-your-auth-handler)
- [備考](/docs/jp/extensions/basic-auth#remarks)

### [サービスプロバイダー](/docs/jp/extensions/service-providers)

- [JSON ファイルから設定を読む](/docs/jp/extensions/service-providers#reading-configurations-from-a-json-file)
- [設定ファイル構造](/docs/jp/extensions/service-providers#configuration-file-structure)

### [INI 設定プロバイダー](/docs/jp/extensions/ini-configuration)

- [インストール](/docs/jp/extensions/ini-configuration#installing)
- [INI のフレーバーと構文](/docs/jp/extensions/ini-configuration#ini-flavor-and-syntax)
- [設定パラメータ](/docs/jp/extensions/ini-configuration#configuration-parameters)

### [API ドキュメント](/docs/jp/extensions/api-documentation)

- [タイプハンドラ](/docs/jp/extensions/api-documentation#type-handlers)
- [エクスポーター](/docs/jp/extensions/api-documentation#exporters)

## 上級

### [手動（高度）設定](/docs/jp/advanced/manual-setup)

- [ルーター](/docs/jp/advanced/manual-setup#routers)
- [リスニングホストとポート](/docs/jp/advanced/manual-setup#listening-hosts-and-ports)
- [サーバー構成](/docs/jp/advanced/manual-setup#server-configuration)

### [リクエストライフサイクル](/docs/jp/advanced/request-lifecycle)

### [転送リゾルバ](/docs/jp/advanced/forwarding-resolvers)

- [ForwardingResolver クラス](/docs/jp/advanced/forwarding-resolvers#the-forwardingresolver-class)

### [HTTP サーバーハンドラ](/docs/jp/advanced/http-server-handlers)

### [サーバーごとの複数リスニングホスト](/docs/jp/advanced/multi-host-setup)

### [HTTP サーバーエンジン](/docs/jp/advanced/server-engines)

- [Sisk 用 HTTP エンジンの実装](/docs/jp/advanced/server-engines#implementing-an-http-engine-for-sisk)
- [イベントループの選択](/docs/jp/advanced/server-engines#choosing-an-event-loop)
- [テスト](/docs/jp/advanced/server-engines#testing)