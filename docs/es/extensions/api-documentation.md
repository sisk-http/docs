# Documentación de la API

La extensión `Sisk.Documenting` le permite generar documentación de API para su aplicación Sisk automáticamente. Aprovecha la estructura de su código y los atributos para crear un sitio de documentación completo, con soporte de exportación al formato Open API (Swagger).

> [!WARNING]
> Este paquete está actualmente en desarrollo y aún no se ha publicado. Su comportamiento y API pueden estar sujetos a cambios en futuras actualizaciones.

Dado que este paquete aún no está disponible en NuGet, debe incorporar el código fuente directamente en su proyecto o referenciarlo como una dependencia del proyecto. Puede acceder al código fuente [aquí](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Documenting).

Para usar `Sisk.Documenting`, necesita registrarlo en el constructor de su aplicación y decorar sus manejadores de rutas con atributos de documentación.

### Registro de generación de documentación

Utilice el método de extensión `UseApiDocumentation` en su `HttpServerHostContextBuilder` para exponer la documentación de API generada desde el mismo router que sirve su aplicación.

```csharp
using Sisk.Documenting;
using Sisk.Documenting.Exporters;

// ...

host.UseApiDocumentation(
    context: new ApiGenerationContext()
    {
        ApplicationName = "My Application",
        ApplicationDescription = "Description of my application.",
        ApplicationVersion = "1.0.0"
    },
    routerPath: "/api/docs",
    exporter: new OpenApiExporter() { ServerUrls = ["http://localhost:5555/"] });
```

- **context**: Define los metadatos de su aplicación, como nombre, descripción y versión.  
- **routerPath**: La ruta URL donde la interfaz de usuario de la documentación (o JSON) será accesible.  
- **exporter**: Configura cómo se exporta la documentación. El `OpenApiExporter` habilita el soporte Open API (Swagger).

### Documentación de Endpoints

Puede describir sus endpoints usando los atributos `[ApiEndpoint]` y `[ApiQueryParameter]` en los métodos manejadores de rutas.

### `ApiEndpoint`

El atributo `[ApiEndpoint]` le permite proporcionar una descripción para el endpoint.

```csharp
[ApiEndpoint(Description = "Returns a greeting message.")]
public HttpResponse Index(HttpRequest request) { ... }
```

### `ApiQueryParameter`

El atributo `[ApiQueryParameter]` documenta los parámetros de cadena de consulta que el endpoint acepta.

```csharp
[ApiQueryParameter(name: "name", IsRequired = false, Description = "The name of the person to greet.", Type = "string")]
public HttpResponse Index(HttpRequest request) { ... }
```

- **name**: El nombre del parámetro de consulta.  
- **IsRequired**: Especifica si el parámetro es obligatorio.  
- **Description**: Una descripción legible del parámetro.  
- **Type**: El tipo de dato esperado (p.ej., "string", "int").

### `ApiEndpoint`

Anota un endpoint con información general.

*   **Name** (string, required in constructor): El nombre del endpoint de la API.  
*   **Description** (string): Una breve descripción de lo que hace el endpoint.  
*   **Group** (string): Permite agrupar endpoints (p.ej., por controlador o módulo).  
*   **InheritDescriptionFromXmlDocumentation** (bool, default: `true`): Si `true`, intenta usar el resumen de la documentación XML del método si `Description` no está establecida.

### `ApiHeader`

Documenta un encabezado HTTP específico que el endpoint espera o utiliza.

*   **HeaderName** (string, required in constructor): La clave del encabezado (p.ej., "Authorization").  
*   **Description** (string): Describe el propósito del encabezado.  
*   **IsRequired** (bool): Indica si el encabezado es obligatorio para la solicitud.

### `ApiParameter`

Define un parámetro genérico para el endpoint, a menudo usado para campos de formulario o parámetros de cuerpo que no están cubiertos por otros atributos.

*   **Name** (string, required in constructor): El nombre del parámetro.  
*   **TypeName** (string, required in constructor): El tipo de dato del parámetro (p.ej., "string", "int").  
*   **Description** (string): Una descripción del parámetro.  
*   **IsRequired** (bool): Indica si el parámetro es obligatorio.

### `ApiParametersFrom`

Genera automáticamente la documentación de parámetros a partir de las propiedades de una clase o tipo especificado.

*   **Type** (Type, required in constructor): El `Type` de la clase del cual reflejar propiedades.

### `ApiPathParameter`

Documenta una variable de ruta (p.ej., en `/users/{id}`).

*   **Name** (string, required in constructor): El nombre del parámetro de ruta.  
*   **Description** (string): Describe lo que representa el parámetro.  
*   **Type** (string): El tipo de dato esperado.

### `ApiQueryParameter`

Documenta un parámetro de cadena de consulta (p.ej., `?page=1`).

*   **Name** (string, required in constructor): La clave del parámetro de consulta.  
*   **Description** (string): Describe el parámetro.  
*   **Type** (string): El tipo de dato esperado.  
*   **IsRequired** (bool): Indica si el parámetro de consulta debe estar presente.

### `ApiRequest`

Describe el cuerpo de la solicitud esperado.

*   **Description** (string, required in constructor): Una descripción del cuerpo de la solicitud.  
*   **Example** (string): Una cadena cruda que contiene un ejemplo del cuerpo de la solicitud.  
*   **ExampleLanguage** (string): El lenguaje del ejemplo (p.ej., "json", "xml").  
*   **PayloadType** (Type): Si se establece, el ejemplo y el esquema se generarán automáticamente a partir de este tipo cuando los manejadores de contexto configurados lo soporten.

### `ApiResponse`

Describe una posible respuesta del endpoint.

*   **StatusCode** (HttpStatusCode, required in constructor): El código de estado HTTP devuelto (p.ej., `HttpStatusCode.OK`).  
*   **Description** (string): Describe la condición para esta respuesta.  
*   **Example** (string): Una cadena cruda que contiene un ejemplo del cuerpo de la respuesta.  
*   **ExampleLanguage** (string): El lenguaje del ejemplo.  
*   **PayloadType** (Type): Si se establece, el ejemplo y el esquema se generarán automáticamente a partir de este tipo cuando los manejadores de contexto configurados lo soporten.

## Manejadores de Tipo

Los manejadores de tipo son responsables de convertir sus tipos .NET (clases, enumeraciones, etc.) en ejemplos de documentación. Esto es particularmente útil para generar ejemplos automáticos de cuerpos de solicitud y respuesta basados en sus modelos de datos.

Estos manejadores se configuran dentro del `ApiGenerationContext`.

```csharp
using Sisk.Documenting.Content;

var context = new ApiGenerationContext()
{
    // ...
    BodyExampleTypeHandler = new JsonContentTypeHandler(),
    ParameterExampleTypeHandler = new JsonContentTypeHandler(),
    ContentSchemaTypeHandler = new JsonContentTypeHandler()
};
```

### JsonContentTypeHandler

El `JsonContentTypeHandler` es un manejador incorporado que genera ejemplos JSON, ejemplos de parámetros y esquemas JSON. Implementa `IExampleBodyTypeHandler`, `IExampleParameterTypeHandler` y `IContentSchemaTypeHandler`.

Puede personalizarse con opciones específicas de `JsonSerializerOptions` o `IJsonTypeInfoResolver` para que coincidan con la lógica de serialización de su aplicación.

```csharp
var jsonHandler = new JsonContentTypeHandler(new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    WriteIndented = true
});

context.BodyExampleTypeHandler = jsonHandler;
context.ParameterExampleTypeHandler = jsonHandler;
context.ContentSchemaTypeHandler = jsonHandler;
```

### Manejadores de Tipo Personalizados

Puede implementar sus propios manejadores para soportar otros formatos (como XML) o para personalizar cómo se generan los ejemplos.

#### IExampleBodyTypeHandler

Implemente esta interfaz para generar ejemplos de cuerpo para tipos de solicitud y respuesta.

```csharp
public class XmlExampleTypeHandler : IExampleBodyTypeHandler
{
    public BodyExampleResult? GetBodyExampleForType(Type type)
    {
        // Generate XML string for the type
        string xmlContent = MyXmlGenerator.Generate(type);

        return new BodyExampleResult(xmlContent, "xml");
    }
}
```

#### IExampleParameterTypeHandler

Implemente esta interfaz para generar descripciones detalladas de parámetros a partir de un tipo (usado por `[ApiParametersFrom]`).

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
                description: "Generated description"
            ));
        }

        return examples.ToArray();
    }
}
```

## Exportadores

Los exportadores son responsables de convertir los metadatos de documentación de API recopilados en un formato específico que pueda ser consumido por otras herramientas o mostrado al usuario.

### OpenApiExporter

El exportador predeterminado proporcionado es el `OpenApiExporter`, que genera un archivo JSON siguiendo la [OpenAPI Specification 3.0.0](https://spec.openapis.org/oas/v3.0.0).

```csharp
new OpenApiExporter()
{
    OpenApiVersion = "3.0.0",
    ServerUrls = new[] { "http://localhost:5555" },
    Contact = new OpenApiContact()
    {
        Name = "Support",
        Email = "support@example.com",
        Url = "https://example.com/support"
    },
    License = new OpenApiLicense()
    {
        Name = "MIT",
        Url = "https://opensource.org/licenses/MIT"
    },
    TermsOfService = "https://example.com/terms"
}
```

### Creación de un Exportador Personalizado

Puede crear su propio exportador implementando la interfaz `IApiDocumentationExporter`. Esto le permite generar documentación en formatos como Markdown, HTML, Postman Collection o cualquier otro formato personalizado.

La interfaz requiere que implemente un único método: `ExportDocumentationContent`.

```csharp
using Sisk.Core.Http;
using Sisk.Documenting;

public class MyCustomExporter : IApiDocumentationExporter
{
    public HttpContent ExportDocumentationContent(ApiDocumentation documentation)
    {
        // 1. Process the documentation object
        var sb = new StringBuilder();
        sb.AppendLine($"# {documentation.ApplicationName}");

        foreach(var endpoint in documentation.Endpoints)
        {
            sb.AppendLine($"## {endpoint.Method} {endpoint.Path}");
            sb.AppendLine(endpoint.Description);
        }

        // 2. Return the content as an HttpContent
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

### Ejemplo Completo

A continuación se muestra un ejemplo completo que demuestra cómo configurar `Sisk.Documenting` y documentar un controlador sencillo.

```csharp
using Sisk.Core.Entity;
using Sisk.Core.Http;
using Sisk.Core.Routing;
using Sisk.Documenting;
using Sisk.Documenting.Annotations;
using Sisk.Documenting.Exporters;

using var host = HttpServer.CreateBuilder(5555)
    .UseCors(CrossOriginResourceSharingHeaders.CreatePublicContext())
    .UseApiDocumentation(
        context: new ApiGenerationContext()
        {
            ApplicationName = "My application",
            ApplicationDescription = "It greets someone."
        },
        routerPath: "/api/docs",
        exporter: new OpenApiExporter() { ServerUrls = ["http://localhost:5555/"] })
    .UseRouter(router =>
    {
        router.MapInstance(new MyController());
    })
    .Build();

await host.StartAsync();

class MyController
{
    [RouteGet]
    [ApiEndpoint(Description = "Returns a greeting message.")]
    [ApiQueryParameter(name: "name", IsRequired = false, Description = "The name of the person to greet.", Type = "string")]
    public HttpResponse Index(HttpRequest request)
    {
        string? name = request.Query["name"].MaybeNullOrEmpty() ?? "world";
        return new HttpResponse($"Hello, {name}!");
    }
}
```

En este ejemplo, al acceder a `/api/docs` se servirá la documentación generada para la API "My application", describiendo el endpoint `GET /` y su parámetro `name`.