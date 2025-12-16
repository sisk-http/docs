# Registro de logs

Puedes configurar Sisk para escribir automáticamente los registros de acceso y error. Es posible definir la rotación de registros, extensiones y frecuencia.

La clase [LogStream](/api/Sisk.Core.Http.LogStream) proporciona una forma asíncrona de escribir registros y mantenerlos en una cola de escritura esperable. La clase `LogStream` implementa `IAsyncDisposable`, lo que garantiza que todos los registros pendientes se escriban antes de que se cierre el flujo.

En este artículo te mostraremos cómo configurar el registro para tu aplicación.

## Registros de acceso basados en archivos

Los registros en archivos abren el archivo, escriben el texto de la línea y luego cierran el archivo para cada línea escrita. Este procedimiento se adoptó para mantener la respuesta de escritura en los registros.

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

El código anterior escribirá todas las solicitudes entrantes en el archivo `logs/access.log`. Ten en cuenta que el archivo se crea automáticamente si no existe, sin embargo, el directorio anterior no. No es necesario crear el directorio `logs/` ya que la clase `LogStream` lo crea automáticamente.

## Registro basado en flujo

Puedes escribir archivos de registro en objetos `TextWriter`, como `Console.Out`, pasando un objeto `TextWriter` en el constructor:

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

Para cada mensaje escrito en el registro basado en flujo, se llama al método `TextWriter.Flush()`.

## Formato de registro de acceso

Puedes personalizar el formato de registro de acceso mediante variables predefinidas. Considera la siguiente línea:

```cs
config.AccessLogsFormat = "%dd/%dmm/%dy %tH:%ti:%ts %tz %ls %ri %rs://%ra%rz%rq [%sc %sd] %lin -> %lou in %lmsms [%{user-agent}]";
```

Escribirá un mensaje como:

    29/mar./2023 15:21:47 -0300 Ejecutado ::1 http://localhost:5555/ [200 OK] 689B -> 707B en 84ms [Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/111.0.0.0 Safari/537.36]

Puedes formatear tu archivo de registro según el formato descrito en la tabla:

| Valor  | Lo que representa                                                                 | Ejemplo                               |
|--------|-----------------------------------------------------------------------------------|---------------------------------------|
| %dd    | Día del mes (con dos dígitos)                                        | 05                                    |
| %dmmm  | Nombre completo del mes                                                            | julio                                  |
| %dmm   | Nombre abreviado del mes (tres letras)                                  | jul                                  |
| %dm    | Número de mes (con dos dígitos)                                          | 07                                    |
| %dy    | Año (con cuatro dígitos)                                                 | 2023                                 |
| %th    | Hora en formato de 12 horas                                                          | 03                                    |
| %tH    | Hora en formato de 24 horas (HH)                                                    | 15                                    |
| %ti    | Minutos (con dos dígitos)                                               | 30                                    |
| %ts    | Segundos (con dos dígitos)                                               | 45                                    |
| %tm    | Milisegundos (con tres dígitos)                                        | 123                                   |
| %tz    | Desplazamiento de zona horaria (horas totales en UTC)                                         | +03:00                               |
| %ri    | Dirección IP remota del cliente                                                       | 192.168.1.100                        |
| %rm    | Método HTTP (en mayúsculas)                                                          | GET                                   |
| %rs    | Esquema de URI (http/https)                                                          | https                                |
| %ra    | Autoridad de URI (dominio)                                                           | example.com                          |
| %rh    | Host de la solicitud                                                             | www.example.com                       |
| %rp    | Puerto de la solicitud                                                             | 443                                  |
| %rz    | Ruta de la solicitud                                                             | /path/to/resource                    |
| %rq    | Cadena de consulta                                                                    | ?key=value&another=123               |
| %sc    | Código de estado de respuesta HTTP                                                      | 200                                  |
| %sd    | Descripción del estado de respuesta HTTP                                              | OK                                   |
| %lin   | Tamaño legible de la solicitud                                             | 1.2 KB                               |
| %linr  | Tamaño bruto de la solicitud (bytes)                                                | 1234                                |
| %lou   | Tamaño legible de la respuesta                                            | 2.5 KB                               |
| %lour  | Tamaño bruto de la respuesta (bytes)                                               | 2560                                |
| %lms   | Tiempo transcurrido en milisegundos                                                   | 120                                  |
| %ls    | Estado de ejecución                                                                | Ejecutado                |
| %{header-name}    | Representa el encabezado `header-name` de la solicitud.                                                                | `Mozilla/5.0 (platform; rv:gecko [...]`                |
| %{:header-name}    | Representa el encabezado `header-name` de la respuesta. | `application/json` |

También puedes usar `HttpServerConfiguration.DefaultAccessLogFormat` para usar el formato de registro de acceso predeterminado.

## Registros rotativos

Puedes configurar el servidor HTTP para rotar los archivos de registro a un archivo comprimido .gz cuando alcancen un tamaño determinado. El tamaño se comprueba periódicamente por el límite que defines.

```cs
LogStream errorLog = new LogStream("logs/error.log")
    .ConfigureRotatingPolicy(
        maximumSize: 64 * SizeHelper.UnitMb,
        dueTime: TimeSpan.FromHours(6));
```

El código anterior comprueba cada seis horas si el archivo de `LogStream` ha alcanzado su límite de 64 MB. Si es así, el archivo se comprime a un archivo .gz y luego se limpia el `access.log`.

Durante este proceso, la escritura en el archivo está bloqueada hasta que el archivo se comprima y limpie. Todas las líneas que entren para ser escritas en este período esperarán en una cola hasta que termine la compresión.

Esta función solo funciona con `LogStreams` basados en archivos.

## Registro de errores

Cuando un servidor no está lanzando errores al depurador, los reenvía a la escritura de registros cuando hay alguno. Puedes configurar la escritura de errores con:

```cs
config.ThrowExceptions = false;
config.ErrorsLogsStream = new LogStream("error.log");
```

Esta propiedad solo escribirá algo en el registro si el error no es capturado por la devolución de llamada o la propiedad [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler).

El error escrito por el servidor siempre escribe la fecha y hora, los encabezados de la solicitud (no el cuerpo), la traza del error y la traza de la excepción interna, si la hay.

## Otras instancias de registro

Tu aplicación puede tener cero o múltiples `LogStreams`, no hay límite en la cantidad de canales de registro que puede tener. Por lo tanto, es posible dirigir el registro de tu aplicación a un archivo diferente al registro de acceso o error predeterminado.

```cs
LogStream appMessages = new LogStream("messages.log");
appMessages.WriteLine("Aplicación iniciada en {0}", DateTime.Now);
```

## Extensión de LogStream

Puedes extender la clase `LogStream` para escribir formatos personalizados, compatibles con el motor de registro actual de Sisk. El ejemplo siguiente permite escribir mensajes con colores en la consola a través de la biblioteca Spectre.Console:

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

Otra forma de escribir automáticamente registros personalizados para cada solicitud/respuesta es crear un [HttpServerHandler](/api/Sisk.Core.Http.Handlers.HttpServerHandler). El ejemplo siguiente es un poco más completo. Escribe el cuerpo de la solicitud y la respuesta en JSON en la consola. Puede ser útil para depurar solicitudes en general. Este ejemplo utiliza `ContextBag` y `HttpServerHandler`.

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

        app.Router += new Route(RouteMethod.Any, "/json", request =>
        {
            return new HttpResponse()
                .WithContent(JsonContent.Create(new
                {
                    method = request.Method.Method,
                    path = request.Path,
                    specialMessage = "Hola, mundo!!"
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
            // Si el contenido no se lee en la acción de la solicitud, es probable que el GC lo recolecte
            // después de enviar la respuesta al cliente, por lo que el contenido puede no estar disponible después de que se cierre la respuesta.
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
            // reformatea el JSON utilizando la biblioteca CypherPotato.LightJson
            var content = result.Request.Body;
            requestJson = JsonValue.Deserialize(content, new JsonOptions() { WriteIndented = true }).ToString();
        }
        
        if (result.Response is { } response)
        {
            var content = response.Content;
            responseMessage = $"{(int)response.Status} {HttpStatusInformation.GetStatusCodeDescription(response.Status)}";
            
            if (content is HttpContent httpContent &&
                // comprueba si la respuesta es JSON
                httpContent.Headers.ContentType?.MediaType?.Contains("json", StringComparison.InvariantCultureIgnoreCase) == true)
            {
                string json = await httpContent.ReadAsStringAsync();
                responseJson = JsonValue.Deserialize(json, new JsonOptions() { WriteIndented = true }).ToString();
            }
        }
        else
        {
            // obtiene el estado de manejo interno del servidor
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