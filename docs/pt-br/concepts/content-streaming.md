# Streaming de Conteúdo

O Sisk suporta a leitura e o envio de fluxos de conteúdo para e do cliente. Essa funcionalidade é útil para remover a sobrecarga de memória para serializar e deserializar conteúdo durante a vida útil de uma solicitação.

## Fluxo de Conteúdo de Solicitação

Pequenos conteúdos são carregados automaticamente na memória do buffer de conexão HTTP, carregando rapidamente esse conteúdo para [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body) e [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.RawBody). Para conteúdos maiores, o método [HttpRequest.GetRequestStream](/api/Sisk.Core.Http.HttpRequest.GetRequestStream) pode ser usado para obter o fluxo de leitura do conteúdo da solicitação.

É importante notar que o método [HttpRequest.GetMultipartFormContent](/api/Sisk.Core.Http.HttpRequest.GetMultipartFormContent) lê todo o conteúdo da solicitação na memória, portanto, pode não ser útil para ler conteúdos grandes.

Considere o seguinte exemplo:

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
        // solicitação não tem conteúdo
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
        Content = JsonContent.Create ( new { message = "Arquivo enviado com sucesso." } )
    };
}
```

No exemplo acima, o método `UploadDocument` lê o conteúdo da solicitação e salva o conteúdo em um arquivo. Nenhuma alocação adicional de memória é feita, exceto pelo buffer de leitura usado por `Stream.CopyToAsync`. O exemplo acima remove a pressão de alocação de memória para um arquivo muito grande, o que pode otimizar o desempenho da aplicação.

Uma boa prática é sempre usar um [CancellationToken](https://learn.microsoft.com/pt-br/dotnet/api/system.threading.cancellationtoken) em uma operação que possa ser demorada, como enviar arquivos, pois depende da velocidade da rede entre o cliente e o servidor.

A ajuste com um CancellationToken pode ser feito da seguinte forma:

<div class="script-header">
    <span>
        Controller/UploadDocument.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
// o token de cancelamento abaixo irá lançar uma exceção se o tempo limite de 30 segundos for atingido.
CancellationTokenSource copyCancellation = new CancellationTokenSource ( delay: TimeSpan.FromSeconds ( 30 ) );

try {
    using (var fs = File.Create ( outputFileName )) {
        await contentStream.CopyToAsync ( fs, copyCancellation.Token );
    }
}
catch (OperationCanceledException) {
    return new HttpResponse ( HttpStatusInformation.BadRequest ) {
        Content = JsonContent.Create ( new { Error = "O upload excedeu o tempo máximo de upload (30 segundos)." } )
    };
}
```

## Fluxo de Conteúdo de Resposta
Enviar conteúdo de resposta também é possível. Atualmente, existem duas maneiras de fazer isso: através do método [HttpRequest.GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream) e usando um conteúdo do tipo [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent?view=net-9.0).

Considere um cenário em que precisamos servir um arquivo de imagem. Para fazer isso, podemos usar o seguinte código:

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

    // método de exemplo para obter uma imagem de perfil
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

O método acima faz uma alocação de memória a cada vez que lê o conteúdo da imagem. Se a imagem for grande, isso pode causar um problema de desempenho e, em situações de pico, até mesmo uma sobrecarga de memória e travar o servidor. Nesses casos, o cache pode ser útil, mas não eliminará o problema, pois a memória ainda será reservada para esse arquivo. O cache aliviará a pressão de ter que alocar memória para cada solicitação, mas para arquivos grandes, não será suficiente.

Enviar a imagem por meio de um fluxo pode ser uma solução para o problema. Em vez de ler todo o conteúdo da imagem, um fluxo de leitura é criado no arquivo e copiado para o cliente usando um buffer pequeno.

#### Enviar através do método GetResponseStream

O método [HttpRequest.GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream) cria um objeto que permite enviar pedaços da resposta HTTP à medida que o fluxo de conteúdo é preparado. Esse método é mais manual, exigindo que você defina o status, cabeçalhos e tamanho do conteúdo antes de enviar o conteúdo.

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

    // nessa forma de envio, o status e o cabeçalho devem ser definidos
    // antes de enviar o conteúdo
    var requestStreamManager = request.GetResponseStream ();

    requestStreamManager.SetStatus ( System.Net.HttpStatusCode.OK );
    requestStreamManager.SetHeader ( HttpKnownHeaderNames.ContentType, "image/jpeg" );
    requestStreamManager.SetHeader ( HttpKnownHeaderNames.ContentDisposition, $"inline; filename={profilePictureFilename}" );

    using (var fs = File.OpenRead ( profilePictureFilename )) {

        // nessa forma de envio, também é necessário definir o tamanho do conteúdo
        // antes de enviá-lo.
        requestStreamManager.SetContentLength ( fs.Length );

        // se você não souber o tamanho do conteúdo, pode usar o chunked-encoding
        // para enviar o conteúdo
        requestStreamManager.SendChunked = true;

        // e então, escrever no fluxo de saída
        await fs.CopyToAsync ( requestStreamManager.ResponseStream );
    }
}
```

#### Enviar conteúdo através de um StreamContent

A classe [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent?view=net-9.0) permite enviar conteúdo de uma fonte de dados como um fluxo de bytes. Essa forma de envio é mais fácil, removendo os requisitos anteriores e até mesmo permitindo o uso de [codificação de compressão](/docs/fundamentos/respostas#gzip-deflate-and-brotli-compression) para reduzir o tamanho do conteúdo.

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
> Nesse tipo de conteúdo, não encapsule o fluxo em um bloco `using`. O conteúdo será automaticamente descartado pelo servidor HTTP quando o fluxo de conteúdo for finalizado, com ou sem erros.