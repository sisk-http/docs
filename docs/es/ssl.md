# Trabajando con SSL

Trabajar con SSL para desarrollo puede ser necesario cuando se trabaja en contextos que requieren seguridad, como la mayoría de los escenarios de desarrollo web. Sisk opera sobre HttpListener, que no admite HTTPS de forma nativa, solo HTTP. Sin embargo, existen soluciones alternativas que permiten trabajar con SSL en Sisk. Consulte a continuación:

## A través de Sisk.Cadente.CoreEngine

- Disponible en: Linux, macOS, Windows
- Esfuerzo: fácil

Es posible utilizar el motor experimental **Cadente** en proyectos Sisk, sin requerir configuración adicional en la computadora o en el proyecto. Deberá instalar el paquete `Sisk.Cadente.CoreEngine` en su proyecto para poder utilizar el servidor Cadente en el servidor Sisk.

Para configurar SSL, puede utilizar los métodos `UseSsl` y `UseEngine` del constructor:

```csharp
using var http = HttpServer.CreateBuilder()
    .UseEngine<CadenteHttpServerEngine>()
    .UseSsl(CertificateHelper.CreateTrustedDevelopmentCertificate("localhost"))
```

> Nota: este paquete aún se encuentra en la fase experimental.

## A través de IIS en Windows

- Disponible en: Windows
- Esfuerzo: medio

Si se encuentra en Windows, puede utilizar IIS para habilitar SSL en su servidor HTTP. Para que esto funcione, se recomienda seguir [este tutorial](/docs/es/registering-namespace) con anticipación si desea que su aplicación esté escuchando en un host diferente a "localhost".

Para que esto funcione, debe instalar IIS a través de las características de Windows. IIS está disponible de forma gratuita para usuarios de Windows y Windows Server. Para configurar SSL en su aplicación, tenga listo el certificado SSL, incluso si es autoemitido. A continuación, puede ver [cómo configurar SSL en IIS 7 o superior](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis).

## A través de mitmproxy

- Disponible en: Linux, macOS, Windows
- Esfuerzo: fácil

**mitmproxy** es una herramienta de proxy de interceptación que permite a los desarrolladores y testers de seguridad inspeccionar, modificar y grabar el tráfico HTTP y HTTPS entre un cliente (como un navegador web) y un servidor. Puede utilizar la utilidad **mitmdump** para iniciar un proxy SSL inverso entre su cliente y su aplicación Sisk.

1. Primero, instale [mitmproxy](https://mitmproxy.org/) en su máquina.
2. Inicie su aplicación Sisk. En este ejemplo, utilizaremos el puerto 8000 como el puerto HTTP inseguro.
3. Inicie el servidor mitmproxy para escuchar en el puerto seguro 8001:

```sh
mitmdump --mode reverse:http://localhost:8000/ -p 8001
```

Y listo! Ya puede acceder a su aplicación a través de `https://localhost:8001/`. Su aplicación no necesita estar en ejecución para iniciar `mitmdump`.

Alternativamente, puede agregar una referencia a la [herramienta de ayuda de mitmproxy](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Helpers.mitmproxy) en su proyecto. Esto aún requiere que mitmproxy esté instalado en su computadora.

## A través del paquete Sisk.SslProxy

- Disponible en: Linux, macOS, Windows
- Esfuerzo: fácil

> [!IMPORTANT]
>
> El paquete Sisk.SslProxy está en desuso a favor del paquete `Sisk.Cadente.CoreEngine` y ya no será mantenido.

El paquete Sisk.SslProxy es una forma sencilla de habilitar SSL en su aplicación Sisk. Sin embargo, es un paquete **extremadamente experimental**. Puede ser inestable trabajar con este paquete, pero puede ser parte del pequeño porcentaje de personas que contribuirán a hacer que este paquete sea viable y estable. Para empezar, puede instalar el paquete Sisk.SslProxy con:

```sh
dotnet add package Sisk.SslProxy
```

> [!NOTE]
>
> Debe habilitar "Incluir prelanzamiento" en el Administrador de paquetes de Visual Studio para instalar Sisk.SslProxy.

Nuevamente, es un proyecto experimental, así que ni siquiera piense en ponerlo en producción.

En este momento, Sisk.SslProxy puede manejar la mayoría de las características de HTTP/1.1, incluyendo HTTP Continue, Chunked-Encoding, WebSockets y SSE. Lea más sobre SslProxy [aquí](/docs/es/extensions/ssl-proxy).