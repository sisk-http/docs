# Потоковая передача контента

Sisk поддерживает чтение и отправку потоков контента клиенту и от клиента. Эта функция полезна для удаления нагрузки на память при сериализации и десериализации контента во время жизни запроса.

## Поток контента запроса

Маленькие содержимые автоматически загружаются в буфер памяти HTTP-соединения, быстро загружая это содержимое в [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body) и [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.RawBody). Для более крупных содержимых можно использовать метод [HttpRequest.GetRequestStream](/api/Sisk.Core.Http.HttpRequest.GetRequestStream), чтобы получить поток чтения контента запроса.

Стоит отметить, что метод [HttpRequest.GetMultipartFormContent](/api/Sisk.Core.Http.HttpRequest.GetMultipartFormContent) читает весь контент запроса в память, поэтому он может не быть полезен для чтения крупных содержимых.

Рассмотрим следующий пример:

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
        // запрос не содержит контента
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
        Content = JsonContent.Create ( new { message = "Файл отправлен успешно." } )
    };
}
```

В примере выше метод `UploadDocument` читает контент запроса и сохраняет контент в файл. Не производится дополнительная аллокация памяти, кроме буфера чтения, используемого `Stream.CopyToAsync`. Пример выше удаляет нагрузку на аллокацию памяти для очень крупного файла, что может оптимизировать производительность приложения.

Хорошей практикой является всегда использовать [CancellationToken](https://learn.microsoft.com/pt-br/dotnet/api/system.threading.cancellationtoken) в операции, которая может занять много времени, такой как отправка файлов, поскольку она зависит от скорости сети между клиентом и сервером.

Настройка с помощью `CancellationToken` может быть выполнена следующим образом:

<div class="script-header">
    <span>
        Controller/UploadDocument.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
// токен отмены ниже бросит исключение, если будет достигнута 30-секундная задержка.
CancellationTokenSource copyCancellation = new CancellationTokenSource ( delay: TimeSpan.FromSeconds ( 30 ) );

try {
    using (var fs = File.Create ( outputFileName )) {
        await contentStream.CopyToAsync ( fs, copyCancellation.Token );
    }
}
catch (OperationCanceledException) {
    return new HttpResponse ( HttpStatusInformation.BadRequest ) {
        Content = JsonContent.Create ( new { Error = "Загрузка превысила максимальное время загрузки (30 секунд)." } )
    };
}
```

## Поток контента ответа
Отправка контента ответа также возможна. В настоящее время существует два способа сделать это: через метод [HttpRequest.GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream) и используя контент типа [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent?view=net-9.0).

Рассмотрим сценарий, в котором нам нужно предоставить файл изображения. Для этого можно использовать следующий код:

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

    // пример метода для получения изображения профиля
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

Метод выше производит аллокацию памяти каждый раз, когда он читает контент изображения. Если изображение большое, это может вызвать проблему производительности, и в пиковых ситуациях даже привести к переполнению памяти и краху сервера. В таких ситуациях кэширование может быть полезным, но оно не устранит проблему, поскольку память все равно будет зарезервирована для этого файла. Кэширование облегчит нагрузку на аллокацию памяти для каждого запроса, но для крупных файлов оно не будет достаточно.

Отправка изображения через поток может быть решением проблемы. Вместо чтения всего контента изображения создается поток чтения файла и копируется клиенту с помощью небольшого буфера.

#### Отправка через метод GetResponseStream

Метод [HttpRequest.GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream) создает объект, который позволяет отправлять фрагменты HTTP-ответа по мере подготовки потока контента. Этот метод более ручной, требующий определения статуса, заголовков и размера контента перед отправкой контента.

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

    // в этой форме отправки необходимо определить статус и заголовки
    // перед отправкой контента
    var requestStreamManager = request.GetResponseStream ();

    requestStreamManager.SetStatus ( System.Net.HttpStatusCode.OK );
    requestStreamManager.SetHeader ( HttpKnownHeaderNames.ContentType, "image/jpeg" );
    requestStreamManager.SetHeader ( HttpKnownHeaderNames.ContentDisposition, $"inline; filename={profilePictureFilename}" );

    using (var fs = File.OpenRead ( profilePictureFilename )) {

        // в этой форме отправки также необходимо определить размер контента
        // перед отправкой его.
        requestStreamManager.SetContentLength ( fs.Length );

        // если вы не знаете размер контента, можно использовать chunked-encoding
        // для отправки контента
        requestStreamManager.SendChunked = true;

        // и затем записать в поток вывода
        await fs.CopyToAsync ( requestStreamManager.ResponseStream );
    }
}
```

#### Отправка контента через StreamContent

Класс [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent?view=net-9.0) позволяет отправлять контент из источника данных в виде потока байтов. Эта форма отправки проще, удаляя предыдущие требования, и даже позволяет использовать [кодирование сжатия](/docs/ru/fundamentals/responses#gzip-deflate-and-brotli-compression), чтобы уменьшить размер контента.

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
> В этом типе контента не заключайте поток в блок `using`. Контент будет автоматически удален HTTP-сервером, когда поток контента будет завершен, с ошибками или без них.