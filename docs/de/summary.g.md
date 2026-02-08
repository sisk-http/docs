# Dokumentationsübersicht

## Willkommen

### [Erste Schritte](/docs/de/getting-started)

- [Erste Schritte](/docs/de/getting-started#first-steps)
- [Erstellen eines Projekts](/docs/de/getting-started#creating-a-project)
- [Aufbau des HTTP-Servers](/docs/de/getting-started#building-the-http-server)
- [Manuelle (erweiterte) Einrichtung](/docs/de/getting-started#manual-advanced-setup)

### [Installation](/docs/de/installing)

### [Native AOT-Unterstützung](/docs/de/native-aot)

- [Nicht unterstützte Funktionen](/docs/de/native-aot#not-supported-features)

### [Bereitstellung Ihrer Sisk-Anwendung](/docs/de/deploying)

- [Veröffentlichen Ihrer Anwendung](/docs/de/deploying#publishing-your-app)
- [Proxy Ihrer Anwendung](/docs/de/deploying#proxying-your-application)
- [Erstellen eines Dienstes](/docs/de/deploying#creating-an-service)

### [Arbeiten mit SSL](/docs/de/ssl)

- [Über die Sisk.Cadente.CoreEngine](/docs/de/ssl#through-the-siskcadentecoreengine)
- [Über IIS unter Windows](/docs/de/ssl#through-iis-on-windows)
- [Über mitmproxy](/docs/de/ssl#through-mitmproxy)
- [Über das Sisk.SslProxy-Paket](/docs/de/ssl#through-sisksslproxy-package)

### [Cadente](/docs/de/cadente)

- [Übersicht](/docs/de/cadente#overview)
- [Installation](/docs/de/cadente#installation)
- [Verwendung mit Sisk](/docs/de/cadente#using-with-sisk)
- [Eigenständige Nutzung](/docs/de/cadente#standalone-usage)

### [Konfigurieren von Namespace-Reservierungen unter Windows](/docs/de/registering-namespace)

### [Änderungsprotokolle](/docs/de/changelogs)

### [Häufig gestellte Fragen](/docs/de/faq)

- [Ist Sisk Open-Source?](/docs/de/faq#is-sisk-open-source)
- [Werden Beiträge akzeptiert?](/docs/de/faq#are-contributions-accepted)
- [Wird Sisk finanziert?](/docs/de/faq#is-sisk-funded)
- [Kann ich Sisk in der Produktion einsetzen?](/docs/de/faq#can-i-use-sisk-in-production)
- [Bietet Sisk Authentifizierung, Monitoring und Datenbankdienste?](/docs/de/faq#does-sisk-have-authentication-monitoring-and-database-services)
- [Warum sollte ich Sisk statt <framework> verwenden?](/docs/de/faq#why-should-i-use-sisk-instead-of-framework)
- [Was muss ich lernen, um Sisk zu verwenden?](/docs/de/faq#what-do-i-need-to-learn-sisk)
- [Kann ich kommerzielle Anwendungen mit Sisk entwickeln?](/docs/de/faq#can-i-develop-commercial-applications-with-sisk)

## Grundlagen

### [Routing](/docs/de/fundamentals/routing)

- [Übereinstimmende Routen](/docs/de/fundamentals/routing#matching-routes)
- [Regex-Routen](/docs/de/fundamentals/routing#regex-routes)
- [Präfixieren von Routen](/docs/de/fundamentals/routing#prefixing-routes)
- [Routen ohne Anfrageparameter](/docs/de/fundamentals/routing#routes-without-request-parameter)
- [Routen für beliebige Methoden](/docs/de/fundamentals/routing#any-method-routes)
- [Routen für beliebige Pfade](/docs/de/fundamentals/routing#any-path-routes)
- [Groß-/Kleinschreibung bei Routen ignorieren](/docs/de/fundamentals/routing#ignore-case-route-matching)
- [Nicht gefunden (404) Callback-Handler](/docs/de/fundamentals/routing#not-found-404-callback-handler)
- [Methode nicht erlaubt (405) Callback-Handler](/docs/de/fundamentals/routing#method-not-allowed-405-callback-handler)
- [Interner Fehler-Handler](/docs/de/fundamentals/routing#internal-error-handler)

### [Anfrageverarbeitung](/docs/de/fundamentals/request-handlers)

- [Erstellen eines Anfrage-Handlers](/docs/de/fundamentals/request-handlers#creating-an-request-handler)
- [Zuweisen eines Anfrage-Handlers zu einer einzelnen Route](/docs/de/fundamentals/request-handlers#associating-a-request-handler-with-a-single-route)
- [Zuweisen eines Anfrage-Handlers zu einem Router](/docs/de/fundamentals/request-handlers#associating-a-request-handler-with-a-router)
- [Zuweisen eines Anfrage-Handlers zu einem Attribut](/docs/de/fundamentals/request-handlers#associating-a-request-handler-with-an-attribute)
- [Umgehen eines globalen Anfrage-Handlers](/docs/de/fundamentals/request-handlers#bypassing-an-global-request-handler)

### [Anfragen](/docs/de/fundamentals/requests)

- [Abrufen der Anfragemethode](/docs/de/fundamentals/requests#getting-the-request-method)
- [Abrufen von URL-Komponenten der Anfrage](/docs/de/fundamentals/requests#getting-request-url-components)
- [Abrufen des Anfragetextes](/docs/de/fundamentals/requests#getting-the-request-body)
- [Abrufen des Anfragekontexts](/docs/de/fundamentals/requests#getting-the-request-context)
- [Abrufen von Formulardaten](/docs/de/fundamentals/requests#getting-form-data)
- [Abrufen von Multipart-Formulardaten](/docs/de/fundamentals/requests#getting-multipart-form-data)
- [Erkennen von Client-Disconnects](/docs/de/fundamentals/requests#detecting-client-disconnection)
- [Unterstützung von Server-Sent Events](/docs/de/fundamentals/requests#server-sent-events-support)
- [Auflösen von proxied IPs und Hosts](/docs/de/fundamentals/requests#resolving-proxied-ips-and-hosts)
- [Kodierung von Headern](/docs/de/fundamentals/requests#headers-encoding)

### [Antworten](/docs/de/fundamentals/responses)

- [Setzen eines HTTP-Status](/docs/de/fundamentals/responses#setting-an-http-status)
- [Body und Content-Type](/docs/de/fundamentals/responses#body-and-content-type)
- [Antwort-Header](/docs/de/fundamentals/responses#response-headers)
- [Senden von Cookies](/docs/de/fundamentals/responses#sending-cookies)
- [Chunked-Antworten](/docs/de/fundamentals/responses#chunked-responses)
- [Antwort-Stream](/docs/de/fundamentals/responses#response-stream)
- [GZip-, Deflate- und Brotli-Kompression](/docs/de/fundamentals/responses#gzip-deflate-and-brotli-compression)
- [Automatische Kompression](/docs/de/fundamentals/responses#automatic-compression)
- [Implizite Antworttypen](/docs/de/fundamentals/responses#implicit-response-types)
- [Hinweis zu aufzählbaren Objekten und Arrays](/docs/de/fundamentals/responses#note-on-enumerable-objects-and-arrays)

## Funktionen

### [Logging](/docs/de/features/logging)

- [Dateibasierte Zugriffsprotokolle](/docs/de/features/logging#file-based-access-logs)
- [Stream-basierte Protokollierung](/docs/de/features/logging#stream-based-logging)
- [Formatierung von Zugriffsprotokollen](/docs/de/features/logging#access-log-formatting)
- [Rotierende Protokolle](/docs/de/features/logging#rotating-logs)
- [Fehlerprotokollierung](/docs/de/features/logging#error-logging)
- [Weitere Protokollierungsinstanzen](/docs/de/features/logging#other-logging-instances)
- [Erweitern von LogStream](/docs/de/features/logging#extending-logstream)

### [Server Sent Events](/docs/de/features/server-sent-events)

- [Erstellen einer SSE-Verbindung](/docs/de/features/server-sent-events#creating-an-sse-connection)
- [Anhängen von Headern](/docs/de/features/server-sent-events#appending-headers)
- [Wait-For-Fail-Verbindungen](/docs/de/features/server-sent-events#wait-for-fail-connections)
- [Einrichten der Ping-Policy für Verbindungen](/docs/de/features/server-sent-events#setup-connections-ping-policy)
- [Abfragen von Verbindungen](/docs/de/features/server-sent-events#querying-connections)

### [WebSockets](/docs/de/features/websockets)

- [Empfangen von Nachrichten](/docs/de/features/websockets#accepting-messages)
- [Persistente Verbindung](/docs/de/features/websockets#persistent-connection)
- [Ping-Policy](/docs/de/features/websockets#ping-policy)

### [Discard-Syntax](/docs/de/features/discard-syntax)

### [Dependency Injection](/docs/de/features/instancing)

### [Streaming-Inhalte](/docs/de/features/content-streaming)

- [Anfrage-Inhalts-Stream](/docs/de/features/content-streaming#request-content-stream)
- [Antwort-Inhalts-Stream](/docs/de/features/content-streaming#response-content-stream)

### [Aktivieren von CORS (Cross-Origin Resource Sharing) in Sisk](/docs/de/features/cors)

- [Gleiche Herkunft](/docs/de/features/cors#same-origin)
- [Aktivieren von CORS](/docs/de/features/cors#enabling-cors)
- [Weitere Möglichkeiten, CORS anzuwenden](/docs/de/features/cors#other-ways-to-apply-cors)
- [Deaktivieren von CORS für bestimmte Routen](/docs/de/features/cors#disabling-cors-on-specific-routes)
- [Ersetzen von Werten in der Antwort](/docs/de/features/cors#replacing-values-in-the-response)
- [Preflight-Anfragen](/docs/de/features/cors#preflight-requests)
- [Deaktivieren von CORS global](/docs/de/features/cors#disabling-cors-globally)

### [Dateiserver](/docs/de/features/file-server)

- [Bereitstellen statischer Dateien](/docs/de/features/file-server#serving-static-files)
- [HttpFileServerHandler](/docs/de/features/file-server#httpfileserverhandler)
- [Verzeichnisauflistung](/docs/de/features/file-server#directory-listing)
- [Dateikonverter](/docs/de/features/file-server#file-converters)

## Erweiterungen

### [Model Context Protocol](/docs/de/extensions/mcp)

- [Erste Schritte mit MCP](/docs/de/extensions/mcp#getting-started-with-mcp)
- [Erstellen von JSON-Schemas für Funktionen](/docs/de/extensions/mcp#creating-json-schemas-for-functions)
- [Verarbeiten von Funktionsaufrufen](/docs/de/extensions/mcp#handling-function-calls)
- [Funktionsergebnisse](/docs/de/extensions/mcp#function-results)
- [Fortsetzung der Arbeit](/docs/de/extensions/mcp#continuing-work)

### [JSON-RPC-Erweiterung](/docs/de/extensions/json-rpc)

- [Transport-Schnittstelle](/docs/de/extensions/json-rpc#transport-interface)
- [JSON-RPC-Methoden](/docs/de/extensions/json-rpc#json-rpc-methods)
- [Anpassen des Serialisierers](/docs/de/extensions/json-rpc#customizing-the-serializer)

### [SSL-Proxy](/docs/de/extensions/ssl-proxy)

### [Basic Auth](/docs/de/extensions/basic-auth)

- [Installation](/docs/de/extensions/basic-auth#installing)
- [Erstellen Ihres Auth-Handlers](/docs/de/extensions/basic-auth#creating-your-auth-handler)
- [Hinweise](/docs/de/extensions/basic-auth#remarks)

### [Service Provider](/docs/de/extensions/service-providers)

- [Lesen von Konfigurationen aus einer JSON-Datei](/docs/de/extensions/service-providers#reading-configurations-from-a-json-file)
- [Struktur der Konfigurationsdatei](/docs/de/extensions/service-providers#configuration-file-structure)

### [INI-Konfigurationsanbieter](/docs/de/extensions/ini-configuration)

- [Installation](/docs/de/extensions/ini-configuration#installing)
- [INI-Variante und Syntax](/docs/de/extensions/ini-configuration#ini-flavor-and-syntax)
- [Konfigurationsparameter](/docs/de/extensions/ini-configuration#configuration-parameters)

### [API-Dokumentation](/docs/de/extensions/api-documentation)

- [Typ-Handler](/docs/de/extensions/api-documentation#type-handlers)
- [Exporter](/docs/de/extensions/api-documentation#exporters)

## Fortgeschritten

### [Manuelle (erweiterte) Einrichtung](/docs/de/advanced/manual-setup)

- [Router](/docs/de/advanced/manual-setup#routers)
- [Listening Hosts und Ports](/docs/de/advanced/manual-setup#listening-hosts-and-ports)
- [Serverkonfiguration](/docs/de/advanced/manual-setup#server-configuration)

### [Anfrage-Lebenszyklus](/docs/de/advanced/request-lifecycle)

### [Forwarding Resolver](/docs/de/advanced/forwarding-resolvers)

- [Die ForwardingResolver-Klasse](/docs/de/advanced/forwarding-resolvers#the-forwardingresolver-class)

### [HTTP-Server-Handler](/docs/de/advanced/http-server-handlers)

### [Mehrere Listening Hosts pro Server](/docs/de/advanced/multi-host-setup)

### [HTTP-Server-Engines](/docs/de/advanced/server-engines)

- [Implementieren einer HTTP-Engine für Sisk](/docs/de/advanced/server-engines#implementing-an-http-engine-for-sisk)
- [Auswahl einer Event-Loop](/docs/de/advanced/server-engines#choosing-an-event-loop)
- [Testen](/docs/de/advanced/server-engines#testing)