# Documentação da API

A extensão `Sisk.Documenting` permite gerar documentação de API para sua aplicação Sisk automaticamente. Ela aproveita a estrutura do seu código e os atributos para criar um site de documentação abrangente, suportando exportação para o formato Open API (Swagger).

> [!WARNING]
> Este pacote está atualmente em desenvolvimento e ainda não foi publicado. Seu comportamento e API podem estar sujeitos a alterações em atualizações futuras.

Como este pacote ainda não está disponível no NuGet, você deve incorporar o código-fonte diretamente ao seu projeto ou referenciá-lo como uma dependência de projeto. Você pode acessar o código-fonte [aqui](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Documenting).

Para usar `Sisk.Documenting`, você precisa registrá-lo no construtor da sua aplicação e decorar seus manipuladores de rotas com atributos de documentação.

### Registrando a geração de documentação

Use o método de extensão `UseApiDocumentation` no seu `HttpServerHostContextBuilder` para expor a documentação de API gerada a partir do mesmo roteador que serve sua aplicação.

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

- **context**: Define metadados sobre sua aplicação, como nome, descrição e versão.
- **routerPath**: O caminho URL onde a interface de usuário da documentação (ou JSON) estará acessível.
- **exporter**: Configura como a documentação é exportada. O `OpenApiExporter` habilita o suporte a Open API (Swagger).

### Documentando Endpoints

Você pode descrever seus endpoints usando os atributos `[ApiEndpoint]` e `[ApiQueryParameter]` nos seus métodos manipuladores de rotas.

### `ApiEndpoint`

O atributo `[ApiEndpoint]` permite que você forneça uma descrição para o endpoint.

```csharp
[ApiEndpoint(Description = "Returns a greeting message.")]
public HttpResponse Index(HttpRequest request) { ... }
```

### `ApiQueryParameter`

O atributo `[ApiQueryParameter]` documenta os parâmetros de string de consulta que o endpoint aceita.

```csharp
[ApiQueryParameter(name: "name", IsRequired = false, Description = "The name of the person to greet.", Type = "string")]
public HttpResponse Index(HttpRequest request) { ... }
```

- **name**: O nome do parâmetro de consulta.
- **IsRequired**: Especifica se o parâmetro é obrigatório.
- **Description**: Uma descrição legível do parâmetro.
- **Type**: O tipo de dado esperado (ex.: "string", "int").

### `ApiEndpoint`

Anota um endpoint com informações gerais.

*   **Name** (string, required in constructor): O nome do endpoint da API.
*   **Description** (string): Uma breve descrição do que o endpoint faz.
*   **Group** (string): Permite agrupar endpoints (ex.: por controlador ou módulo).
*   **InheritDescriptionFromXmlDocumentation** (bool, default: `true`): Se `true`, tenta usar o resumo da documentação XML do método caso `Description` não esteja definido.

### `ApiHeader`

Documenta um cabeçalho HTTP específico que o endpoint espera ou utiliza.

*   **HeaderName** (string, required in constructor): A chave do cabeçalho (ex.: "Authorization").
*   **Description** (string): Descreve o propósito do cabeçalho.
*   **IsRequired** (bool): Indica se o cabeçalho é obrigatório para a requisição.

### `ApiParameter`

Define um parâmetro genérico para o endpoint, frequentemente usado para campos de formulário ou parâmetros de corpo que não são cobertos por outros atributos.

*   **Name** (string, required in constructor): O nome do parâmetro.
*   **TypeName** (string, required in constructor): O tipo de dado do parâmetro (ex.: "string", "int").
*   **Description** (string): Uma descrição do parâmetro.
*   **IsRequired** (bool): Indica se o parâmetro é obrigatório.

### `ApiParametersFrom`

Gera automaticamente a documentação de parâmetros a partir das propriedades de uma classe ou tipo especificado.

*   **Type** (Type, required in constructor): O `Type` da classe a partir do qual refletir as propriedades.

### `ApiPathParameter`

Documenta uma variável de caminho (ex.: em `/users/{id}`).

*   **Name** (string, required in constructor): O nome do parâmetro de caminho.
*   **Description** (string): Descreve o que o parâmetro representa.
*   **Type** (string): O tipo de dado esperado.

### `ApiQueryParameter`

Documenta um parâmetro de string de consulta (ex.: `?page=1`).

*   **Name** (string, required in constructor): A chave do parâmetro de consulta.
*   **Description** (string): Descreve o parâmetro.
*   **Type** (string): O tipo de dado esperado.
*   **IsRequired** (bool): Indica se o parâmetro de consulta deve estar presente.

### `ApiRequest`

Descreve o corpo da requisição esperado.

*   **Description** (string, required in constructor): Uma descrição do corpo da requisição.
*   **Example** (string): Uma string bruta contendo um exemplo do corpo da requisição.
*   **ExampleLanguage** (string): A linguagem do exemplo (ex.: "json", "xml").
*   **PayloadType** (Type): Se definido, o exemplo e o esquema serão gerados automaticamente a partir desse tipo quando os manipuladores de contexto configurados o suportarem.

### `ApiResponse`

Descreve uma resposta possível do endpoint.

*   **StatusCode** (HttpStatusCode, required in constructor): O código de status HTTP retornado (ex.: `HttpStatusCode.OK`).
*   **Description** (string): Descreve a condição para esta resposta.
*   **Example** (string): Uma string bruta contendo um exemplo do corpo da resposta.
*   **ExampleLanguage** (string): A linguagem do exemplo.
*   **PayloadType** (Type): Se definido, o exemplo e o esquema serão gerados automaticamente a partir desse tipo quando os manipuladores de contexto configurados o suportarem.

## Manipuladores de Tipo

Os manipuladores de tipo são responsáveis por converter seus tipos .NET (classes, enums, etc.) em exemplos de documentação. Isso é particularmente útil para gerar exemplos automáticos de corpos de requisição e resposta com base em seus modelos de dados.

Esses manipuladores são configurados dentro do `ApiGenerationContext`.

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

O `JsonContentTypeHandler` é um manipulador embutido que gera exemplos JSON, exemplos de parâmetros e esquemas JSON. Ele implementa `IExampleBodyTypeHandler`, `IExampleParameterTypeHandler` e `IContentSchemaTypeHandler`.

Ele pode ser customizado com opções específicas de `JsonSerializerOptions` ou `IJsonTypeInfoResolver` para corresponder à lógica de serialização da sua aplicação.

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

### Custom Type Handlers

Você pode implementar seus próprios manipuladores para suportar outros formatos (como XML) ou para personalizar como os exemplos são gerados.

#### IExampleBodyTypeHandler

Implemente esta interface para gerar exemplos de corpo para tipos de requisição e resposta.

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

Implemente esta interface para gerar descrições detalhadas de parâmetros a partir de um tipo (usado por `[ApiParametersFrom]`).

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

Os exportadores são responsáveis por converter os metadados de documentação de API coletados em um formato específico que pode ser consumido por outras ferramentas ou exibido ao usuário.

### OpenApiExporter

O exportador padrão fornecido é o `OpenApiExporter`, que gera um arquivo JSON seguindo a [OpenAPI Specification 3.0.0](https://spec.openapis.org/oas/v3.0.0).

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

Você pode criar seu próprio exportador implementando a interface `IApiDocumentationExporter`. Isso permite que você exporte a documentação em formatos como Markdown, HTML, Postman Collection ou qualquer outro formato customizado.

A interface requer que você implemente um único método: `ExportDocumentationContent`.

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

Então, basta usá-lo na sua configuração:

```csharp
host.UseApiDocumentation(
    // ...
    exporter: new MyCustomExporter()
);
```

### Full Example

Abaixo está um exemplo completo demonstrando como configurar o `Sisk.Documenting` e documentar um controlador simples.

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

Neste exemplo, acessar `/api/docs` servirá a documentação gerada para a API "My application", descrevendo o endpoint `GET /` e seu parâmetro `name`.