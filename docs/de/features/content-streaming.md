# Streaming-Inhalt

Das Sisk unterstützt das Lesen und Senden von Inhalten als Streams zwischen Client und Server. Diese Funktion ist nützlich, um den Speicherüberkopft für die Serialisierung und Deserialisierung von Inhalten während der Lebensdauer einer Anfrage zu reduzieren.

## Anfrage-Inhalt-Stream

Kleine Inhalte werden automatisch in den HTTP-Verbindungspuffer-Speicher geladen, sodass dieser Inhalt schnell in [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body) und [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.RawBody) geladen wird. Für größere Inhalte kann die [HttpRequest.GetRequestStream](/api/Sisk.Core.Http.HttpRequest.GetRequestStream)-Methode verwendet werden, um den Anfrage-Inhalt-Stream zu erhalten.

Es ist wichtig zu beachten, dass die [HttpRequest.GetMultipartFormContent](/api/Sisk.Core.Http.HttpRequest.GetMultipartFormContent)-Methode den gesamten Anfrage-Inhalt in den Speicher lädt, sodass sie für das Lesen großer Inhalte nicht geeignet ist.

Betrachten Sie das folgende Beispiel:

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
        // Anfrage hat keinen Inhalt
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
        Content = JsonContent.Create ( new { message = "Datei erfolgreich gesendet." } )
    };
}
```

In dem obigen Beispiel liest die `UploadDocument`-Methode den Anfrage-Inhalt und speichert den Inhalt in einer Datei. Es wird keine zusätzliche Speicherzuweisung vorgenommen, außer für den Lese-Puffer, der von `Stream.CopyToAsync` verwendet wird. Das obige Beispiel reduziert den Druck der Speicherzuweisung für sehr große Dateien, was die Anwendungsleistung optimieren kann.

Eine gute Praxis ist es, immer ein [CancellationToken](https://learn.microsoft.com/pt-br/dotnet/api/system.threading.cancellationtoken) in einer Operation zu verwenden, die zeitaufwändig sein kann, wie z.B. das Senden von Dateien, da es von der Netzwerkgeschwindigkeit zwischen Client und Server abhängt.

Die Anpassung mit einem CancellationToken kann wie folgt vorgenommen werden:

<div class="script-header">
    <span>
        Controller/UploadDocument.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
// Der CancellationToken unten wird eine Ausnahme auslösen, wenn die 30-Sekunden-Frist erreicht ist.
CancellationTokenSource copyCancellation = new CancellationTokenSource ( delay: TimeSpan.FromSeconds ( 30 ) );

try {
    using (var fs = File.Create ( outputFileName )) {
        await contentStream.CopyToAsync ( fs, copyCancellation.Token );
    }
}
catch (OperationCanceledException) {
    return new HttpResponse ( HttpStatusInformation.BadRequest ) {
        Content = JsonContent.Create ( new { Error = "Der Upload hat die maximale Upload-Zeit (30 Sekunden) überschritten." } )
    };
}
```

## Antwort-Inhalt-Stream
Das Senden von Antwort-Inhalten ist auch möglich. Derzeit gibt es zwei Möglichkeiten, dies zu tun: über die [HttpRequest.GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream)-Methode und mit einem Inhalt vom Typ [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent?view=net-9.0).

Betrachten Sie ein Szenario, in dem wir ein Bild senden müssen. Dazu können wir den folgenden Code verwenden:

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

    // Beispiel-Methode, um ein Profilbild zu erhalten
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

Die obige Methode führt eine Speicherzuweisung durch, wenn sie den Bild-Inhalt liest. Wenn das Bild groß ist, kann dies ein Leistungsproblem verursachen und in Spitzenzeiten sogar einen Speicherüberlauf und einen Server-Absturz verursachen. In diesen Situationen kann Caching nützlich sein, aber es wird das Problem nicht eliminieren, da Speicher immer noch für diese Datei reserviert wird. Caching kann den Druck der Speicherzuweisung für jede Anfrage lindern, aber für große Dateien wird es nicht ausreichen.

Das Senden des Bildes über einen Stream kann eine Lösung für das Problem sein. Anstatt den gesamten Bild-Inhalt zu lesen, wird ein Lese-Stream auf der Datei erstellt und mit einem kleinen Puffer an den Client kopiert.

#### Senden über die GetResponseStream-Methode

Die [HttpRequest.GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream)-Methode erstellt ein Objekt, das das Senden von Teilen der HTTP-Antwort ermöglicht, während der Inhalt-Fluss vorbereitet wird. Diese Methode ist manuell und erfordert, dass Sie den Status, die Header und die Inhaltsgröße vor dem Senden des Inhalts definieren.

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

    // in dieser Form des Sendens müssen der Status und der Header definiert werden
    // bevor der Inhalt gesendet wird
    var requestStreamManager = request.GetResponseStream ();

    requestStreamManager.SetStatus ( System.Net.HttpStatusCode.OK );
    requestStreamManager.SetHeader ( HttpKnownHeaderNames.ContentType, "image/jpeg" );
    requestStreamManager.SetHeader ( HttpKnownHeaderNames.ContentDisposition, $"inline; filename={profilePictureFilename}" );

    using (var fs = File.OpenRead ( profilePictureFilename )) {

        // in dieser Form des Sendens muss auch die Inhaltsgröße definiert werden
        // bevor sie gesendet wird.
        requestStreamManager.SetContentLength ( fs.Length );

        // wenn Sie die Inhaltsgröße nicht kennen, können Sie chunked-encoding
        // verwenden, um den Inhalt zu senden
        requestStreamManager.SendChunked = true;

        // und dann schreiben Sie in den Ausgabe-Stream
        await fs.CopyToAsync ( requestStreamManager.ResponseStream );
    }
}
```

#### Senden von Inhalten über einen StreamContent

Die [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent?view=net-9.0)-Klasse ermöglicht das Senden von Inhalten aus einer Datenquelle als Byte-Stream. Diese Form des Sendens ist einfacher und entfernt die vorherigen Anforderungen und ermöglicht sogar die Verwendung von [Komprimierungs-Codierung](/docs/fundamentals/responses#gzip-deflate-and-brotli-compression), um die Inhaltsgröße zu reduzieren.

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

> [!WICHTIG]
>
> Bei dieser Art von Inhalten sollten Sie den Stream nicht in einem `using`-Block einwickeln. Der Inhalt wird automatisch vom HTTP-Server verworfen, wenn der Inhalts-Fluss abgeschlossen ist, mit oder ohne Fehler.