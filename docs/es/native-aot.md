# Soporte nativo AOT

En el .NET 7, se introdujo el [Native AOT](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/), un modo de compilación de .NET que permite exportar binarios listos en cualquier plataforma compatible, sin requerir que el tiempo de ejecución de .NET esté instalado en la máquina objetivo.

Con Native AOT, su código se compila para código nativo y ya contiene todo lo que necesita para ser ejecutado. Sisk ha estado experimentando con la característica desde la versión 0.9.1, que mejora el soporte para Native AOT con características para definir rutas dinámicas por aplicación sin afectar la compilación con mensajes de advertencia.

Sisk utiliza la reflexión para obtener los métodos que se definirán desde tipos y objetos. Además, Sisk utiliza la reflexión para atributos como `RequestHandlerAttribute`, que se inicializan desde un tipo. Para funcionar correctamente, la compilación AOT utiliza el recorte, donde los tipos dinámicos deben especificar qué se utilizará en el ensamblado final.

Considerando el ejemplo a continuación, es una ruta que llama a un RequestHandler.

```cs
[Route(RouteMethod.Get, "/", LogMode = LogOutput.None)]
[RequestHandler(typeof(MyRequestHandler))]
static HttpResponse IndexPage(HttpRequest request)
{
    HttpResponse htmlResponse = new HttpResponse();
    htmlResponse.Content = new StringContent("Hola, mundo!", System.Text.Encoding.UTF8, "text/plain");
    return htmlResponse;
}
```

Este RequestHandler se invoca dinámicamente durante la ejecución, y esta invocación debe segmentarse, y esta segmentación debe ser explícita.

Para entender mejor qué considerará el compilador de `MyRequestHandler` que se debe mantener en la compilación final es:

- Propiedades públicas;
- Campos públicos y privados;
- Constructores públicos y privados;
- Métodos públicos y privados;

Todo lo que tenga en un RequestHandler que no esté mencionado anteriormente será eliminado por el compilador.

Recordando que todos los demás componentes, clases y paquetes que utilice en su aplicación deben ser compatibles con el recorte AOT, o su código no funcionará como se espera. De todos modos, Sisk no lo abandonará si desean construir algo donde el rendimiento sea una prioridad.

Puede leer más sobre Native AOT y cómo funciona en la documentación oficial de [Microsoft](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/).