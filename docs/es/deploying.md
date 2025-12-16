# Desplegando tu aplicación Sisk

El proceso de desplegar una aplicación Sisk consiste en publicar tu proyecto en producción. Aunque el proceso es relativamente simple, es digno de tener en cuenta detalles que pueden ser letales para la seguridad y la estabilidad de la infraestructura de despliegue.

Idealmente, deberías estar listo para desplegar tu aplicación en la nube, después de realizar todas las pruebas posibles para tener tu aplicación lista.

## Publicando tu aplicación

Publicar tu aplicación o servicio Sisk es generar binarios listos y optimizados para producción. En este ejemplo, compilaremos los binarios para producción para ejecutarlos en una máquina que tenga el tiempo de ejecución de .NET instalado.

Necesitarás el SDK de .NET instalado en tu máquina para compilar tu aplicación, y el tiempo de ejecución de .NET instalado en el servidor objetivo para ejecutar tu aplicación. Puedes aprender a instalar el tiempo de ejecución de .NET en tu servidor Linux [aquí](https://learn.microsoft.com/en-us/dotnet/core/install/linux), [Windows](https://learn.microsoft.com/en-us/dotnet/core/install/windows?tabs=net70) y [Mac OS](https://learn.microsoft.com/en-us/dotnet/core/install/macos).

En la carpeta donde se encuentra tu proyecto, abre una terminal y utiliza el comando de publicación de .NET:

```shell
$ dotnet publish -r linux-x64 -c Release
```

Esto generará tus binarios dentro de `bin/Release/publish/linux-x64`.

> [!NOTE]
> Si tu aplicación se ejecuta utilizando el paquete Sisk.ServiceProvider, debes copiar tu archivo `service-config.json` en tu servidor de host junto con todos los binarios generados por `dotnet publish`.
> Puedes dejar el archivo preconfigurado, con variables de entorno, puertos y hosts de escucha, y configuraciones de servidor adicionales.

El siguiente paso es trasladar estos archivos al servidor donde se alojará tu aplicación.

Después de eso, da permisos de ejecución a tu archivo binario. En este caso, consideremos que el nombre de nuestro proyecto es "my-app":

```shell
$ cd /home/htdocs
$ chmod +x my-app
$ ./my-app
```

Después de ejecutar tu aplicación, verifica si produce algún mensaje de error. Si no produce ninguno, es porque tu aplicación se está ejecutando.

En este punto, es probable que no sea posible acceder a tu aplicación desde la red externa fuera de tu servidor, ya que no se han configurado las reglas de acceso como el Firewall. Consideraremos esto en los siguientes pasos.

Debes tener la dirección del host virtual donde tu aplicación está escuchando. Esto se establece manualmente en la aplicación y depende de cómo estás instanciando tu servicio Sisk.

Si **no** estás utilizando el paquete Sisk.ServiceProvider, debes encontrarla donde definiste tu instancia de HttpServer:

```cs
HttpServer server = HttpServer.Emit(5000, out HttpServerConfiguration config, out var host, out var router);
// sisk debe escuchar en http://localhost:5000/
```

Asociando un ListeningHost manualmente:

```cs
config.ListeningHosts.Add(new ListeningHost("https://localhost:5000/", router));
```

O si estás utilizando el paquete Sisk.ServiceProvider, en tu archivo `service-config.json`:

```json
{
  "Server": { },
  "ListeningHost": {
    "Ports": [
      "http://localhost:5000/"
    ]
  }
}
```

A partir de esto, podemos crear un proxy inverso para escuchar a tu servicio y hacer que el tráfico esté disponible en la red abierta.

## Proxyando tu aplicación

Proxyar tu servicio significa no exponer directamente tu servicio Sisk a una red externa. Esta práctica es muy común para despliegues de servidores porque:

- Permite asociar un certificado SSL en tu aplicación;
- Crear reglas de acceso antes de acceder al servicio y evitar sobrecargas;
- Controlar el ancho de banda y los límites de solicitudes;
- Separar los equilibradores de carga para tu aplicación;
- Prevenir daños de seguridad a la infraestructura fallida.

Puedes servir tu aplicación a través de un proxy inverso como [Nginx](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-nginx?view=aspnetcore-7.0&tabs=linux-ubuntu#install-nginx) o [Apache](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-apache?view=aspnetcore-7.0), o puedes utilizar un túnel http-over-dns como [Cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-and-setup/tunnel-guide/).

También recuerda resolver correctamente los encabezados de reenvío de tu proxy para obtener la información del cliente, como la dirección IP y el host, a través de [resolutores de reenvío](/docs/es/advanced/forwarding-resolvers).

El siguiente paso después de crear tu túnel, configurar el firewall y tener tu aplicación en ejecución, es crear un servicio para tu aplicación.

> [!NOTE]
> Utilizar certificados SSL directamente en el servicio Sisk en sistemas no Windows no es posible. Esto es un punto de la implementación de HttpListener, que es el módulo central para la gestión de la cola HTTP en Sisk, y esta implementación varía de un sistema operativo a otro. Puedes utilizar SSL en tu servicio Sisk si [asocias un certificado con el host virtual con IIS](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis). Para otros sistemas, se recomienda altamente utilizar un proxy inverso.

## Creando un servicio

Crear un servicio hará que tu aplicación esté siempre disponible, incluso después de reiniciar tu instancia de servidor o un bloqueo no recuperable.

En este tutorial simple, utilizaremos el contenido del tutorial anterior como una demostración para mantener tu servicio siempre activo.

1. Accede a la carpeta donde se encuentran los archivos de configuración del servicio:

    ```sh
    cd /etc/systemd/system
    ```

2. Crea tu archivo `my-app.service` e incluye el contenido:
    
    <div class="script-header">
        <span>
            my-app.service
        </span>
        <span>
            INI
        </span>
    </div>
    
    ```ini
    [Unit]
    Description=<descripción sobre tu aplicación>

    [Service]
    # establece el usuario que lanzará el servicio
    User=<usuario que lanzará el servicio>

    # la ruta de ExecStart no es relativa a WorkingDirectory.
    # establécela como la ruta completa al archivo ejecutable
    WorkingDirectory=/home/htdocs
    ExecStart=/home/htdocs/my-app

    # establece el servicio para que siempre se reinicie en caso de bloqueo
    Restart=always
    RestartSec=3

    [Install]
    WantedBy=multi-user.target
    ```

3. Reinicia el módulo de administración de servicios:

    ```sh
    $ sudo systemctl daemon-reload
    ```

4. Inicia tu servicio recién creado desde el nombre del archivo que estableciste y verifica si se está ejecutando:

    ```sh
    $ sudo systemctl start my-app
    $ sudo systemctl status my-app
    ```

5. Ahora, si tu aplicación se está ejecutando ("Active: active"), habilita tu servicio para que se mantenga en ejecución después de un reinicio del sistema:
    
    ```sh
    $ sudo systemctl enable my-app
    ```

Ahora estás listo para presentar tu aplicación Sisk a todos.