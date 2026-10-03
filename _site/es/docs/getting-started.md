# Comenzando

Source: https://docs.sisk-framework.org/es/docs/getting-started.html

¡Bienvenido a la documentación de Sisk!

Sisk es un framework HTTP ligero y de código abierto para .NET. Puedes usarlo para crear un servicio web independiente, incrustar un módulo HTTP dentro de una aplicación existente, o ejecutar un servicio detrás de un proxy inverso con solo la configuración que necesitas.

Los valores de Sisk incluyen transparencia del código, modularidad, rendimiento y escalabilidad. Puede manejar diferentes estilos de aplicación, incluidos APIs RESTful, servicios JSON‑RPC, WebSockets, Server‑Sent Events y servir archivos estáticos.

Sus principales características incluyen:

| Recurso | Descripción |
| ------- | ----------- |
| [Routing](https://docs.sisk-framework.org/es/docs/fundamentals/routing.md) | Un enrutador de rutas que soporta prefijos, métodos personalizados, variables de ruta, convertidores de valores y más. |
| [Request Handlers](https://docs.sisk-framework.org/es/docs/fundamentals/request-handlers.md) | También conocidos como *middlewares*, proporcionan una interfaz para crear tus propios manejadores de solicitud que actúan antes o después de una acción. |
| [Compression](https://docs.sisk-framework.org/es/docs/fundamentals/responses.md#gzip-deflate-and-brotli-compression) | Comprime fácilmente el contenido de tus respuestas con Sisk. |
| [Web sockets](https://docs.sisk-framework.org/es/docs/features/websockets.md) | Proporciona rutas que aceptan websockets completos, para leer y escribir al cliente. |
| [Server-sent events](https://docs.sisk-framework.org/es/docs/features/server-sent-events.md) | Permite el envío de eventos del servidor a clientes que soportan el protocolo SSE. |
| [Logging](https://docs.sisk-framework.org/es/docs/features/logging.md) | Registro simplificado. Registra errores, accesos, define rotación de logs por tamaño, múltiples flujos de salida para el mismo log, y más. |
| [Multi-host](https://docs.sisk-framework.org/es/docs/advanced/multi-host-setup.md) | Tener un servidor HTTP para varios puertos, y cada puerto con su propio enrutador, y cada enrutador con su propia aplicación. |
| [Server handlers](https://docs.sisk-framework.org/es/docs/advanced/http-server-handlers.md) | Extiende tu propia implementación del servidor HTTP. Personaliza con extensiones, mejoras y nuevas funcionalidades. |

## Primeros pasos

Sisk puede ejecutarse en cualquier entorno .NET. En esta guía, te enseñaremos cómo crear una aplicación Sisk usando .NET. Si aún no lo has instalado, descarga el SDK desde [aquí](https://dotnet.microsoft.com/en-us/download/dotnet/7.0).

En este tutorial, cubriremos cómo crear una estructura de proyecto, recibir una solicitud, obtener un parámetro de URL y enviar una respuesta. Esta guía se centrará en construir un servidor simple usando C#. También puedes usar tu lenguaje de programación favorito.

> [!NOTE]
> Puede que te interese un proyecto de inicio rápido. Consulta [este repositorio](https://github.com/sisk-http/quickstart) para más información.

## Creando un proyecto

Llamemos a nuestro proyecto "My Sisk Application". Una vez que tengas .NET configurado, puedes crear tu proyecto con el siguiente comando:

```bash
dotnet new console -n my-sisk-application
```

Luego, navega al directorio de tu proyecto e instala Sisk usando la herramienta de utilidad de .NET:

```bash
cd my-sisk-application
dotnet add package Sisk.HttpServer
```

Puedes encontrar formas adicionales de instalar Sisk en tu proyecto [aquí](https://www.nuget.org/packages/Sisk.HttpServer/).

Ahora, creemos una instancia de nuestro servidor HTTP. Para este ejemplo, lo configuraremos para escuchar en el puerto 5000.

## Construyendo el servidor HTTP

Sisk te permite construir tu aplicación paso a paso manualmente, ya que enruta al objeto HttpServer. Sin embargo, esto puede no ser muy conveniente para la mayoría de los proyectos. Por lo tanto, podemos usar el método builder, que facilita poner nuestra aplicación en marcha.

```csharp {title="Program.cs"}
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
                Content = new StringContent("Hello, world!")
            };
        });
        
        await app.StartAsync();
    }
}
```

Es importante entender cada componente vital de Sisk. Más adelante en este documento, aprenderás más sobre cómo funciona Sisk.

## Configuración manual (avanzada)

Puedes aprender cómo funciona cada mecanismo de Sisk en [esta sección](https://docs.sisk-framework.org/es/docs/advanced/manual-setup.md) de la documentación, que explica el comportamiento y las relaciones entre HttpServer, Router, ListeningPort y otros componentes.
