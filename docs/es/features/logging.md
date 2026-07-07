# Registro

Puedes configurar Sisk para que escriba automáticamente registros de acceso y de errores. Es posible definir la rotación de logs, extensiones y frecuencia.

La clase [LogStream](/api/Sisk.Core.Http.LogStream) proporciona una forma asíncrona de escribir logs y mantenerlos en una cola de escritura esperable. La clase `LogStream` implementa `IAsyncDisposable`, asegurando que todos los logs pendientes se escriban antes de que el flujo se cierre.

En este artículo te mostraremos cómo configurar el registro para tu aplicación.

## Registros de acceso basados en archivos

Los logs a archivos abren el archivo, escriben la línea de texto y luego cierran el archivo por cada línea escrita. Este procedimiento se adoptó para mantener la capacidad de respuesta de escritura en los logs.

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
class Program
{
    static async Task Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseConfiguration(config => {
                config.AccessLogsStream = new LogStream("logs/access.log");
            })
            .Build();
        
        ...
        
        await app.StartAsync();
    }
}
```

El código anterior escribirá todas las solicitudes entrantes en el archivo `logs/access.log`. Ten en cuenta que el archivo se crea automáticamente si no existe, sin embargo la carpeta anterior no. No es necesario crear el directorio `logs/` ya que la clase LogStream lo crea automáticamente.

## Registro basado en flujos

Puedes escribir archivos de registro en instancias de objetos `TextWriter`, como `Console.Out`, pasando un objeto `TextWriter` en el constructor:

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
using var app = HttpServer.CreateBuilder()
    .UseConfiguration(config => {
        config.AccessLogsStream = new LogStream(Console.Out);
    })
    .Build();
```

Por cada mensaje escrito en el registro basado en flujo, se llama al método `TextWriter.Flush()`.

## Formato del registro de acceso

Puedes personalizar el formato del registro de acceso mediante variables predefinidas. Considera la siguiente línea:

```cs
config.AccessLogsFormat = "%dd/%dmm/%dy %tH:%ti:%ts %tz %ls %ri %rs://%ra%rz%rq [%sc %sd] %lin -> %lou in %lmsms [%{user-agent}]";
```

Escribirá un mensaje como:

    29/mar./2023 15:21:47 -0300 Executed ::1 http://localhost:5555/ [200 OK] 689B -> 707B in 84ms [Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/111.0.0.0 Safari/537.36]

Puedes formatear tu archivo de registro con el formato descrito en la tabla:

| Valor | Qué representa | Ejemplo |
|-------|----------------|---------|
| %dd   | Día del mes (formateado con dos dígitos) | 05 |
| %dmmm | Nombre completo del mes | July |
| %dmm  | Nombre abreviado del mes (tres letras) | Jul |
| %dm   | Número del mes (formateado con dos dígitos) | 07 |
| %dy   | Año (formateado con cuatro dígitos) | 2023 |
| %th   | Hora en formato de 12 horas | 03 |
| %tH   | Hora en formato de 24 horas (HH) | 15 |
| %ti   | Minutos (formateado con dos dígitos) | 30 |
| %ts   | Segundos (formateado con dos dígitos) | 45 |
| %tm   | Milisegundos (formateado con tres dígitos) | 123 |
| %tz   | Desplazamiento de zona horaria (horas totales en UTC) | +03:00 |
| %ri   | Dirección IP remota del cliente | 192.168.1.100 |
| %rm   | Método HTTP (mayúsculas) | GET |
| %rs   | Esquema URI (http/https) | https |
| %ra   | Autoridad URI (dominio) | example.com |
| %rh   | Host de la solicitud | www.example.com |
| %rp   | Puerto de la solicitud | 443 |
| %rz   | Ruta de la solicitud | /path/to/resource |
| %rq   | Cadena de consulta | ?key=value&another=123 |
| %sc   | Código de estado de la respuesta HTTP | 200 |
| %sd   | Descripción del estado de la respuesta HTTP | OK |
| %lin  | Tamaño legible por humanos de la solicitud | 1.2 KB |
| %linr | Tamaño bruto de la solicitud (bytes) | 1234 |
| %lou  | Tamaño legible por humanos de la respuesta | 2.5 KB |
| %lour | Tamaño bruto de la respuesta (bytes) | 2560 |
| %lms  | Tiempo transcurrido en milisegundos | 120 |
| %ls   | Estado de ejecución | Executed |
| %{header-name} | Representa el encabezado `header-name` de la solicitud. | `Mozilla/5.0 (platform; rv:gecko [...]` |
| %{:header-name} | Representa el encabezado `header-name` de la respuesta. | `application/json` |

También puedes usar `HttpServerConfiguration.DefaultAccessLogFormat` para emplear el formato de registro de acceso predeterminado.

## Rotación de logs

Puedes configurar el servidor HTTP para rotar los archivos de registro a un archivo comprimido .gz cuando alcancen un cierto tamaño. El tamaño se verifica periódicamente según el umbral que definas.

```cs
LogStream errorLog = new LogStream("logs/error.log")
    .ConfigureRotatingPolicy(
        maximumSize: 64 * SizeHelper.UnitMb,
        dueTime: TimeSpan.FromHours(6));
```

El código anterior comprobará cada seis horas si el archivo del `LogStream` ha alcanzado su límite de 64 MB. De ser así, el archivo se comprime a .gz y luego se limpia `access.log`.

Durante este proceso, la escritura en el archivo está bloqueada hasta que el archivo se comprime y se limpia. Todas las líneas que intenten escribirse en este período quedarán en una cola esperando el final de la compresión.

Esta función solo funciona con `LogStream` basados en archivos.

## Registro de errores

Cuando un servidor no lanza errores al depurador, reenvía los errores a la escritura de logs cuando existen. Puedes configurar la escritura de errores con:

```cs
config.ThrowExceptions = false;
config.ErrorsLogsStream = new LogStream("error.log");
```

Esta propiedad solo escribirá algo en el log si el error no es capturado por el callback o la propiedad [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler).

El error escrito por el servidor siempre incluye la fecha y hora, los encabezados de la solicitud (no el cuerpo), la traza del error y la traza de la excepción interna, si existe alguna.

## Otras instancias de registro

Tu aplicación puede tener cero o múltiples `LogStream`; no hay límite en la cantidad de canales de registro que puede tener. Por lo tanto, es posible dirigir el registro de tu aplicación a un archivo distinto del `AccessLog` o `ErrorLog` predeterminados.

```cs
LogStream appMessages = new LogStream("messages.log");
appMessages.WriteLine("Application started at {0}", DateTime.Now);
```

## Extender LogStream

Puedes extender la clase `LogStream` para escribir formatos personalizados, compatibles con el motor de logs actual de Sisk. El ejemplo a continuación permite escribir mensajes coloridos en la consola mediante la biblioteca Spectre.Console:

<div class="script-header">
    <span>
        CustomLogStream.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class CustomLogStream : LogStream
{
    protected override void WriteLineInternal(string line)
    {
        base.WriteLineInternal($"[{DateTime.Now:g}] {line}");
    }
}
```

Otra forma de escribir automáticamente logs personalizados para cada solicitud/respuesta es crear un [HttpServerHandler](/api/Sisk.Core.Http.Handlers.HttpServerHandler). El ejemplo a continuación es un poco más completo. Escribe el cuerpo de la solicitud y la respuesta en JSON a la consola. Puede ser útil para depurar solicitudes en general. Este ejemplo hace uso de `ContextBag` y `HttpServerHandler`.

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
class Program
{
    static async Task Main(string[] args)
    {
        var app = HttpServer.CreateBuilder(host =>
        {
            host.UseListeningPort(5555);
            host.UseHandler<JsonMessageHandler>();
        });

        app.Router.MapAny("/json", request =>
        {
            return new HttpResponse()
                .WithContent(JsonContent.Create(new
                {
                    method = request.Method.Method,
                    path = request.Path,
                    specialMessage = "Hello, world!!"
                }));
        });

        await app.StartAsync();
    }
}
```

<div class="script-header">
    <span>
        JsonMessageHandler.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
class JsonMessageHandler : HttpServerHandler
{
    protected override void OnHttpRequestOpen(HttpRequest request)
    {
        if (request.Method != HttpMethod.Get && request.Headers["Content-Type"]?.Contains("json", StringComparison.InvariantCultureIgnoreCase) == true)
        {
            // En este punto, la conexión está abierta y el cliente ha enviado el encabezado que especifica
            // que el contenido es JSON. La línea siguiente lee el contenido y lo deja almacenado en la solicitud.
            //
            // Si el contenido no se lee en la acción de la solicitud, el GC probablemente recoja el contenido
            // después de enviar la respuesta al cliente, por lo que el contenido podría no estar disponible después de que la respuesta se cierre.
            //
            _ = request.RawBody;

            // agrega una pista en el contexto para indicar que esta solicitud tiene un cuerpo JSON
            request.Bag.Add("IsJsonRequest", true);
        }
    }

    protected override async void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        string? requestJson = null,
                responseJson = null,
                responseMessage;

        if (result.Request.Bag.ContainsKey("IsJsonRequest"))
        {
            // reformatea el JSON usando la biblioteca CypherPotato.LightJson
            var content = result.Request.Body;
            requestJson = JsonValue.Deserialize(content, new JsonOptions() { WriteIndented = true }).ToString();
        }
        
        if (result.Response is { } response)
        {
            var content = response.Content;
            responseMessage = $"{(int)response.Status} {HttpStatusInformation.GetStatusCodeDescription(response.Status)}";
            
            if (content is HttpContent httpContent &&
                // verifica si la respuesta es JSON
                httpContent.Headers.ContentType?.MediaType?.Contains("json", StringComparison.InvariantCultureIgnoreCase) == true)
            {
                string json = await httpContent.ReadAsStringAsync();
                responseJson = JsonValue.Deserialize(json, new JsonOptions() { WriteIndented = true }).ToString();
            }
        }
        else
        {
            // obtiene el estado interno del manejo del servidor
            responseMessage = result.Status.ToString();
        }
        
        StringBuilder outputMessage = new StringBuilder();

        if (requestJson != null)
        {
            outputMessage.AppendLine("-----");
            outputMessage.AppendLine($">>> {result.Request.Method} {result.Request.Path}");

            if (requestJson is not null)
                outputMessage.AppendLine(requestJson);
        }

        outputMessage.AppendLine($"<<< {responseMessage}");

        if (responseJson is not null)
            outputMessage.AppendLine(responseJson);

        outputMessage.AppendLine("-----");

        await Console.Out.WriteLineAsync(outputMessage.ToString());
    }
}
```