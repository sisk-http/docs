# 基礎

Source: https://docs.sisk-framework.org/ja/docs/fundamentals/index.html



## 基礎

- [ルーティング](https://docs.sisk-framework.org/ja/docs/fundamentals/routing.md): The Router はサーバー構築の最初のステップです。これは Route オブジェクトを保持する役割を担い、URL とそのメソッドをサーバーが実行するアクションにマッピングするエンドポイントです。各アクションはリクエストを受け取り、クライアントへレスポンスを返すことを担当します。
ルートはパス式（「パスパターン」） …
- [リクエストハンドリング](https://docs.sisk-framework.org/ja/docs/fundamentals/request-handlers.md): リクエストハンドラは、“ミドルウェア” とも呼ばれ、ルーターでリクエストが実行される前後に実行される関数です。ルート単位またはルーター単位で定義できます。
リクエストハンドラには2種類あります：
BeforeResponse: ルーターアクションを呼び出す前にリクエストハンドラが実行されることを示します。 …
- [リクエスト](https://docs.sisk-framework.org/ja/docs/fundamentals/requests.md): リクエストは HTTP リクエストメッセージを表す構造体です。 HttpRequest オブジェクトには、アプリケーション全体で HTTP メッセージを処理するための便利な機能が含まれています。
HTTP リクエストは、メソッド、パス、バージョン、ヘッダー、ボディで構成されます。
このドキュメントでは、これらの要素を取 …
- [Responses](https://docs.sisk-framework.org/ja/docs/fundamentals/responses.md): Responses は HTTP リクエストに対する HTTP レスポンスのオブジェクトを表します。サーバーはリソース、ページ、ドキュメント、ファイル、またはその他のオブジェクトへの要求の結果として、クライアントに送信します。
HTTP レスポンスはステータス、ヘッダー、コンテンツで構成されます。
このドキュメントでは …


