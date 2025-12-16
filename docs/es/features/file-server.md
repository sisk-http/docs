# Servidor de archivos

Sisk proporciona el espacio de nombres `Sisk.Http.FileSystem`, que contiene herramientas para servir archivos estáticos, listado de directorios y conversión de archivos. Esta característica le permite servir archivos desde un directorio local, con soporte para solicitudes de rango (transmisión de audio y video) y procesamiento de archivos personalizado.

## Servir archivos estáticos

La forma más sencilla de servir archivos estáticos es utilizando `HttpFileServer.CreateServingRoute`. Este método crea una ruta que asigna un prefijo de URL a un directorio en el disco.

```cs
using Sisk.Core.Http;
using Sisk.Core.Http.FileSystem;

// asigna la raíz del servidor al directorio actual
mainRouter.SetRoute(HttpFileServer.CreateServingRoute("/", Directory.GetCurrentDirectory()));

// asigna /assets al folder "public/assets"
mainRouter.SetRoute(HttpFileServer.CreateServingRoute("/assets", Path.Combine(Directory.GetCurrentDirectory(), "public", "assets")));
```

Cuando una solicitud coincide con el prefijo de la ruta, el `HttpFileServerHandler` buscará un archivo en el directorio especificado. Si se encuentra, servirá el archivo; de lo contrario, devolverá una respuesta 404 (o 403 si se deniega el acceso).

## HttpFileServerHandler

Para tener más control sobre cómo se sirven los archivos, puede instanciar y configurar `HttpFileServerHandler` manualmente.

```cs
var fileHandler = new HttpFileServerHandler("/var/www/html");

// habilita el listado de directorios (desactivado por defecto)
fileHandler.AllowDirectoryListing = true;

// establece un prefijo de ruta personalizado (esto se recortará de la ruta de la solicitud)
fileHandler.RoutePrefix = "/public";

// registra la acción del controlador
mainRouter.SetRoute(RouteMethod.Get, "/public/.*", fileHandler.HandleRequest);
```

### Configuración

| Propiedad | Descripción |
|---|---|
| `RootDirectoryPath` | La ruta absoluta o relativa al directorio raíz desde el que se sirven los archivos. |
| `RoutePrefix` | El prefijo de ruta que se recortará de la ruta de la solicitud al resolver archivos. Por defecto es `/`. |
| `AllowDirectoryListing` | Si se establece en `true`, habilita el listado de directorios cuando se solicita un directorio y no se encuentra un archivo índice. Por defecto es `false`. |
| `FileConverters` | Una lista de `HttpFileServerFileConverter` utilizados para transformar archivos antes de servirlos. |

## Listado de directorios

Cuando `AllowDirectoryListing` está habilitado, y el usuario solicita una ruta de directorio, Sisk generará una página HTML que lista el contenido de ese directorio.

El listado de directorios incluye:
- Navegación al directorio padre (`..`).
- Lista de subdirectorios.
- Lista de archivos con tamaño y fecha de última modificación.

## Convertidores de archivos

Los convertidores de archivos le permiten interceptar tipos de archivos específicos y manejarlos de manera diferente. Por ejemplo, puede que desee transcodificar una imagen, comprimir un archivo en tiempo real o servir un archivo utilizando contenido parcial (solicitudes de rango).

Sisk incluye dos convertidores integrados para transmisión de medios:
- `HttpFileAudioConverter`: Maneja `.mp3`, `.ogg`, `.wav`, `.flac`, `.ogv`.
- `HttpFileVideoConverter`: Maneja `.webm`, `.avi`, `.mkv`, `.mpg`, `.mpeg`, `.wmv`, `.mov`, `.mp4`.

Estos convertidores habilitan el soporte para **solicitudes de rango HTTP**, lo que permite a los clientes buscar a través de archivos de audio y video.

### Crear un convertidor personalizado

Para crear un convertidor de archivo personalizado, herede de `HttpFileServerFileConverter` e implemente `CanConvert` y `Convert`.

```cs
using Sisk.Core.Http;
using Sisk.Core.Http.FileSystem;

public class MyTextConverter : HttpFileServerFileConverter
{
    public override bool CanConvert(FileInfo file)
    {
        // aplica solo a archivos .txt
        return file.Extension.Equals(".txt", StringComparison.OrdinalIgnoreCase);
    }

    public override HttpResponse Convert(FileInfo file, HttpRequest request)
    {
        string content = File.ReadAllText(file.FullName);
        
        // convierte todo el contenido de texto a mayúsculas
        return new HttpResponse(200)
        {
            Content = new StringContent(content.ToUpper())
        };
    }
}
```

Luego, agréguelo a su controlador:

```cs
var handler = new HttpFileServerHandler("./files");
handler.FileConverters.Add(new MyTextConverter());
```