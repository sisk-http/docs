# File Server

Sisk は `Sisk.Http.FileSystem` 名前空間を提供し、静的ファイルの配信、ディレクトリ一覧表示、ファイル変換のツールが含まれます。この機能により、ローカルディレクトリからファイルを配信でき、レンジリクエスト（音声/動画ストリーミング）やカスタムファイル処理をサポートします。

## 静的ファイルの配信

静的ファイルを配信する最も簡単な方法は [Router.MapFileSystem](/api/Sisk.Core.Routing.Router.MapFileSystem) です。このメソッドは URL プレフィックスをディスク上のディレクトリにマッピングします。

```cs
using Sisk.Core.Http;
using Sisk.Core.Http.FileSystem;

// サーバーのルートを現在のディレクトリにマップ
mainRouter.MapFileSystem("/", Directory.GetCurrentDirectory());

// /assets を "public/assets" フォルダーにマップ
mainRouter.MapFileSystem(
    "/assets",
    Path.Combine(Directory.GetCurrentDirectory(), "public", "assets"));
```

リクエストがルートプレフィックスにマッチすると、`HttpFileServerHandler` は指定されたディレクトリ内のファイルを探します。見つかればそのファイルを配信し、見つからなければ 404 応答（アクセスが拒否された場合は 403）を返します。

`HttpFileServer.CreateServingRoute` は `Route` オブジェクトを明示的に作成したいときにまだ利用可能ですが、`MapFileSystem` がアプリケーションコードにとって最も直接的なオプションです。

## HttpFileServerHandler

ファイルの配信方法をより細かく制御したい場合は、`HttpFileServerHandler` を手動でインスタンス化して設定できます。

```cs
var fileHandler = new HttpFileServerHandler("/var/www/html");

// ディレクトリ一覧表示を有効化（デフォルトは無効）
fileHandler.AllowDirectoryListing = true;

// カスタムルートプレフィックスを設定（リクエストパスからこの部分が除去されます）
fileHandler.RoutePrefix = "/public";

// /public 配下にハンドラを登録
mainRouter.MapFileSystem("/public", fileHandler);
```

### 設定

| Property | Description |
|---|---|
| `RootDirectoryPath` | ファイルを配信するルートディレクトリへの絶対パスまたは相対パス。 |
| `RoutePrefix` | ファイル解決時にリクエストパスから除去されるルートプレフィックス。デフォルトは `/`。 |
| `AllowDirectoryListing` | `true` に設定すると、ディレクトリが要求されインデックスファイルが見つからない場合にディレクトリ一覧を表示します。デフォルトは `false`。 |
| `FileConverters` | 配信前にファイルを変換するために使用される `HttpFileServerFileConverter` のリスト。 |

## ディレクトリ一覧表示

`AllowDirectoryListing` が有効で、ユーザーがディレクトリパスを要求した場合、Sisk はそのディレクトリの内容を一覧表示する HTML ページを生成します。

ディレクトリ一覧には以下が含まれます：
- 親ディレクトリへのナビゲーション（`..`）。
- サブディレクトリの一覧。
- ファイルの一覧（サイズと最終更新日付き）。

## ファイルコンバータ

ファイルコンバータを使用すると、特定のファイルタイプをインターセプトして別の方法で処理できます。たとえば、画像をトランスコードしたり、ファイルをオンザフライで圧縮したり、部分コンテンツ（Range リクエスト）で配信したりできます。

Sisk にはメディアストリーミング用の組み込みコンバータが 2 つ含まれています：
- `HttpFileAudioConverter`: `.mp3`, `.ogg`, `.wav`, `.flac`, `.ogv` を処理。
- `HttpFileVideoConverter`: `.webm`, `.avi`, `.mkv`, `.mpg`, `.mpeg`, `.wmv`, `.mov`, `.mp4` を処理。

これらのコンバータは **HTTP Range Requests** をサポートし、クライアントが音声・動画ファイルをシークできるようにします。

### カスタムコンバータの作成

カスタムファイルコンバータを作成するには、`HttpFileServerFileConverter` を継承し、`CanConvert` と `Convert` を実装します。

```cs
using Sisk.Core.Http;
using Sisk.Core.Http.FileSystem;

public class MyTextConverter : HttpFileServerFileConverter
{
    public override bool CanConvert(FileInfo file)
    {
        // .txt ファイルのみに適用
        return file.Extension.Equals(".txt", StringComparison.OrdinalIgnoreCase);
    }

    public override HttpResponse Convert(FileInfo file, HttpRequest request)
    {
        string content = File.ReadAllText(file.FullName);
        
        // すべてのテキストを大文字に変換
        return new HttpResponse(200)
        {
            Content = new StringContent(content.ToUpper())
        };
    }
}
```

次にハンドラに追加します：

```cs
var handler = new HttpFileServerHandler("./files");
handler.FileConverters.Add(new MyTextConverter());
```