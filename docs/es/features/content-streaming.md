# Transmisión de contenido

El Sisk admite la lectura y el envío de flujos de contenido desde y hacia el cliente. Esta característica es útil para eliminar la sobrecarga de memoria para serializar y deserializar contenido durante la vida útil de una solicitud.

## Flujo de contenido de la solicitud

Los contenidos pequeños se cargan automáticamente en la memoria del búfer de conexión HTTP, cargando rápidamente este contenido en [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body) y [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.RawBody). Para contenidos más grandes, se puede utilizar el método [HttpRequest.GetRequestStream](/api/Sisk.Core.Http.HttpRequest.GetRequestStream) para obtener el flujo de lectura de contenido de la solicitud.

Es importante destacar que el método [HttpRequest.GetMultipartFormContent](/api/Sisk.Core.Http.HttpRequest.GetMultipartFormContent) lee todo el contenido de la solicitud en memoria, por lo que puede no ser útil para leer contenidos grandes.

Consideremos el siguiente ejemplo:

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
        // la solicitud no tiene contenido
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
        Content = JsonContent.Create ( new { message = "Archivo enviado con éxito." } )
    };
}
```

En el ejemplo anterior, el método `UploadDocument` lee el contenido de la solicitud y lo guarda en un archivo. No se realiza ninguna asignación de memoria adicional excepto por el búfer de lectura utilizado por `Stream.CopyToAsync`. El ejemplo anterior elimina la presión de asignación de memoria para un archivo muy grande, lo que puede optimizar el rendimiento de la aplicación.

Es una buena práctica utilizar siempre un [CancellationToken](https://learn.microsoft.com/pt-br/dotnet/api/system.threading.cancellationtoken) en una operación que pueda ser larga, como el envío de archivos, ya que depende de la velocidad de la red entre el cliente y el servidor.

El ajuste con un CancellationToken se puede realizar de la siguiente manera:

<div class="script-header">
    <span>
        Controller/UploadDocument.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
// el token de cancelación a continuación lanzará una excepción si se alcanza el tiempo de espera de 30 segundos.
CancellationTokenSource copyCancellation = new CancellationTokenSource ( delay: TimeSpan.FromSeconds ( 30 ) );

try {
    using (var fs = File.Create ( outputFileName )) {
        await contentStream.CopyToAsync ( fs, copyCancellation.Token );
    }
}
catch (OperationCanceledException) {
    return new HttpResponse ( HttpStatusInformation.BadRequest ) {
        Content = JsonContent.Create ( new { Error = "La carga superó el tiempo de carga máximo (30 segundos)." } )
    };
}
```

## Flujo de contenido de la respuesta
Enviar contenido de respuesta también es posible. Actualmente, hay dos formas de hacerlo: a través del método [HttpRequest.GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream) y utilizando un contenido de tipo [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent?view=net-9.0).

Consideremos un escenario en el que necesitamos servir un archivo de imagen. Para hacer esto, podemos utilizar el siguiente código:

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

    // método de ejemplo para obtener una imagen de perfil
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

El método anterior realiza una asignación de memoria cada vez que se lee el contenido de la imagen. Si la imagen es grande, esto puede causar un problema de rendimiento, y en situaciones de pico, incluso una sobrecarga de memoria y hacer que el servidor se bloquee. En estas situaciones, la caché puede ser útil, pero no eliminará el problema, ya que la memoria seguirá reservada para ese archivo. La caché aliviará la presión de tener que asignar memoria para cada solicitud, pero para archivos grandes, no será suficiente.

Enviar la imagen a través de un flujo puede ser una solución al problema. En lugar de leer todo el contenido de la imagen, se crea un flujo de lectura en el archivo y se copia al cliente utilizando un búfer pequeño.

#### Enviar a través del método GetResponseStream

El método [HttpRequest.GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream) crea un objeto que permite enviar trozos de la respuesta HTTP a medida que se prepara el flujo de contenido. Este método es más manual, requiriendo que se defina el estado, los encabezados y el tamaño del contenido antes de enviar el contenido.

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

    // en esta forma de envío, el estado y el encabezado deben definirse
    // antes de enviar el contenido
    var requestStreamManager = request.GetResponseStream ();

    requestStreamManager.SetStatus ( System.Net.HttpStatusCode.OK );
    requestStreamManager.SetHeader ( HttpKnownHeaderNames.ContentType, "image/jpeg" );
    requestStreamManager.SetHeader ( HttpKnownHeaderNames.ContentDisposition, $"inline; filename={profilePictureFilename}" );

    using (var fs = File.OpenRead ( profilePictureFilename )) {

        // en esta forma de envío, también es necesario definir el tamaño del contenido
        // antes de enviarlo.
        requestStreamManager.SetContentLength ( fs.Length );

        // si no se conoce el tamaño del contenido, se puede utilizar codificación por trozos
        // para enviar el contenido
        requestStreamManager.SendChunked = true;

        // y luego, escribir en el flujo de salida
        await fs.CopyToAsync ( requestStreamManager.ResponseStream );
    }
}
```

#### Enviar contenido a través de un StreamContent

La clase [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent?view=net-9.0) permite enviar contenido desde una fuente de datos como un flujo de bytes. Esta forma de envío es más fácil, eliminando los requisitos anteriores, e incluso permitiendo el uso de [codificación de compresión](/docs/es/fundamentals/responses#gzip-deflate-and-brotli-compression) para reducir el tamaño del contenido.

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
> En este tipo de contenido, no encapsule el flujo en un bloque `using`. El contenido se descartará automáticamente por el servidor HTTP cuando se finalice el flujo de contenido, con o sin errores.