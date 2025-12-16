# Documentação da API

A extensão `Sisk.Documenting` permite gerar documentação de API para seu aplicativo Sisk de forma automática. Ela aproveita a estrutura do seu código e atributos para criar um site de documentação abrangente, com suporte à exportação para o formato Open API (Swagger).

> [!WARNING]
> Este pacote está atualmente em desenvolvimento e ainda não foi publicado. Seu comportamento e API podem ser alterados em atualizações futuras.

Como este pacote ainda não está disponível no NuGet, você deve incorporar o código-fonte diretamente ao seu projeto ou referenciá-lo como uma dependência de projeto. Você pode acessar o código-fonte [aqui](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Documenting).

Para usar `Sisk.Documenting`, você precisa registrá-lo no construtor do aplicativo e decorar os manipuladores de rotas com atributos de documentação.

### Registrando o Middleware

Use o método de extensão `UseApiDocumentation` no `HttpServerBuilder` para habilitar a documentação da API.

```csharp
using Sisk.Documenting;

// ...

host.UseApiDocumentation(
    context: new ApiGenerationContext()
    {
        ApplicationName = "Meu Aplicativo",
        ApplicationDescription = "Descrição do meu aplicativo.",
        Version = "1.0.0"
    },
    routerPath: "/api/docs",
    exporter: new OpenApiExporter() { ServerUrls = ["http://localhost:5555/"] });
```

- **context**: Define metadados sobre o aplicativo, como nome, descrição e versão.
- **routerPath**: O caminho da URL onde a interface do usuário da documentação (ou JSON) estará acessível.
- **exporter**: Configura como a documentação é exportada. O `OpenApiExporter` habilita o suporte ao Open API (Swagger).

### Documentando Endpoints

Você pode descrever os endpoints usando os atributos `[ApiEndpoint]` e `[ApiQueryParameter]` nos métodos dos manipuladores de rotas.

### `ApiEndpoint`

O atributo `[ApiEndpoint]` permite fornecer uma descrição para o endpoint.

```csharp
[ApiEndpoint(Description = "Retorna uma mensagem de saudação.")]
public HttpResponse Index(HttpRequest request) { ... }
```

### `ApiQueryParameter`

O atributo `[ApiQueryParameter]` documenta parâmetros de string de consulta que o endpoint aceita.

```csharp
[ApiQueryParameter(name: "name", IsRequired = false, Description = "O nome da pessoa a ser saudada.", Type = "string")]
public HttpResponse Index(HttpRequest request) { ... }
```

- **name**: O nome do parâmetro de consulta.
- **IsRequired**: Especifica se o parâmetro é obrigatório.
- **Description**: Uma descrição legível para o parâmetro.
- **Type**: O tipo de dados esperado (por exemplo, "string", "int").

### `ApiEndpoint`

Anota um endpoint com informações gerais.

*   **Name** (string, obrigatório no construtor): O nome do endpoint da API.
*   **Description** (string): Uma descrição breve do que o endpoint faz.
*   **Group** (string): Permite agrupar endpoints (por exemplo, por controlador ou módulo).
*   **InheritDescriptionFromXmlDocumentation** (bool, padrão: `true`): Se `true`, tenta usar o resumo da documentação XML do método se `Description` não for definido.

### `ApiHeader`

Documenta um cabeçalho HTTP específico que o endpoint espera ou utiliza.

*   **HeaderName** (string, obrigatório no construtor): A chave do cabeçalho (por exemplo, "Authorization").
*   **Description** (string): Descreve o propósito do cabeçalho.
*   **IsRequired** (bool): Indica se o cabeçalho é obrigatório para a solicitação.

### `ApiParameter`

Define um parâmetro genérico para o endpoint, frequentemente usado para campos de formulário ou parâmetros do corpo não cobertos por outros atributos.

*   **Name** (string, obrigatório no construtor): O nome do parâmetro.
*   **TypeName** (string, obrigatório no construtor): O tipo de dados do parâmetro (por exemplo, "string", "int").
*   **Description** (string): Uma descrição do parâmetro.
*   **IsRequired** (bool): Indica se o parâmetro é obrigatório.

### `ApiParametersFrom`

Gera automaticamente a documentação de parâmetros a partir das propriedades de uma classe ou tipo especificado.

*   **Type** (Type, obrigatório no construtor): O tipo `Type` para refletir propriedades.

### `ApiPathParameter`

Documenta uma variável de caminho (por exemplo, em `/users/{id}`).

*   **Name** (string, obrigatório no construtor): O nome do parâmetro do caminho.
*   **Description** (string): Descreve o que o parâmetro representa.
*   **Type** (string): O tipo de dados esperado.

### `ApiQueryParameter`

Documenta um parâmetro de string de consulta (por exemplo, `?page=1`).

*   **Name** (string, obrigatório no construtor): A chave do parâmetro de consulta.
*   **Description** (string): Descreve o parâmetro.
*   **Type** (string): O tipo de dados esperado.
*   **IsRequired** (bool): Indica se o parâmetro de consulta deve estar presente.

### `ApiRequest`

Descreve o corpo da solicitação esperado.

*   **Description** (string, obrigatório no construtor): Uma descrição do corpo da solicitação.
*   **Example** (string): Uma string bruta contendo um exemplo do corpo da solicitação.
*   **ExampleLanguage** (string): A linguagem do exemplo (por exemplo, "json", "xml").
*   **ExampleType** (Type): Se definido, o exemplo será gerado automaticamente a partir deste tipo (se suportado pelo contexto).

### `ApiResponse`

Descreve uma resposta possível do endpoint.

*   **StatusCode** (HttpStatusCode, obrigatório no construtor): O código de status HTTP retornado (por exemplo, `HttpStatusCode.OK`).
*   **Description** (string): Descreve a condição para esta resposta.
*   **Example** (string): Uma string bruta contendo um exemplo do corpo da resposta.
*   **ExampleLanguage** (string): A linguagem do exemplo.
*   **ExampleType** (Type): Se definido, o exemplo será gerado automaticamente a partir deste tipo.

## Manipuladores de Tipo

Os manipuladores de tipo são responsáveis por converter os tipos .NET (classes, enums, etc.) em exemplos de documentação. Isso é particularmente útil para gerar exemplos automáticos de corpo de solicitação e resposta com base nos modelos de dados.

Esses manipuladores são configurados dentro do `ApiGenerationContext`.

```csharp
var context = new ApiGenerationContext()
{
    // ...
    BodyExampleTypeHandler = new JsonExampleTypeHandler(),
    ParameterExampleTypeHandler = new JsonExampleTypeHandler()
};
```

### JsonExampleTypeHandler

O `JsonExampleTypeHandler` é um manipulador incorporado que gera exemplos em JSON. Ele implementa tanto `IExampleBodyTypeHandler` quanto `IExampleParameterTypeHandler`.

Ele pode ser personalizado com opções específicas `JsonSerializerOptions` ou `IJsonTypeInfoResolver` para corresponder à lógica de serialização do aplicativo.

```csharp
var jsonHandler = new JsonExampleTypeHandler(new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    WriteIndented = true
});

context.BodyExampleTypeHandler = jsonHandler;
```

### Manipuladores de Tipo Personalizados

Você pode implementar seus próprios manipuladores para suportar outros formatos (como XML) ou para personalizar como os exemplos são gerados.

#### IExampleBodyTypeHandler

Implemente esta interface para gerar exemplos de corpo para tipos de solicitação e resposta.

```csharp
public class XmlExampleTypeHandler : IExampleBodyTypeHandler
{
    public BodyExampleResult? GetBodyExampleForType(Type type)
    {
        // Gera string XML para o tipo
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
                description: "Descrição gerada"
            ));
        }

        return examples.ToArray();
    }
}
```

## Exportadores

Os exportadores são responsáveis por converter os metadados de documentação da API coletados em um formato específico que possa ser consumido por outras ferramentas ou exibido ao usuário.

### OpenApiExporter

O exportador padrão fornecido é o `OpenApiExporter`, que gera um arquivo JSON seguindo a [Especificação OpenAPI 3.0.0](https://spec.openapis.org/oas/v3.0.0).

```csharp
new OpenApiExporter()
{
    OpenApiVersion = "3.0.0",
    ServerUrls = new[] { "http://localhost:5555" },
    Contact = new OpenApiContact()
    {
        Name = "Suporte",
        Email = "suporte@example.com",
        Url = "https://example.com/suporte"
    },
    License = new OpenApiLicense()
    {
        Name = "MIT",
        Url = "https://opensource.org/licenses/MIT"
    },
    TermsOfService = "https://example.com/termos"
}
```

### Criando um Exportador Personalizado

Você pode criar seu próprio exportador implementando a interface `IApiDocumentationExporter`. Isso permite saídas de documentação em formatos como Markdown, HTML, Coleção Postman ou qualquer outro formato personalizado.

A interface exige a implementação de um único método: `ExportDocumentationContent`.

```csharp
using Sisk.Core.Http;
using Sisk.Documenting;

public class MyCustomExporter : IApiDocumentationExporter
{
    public HttpContent ExportDocumentationContent(ApiDocumentation documentation)
    {
        // 1. Processa o objeto de documentação
        var sb = new StringBuilder();
        sb.AppendLine($"# {documentation.ApplicationName}");

        foreach(var endpoint in documentation.Endpoints)
        {
            sb.AppendLine($"## {endpoint.Method} {endpoint.Path}");
            sb.AppendLine(endpoint.Description);
        }

        // 2. Retorna o conteúdo como um HttpContent
        return new StringContent(sb.ToString(), Encoding.UTF8, "text/markdown");
    }
}
```

Em seguida, basta usá-lo na configuração:

```csharp
host.UseApiDocumentation(
    // ...
    exporter: new MyCustomExporter()
);
```

### Exemplo Completo

Abaixo está um exemplo completo demonstrando como configurar `Sisk.Documenting` e documentar um controlador simples.

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
            ApplicationName = "Meu Aplicativo",
            ApplicationDescription = "Ele saúda alguém."
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
    [ApiEndpoint(Description = "Retorna uma mensagem de saudação.")]
    [ApiQueryParameter(name: "name", IsRequired = false, Description = "O nome da pessoa a ser saudada.", Type = "string")]
    public HttpResponse Index(HttpRequest request)
    {
        string? name = request.Query["name"].MaybeNullOrEmpty() ?? "mundo";
        return new HttpResponse($"Olá, {name}!");
    }
}
```

Neste exemplo, acessar `/api/docs` servirá a documentação gerada para a API "Meu Aplicativo", descrevendo o endpoint `GET /` e seu parâmetro `name`.