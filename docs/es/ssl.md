# Trabajando con SSL

Trabajar con SSL para desarrollo puede ser necesario cuando se trabaja en contextos que requieren seguridad, como la mayoría de los escenarios de desarrollo web. Sisk opera sobre HttpListener, que no admite HTTPS de forma nativa, solo HTTP. Sin embargo, existen soluciones alternativas que te permiten trabajar con SSL en Sisk. Consulta a continuación:

## A través de IIS en Windows

- Disponible en: Windows
- Esfuerzo: medio

Si estás en Windows, puedes utilizar IIS para habilitar SSL en tu servidor HTTP. Para que esto funcione, es recomendable que sigas [este tutorial](/docs/registering-namespace) con anticipación si deseas que tu aplicación escuche en un host diferente a "localhost".

Para que esto funcione, debes instalar IIS a través de las características de Windows. IIS está disponible de forma gratuita para usuarios de Windows y Windows Server. Para configurar SSL en tu aplicación, ten el certificado SSL listo, incluso si es auto-firmado. A continuación, puedes ver [cómo configurar SSL en IIS 7 o superior](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis).

## A través de mitmproxy

- Disponible en: Linux, macOS, Windows
- Esfuerzo: fácil

**mitmproxy** es una herramienta de proxy de interceptación que permite a los desarrolladores y testers de seguridad inspeccionar, modificar y grabar el tráfico HTTP y HTTPS entre un cliente (como un navegador web) y un servidor. Puedes utilizar la utilidad **mitmdump** para iniciar un proxy SSL inverso entre tu cliente y tu aplicación Sisk.

1. Primero, instala [mitmproxy](https://mitmproxy.org/) en tu máquina.
2. Inicia tu aplicación Sisk. En este ejemplo, utilizaremos el puerto 8000 como el puerto HTTP inseguro.
3. Inicia el servidor mitmproxy para escuchar el puerto seguro en 8001:

```sh
mitmdump --mode reverse:http://localhost:8000/ -p 8001
```

Y listo! Ya puedes acceder a tu aplicación a través de `https://localhost:8001/`. Tu aplicación no necesita estar en ejecución para iniciar `mitmdump`.

## A través del paquete Sisk.SslProxy

- Disponible en: Linux, macOS, Windows
- Esfuerzo: fácil

El paquete Sisk.SslProxy es una forma sencilla de habilitar SSL en tu aplicación Sisk. Sin embargo, es un paquete **extremadamente experimental**. Puede ser inestable trabajar con este paquete, pero puedes ser parte del pequeño porcentaje de personas que contribuirán a hacer que este paquete sea viable y estable. Para empezar, puedes instalar el paquete Sisk.SslProxy con:

```sh
dotnet add package Sisk.SslProxy
```

> [!NOTE]
>
> Debes habilitar "Habilitar paquetes de pre-lanzamiento" en el Administrador de paquetes de Visual Studio para instalar Sisk.SslProxy.

Nuevamente, es un proyecto experimental, así que no pienses en ponerlo en producción.

En este momento, Sisk.SslProxy puede manejar la mayoría de las características de HTTP/1.1, incluyendo HTTP Continue, Chunked-Encoding, WebSockets y SSE. Lee más sobre SslProxy [aquí](/docs/extensions/ssl-proxy).