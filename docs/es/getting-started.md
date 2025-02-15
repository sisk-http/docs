# Introducción a Sisk

Sisk puede ejecutarse en cualquier entorno .NET. En esta guía, te enseñaremos cómo crear una aplicación Sisk utilizando .NET. Si aún no lo has instalado, por favor descarga el SDK desde [aquí](https://dotnet.microsoft.com/en-us/download/dotnet/7.0).

En este tutorial, cubriremos cómo crear una estructura de proyecto, recibir una solicitud, obtener un parámetro de URL y enviar una respuesta. Esta guía se centrará en construir un servidor simple utilizando C#. También puedes utilizar tu lenguaje de programación favorito.

> [!NOTE]
> Es posible que estés interesado en un proyecto de inicio rápido. Consulta [este repositorio](https://github.com/sisk-http/quickstart) para obtener más información.

## Creación de un Proyecto

Llamemos a nuestro proyecto "Mi Aplicación Sisk". Una vez que tengas .NET configurado, puedes crear tu proyecto con el siguiente comando:

```bash
dotnet new console -n mi-aplicacion-sisk
```

A continuación, navega hasta el directorio de tu proyecto e instala Sisk utilizando la herramienta de utilidad .NET:

```bash
cd mi-aplicacion-sisk
dotnet add package Sisk.HttpServer
```

Puedes encontrar formas adicionales de instalar Sisk en tu proyecto [aquí](https://www.nuget.org/packages/Sisk.HttpServer/).

Ahora, creemos una instancia de nuestro servidor HTTP. En este ejemplo, lo configuraremos para escuchar en el puerto 5000.

## Construcción del Servidor HTTP

Sisk te permite construir tu aplicación paso a paso manualmente, ya que enruta al objeto HttpServer. Sin embargo, esto puede no ser muy conveniente para la mayoría de los proyectos. Por lo tanto, podemos utilizar el método de creación, que facilita la ejecución de nuestra aplicación.

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
                Content = new StringContent("Hola, mundo!")
            };
        });
        
        await app.StartAsync();
    }
}
```

Es importante entender cada componente vital de Sisk. Más adelante en este documento, aprenderás más sobre cómo funciona Sisk.

## Configuración Manual (Avanzada)

Puedes aprender cómo funciona cada mecanismo de Sisk en [esta sección](/docs/advanced/manual-setup) de la documentación, que explica el comportamiento y las relaciones entre el HttpServer, Router, ListeningPort y otros componentes.