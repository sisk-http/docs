---
title: "Servidor de Archivos"
linkTitle: "Servidor de archivos"
weight: 80
aliases:
  - "/docs/es/features/file-server.html"
sourceHash: "ecb5bc7dc9bb5964"
---

Sisk proporciona el espacio de nombres `Sisk.Http.FileSystem`, que contiene herramientas para servir archivos estáticos, listado de directorios y conversión de archivos. Esta característica le permite servir archivos desde un directorio local, con soporte para solicitudes de rango (transmisión de audio/video) y procesamiento personalizado de archivos.

## Servir archivos estáticos

La forma más sencilla de servir archivos estáticos es [Router.MapFileSystem](/api/Sisk.Core.Routing.Router.MapFileSystem). Este método asigna un prefijo de URL a un directorio en el disco.

```cs
using Sisk.Core.Http;
using Sisk.Core.Http.FileSystem;

// maps the root of the server to the current directory
mainRouter.MapFileSystem("/", Directory.GetCurrentDirectory());

// maps /assets to the "public/assets" folder
mainRouter.MapFileSystem(
    "/assets",
    Path.Combine(Directory.GetCurrentDirectory(), "public", "assets"));
```

Cuando una solicitud coincide con el prefijo de ruta, el `HttpFileServerHandler` buscará un archivo en el directorio especificado. Si lo encuentra, servirá el archivo; de lo contrario, devolverá una respuesta 404 (o 403 si se niega el acceso).

`HttpFileServer.CreateServingRoute` sigue estando disponible cuando necesita crear un objeto `Route` explícitamente, pero `MapFileSystem` es la opción más directa para el código de la aplicación.

## HttpFileServerHandler

Para tener más control sobre cómo se sirven los archivos, puede instanciar y configurar `HttpFileServerHandler` manualmente.

```cs
var fileHandler = new HttpFileServerHandler("/var/www/html");

// enable directory listing (disabled by default)
fileHandler.AllowDirectoryListing = true;

// set a custom route prefix (this will be trimmed from the request path)
fileHandler.RoutePrefix = "/public";

// register the handler under /public
mainRouter.MapFileSystem("/public", fileHandler);
```

### Configuración

| Property | Description |
|---|---|
| `RootDirectoryPath` | La ruta absoluta o relativa al directorio raíz desde el cual se sirven los archivos. |
| `RoutePrefix` | El prefijo de ruta que se recortará del camino de la solicitud al resolver archivos. El valor predeterminado es `/`. |
| `AllowDirectoryListing` | Si se establece en `true`, habilita el listado de directorios cuando se solicita un directorio y no se encuentra un archivo índice. El valor predeterminado es `false`. |
| `FileConverters` | Una lista de `HttpFileServerFileConverter` utilizada para transformar archivos antes de servirlos. |

## Listado de Directorios

Cuando `AllowDirectoryListing` está habilitado y el usuario solicita una ruta de directorio, Sisk generará una página HTML que enumera el contenido de ese directorio.

El listado de directorios incluye:
- Navegación al directorio padre (`..`).
- Lista de subdirectorios.
- Lista de archivos con tamaño y fecha de última modificación.

## Convertidores de Archivos

Los convertidores de archivos le permiten interceptar tipos de archivo específicos y manejarlos de manera diferente. Por ejemplo, podría querer transcodificar una imagen, comprimir un archivo al vuelo, o servir un archivo usando contenido parcial (solicitudes de rango).

Sisk incluye dos convertidores incorporados para transmisión de medios:
- `HttpFileAudioConverter`: Maneja `.mp3`, `.ogg`, `.wav`, `.flac`, `.ogv`.
- `HttpFileVideoConverter`: Maneja `.webm`, `.avi`, `.mkv`, `.mpg`, `.mpeg`, `.wmv`, `.mov`, `.mp4`.

Estos convertidores habilitan el soporte para **solicitudes de rango HTTP**, permitiendo a los clientes buscar dentro de archivos de audio y video.

### Crear un convertidor personalizado

Para crear un convertidor de archivo personalizado, herede de `HttpFileServerFileConverter` e implemente `CanConvert` y `Convert`.

```cs
using Sisk.Core.Http;
using Sisk.Core.Http.FileSystem;

public class MyTextConverter : HttpFileServerFileConverter
{
    public override bool CanConvert(FileInfo file)
    {
        // apply only to .txt files
        return file.Extension.Equals(".txt", StringComparison.OrdinalIgnoreCase);
    }

    public override HttpResponse Convert(FileInfo file, HttpRequest request)
    {
        string content = File.ReadAllText(file.FullName);
        
        // uppercase all text content
        return new HttpResponse(200)
        {
            Content = new StringContent(content.ToUpper())
        };
    }
}
```

Luego, agréguelo a su manejador:

```cs
var handler = new HttpFileServerHandler("./files");
handler.FileConverters.Add(new MyTextConverter());
```
