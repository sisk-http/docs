# Introdução ao Sisk

Sisk pode ser executado em qualquer ambiente .NET. Neste guia, vamos ensinar como criar um aplicativo Sisk usando .NET. Se você ainda não o instalou, por favor, baixe o SDK [aqui](https://dotnet.microsoft.com/en-us/download/dotnet/7.0).

Neste tutorial, vamos cobrir como criar uma estrutura de projeto, receber uma solicitação, obter um parâmetro de URL e enviar uma resposta. Este guia se concentrará em construir um servidor simples usando C#. Você também pode usar sua linguagem de programação favorita.

> [!NOTE]
> Você pode estar interessado em um projeto de início rápido. Verifique [este repositório](https://github.com/sisk-http/quickstart) para obter mais informações.

## Criando um Projeto

Vamos nomear nosso projeto "Meu Aplicativo Sisk". Uma vez que você tenha o .NET configurado, você pode criar seu projeto com o seguinte comando:

```bash
dotnet new console -n meu-aplicativo-sisk
```

Em seguida, navegue até o diretório do seu projeto e instale o Sisk usando a ferramenta de utilitário .NET:

```bash
cd meu-aplicativo-sisk
dotnet add package Sisk.HttpServer
```

Você pode encontrar maneiras adicionais de instalar o Sisk no seu projeto [aqui](https://www.nuget.org/packages/Sisk.HttpServer/).

Agora, vamos criar uma instância do nosso servidor HTTP. Para este exemplo, vamos configurá-lo para ouvir na porta 5000.

## Construindo o Servidor HTTP

Sisk permite que você construa seu aplicativo passo a passo manualmente, pois ele roteia para o objeto HttpServer. No entanto, isso pode não ser muito conveniente para a maioria dos projetos. Portanto, podemos usar o método de construtor, que torna mais fácil colocar nosso aplicativo em execução.

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

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

## Configuração Manual (avançada)

Você pode aprender como cada mecanismo do Sisk funciona [nesta seção](/docs/advanced/manual-setup) da documentação, que explica o comportamento e as relações entre o HttpServer, Router, ListeningPort e outros componentes.