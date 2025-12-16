# Introducción

Bienvenido a la documentación de Sisk.

Finalmente, ¿qué es el Marco de Sisk? Es una biblioteca de código abierto y ligera construida con .NET, diseñada para ser minimalista, flexible y abstracta. Permite a los desarrolladores crear servicios de internet rápidamente, con poca o ninguna configuración necesaria. Sisk hace posible que su aplicación existente tenga un módulo HTTP administrado, completo y desechable o completo.

Los valores de Sisk incluyen la transparencia del código, la modularidad, el rendimiento y la escalabilidad, y pueden manejar varios tipos de aplicaciones, como Restful, JSON-RPC, Web-sockets y más.

Sus características principales incluyen:

| Recurso | Descripción |
| ------- | --------- |
| [Enrutamiento](/docs/es/fundamentals/routing) | Un enrutador de rutas que admite prefijos, métodos personalizados, variables de ruta, convertidores de valores y más. |
| [Controladores de solicitudes](/docs/es/fundamentals/request-handlers) | También conocidos como *middlewares*, proporcionan una interfaz para crear sus propios controladores de solicitudes que funcionan con la solicitud antes o después de una acción. |
| [Compresión](/docs/es/fundamentals/responses#gzip-deflate-and-brotli-compression) | Comprima el contenido de su respuesta fácilmente con Sisk. |
| [Web sockets](/docs/es/features/websockets) | Proporciona rutas que aceptan websockets completos, para leer y escribir en el cliente. |
| [Eventos enviados por el servidor](/docs/es/features/server-sent-events) | Proporciona el envío de eventos del servidor a clientes que admiten el protocolo SSE. |
| [Registro](/docs/es/features/logging) | Registro simplificado. Registre errores, acceso, defina registros rotativos por tamaño, varias secuencias de salida para el mismo registro, y más. |
| [Multi-hospedaje](/docs/es/advanced/multi-host-setup) | Tenga un servidor HTTP para varios puertos, y cada puerto con su propio enrutador, y cada enrutador con su propia aplicación. |
| [Controladores de servidor](/docs/es/advanced/http-server-handlers) | Amplíe su propia implementación del servidor HTTP. Personalice con extensiones, mejoras y nuevas características.

## Primeros pasos

Sisk puede ejecutarse en cualquier entorno .NET. En esta guía, le enseñaremos cómo crear una aplicación Sisk utilizando .NET. Si aún no lo ha instalado, descargue el SDK desde [aquí](https://dotnet.microsoft.com/en-us/download/dotnet/7.0).

En este tutorial, cubriremos cómo crear una estructura de proyecto, recibir una solicitud, obtener un parámetro de URL y enviar una respuesta. Esta guía se centrará en la creación de un servidor simple utilizando C#. También puede utilizar su lenguaje de programación favorito.

> [!NOTE]
> Es posible que esté interesado en un proyecto de inicio rápido. Consulte [este repositorio](https://github.com/sisk-http/quickstart) para obtener más información.

## Creación de un proyecto

Llamemos a nuestro proyecto "Mi aplicación Sisk". Una vez que tenga configurado .NET, puede crear su proyecto con el siguiente comando:

```bash
dotnet new console -n my-sisk-application
```

A continuación, navegue hasta el directorio de su proyecto e instale Sisk utilizando la herramienta de utilidad .NET:

```bash
cd my-sisk-application
dotnet add package Sisk.HttpServer
```

Puede encontrar formas adicionales de instalar Sisk en su proyecto [aquí](https://www.nuget.org/packages/Sisk.HttpServer/).

Ahora, creemos una instancia de nuestro servidor HTTP. En este ejemplo, lo configuraremos para escuchar en el puerto 5000.

## Construcción del servidor HTTP

Sisk le permite construir su aplicación paso a paso manualmente, ya que enruta al objeto HttpServer. Sin embargo, esto puede no ser muy conveniente para la mayoría de los proyectos. Por lo tanto, podemos utilizar el método del constructor, que facilita la ejecución de nuestra aplicación.

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

Es importante entender cada componente vital de Sisk. Más adelante en este documento, aprenderá más sobre cómo funciona Sisk.

## Configuración manual (avanzada)

Puede aprender cómo funciona cada mecanismo de Sisk en [esta sección](/docs/es/advanced/manual-setup) de la documentación, que explica el comportamiento y las relaciones entre el HttpServer, el enrutador, el puerto de escucha y otros componentes.