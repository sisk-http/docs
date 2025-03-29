# コンテンツのストリーミング

Sisk では、クライアントとサーバー間でコンテンツのストリーミングを読み書きすることができます。この機能は、リクエストの生存期間中にコンテンツのシリアル化とデシリアル化のメモリ負荷を削減するために役立ちます。

## リクエストコンテンツストリーム

小さなコンテンツは自動的に HTTP 接続バッファメモリに読み込まれ、[HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body) と [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.RawBody) に迅速に読み込まれます。より大きなコンテンツの場合は、[HttpRequest.GetRequestStream](/api/Sisk.Core.Http.HttpRequest.GetRequestStream) メソッドを使用してリクエストコンテンツ読み取りストリームを取得できます。

[HttpRequest.GetMultipartFormContent](/api/Sisk.Core.Http.HttpRequest.GetMultipartFormContent) メソッドは、リクエスト全体のコンテンツをメモリに読み込むため、大きなコンテンツを読み取るには適していないことに注意してください。

以下の例を考えてみましょう:

<div class="script-header">
    <span>
        Controller/UploadDocument.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RoutePost ( "/api/upload-document/<filename>" )]
public async Task<HttpResponse> UploadDocument ( HttpRequest request ) {

    var fileName = request.RouteParameters [ "filename" ].GetString ();

    if (!request.HasContents) {
        // リクエストにコンテンツがありません
        return new HttpResponse ( HttpStatusInformation.BadRequest );
    }

    var contentStream = request.GetRequestStream ();
    var outputFileName = Path.Combine (
        AppDomain.CurrentDomain.BaseDirectory,
        "uploads",
        fileName );

    using (var fs = File.Create ( outputFileName )) {
        await contentStream.CopyToAsync ( fs );
    }

    return new HttpResponse () {
        Content = JsonContent.Create ( new { message = "ファイルが正常に送信されました。" } )
    };
}
```

上記の例では、`UploadDocument` メソッドはリクエストコンテンツを読み取り、コンテンツをファイルに保存します。`Stream.CopyToAsync` で使用される読み取りバッファ以外に、追加のメモリ割り当ては行われません。上記の例は、非常に大きなファイルの場合にメモリ割り当ての負担を削減し、アプリケーションのパフォーマンスを最適化するのに役立ちます。

良い実践は、ファイルの送信などの時間のかかる操作では、常に [CancellationToken](https://learn.microsoft.com/pt-br/dotnet/api/system.threading.cancellationtoken) を使用することです。これは、クライアントとサーバーの間のネットワーク速度に依存するためです。

CancellationToken での調整は、以下のように行うことができます:

<div class="script-header">
    <span>
        Controller/UploadDocument.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
// 30 秒のタイムアウトに達した場合、以下のキャンセルトークンは例外をスローします。
CancellationTokenSource copyCancellation = new CancellationTokenSource ( delay: TimeSpan.FromSeconds ( 30 ) );

try {
    using (var fs = File.Create ( outputFileName )) {
        await contentStream.CopyToAsync ( fs, copyCancellation.Token );
    }
}
catch (OperationCanceledException) {
    return new HttpResponse ( HttpStatusInformation.BadRequest ) {
        Content = JsonContent.Create ( new { Error = "アップロードが最大アップロード時間 (30 秒) を超えました。" } )
    };
}
```

## レスポンスコンテンツストリーム
レスポンスコンテンツを送信することも可能です。現在、[HttpRequest.GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream) メソッドと [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent?view=net-9.0) タイプのコンテンツを使用するという 2 つの方法があります。

画像ファイルを提供するシナリオを考えてみましょう。以下のコードを使用できます:

<div class="script-header">
    <span>
        Controller/ImageController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RouteGet ( "/api/profile-picture" )]
public async Task<HttpResponse> UploadDocument ( HttpRequest request ) {

    // プロファイル画像を取得するための例メソッド
    var profilePictureFilename = "profile-picture.jpg";
    byte[] profilePicture = await File.ReadAllBytesAsync ( profilePictureFilename );

    return new HttpResponse () {
        Content = new ByteArrayContent ( profilePicture ),
        Headers = new () {
            ContentType = "image/jpeg",
            ContentDisposition = $"inline; filename={profilePictureFilename}"
        }
    };
}
```

上記のメソッドは、画像コンテンツを読み取るたびにメモリ割り当てを行います。画像が大きい場合、これによりパフォーマンスの問題が発生し、ピーク時にはメモリオーバーロードによりサーバーがクラッシュする可能性があります。このような状況では、キャッシングは役立ちますが、ファイルのためにメモリが依然として予約されるため、問題を完全に解決することはできません。キャッシングは、毎回メモリを割り当てる必要性の圧力を軽減するのに役立ちますが、大きなファイルの場合は十分ではありません。

画像をストリームで送信することが問題の解決策となります。画像コンテンツ全体を読み取るのではなく、ファイル上で読み取りストリームを作成し、クライアントに小さなバッファを使用してコピーします。

#### GetResponseStream メソッドを使用した送信

[HttpRequest.GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream) メソッドは、HTTP 応答のコンテンツフローが準備されるにつれて、HTTP 応答のチャンクを送信できるオブジェクトを作成します。このメソッドはより手動で、コンテンツを送信する前にステータス、ヘッダー、コンテンツサイズを定義する必要があります。

<div class="script-header">
    <span>
        Controller/ImageController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RouteGet ( "/api/profile-picture" )]
public async Task<HttpResponse> UploadDocument ( HttpRequest request ) {

    var profilePictureFilename = "profile-picture.jpg";

    // この形式の送信では、ステータスとヘッダーを事前に定義する必要があります。
    var requestStreamManager = request.GetResponseStream ();

    requestStreamManager.SetStatus ( System.Net.HttpStatusCode.OK );
    requestStreamManager.SetHeader ( HttpKnownHeaderNames.ContentType, "image/jpeg" );
    requestStreamManager.SetHeader ( HttpKnownHeaderNames.ContentDisposition, $"inline; filename={profilePictureFilename}" );

    using (var fs = File.OpenRead ( profilePictureFilename )) {

        // この形式の送信では、コンテンツサイズも事前に定義する必要があります。
        requestStreamManager.SetContentLength ( fs.Length );

        // コンテンツサイズがわからない場合は、チャンク化されたエンコードを使用してコンテンツを送信できます。
        requestStreamManager.SendChunked = true;

        // その後、出力ストリームに書き込みます。
        await fs.CopyToAsync ( requestStreamManager.ResponseStream );
    }
}
```

#### StreamContent を使用したコンテンツの送信

[StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent?view=net-9.0) クラスを使用すると、データソースからバイトストリームとしてコンテンツを送信できます。この形式の送信は、以前の要件を削除し、[圧縮エンコード](/docs/jp/fundamentals/responses#gzip-deflate-and-brotli-compression) を使用してコンテンツサイズを削減することもできます。

<div class="script-header">
    <span>
        Controller/ImageController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RouteGet ( "/api/profile-picture" )]
public HttpResponse UploadDocument ( HttpRequest request ) {

    var profilePictureFilename = "profile-picture.jpg";

    return new HttpResponse () {
        Content = new StreamContent ( File.OpenRead ( profilePictureFilename ) ),
        Headers = new () {
            ContentType = "image/jpeg",
            ContentDisposition = $"inline; filename=\"{profilePictureFilename}\""
        }
    };
}
```

> [!IMPORTANT]
>
> このタイプのコンテンツでは、ストリームを `using` ブロックで囲むことは避けてください。コンテンツフローが終了すると、HTTP サーバーによってコンテンツが自動的に破棄されます。