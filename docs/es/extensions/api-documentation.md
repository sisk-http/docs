# Documentación de la API

La extensión `Sisk.Documenting` permite generar documentación de la API para su aplicación Sisk de forma automática. Se basa en la estructura de su código y atributos para crear un sitio de documentación integral, con soporte para exportar a formato Open API (Swagger).

> [!WARNING]
> Este paquete está actualmente en desarrollo y no se ha publicado aún. Su comportamiento y API pueden cambiar en actualizaciones futuras.

Dado que este paquete no está disponible en NuGet, debe incorporar el código fuente directamente en su proyecto o hacer referencia a él como una dependencia de proyecto. Puede acceder al código fuente [aquí](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Documenting).

Para utilizar `Sisk.Documenting`, necesita registrarla en su constructor de aplicación y decorar sus controladores de rutas con atributos de documentación.

### Registro del middleware

Utilice el método de extensión `UseApiDocumentation` en su `HttpServerBuilder` para habilitar la documentación de la API.

```csharp
using Sisk.Documenting;

// ...

host.UseApiDocumentation(
    context: new ApiGenerationContext()
    {
        ApplicationName = "Mi aplicación",
        ApplicationDescription = "Descripción de mi aplicación.",
        Version = "1.0.0"
    },
    routerPath: "/api/docs",
    exporter: new OpenApiExporter() { ServerUrls = ["http://localhost:5555/"] });
```

- **context**: Define metadatos sobre su aplicación, como nombre, descripción y versión.
- **routerPath**: La ruta URL donde se accederá a la interfaz de usuario de la documentación (o JSON).
- **exporter**: Configura cómo se exporta la documentación. El `OpenApiExporter` habilita el soporte para Open API (Swagger).

### Documentación de puntos de conexión

Puede describir sus puntos de conexión utilizando los atributos `[ApiEndpoint]` y `[ApiQueryParameter]` en sus métodos de controlador de rutas.

### `ApiEndpoint`

El atributo `[ApiEndpoint]` permite proporcionar una descripción para el punto de conexión.

```csharp
[ApiEndpoint(Description = "Devuelve un mensaje de saludo.")]
public HttpResponse Index(HttpRequest request) { ... }
```

### `ApiQueryParameter`

El atributo `[ApiQueryParameter]` documenta los parámetros de la cadena de consulta que acepta el punto de conexión.

```csharp
[ApiQueryParameter(name: "name", IsRequired = false, Description = "El nombre de la persona a saludar.", Type = "string")]
public HttpResponse Index(HttpRequest request) { ... }
```

- **name**: El nombre del parámetro de la consulta.
- **IsRequired**: Especifica si el parámetro es obligatorio.
- **Description**: Una descripción legible por humanos del parámetro.
- **Type**: El tipo de datos esperado (por ejemplo, "string", "int").

### `ApiEndpoint`

Anota un punto de conexión con información general.

*   **Name** (string, requerido en constructor): El nombre del punto de conexión de la API.
*   **Description** (string): Una descripción breve de lo que hace el punto de conexión.
*   **Group** (string): Permite agrupar puntos de conexión (por ejemplo, por controlador o módulo).
*   **InheritDescriptionFromXmlDocumentation** (bool, valor predeterminado: `true`): Si es `true`, intenta usar el resumen de la documentación XML del método si `Description` no está establecida.

### `ApiHeader`

Documenta un encabezado HTTP específico que el punto de conexión espera o utiliza.

*   **HeaderName** (string, requerido en constructor): La clave del encabezado (por ejemplo, "Authorization").
*   **Description** (string): Describe el propósito del encabezado.
*   **IsRequired** (bool): Indica si el encabezado es obligatorio para la solicitud.

### `ApiParameter`

Define un parámetro genérico para el punto de conexión, a menudo utilizado para campos de formulario o parámetros del cuerpo no cubiertos por otros atributos.

*   **Name** (string, requerido en constructor): El nombre del parámetro.
*   **TypeName** (string, requerido en constructor): El tipo de datos del parámetro (por ejemplo, "string", "int").
*   **Description** (string): Una descripción del parámetro.
*   **IsRequired** (bool): Indica si el parámetro es obligatorio.

### `ApiParametersFrom`

Genera automáticamente la documentación de parámetros a partir de las propiedades de una clase o tipo especificado.

*   **Type** (Type, requerido en constructor): El tipo `Type` para reflejar propiedades desde.

### `ApiPathParameter`

Documenta una variable de ruta (por ejemplo, en `/users/{id}`).

*   **Name** (string, requerido en constructor): El nombre del parámetro de la ruta.
*   **Description** (string): Describe lo que representa el parámetro.
*   **Type** (string): El tipo de datos esperado.

### `ApiQueryParameter`

Documenta un parámetro de la cadena de consulta (por ejemplo, `?page=1`).

*   **Name** (string, requerido en constructor): La clave del parámetro de la consulta.
*   **Description** (string): Describe el parámetro.
*   **Type** (string): El tipo de datos esperado.
*   **IsRequired** (bool): Indica si el parámetro de la consulta debe estar presente.

### `ApiRequest`

Describe el cuerpo de la solicitud esperado.

*   **Description** (string, requerido en constructor): Una descripción del cuerpo de la solicitud.
*   **Example** (string): Una cadena cruda que contiene un ejemplo del cuerpo de la solicitud.
*   **ExampleLanguage** (string): El lenguaje del ejemplo (por ejemplo, "json", "xml").
*   **ExampleType** (Type): Si se establece, el ejemplo se generará automáticamente a partir de este tipo (si está soportado por el contexto).

### `ApiResponse`

Describe una respuesta posible del punto de conexión.

*   **StatusCode** (HttpStatusCode, requerido en constructor): El código de estado HTTP devuelto (por ejemplo, `HttpStatusCode.OK`).
*   **Description** (string): Describe la condición para esta respuesta.
*   **Example** (string): Una cadena cruda que contiene un ejemplo del cuerpo de la respuesta.
*   **ExampleLanguage** (string): El lenguaje del ejemplo.
*   **ExampleType** (Type): Si se establece, el ejemplo se generará automáticamente a partir de este tipo.

## Controladores de tipo

Los controladores de tipo son responsables de convertir los tipos .NET (clases, enumeraciones, etc.) en ejemplos de documentación. Esto es particularmente útil para generar ejemplos automáticos de cuerpo de solicitud y respuesta en función de sus modelos de datos.

Estos controladores se configuran dentro del `ApiGenerationContext`.

```csharp
var context = new ApiGenerationContext()
{
    // ...
    BodyExampleTypeHandler = new JsonExampleTypeHandler(),
    ParameterExampleTypeHandler = new JsonExampleTypeHandler()
};
```

### JsonExampleTypeHandler

El `JsonExampleTypeHandler` es un controlador integrado que genera ejemplos en JSON. Implementa tanto `IExampleBodyTypeHandler` como `IExampleParameterTypeHandler`.

Puede personalizarlo con opciones `JsonSerializerOptions` específicas o `IJsonTypeInfoResolver` para que coincida con la lógica de serialización de su aplicación.

```csharp
var jsonHandler = new JsonExampleTypeHandler(new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    WriteIndented = true
});

context.BodyExampleTypeHandler = jsonHandler;
```

### Controladores de tipo personalizados

Puede implementar sus propios controladores para admitir otros formatos (como XML) o para personalizar cómo se generan los ejemplos.

#### IExampleBodyTypeHandler

Implemente esta interfaz para generar ejemplos de cuerpo para tipos de solicitud y respuesta.

```csharp
public class XmlExampleTypeHandler : IExampleBodyTypeHandler
{
    public BodyExampleResult? GetBodyExampleForType(Type type)
    {
        // Genera una cadena XML para el tipo
        string xmlContent = MyXmlGenerator.Generate(type);

        return new BodyExampleResult(xmlContent, "xml");
    }
}
```

#### IExampleParameterTypeHandler

Implemente esta interfaz para generar descripciones detalladas de parámetros a partir de un tipo (utilizado por `[ApiParametersFrom]`).

```csharp
public class CustomParameterHandler : IExampleParameterTypeHandler
{
    public ParameterExampleResult[] GetParameterExamplesForType(Type type)
    {
        var properties = type.GetProperties();
        var examples = new List<ParameterExampleResult>();

        foreach (var prop in properties)
        {
            examples.Add(new ParameterExampleResult(
                name: prop.Name,
                typeName: prop.PropertyType.Name,
                isRequired: true,
                description: "Descripción generada"
            ));
        }

        return examples.ToArray();
    }
}
```

## Exportadores

Los exportadores son responsables de convertir los metadatos de documentación de la API recopilados en un formato específico que pueda ser consumido por otras herramientas o mostrado al usuario.

### OpenApiExporter

El exportador predeterminado proporcionado es el `OpenApiExporter`, que genera un archivo JSON que sigue la [Especificación OpenAPI 3.0.0](https://spec.openapis.org/oas/v3.0.0).

```csharp
new OpenApiExporter()
{
    OpenApiVersion = "3.0.0",
    ServerUrls = new[] { "http://localhost:5555" },
    Contact = new OpenApiContact()
    {
        Name = "Soporte",
        Email = "soporte@example.com",
        Url = "https://example.com/soporte"
    },
    License = new OpenApiLicense()
    {
        Name = "MIT",
        Url = "https://opensource.org/licenses/MIT"
    },
    TermsOfService = "https://example.com/terminos"
}
```

### Creación de un exportador personalizado

Puede crear su propio exportador implementando la interfaz `IApiDocumentationExporter`. Esto le permite generar documentación en formatos como Markdown, HTML, Colección Postman o cualquier otro formato personalizado.

La interfaz requiere que implemente un solo método: `ExportDocumentationContent`.

```csharp
using Sisk.Core.Http;
using Sisk.Documenting;

public class MyCustomExporter : IApiDocumentationExporter
{
    public HttpContent ExportDocumentationContent(ApiDocumentation documentation)
    {
        // 1. Procesa el objeto de documentación
        var sb = new StringBuilder();
        sb.AppendLine($"# {documentation.ApplicationName}");

        foreach(var endpoint in documentation.Endpoints)
        {
            sb.AppendLine($"## {endpoint.Method} {endpoint.Path}");
            sb.AppendLine(endpoint.Description);
        }

        // 2. Devuelve el contenido como un HttpContent
        return new StringContent(sb.ToString(), Encoding.UTF8, "text/markdown");
    }
}
```

Luego, simplemente úselo en su configuración:

```csharp
host.UseApiDocumentation(
    // ...
    exporter: new MyCustomExporter()
);
```

### Ejemplo completo

A continuación, se muestra un ejemplo completo que demuestra cómo configurar `Sisk.Documenting` y documentar un controlador simple.

```csharp
using Sisk.Core.Entity;
using Sisk.Core.Http;
using Sisk.Core.Routing;
using Sisk.Documenting;
using Sisk.Documenting.Annotations;

using var host = HttpServer.CreateBuilder(5555)
    .UseCors(CrossOriginResourceSharingHeaders.CreatePublicContext())
    .UseApiDocumentation(
        context: new ApiGenerationContext()
        {
            ApplicationName = "Mi aplicación",
            ApplicationDescription = "Saluda a alguien."
        },
        routerPath: "/api/docs",
        exporter: new OpenApiExporter() { ServerUrls = ["http://localhost:5555/"] })
    .UseRouter(router =>
    {
        router.SetObject(new MyController());
    })
    .Build();

await host.StartAsync();

class MyController
{
    [RouteGet]
    [ApiEndpoint(Description = "Devuelve un mensaje de saludo.")]
    [ApiQueryParameter(name: "name", IsRequired = false, Description = "El nombre de la persona a saludar.", Type = "string")]
    public HttpResponse Index(HttpRequest request)
    {
        string? name = request.Query["name"].MaybeNullOrEmpty() ?? "mundo";
        return new HttpResponse($"Hola, {name}!");
    }
}
```

En este ejemplo, acceder a `/api/docs` servirá la documentación generada para la API "Mi aplicación", describiendo el punto de conexión `GET /` y su parámetro `name`.