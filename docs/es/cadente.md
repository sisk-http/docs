# Cadente

Cadente es una implementación experimental de escucha de HTTP/1.1 administrada para Sisk. Sirve como reemplazo del `System.Net.HttpListener` predeterminado, ofreciendo un mayor control y flexibilidad, especialmente en plataformas no Windows.

## Visión general

De forma predeterminada, Sisk utiliza `HttpListener` (de `System.Net`) como su motor de servidor HTTP subyacente. Si bien `HttpListener` es estable y performante en Windows (donde utiliza el controlador HTTP.sys en modo kernel), su implementación en Linux y macOS es administrada y ha tenido históricamente limitaciones, como la falta de soporte nativo SSL (que requiere un proxy inverso como Nginx o Sisk.SslProxy) y características de rendimiento variables.

Cadente tiene como objetivo resolver estos problemas al proporcionar un servidor HTTP/1.1 completamente administrado escrito en C#. Sus objetivos clave son:

- **Soporte nativo SSL:** Funciona en todas las plataformas sin necesidad de proxies externos o configuraciones complejas.
- **Consistencia entre plataformas:** Comportamiento idéntico en Windows, Linux y macOS.
- **Rendimiento:** Diseñado para ser una alternativa de alto rendimiento al `HttpListener` administrado.
- **Independencia:** Desacoplado de `System.Net.HttpListener`, aislando a Sisk de posibles deprecaciones o falta de mantenimiento de ese componente en .NET.

> [!WARNING]
> **Estado experimental**
> 
> Cadente se encuentra actualmente en una etapa experimental (Beta). No se recomienda su uso en entornos de producción críticos. La API y el comportamiento pueden cambiar.

## Instalación

Cadente está disponible como un paquete separado. Para utilizarlo con Sisk, necesitas el paquete `Sisk.Cadente.CoreEngine`.

```bash
dotnet add package Sisk.Cadente.CoreEngine --prerelease
```

## Uso con Sisk

Para utilizar Cadente como el motor HTTP para tu aplicación Sisk, debes configurar el `HttpServer` para que utilice `CadenteHttpServerEngine` en lugar del motor predeterminado.

El `CadenteHttpServerEngine` adapta el `HttpHost` de Cadente a la abstracción `HttpServerEngine` requerida por Sisk.

```csharp
using Sisk.Core.Http;
using Sisk.Cadente.CoreEngine;

using var host = HttpServer.CreateBuilder()
    .UseEngine<CadenteHttpServerEngine>()
    .UseSsl(certificate: CertificateHelper.CreateTrustedDevelopmentCertificate("localhost"))
    .Build();

await host.StartAsync();
```

### Configuración avanzada

Puedes personalizar la instancia subyacente de `HttpHost` pasando una acción de configuración al constructor de `CadenteHttpServerEngine`. Esto es útil para configurar tiempos de espera o otros ajustes de bajo nivel.

```csharp
using var engine = new CadenteHttpServerEngine(host =>
{
    // Configurar tiempos de espera de lectura y escritura del cliente
    host.TimeoutManager.ClientReadTimeout = TimeSpan.FromSeconds(30);
    host.TimeoutManager.ClientWriteTimeout = TimeSpan.FromSeconds(30);
});
```

## Uso independiente

Aunque está diseñado principalmente para Sisk, Cadente se puede utilizar como un servidor HTTP independiente (similar a `HttpListener`).

```csharp
using Sisk.Cadente;

var host = new HttpHost(15000)
{
    Handler = new MyHostHandler()
};

host.Start();
Thread.Sleep(-1);

class MyHostHandler : HttpHostHandler
{
    public override async Task OnContextCreatedAsync(HttpHost host, HttpHostContext context)
    {
        context.Response.StatusCode = 200;
        using var writer = new StreamWriter(context.Response.GetResponseStream());
        await writer.WriteLineAsync("Hola, mundo!");
    }
}
```