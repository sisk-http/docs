# Começando com o Sisk

O Sisk pode ser executado em qualquer ambiente .NET. Neste guia, ensinaremos como criar um aplicativo Sisk usando .NET. Se você ainda não o instalou, faça o download do SDK de [aqui](https://dotnet.microsoft.com/en-us/download/dotnet/7.0).

Neste tutorial, vamos cobrir como criar uma estrutura de projeto, receber uma solicitação, obter um parâmetro de URL e enviar uma resposta. Este guia focará na construção de um servidor simples usando C#. Você também pode usar sua linguagem de programação favorita.

> [!NOTE]
> Você pode estar interessado em um projeto rápido. Verifique [este repositório](https://github.com/sisk-http/quickstart) para mais informações.

## Criando um Projeto

Vamos nomear nosso projeto "Meu Aplicativo Sisk". Depois de configurar o .NET, você pode criar seu projeto com o seguinte comando:

```bash
dotnet new console -n meu-sisk-application
```

Em seguida, navegue até o diretório do seu projeto e instale o Sisk usando a ferramenta utilitária .NET:

```bash
cd meu-sisk-application
dotnet add package Sisk.HttpServer
```

Você pode encontrar outras maneiras de instalar o Sisk em seu projeto [aqui](https://www.nuget.org/packages/Sisk.HttpServer/).

Agora, vamos criar uma instância do nosso servidor HTTP. Para este exemplo, vamos configurá-lo para escutar na porta 5000.

## Construindo o Servidor HTTP

O Sisk permite que você construa seu aplicativo passo a passo manualmente, pois ele roteia para o objeto HttpServer. No entanto, isso pode não ser muito conveniente para a maioria dos projetos. Portanto, podemos usar o método de construção, o que torna mais fácil colocar nosso aplicativo em funcionamento.

```csharp
class Program
{
    static async Task Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseListeningPort("http://localhost:5000/")
            .Build();

        app.Router.MapGet("/", request =>
        {
            return new HttpResponse()
            {
                Status = 200,
                Content = new StringContent("Olá, mundo!")
            };
        });

        await app.StartAsync();
    }
}
```

É importante entender cada componente vital do Sisk. Mais tarde neste documento, você aprenderá mais sobre como o Sisk funciona.

## Configuração manual (avançada)

Você pode aprender como cada mecanismo do Sisk funciona em [esta seção](/docs/advanced/manual-setup) da documentação, que explica o comportamento e as relações entre o HttpServer, Router, ListeningPort e outros componentes.