# Bereitstellung Ihrer Sisk-Anwendung

Der Prozess der Bereitstellung einer Sisk-Anwendung besteht darin, Ihr Projekt in die Produktion zu veröffentlichen. Obwohl der Prozess relativ einfach ist, ist es erwähnenswert, Details zu beachten, die für die Sicherheit und Stabilität der Infrastruktur der Bereitstellung tödlich sein können.

Idealerweise sollten Sie bereit sein, Ihre Anwendung in die Cloud zu deployen, nachdem Sie alle möglichen Tests durchgeführt haben, um Ihre Anwendung bereit zu machen.

## Veröffentlichen Ihrer App

Das Veröffentlichen Ihrer Sisk-Anwendung oder eines Dienstes bedeutet, Binaries zu generieren, die für die Produktion bereit und optimiert sind. In diesem Beispiel werden wir die Binaries für die Produktion kompilieren, um auf einer Maschine zu laufen, die die .NET-Laufzeit auf der Maschine installiert hat.

Sie benötigen die .NET-SDK auf Ihrem Computer installiert, um Ihre App zu erstellen, und die .NET-Laufzeit auf dem Zielserver, um Ihre App auszuführen. Sie können erfahren, wie Sie die .NET-Laufzeit auf Ihrem Linux-Server [hier](https://learn.microsoft.com/en-us/dotnet/core/install/linux), [Windows](https://learn.microsoft.com/en-us/dotnet/core/install/windows?tabs=net70) und [Mac OS](https://learn.microsoft.com/en-us/dotnet/core/install/macos) installieren.

Im Ordner, in dem sich Ihr Projekt befindet, öffnen Sie ein Terminal und verwenden den .NET-Veröffentlichungsbefehl:

```shell
$ dotnet publish -r linux-x64 -c Release
```

Dies generiert Ihre Binaries innerhalb von `bin/Release/publish/linux-x64`.

> [!NOTE]
> Wenn Ihre App mit dem Sisk.ServiceProvider-Paket läuft, sollten Sie Ihre `service-config.json` in Ihren Hostserver kopieren, zusammen mit allen Binaries, die von `dotnet publish` generiert werden.
> Sie können die Datei vor konfigurieren, mit Umgebungsvariablen, Lauscher-Ports und Hosts und zusätzlichen Serverkonfigurationen.

Der nächste Schritt ist, diese Dateien auf den Server zu übertragen, auf dem Ihre Anwendung gehostet wird.

Danach geben Sie Ausführungsrechte für Ihre Binärdatei. In diesem Fall nehmen wir an, dass unser Projektname "my-app" ist:

```shell
$ cd /home/htdocs
$ chmod +x my-app
$ ./my-app
```

Nach dem Ausführen Ihrer Anwendung prüfen Sie, ob sie Fehlermeldungen produziert. Wenn sie keine produziert, bedeutet dies, dass Ihre Anwendung läuft.

An diesem Punkt ist es wahrscheinlich nicht möglich, auf Ihre Anwendung von außerhalb Ihres Servers zuzugreifen, da Zugriffsregeln wie Firewall nicht konfiguriert sind. Wir werden dies in den nächsten Schritten berücksichtigen.

Sie sollten die Adresse des virtuellen Hosts haben, auf dem Ihre Anwendung läuft. Dies wird manuell in der Anwendung festgelegt und hängt davon ab, wie Sie Ihren Sisk-Dienst instanziieren.

Wenn Sie **nicht** das Sisk.ServiceProvider-Paket verwenden, sollten Sie es finden, wo Sie Ihre HttpServer-Instanz definiert haben:

```cs
HttpServer server = HttpServer.Emit(5000, out HttpServerConfiguration config, out var host, out var router);
// sisk sollte auf http://localhost:5000/ lauschen
```

Manuelle Zuweisung eines Lauschers:

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

Von hier aus können wir einen Reverse-Proxy erstellen, um Ihren Dienst zu lauschen und den Datenverkehr über das offene Netzwerk verfügbar zu machen.

## Proxying Ihrer Anwendung

Das Proxying Ihres Dienstes bedeutet, dass Sie Ihren Sisk-Dienst nicht direkt einem externen Netzwerk aussetzen. Diese Praxis ist sehr häufig bei Server-Bereitstellungen, da:

- Sie damit ein SSL-Zertifikat in Ihrer Anwendung zuordnen können;
- Sie Zugriffsregeln vor dem Zugriff auf den Dienst erstellen und Überlastungen vermeiden können;
- Sie die Bandbreite und Anfragegrenzen kontrollieren können;
- Sie Lastenausgleich für Ihre Anwendung trennen können;
- Sie Sicherheitsschäden an der fehlgeschlagenen Infrastruktur verhindern können.

Sie können Ihre Anwendung durch einen Reverse-Proxy wie [Nginx](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-nginx?view=aspnetcore-7.0&tabs=linux-ubuntu#install-nginx) oder [Apache](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-apache?view=aspnetcore-7.0) bereitstellen, oder Sie können einen http-over-dns-Tunnel wie [Cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-and-setup/tunnel-guide/) verwenden.

Außerdem sollten Sie daran denken, die Weiterleitungsheader Ihres Proxys korrekt aufzulösen, um die Informationen Ihres Clients, wie IP-Adresse und Host, über [Weiterleitungs-Resolver](/docs/de/advanced/forwarding-resolvers) zu erhalten.

Der nächste Schritt nach der Erstellung Ihres Tunnels, der Firewall-Konfiguration und dem Laufen Ihrer Anwendung ist, einen Dienst für Ihre Anwendung zu erstellen.

> [!NOTE]
> Die direkte Verwendung von SSL-Zertifikaten in der Sisk-Anwendung auf nicht-Windows-Systemen ist nicht möglich. Dies ist ein Punkt der Implementierung von HttpListener, der das zentrale Modul für die HTTP-Warteschlangenverwaltung in Sisk ist, und diese Implementierung variiert von Betriebssystem zu Betriebssystem. Sie können SSL in Ihrer Sisk-Anwendung verwenden, wenn Sie [ein Zertifikat mit dem virtuellen Host mit IIS zuordnen](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis). Für andere Systeme wird die Verwendung eines Reverse-Proxys stark empfohlen.

## Erstellen eines Dienstes

Das Erstellen eines Dienstes macht Ihre Anwendung immer verfügbar, auch nach dem Neustart Ihres Server-Instanz oder einem nicht-wiederherstellbaren Absturz.

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

    # Setzen Sie den Dienst auf immer neu starten bei einem Absturz
    Restart=always
    RestartSec=3

    [Install]
    WantedBy=multi-user.target
    ```

3. Starten Sie Ihren Dienst-Manager-Modul neu:

    ```sh
    $ sudo systemctl daemon-reload
    ```

4. Starten Sie Ihren neu erstellten Dienst vom Namen der Datei, die Sie festgelegt haben, und prüfen Sie, ob er läuft:

    ```sh
    $ sudo systemctl start my-app
    $ sudo systemctl status my-app
    ```

5. Jetzt, wenn Ihre App läuft ("Active: active"), aktivieren Sie Ihren Dienst, um ihn nach einem System-Neustart weiterlaufen zu lassen:
    
    ```sh
    $ sudo systemctl enable my-app
    ```

Jetzt sind Sie bereit, loszulegen und Ihre Sisk-Anwendung allen zu präsentieren.