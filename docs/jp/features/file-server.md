# ファイルサーバー

Sisk では、`Sisk.Http.FileSystem` 名前空間が提供され、静的ファイルの提供、ディレクトリのリスト表示、ファイルの変換などのツールが含まれています。この機能により、ローカル ディレクトリからのファイルの提供が可能になり、範囲要求 (オーディオ/ビデオ ストリーミング) とカスタム ファイル処理がサポートされます。

## 静的ファイルの提供

静的ファイルを提供する最も簡単な方法は、`HttpFileServer.CreateServingRoute` を使用することです。このメソッドは、URL プレフィックスをディスク上のディレクトリにマップするルートを作成します。

```cs
using Sisk.Core.Http;
using Sisk.Core.Http.FileSystem;

// サーバーのルートを現在のディレクトリにマップします
mainRouter.SetRoute(HttpFileServer.CreateServingRoute("/", Directory.GetCurrentDirectory()));

// /assets を "public/assets" フォルダーにマップします
mainRouter.SetRoute(HttpFileServer.CreateServingRoute("/assets", Path.Combine(Directory.GetCurrentDirectory(), "public", "assets")));
```

ルート プレフィックスに一致する要求が発生すると、`HttpFileServerHandler` は指定されたディレクトリ内でファイルを検索します。ファイルが見つかると、ファイルを提供します。そうでない場合は、404 応答 (またはアクセスが拒否された場合は 403 応答) を返します。

## HttpFileServerHandler

ファイルの提供方法をより細かく制御するには、`HttpFileServerHandler` を手動でインスタンス化して構成できます。

```cs
var fileHandler = new HttpFileServerHandler("/var/www/html");

// ディレクトリのリスト表示を有効にします (デフォルトでは無効)
fileHandler.AllowDirectoryListing = true;

// カスタム ルート プレフィックスを設定します (このプレフィックスは、ファイルを解決するときに要求パスからトリミングされます)
fileHandler.RoutePrefix = "/public";

// ハンドラー アクションを登録します
mainRouter.SetRoute(RouteMethod.Get, "/public/.*", fileHandler.HandleRequest);
```

### 構成

| プロパティ | 説明 |
|---|---|
| `RootDirectoryPath` | ファイルを提供するためのルート ディレクトリへの絶対パスまたは相対パス。 |
| `RoutePrefix` | 要求パスからトリミングされるルート プレフィックス。デフォルトは `/`。 |
| `AllowDirectoryListing` | true に設定すると、ディレクトリが要求され、インデックス ファイルが見つからない場合にディレクトリのリスト表示を有効にします。デフォルトは false。 |
| `FileConverters` | ファイルを提供する前に変換するために使用される `HttpFileServerFileConverter` のリスト。 |

## ディレクトリのリスト表示

`AllowDirectoryListing` が有効になっている場合、ユーザーがディレクトリ パスを要求すると、Sisk はそのディレクトリの内容をリストする HTML ページを生成します。

ディレクトリのリストには、次のものが含まれます。
- 親ディレクトリ (`..`) へのナビゲーション。
- サブディレクトリのリスト。
- サイズと最終変更日付を含むファイルのリスト。

## ファイル コンバーター

ファイル コンバーターを使用すると、特定のファイル タイプをインターセプトして、異なる方法で処理できます。たとえば、画像をトランスコードしたり、ファイルを圧縮したり、範囲要求 (Range 要求) を使用してファイルを提供したりすることができます。

Sisk には、メディア ストリーミング用の 2 つの組み込み コンバーターが含まれています。
- `HttpFileAudioConverter`: `.mp3`, `.ogg`, `.wav`, `.flac`, `.ogv` を処理します。
- `HttpFileVideoConverter`: `.webm`, `.avi`, `.mkv`, `.mpg`, `.mpeg`, `.wmv`, `.mov`, `.mp4` を処理します。

これらのコンバーターにより、**HTTP Range 要求** のサポートが可能になり、クライアントはオーディオとビデオ ファイルをシークできます。

### カスタム コンバーターの作成

カスタム ファイル コンバーターを作成するには、`HttpFileServerFileConverter` を継承し、`CanConvert` と `Convert` を実装します。

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
        
        // テキスト コンテンツをすべて大文字に変換
        return new HttpResponse(200)
        {
            Content = new StringContent(content.ToUpper())
        };
    }
}
```

次に、ハンドラーに追加します。

```cs
var handler = new HttpFileServerHandler("./files");
handler.FileConverters.Add(new MyTextConverter());
```