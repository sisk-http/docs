# Proveedores de Servicios

Los Proveedores de Servicios son una forma de portar su aplicación Sisk a diferentes entornos con un archivo de configuración portátil. Esta característica permite cambiar el puerto del servidor, parámetros y otras opciones sin tener que modificar el código de la aplicación para cada entorno. Este módulo depende de la sintaxis de construcción de Sisk y se puede configurar a través del método UsePortableConfiguration.

Un proveedor de configuración se implementa con IConfigurationProvider, que proporciona un lector de configuración y puede recibir cualquier implementación. Por defecto, Sisk proporciona un lector de configuración JSON, pero también hay un paquete para archivos INI. También puede crear su propio proveedor de configuración y registrararlo con:

```csharp
using var app = HttpServer.CreateBuilder()
    .UsePortableConfiguration(config =>
    {
        config.WithConfigReader<MyConfigurationReader>();
    })
    .Build();
```

Como se mencionó anteriormente, el proveedor predeterminado es un archivo JSON. Por defecto, el nombre del archivo que se busca es service-config.json, y se busca en el directorio actual del proceso en ejecución, no en el directorio del ejecutable.

Puede elegir cambiar el nombre del archivo, así como dónde Sisk debe buscar el archivo de configuración, con:

```csharp
using Sisk.Core.Http;
using Sisk.Core.Http.Hosting;

using var app = HttpServer.CreateBuilder()
    .UsePortableConfiguration(config =>
    {
        config.WithConfigFile("config.toml",
            createIfDontExists: true,
            lookupDirectories:
                ConfigurationFileLookupDirectory.CurrentDirectory |
                ConfigurationFileLookupDirectory.AppDirectory);
    })
    .Build();
```

El código anterior buscará el archivo config.toml en el directorio actual del proceso en ejecución. Si no se encuentra, luego buscará en el directorio donde se encuentra el ejecutable. Si el archivo no existe, el parámetro createIfDontExists se honra, creando el archivo, sin contenido, en la última ruta probada (basada en lookupDirectories), y se lanza un error en la consola, impidiendo que la aplicación se inicialice.

> [!TIP]
> 
> Puede ver el código fuente del lector de configuración INI y el lector de configuración JSON para entender cómo se implementa un IConfigurationProvider.

## Lectura de configuraciones desde un archivo JSON

Por defecto, Sisk proporciona un proveedor de configuración que lee configuraciones desde un archivo JSON. Este archivo sigue una estructura fija y está compuesto por los siguientes parámetros:

```json
{
    "Server": {
        "DefaultEncoding": "UTF-8",
        "ThrowExceptions": true,
        "IncludeRequestIdHeader": true
    },
    "ListeningHost": {
        "Label": "Mi aplicación Sisk",
        "Ports": [
            "http://localhost:80/",
            "https://localhost:443/",  // Los archivos de configuración también admiten comentarios
        ],
        "CrossOriginResourceSharingPolicy": {
            "AllowOrigin": "*",
            "AllowOrigins": [ "*" ],   // Nuevo en 0.14
            "AllowMethods": [ "*" ],
            "AllowHeaders": [ "*" ],
            "MaxAge": 3600
        },
        "Parameters": {
            "MySqlConnection": "server=localhost;user=root;"
        }
    }
}
```

Los parámetros creados a partir de un archivo de configuración se pueden acceder en el constructor del servidor:

```csharp
using var app = HttpServer.CreateBuilder()
    .UsePortableConfiguration(config =>
    {
        config.WithParameters(paramCollection =>
        {
            string databaseConnection = paramCollection.GetValueOrThrow("MySqlConnection");
        });
    })
    .Build();
```

Cada lector de configuración proporciona una forma de leer los parámetros de inicialización del servidor. Algunas propiedades se indican que deben estar en el entorno del proceso en lugar de estar definidas en el archivo de configuración, como datos de API sensibles, claves de API, etc.

## Estructura del archivo de configuración

El archivo de configuración JSON está compuesto por las siguientes propiedades:

<table>
    <thead>
        <tr>
            <th>Propiedad</th>
            <th>Obligatorio</th>
            <th>Descripción</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Server</td>
            <td>Requerido</td>
            <td>Representa el servidor en sí con sus configuraciones.</td>
        </tr>
        <tr>
            <td>Server.AccessLogsStream</td>
            <td>Opcional</td>
            <td>Predeterminado en <code>console</code>. Especifica la secuencia de salida de los registros de acceso. Puede ser un nombre de archivo,
                <code>null</code> o <code>console</code>.
            </td>
        </tr>
        <tr>
            <td>Server.ErrorsLogsStream</td>
            <td>Opcional</td>
            <td>Predeterminado en <code>null</code>. Especifica la secuencia de salida de los registros de errores. Puede ser un nombre de archivo,
                <code>null</code> o <code>console</code>.
            </td>
        </tr>
        <tr>
            <td>Server.MaximumContentLength</td>
            <td>Opcional</td>
            <tr>
            <td>Server.MaximumContentLength</td>
            <td>Opcional</td>
            <td>Predeterminado en <code>0</code>. Especifica la longitud máxima de contenido en bytes. Cero significa infinito.</td>
        </tr>
        <tr>
            <td>Server.IncludeRequestIdHeader</td>
            <td>Opcional</td>
            <td>Predeterminado en <code>false</code>. Especifica si el servidor HTTP debe enviar el encabezado <code>X-Request-Id</code>.</td>
        </tr>
        <tr>
            <td>Server.ThrowExceptions</td>
            <td>Opcional</td>
            <td>Predeterminado en <code>true</code>. Especifica si las excepciones no controladas deben lanzarse. Establezca en <code>false</code> cuando esté en producción y <code>true</code> cuando esté depurando.</td>
        </tr>
        <tr>
            <td>ListeningHost</td>
            <td>Requerido</td>
            <td>Representa el host de escucha del servidor.</td>
        </tr>
        <tr>
            <td>ListeningHost.Label</td>
            <td>Opcional</td>
            <td>Representa la etiqueta de la aplicación.</td>
        </tr>
        <tr>
            <td>ListeningHost.Ports</td>
            <td>Requerido</td>
            <td>Representa una matriz de cadenas, que coincide con la sintaxis <a href="/api/Sisk.Core.Http.ListeningPort">ListeningPort</a>.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy</td>
            <td>Opcional</td>
            <td>Configura los encabezados CORS para la aplicación.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowCredentials</td>
            <td>Opcional</td>
            <td>Predeterminado en <code>false</code>. Especifica el encabezado <code>Allow-Credentials</code>.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.ExposeHeaders</td>
            <td>Opcional</td>
            <td>Predeterminado en <code>null</code>. Esta propiedad espera una matriz de cadenas. Especifica el encabezado <code>Expose-Headers</code>.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowOrigin</td>
            <td>Opcional</td>
            <td>Predeterminado en <code>null</code>. Esta propiedad espera una cadena. Especifica el encabezado <code>Allow-Origin</code>.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowOrigins</td>
            <td>Opcional</td>
            <td>Predeterminado en <code>null</code>. Esta propiedad espera una matriz de cadenas. Especifica múltiples encabezados <code>Allow-Origin</code>. Consulte <a href="/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins">AllowOrigins</a> para obtener más información.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowMethods</td>
            <td>Opcional</td>
            <td>Predeterminado en <code>null</code>. Esta propiedad espera una matriz de cadenas. Especifica el encabezado <code>Allow-Methods</code>.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowHeaders</td>
            <td>Opcional</td>
            <td>Predeterminado en <code>null</code>. Esta propiedad espera una matriz de cadenas. Especifica el encabezado <code>Allow-Headers</code>.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.MaxAge</td>
            <td>Opcional</td>
            <td>Predeterminado en <code>null</code>. Esta propiedad espera un entero. Especifica el encabezado <code>Max-Age</code> en segundos.</td>
        </tr>
        <tr>
            <td>ListeningHost.Parameters</td>
            <td>Opcional</td>
            <td>Especifica las propiedades proporcionadas al método de configuración de la aplicación.</td>
        </tr>
    </tbody>
</table>