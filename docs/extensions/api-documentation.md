# API Documentation

The `Sisk.Documenting` extension allows you to generate API documentation for your Sisk application automatically. It leverages your code structure and attributes to create a comprehensive documentation site, supporting export to Open API (Swagger) format.

> [!WARNING]
> This package is currently under development and is not yet published. Its behavior and API may be subject to change in future updates.

Since this package is not yet available on NuGet, you must incorporate the source code directly into your project or reference it as a project dependency. You can access the source code [here](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Documenting).

To use `Sisk.Documenting`, you need to register it in your application builder and decorate your route handlers with documentation attributes.

### Registering the Middleware

Use the `UseApiDocumentation` extension method on your `HttpServerBuilder` to enable API documentation.

```csharp
using Sisk.Documenting;

// ...

host.UseApiDocumentation(
    context: new ApiGenerationContext()
    {
        ApplicationName = "My Application",
        ApplicationDescription = "Description of my application.",
        Version = "1.0.0"
    },
    routerPath: "/api/docs",
    exporter: new OpenApiExporter() { ServerUrls = ["http://localhost:5555/"] });
```

- **context**: Defines metadata about your application, such as name, description, and version.
- **routerPath**: The URL path where the documentation user interface (or JSON) will be accessible.
- **exporter**: Configures how the documentation is exported. The `OpenApiExporter` enables Open API (Swagger) support.

### Documenting Endpoints

You can describe your endpoints using the `[ApiEndpoint]` and `[ApiQueryParameter]` attributes on your route handler methods.

### `ApiEndpoint`

The `[ApiEndpoint]` attribute allows you to provide a description for the endpoint.

```csharp
[ApiEndpoint(Description = "Returns a greeting message.")]
public HttpResponse Index(HttpRequest request) { ... }
```

### `ApiQueryParameter`

The `[ApiQueryParameter]` attribute documents query string parameters that the endpoint accepts.

```csharp
[ApiQueryParameter(name: "name", IsRequired = false, Description = "The name of the person to greet.", Type = "string")]
public HttpResponse Index(HttpRequest request) { ... }
```

- **name**: The name of the query parameter.
- **IsRequired**: Specifies if the parameter is mandatory.
- **Description**: A human-readable description of the parameter.
- **Type**: The expected data type (e.g., "string", "int").

### `ApiEndpoint`

Annotates an endpoint with general information.

*   **Name** (string, required in constructor): The name of the API endpoint.
*   **Description** (string): A brief description of what the endpoint does.
*   **Group** (string): Allows grouping endpoints (e.g., by controller or module).
*   **InheritDescriptionFromXmlDocumentation** (bool, default: `true`): If `true`, attempts to use the method's XML documentation summary if `Description` is not set.

### `ApiHeader`

Documents a specific HTTP header that the endpoint expects or utilizes.

*   **HeaderName** (string, required in constructor): The key of the header (e.g., "Authorization").
*   **Description** (string): Describes the header's purpose.
*   **IsRequired** (bool): Indicates if the header is mandatory for the request.

### `ApiParameter`

Defines a generic parameter for the endpoint, often used for form fields or body parameters not covered by other attributes.

*   **Name** (string, required in constructor): The name of the parameter.
*   **TypeName** (string, required in constructor): The data type of the parameter (e.g., "string", "int").
*   **Description** (string): A description of the parameter.
*   **IsRequired** (bool): Indicates if the parameter is mandatory.

### `ApiParametersFrom`

Automatically generates parameter documentation from the properties of a specified class or type.

*   **Type** (Type, required in constructor): The class `Type` to reflect properties from.

### `ApiPathParameter`

Documents a path variable (e.g., in `/users/{id}`).

*   **Name** (string, required in constructor): The name of the path parameter.
*   **Description** (string): Describes what the parameter represents.
*   **Type** (string): The expected data type.

### `ApiQueryParameter`

Documents a query string parameter (e.g., `?page=1`).

*   **Name** (string, required in constructor): The key of the query parameter.
*   **Description** (string): Describes the parameter.
*   **Type** (string): The expected data type.
*   **IsRequired** (bool): Indicates if the query parameter must be present.

### `ApiRequest`

Describes the expected request body.

*   **Description** (string, required in constructor): A description of the request body.
*   **Example** (string): A raw string containing an example of the request body.
*   **ExampleLanguage** (string): The language of the example (e.g., "json", "xml").
*   **ExampleType** (Type): If set, the example will be generated automatically from this type (if supported by the context).

### `ApiResponse`

Describes a possible response from the endpoint.

*   **StatusCode** (HttpStatusCode, required in constructor): The HTTP status code returned (e.g., `HttpStatusCode.OK`).
*   **Description** (string): Describes the condition for this response.
*   **Example** (string): A raw string containing an example of the response body.
*   **ExampleLanguage** (string): The language of the example.
*   **ExampleType** (Type): If set, the example will be generated automatically from this type.

## Type Handlers

Type handlers are responsible for converting your .NET types (classes, enums, etc.) into documentation examples. This is particularly useful for generating automatic request and response body examples based on your data models.

These handlers are configured within the `ApiGenerationContext`.

```csharp
var context = new ApiGenerationContext()
{
    // ...
    BodyExampleTypeHandler = new JsonExampleTypeHandler(),
    ParameterExampleTypeHandler = new JsonExampleTypeHandler()
};
```

### JsonExampleTypeHandler

The `JsonExampleTypeHandler` is a built-in handler that generates JSON examples. It implements both `IExampleBodyTypeHandler` and `IExampleParameterTypeHandler`.

It can be customized with specific `JsonSerializerOptions` or `IJsonTypeInfoResolver` to match your application's serialization logic.

```csharp
var jsonHandler = new JsonExampleTypeHandler(new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    WriteIndented = true
});

context.BodyExampleTypeHandler = jsonHandler;
```

### Custom Type Handlers

You can implement your own handlers to support other formats (like XML) or to customize how examples are generated.

#### IExampleBodyTypeHandler

Implement this interface to generate body examples for request and response types.

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

Implement this interface to generate detailed parameter descriptions from a type (used by `[ApiParametersFrom]`).

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

## Exporters

Exporters are responsible for converting the collected API documentation metadata into a specific format that can be consumed by other tools or displayed to the user.

### OpenApiExporter

The default exporter provided is the `OpenApiExporter`, which generates a JSON file following the [OpenAPI Specification 3.0.0](https://spec.openapis.org/oas/v3.0.0).

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

### Creating a Custom Exporter

You can create your own exporter by implementing the `IApiDocumentationExporter` interface. This allows you to output documentation in formats such as Markdown, HTML, Postman Collection, or any other custom format.

The interface requires you to implement a single method: `ExportDocumentationContent`.

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

Then, simply use it in your configuration:

```csharp
host.UseApiDocumentation(
    // ...
    exporter: new MyCustomExporter()
);
```

### Full Example

Below is a complete example demonstrating how to set up `Sisk.Documenting` and document a simple controller.

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
            ApplicationName = "My application",
            ApplicationDescription = "It greets someone."
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
    [ApiEndpoint(Description = "Returns a greeting message.")]
    [ApiQueryParameter(name: "name", IsRequired = false, Description = "The name of the person to greet.", Type = "string")]
    public HttpResponse Index(HttpRequest request)
    {
        string? name = request.Query["name"].MaybeNullOrEmpty() ?? "world";
        return new HttpResponse($"Hello, {name}!");
    }
}
```

In this example, accessing `/api/docs` will serve the generated documentation for the "My application" API, describing the `GET /` endpoint and its `name` parameter.
