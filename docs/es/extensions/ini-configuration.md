# Proveedor de configuración INI

Sisk tiene un método para obtener configuraciones de inicio diferentes a JSON. De hecho, cualquier canal que implemente [IConfigurationReader](/api/Sisk.Core.Http.Hosting.IConfigurationReader) se puede utilizar con [PortableConfigurationBuilder.WithConfigurationPipeline](/api/Sisk.Core.Http.Hosting.PortableConfigurationBuilder), leyendo la configuración del servidor desde cualquier tipo de archivo.

El paquete [Sisk.IniConfiguration](https://www.nuget.org/packages/Sisk.IniConfiguration/) proporciona un lector de archivos INI basado en flujo que no lanza excepciones por errores de sintaxis comunes y tiene una sintaxis de configuración simple. Este paquete se puede utilizar fuera del marco de Sisk, ofreciendo flexibilidad para proyectos que requieren un lector de documentos INI eficiente.

## Instalación

Para instalar el paquete, puede comenzar con:

```bash
$ dotnet add package Sisk.IniConfiguration
```

y utilizarlo en su código como se muestra en el ejemplo a continuación:

```cs
class Program
{
    static HttpServerHostContext Host = null!;

    static void Main(string[] args)
    {
        Host = HttpServer.CreateBuilder()
            .UsePortableConfiguration(config =>
            {
                config.WithConfigFile("app.ini", createIfDontExists: true);

                // agrega el IniConfigurationPipeline al lector de configuración
                config.WithConfigurationPipeline<IniConfigurationPipeline>();
            })
            .UseRouter(r =>
            {
                r.MapGet("/", SayHello);
            })
            .Build();

        Host.Start();
    }

    static HttpResponse SayHello(HttpRequest request)
    {
        string? name = Host.Parameters["name"] ?? "world";
        return new HttpResponse($"Hola, {name}!");
    }
}
```

El código anterior buscará un archivo app.ini en el directorio actual del proceso (CurrentDirectory). El archivo INI se ve así:

```ini
[Server]
# Se admiten varias direcciones de escucha
Listen = http://localhost:5552/
Listen = http://localhost:5553/
ThrowExceptions = false
AccessLogsStream = console

[Cors]
AllowMethods = GET, POST
AllowHeaders = Content-Type, Authorization
AllowOrigin = *

[Parameters]
Name = "Kanye West"
```

## Sabor y sintaxis INI

Implementación actual del sabor:

- Los nombres de propiedades y secciones son **insensibles a mayúsculas y minúsculas**.
- Los nombres de propiedades y valores son **recortados**.
- Los valores pueden estar entre comillas simples o dobles. Las comillas pueden tener saltos de línea dentro de ellas.
- Se admiten comentarios con `#` y `;`. También se admiten **comentarios al final**.
- Las propiedades pueden tener varios valores.

En detalle, la documentación para el "sabor" del analizador INI utilizado en Sisk está [disponible en GitHub](https://github.com/sisk-http/archive/blob/master/ext/ini-reader-syntax.md).

Utilizando el siguiente código INI como ejemplo:

```ini
One = 1
Value = este es un valor
Another value = "este valor
    tiene un salto de línea en él"

; el código a continuación tiene algunos colores
[some section]
Color = Rojo
Color = Azul
Color = Amarillo ; no use amarillo
```

Analícelo con:

```csharp
// analice el texto INI desde la cadena
IniDocument doc = IniDocument.FromString(iniText);

// obtenga un valor
string? one = doc.Global.GetOne("one");
string? anotherValue = doc.Global.GetOne("another value");

// obtenga varios valores
string[]? colors = doc.GetSection("some section")?.GetMany("color");
```

## Parámetros de configuración

| Sección y nombre | Admite varios valores | Descripción |
| ---------------- | --------------------- | ----------- |
| `Server.Listen` | Sí | Las direcciones/puertos de escucha del servidor. |
| `Server.Encoding` | No | La codificación predeterminada del servidor. |
| `Server.MaximumContentLength` | No | El tamaño máximo de contenido en bytes del servidor. |
| `Server.IncludeRequestIdHeader` | No | Especifica si el servidor HTTP debe enviar el encabezado X-Request-Id. |
| `Server.ThrowExceptions` | No |  Especifica si las excepciones no controladas deben lanzarse.  |
| `Server.AccessLogsStream` | No |  Especifica la secuencia de salida de registros de acceso. |
| `Server.ErrorsLogsStream` | No |  Especifica la secuencia de salida de registros de errores. |
| `Cors.AllowMethods` | No |  Especifica el valor del encabezado Allow-Methods de CORS. |
| `Cors.AllowHeaders` | No |  Especifica el valor del encabezado Allow-Headers de CORS. |
| `Cors.AllowOrigins` | No |  Especifica varios encabezados Allow-Origin, separados por comas. [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins) para más información. |
| `Cors.AllowOrigin` | No |  Especifica un encabezado Allow-Origin. |
| `Cors.ExposeHeaders` | No |  Especifica el valor del encabezado Expose-Headers de CORS. |
| `Cors.AllowCredentials` | No |  Especifica el valor del encabezado Allow-Credentials de CORS. |
| `Cors.MaxAge` | No |  Especifica el valor del encabezado Max-Age de CORS. |