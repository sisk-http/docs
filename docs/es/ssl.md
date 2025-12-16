# Trabajando con SSL

Trabajar con SSL para desarrollo puede ser necesario cuando se trabaja en contextos que requieren seguridad, como la mayoría de los escenarios de desarrollo web. Sisk funciona sobre HttpListener, que no soporta HTTPS nativo, solo HTTP. Sin embargo, existen soluciones alternativas que le permiten trabajar con SSL en Sisk. Véalas a continuación:

## A través de Sisk.Cadente.CoreEngine

- Disponible en: Linux, macOS, Windows
- Esfuerzo: fácil

Es posible usar el motor experimental [**Cadente**](/docs/es/cadente) en proyectos Sisk, sin requerir configuración adicional en el equipo o en el proyecto. Necesitará instalar el paquete `Sisk.Cadente.CoreEngine` en su proyecto para poder usar el servidor Cadente en el servidor Sisk.

Para configurar SSL, puede usar los métodos `UseSsl` y `UseEngine` del constructor:

```csharp
using var http = HttpServer.CreateBuilder()
    .UseEngine<CadenteHttpServerEngine>()
    .UseSsl(CertificateHelper.CreateTrustedDevelopmentCertificate("localhost"))
```

> Nota: este paquete aún está en fase experimental.

## A través de IIS en Windows

- Disponible en: Windows
- Esfuerzo: medio

Si está en Windows, puede usar IIS para habilitar SSL en su servidor HTTP. Para que esto funcione, es aconsejable que siga [este tutorial](/docs/es/registering-namespace) de antemano si desea que su aplicación escuche en un host distinto de "localhost".

Para que esto funcione, debe instalar IIS a través de las características de Windows. IIS está disponible de forma gratuita para usuarios de Windows y Windows Server. Para configurar SSL en su aplicación, tenga listo el certificado SSL, aunque sea autofirmado. A continuación, puede ver [cómo configurar SSL en IIS 7 o superior](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis).

## A través de mitmproxy

- Disponible en: Linux, macOS, Windows
- Esfuerzo: fácil

**mitmproxy** es una herramienta de proxy de interceptación que permite a desarrolladores y evaluadores de seguridad inspeccionar, modificar y registrar el tráfico HTTP y HTTPS entre un cliente (como un navegador web) y un servidor. Puede usar la utilidad **mitmdump** para iniciar un proxy SSL inverso entre su cliente y su aplicación Sisk.

1. Primero, instale [mitmproxy](https://mitmproxy.org/) en su máquina.  
2. Inicie su aplicación Sisk. Para este ejemplo, usaremos el puerto 8000 como el puerto HTTP inseguro.  
3. Inicie el servidor mitmproxy para escuchar en el puerto seguro 8001:

```sh
mitmdump --mode reverse:http://localhost:8000/ -p 8001
```

¡Y ya está listo! Ya puede acceder a su aplicación a través de `https://localhost:8001/`. Su aplicación no necesita estar ejecutándose para que inicie `mitmdump`.

Alternativamente, puede agregar una referencia al [mitmproxy helper](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Helpers.mitmproxy) en su proyecto. Esto aún requiere que mitmproxy esté instalado en su computadora.

## A través del paquete Sisk.SslProxy

- Disponible en: Linux, macOS, Windows
- Esfuerzo: fácil

> [!IMPORTANT]
> 
> El paquete Sisk.SslProxy está obsoleto en favor del paquete `Sisk.Cadente.CoreEngine` y ya no se mantendrá.

El paquete Sisk.SslProxy es una forma sencilla de habilitar SSL en su aplicación Sisk. Sin embargo, es un paquete **extremadamente experimental**. Puede ser inestable trabajar con este paquete, pero puede formar parte del pequeño porcentaje de personas que contribuirán a que este paquete sea viable y estable. Para comenzar, puede instalar el paquete Sisk.SslProxy con:

```sh
dotnet add package Sisk.SslProxy
```

> [!NOTE]
> 
> Debe habilitar "Incluir versiones preliminares" en el Administrador de paquetes de Visual Studio para instalar Sisk.SslProxy.

Nuevamente, es un proyecto experimental, así que ni lo piense para ponerlo en producción.

En este momento, Sisk.SslProxy puede manejar la mayoría de las características de HTTP/1.1, incluyendo HTTP Continue, Chunked-Encoding, WebSockets y SSE. Lea más sobre SslProxy [aquí](/docs/es/extensions/ssl-proxy).