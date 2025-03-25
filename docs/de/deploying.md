# Bereitstellung Ihrer Sisk-Anwendung

Der Prozess der Bereitstellung einer Sisk-Anwendung besteht darin, Ihr Projekt in die Produktion zu veröffentlichen. Obwohl der Prozess relativ einfach ist, ist es wichtig, Details zu beachten, die für die Sicherheit und Stabilität der Infrastruktur der Bereitstellung von entscheidender Bedeutung sein können.

Idealerweise sollten Sie bereit sein, Ihre Anwendung in die Cloud zu veröffentlichen, nachdem Sie alle möglichen Tests durchgeführt haben, um Ihre Anwendung bereit zu machen.

## Veröffentlichen Ihrer App

Das Veröffentlichen Ihrer Sisk-Anwendung oder eines Dienstes bedeutet, Binärdateien zu generieren, die für die Produktion bereit und optimiert sind. In diesem Beispiel werden wir die Binärdateien für die Produktion kompilieren, um auf einem Computer mit der .NET-Laufzeitumgebung zu laufen.

Sie benötigen die .NET-SDK auf Ihrem Computer, um Ihre App zu erstellen, und die .NET-Laufzeitumgebung auf dem Zielserver, um Ihre App auszuführen. Sie können erfahren, wie Sie die .NET-Laufzeitumgebung auf Ihrem Linux-Server [hier](https://learn.microsoft.com/en-us/dotnet/core/install/linux), [Windows](https://learn.microsoft.com/en-us/dotnet/core/install/windows?tabs=net70) und [Mac OS](https://learn.microsoft.com/en-us/dotnet/core/install/macos) installieren.

Öffnen Sie im Ordner, in dem sich Ihr Projekt befindet, ein Terminal und verwenden Sie den .NET-Veröffentlichungsbefehl:

```shell
$ dotnet publish -r linux-x64 -c Release
```

Dies generiert Ihre Binärdateien im Ordner `bin/Release/publish/linux-x64`.

> [!NOTE]
> Wenn Ihre App mit dem Sisk.ServiceProvider-Paket läuft, sollten Sie Ihre `service-config.json` in den Host-Server zusammen mit allen Binärdateien kopieren, die von `dotnet publish` generiert werden.
> Sie können die Datei vor konfigurieren, mit Umgebungsvariablen, Lauscher-Ports und -Hosts sowie zusätzlichen Server-Konfigurationen.

Der nächste Schritt besteht darin, diese Dateien auf den Server zu übertragen, auf dem Ihre Anwendung gehostet wird.

Anschließend geben Sie der Binärdatei Ausführungsrechte. In diesem Fall nehmen wir an, dass unser Projektname "my-app" ist:

```shell
$ cd /home/htdocs
$ chmod +x my-app
$ ./my-app
```

Nachdem Sie Ihre Anwendung gestartet haben, überprüfen Sie, ob sie Fehlermeldungen produziert. Wenn sie keine Fehlermeldungen produziert, bedeutet dies, dass Ihre Anwendung läuft.

An diesem Punkt ist es wahrscheinlich nicht möglich, auf Ihre Anwendung von außerhalb des Servers zuzugreifen, da Zugriffsregeln wie Firewall nicht konfiguriert sind. Wir werden dies in den nächsten Schritten berücksichtigen.

Sie sollten die Adresse des virtuellen Hosts haben, auf dem Ihre Anwendung läuft. Dies wird manuell in der Anwendung festgelegt und hängt davon ab, wie Sie Ihren Sisk-Dienst instanziieren.

Wenn Sie **nicht** das Sisk.ServiceProvider-Paket verwenden, sollten Sie es finden, wo Sie Ihre HttpServer-Instanz definiert haben:

```cs
HttpServer server = HttpServer.Emit(5000, out HttpServerConfiguration config, out var host, out var router);
// sisk sollte auf http://localhost:5000/ lauschen
```

Manuelle Zuweisung eines ListeningHost:

```cs
config.ListeningHosts.Add(new ListeningHost("https://localhost:5000/", router));
```

Oder wenn Sie das Sisk.ServiceProvider-Paket verwenden, in Ihrer `service-config.json`:

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

Daraus können wir einen Reverse-Proxy erstellen, um Ihren Dienst zu hören und den Datenverkehr über das offene Netzwerk verfügbar zu machen.

## Proxying Ihrer Anwendung

Das Proxying Ihres Dienstes bedeutet, dass Sie Ihren Sisk-Dienst nicht direkt einem externen Netzwerk aussetzen. Diese Praxis ist sehr häufig bei Server-Bereitstellungen, da:

- Sie damit ein SSL-Zertifikat in Ihrer Anwendung verknüpfen können;
- Sie Zugriffsregeln vor dem Zugriff auf den Dienst erstellen und Überlastungen vermeiden können;
- Sie die Bandbreite und Anfragegrenzen kontrollieren können;
- Sie Lastenausgleich für Ihre Anwendung trennen können;
- Sie Sicherheitsschäden an der fehlgeschlagenen Infrastruktur verhindern können.

Sie können Ihre Anwendung durch einen Reverse-Proxy wie [Nginx](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-nginx?view=aspnetcore-7.0&tabs=linux-ubuntu#install-nginx) oder [Apache](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-apache?view=aspnetcore-7.0) bereitstellen, oder Sie können einen http-over-dns-Tunnel wie [Cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-and-setup/tunnel-guide/) verwenden.

Außerdem sollten Sie daran denken, die Weiterleitungsheader Ihres Proxys korrekt aufzulösen, um die Informationen Ihres Clients, wie z.B. die IP-Adresse und den Host, über [Weiterleitungs-Resolver](/docs/advanced/forwarding-resolvers) zu erhalten.

Der nächste Schritt nach der Erstellung Ihres Tunnels, der Firewall-Konfiguration und dem Ausführen Ihrer Anwendung besteht darin, einen Dienst für Ihre Anwendung zu erstellen.

> [!NOTE]
> Die Verwendung von SSL-Zertifikaten direkt im Sisk-Dienst auf nicht-Windows-Systemen ist nicht möglich. Dies ist ein Punkt der Implementierung von HttpListener, der das zentrale Modul für die HTTP-Warteschlangenverwaltung in Sisk ist, und diese Implementierung variiert von Betriebssystem zu Betriebssystem. Sie können SSL in Ihrem Sisk-Dienst verwenden, wenn Sie [ein Zertifikat mit dem virtuellen Host mit IIS verknüpfen](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis). Für andere Systeme wird die Verwendung eines Reverse-Proxys dringend empfohlen.

## Erstellen eines Dienstes

Das Erstellen eines Dienstes macht Ihre Anwendung immer verfügbar, auch nach dem Neustart Ihres Servers oder einem nicht wiederherstellbaren Absturz.

In diesem einfachen Tutorial werden wir den Inhalt des vorherigen Tutorials als Showcase verwenden, um Ihren Dienst immer aktiv zu halten.

1. Greifen Sie auf den Ordner zu, in dem sich die Dienstkonfigurationsdateien befinden:

    ```sh
    cd /etc/systemd/system
    ```

2. Erstellen Sie Ihre `my-app.service`-Datei und fügen Sie den Inhalt hinzu:
    
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
    Description=<Beschreibung über Ihre App>

    [Service]
    # Setzen Sie den Benutzer, der den Dienst starten wird
    User=<Benutzer, der den Dienst starten wird>

    # Der ExecStart-Pfad ist nicht relativ zum WorkingDirectory.
    # Setzen Sie ihn als vollständigen Pfad zur ausführbaren Datei
    WorkingDirectory=/home/htdocs
    ExecStart=/home/htdocs/my-app

    # Setzen Sie den Dienst so, dass er immer nach einem Absturz neu startet
    Restart=always
    RestartSec=3

    [Install]
    WantedBy=multi-user.target
    ```

3. Starten Sie Ihren Dienst-Manager-Modul neu:

    ```sh
    $ sudo systemctl daemon-reload
    ```

4. Starten Sie Ihren neu erstellten Dienst mit dem Namen der Datei, die Sie festgelegt haben, und überprüfen Sie, ob er läuft:

    ```sh
    $ sudo systemctl start my-app
    $ sudo systemctl status my-app
    ```

5. Wenn Ihre App läuft ("Active: active"), aktivieren Sie Ihren Dienst, um ihn nach einem System-Neustart weiterlaufen zu lassen:
    
    ```sh
    $ sudo systemctl enable my-app
    ```

Jetzt sind Sie bereit, Ihre Sisk-Anwendung vorzustellen.