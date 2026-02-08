# Resumen de la documentación

## Bienvenida

### [Comenzando](/docs/es/getting-started)

- [Primeros pasos](/docs/es/getting-started#first-steps)
- [Creando un proyecto](/docs/es/getting-started#creating-a-project)
- [Construyendo el servidor HTTP](/docs/es/getting-started#building-the-http-server)
- [Configuración manual (avanzada)](/docs/es/getting-started#manual-advanced-setup)

### [Instalación](/docs/es/installing)

### [Compatibilidad con Native AOT](/docs/es/native-aot)

- [Características no compatibles](/docs/es/native-aot#not-supported-features)

### [Desplegando tu aplicación Sisk](/docs/es/deploying)

- [Publicando tu aplicación](/docs/es/deploying#publishing-your-app)
- [Proxy de tu aplicación](/docs/es/deploying#proxying-your-application)
- [Creando un servicio](/docs/es/deploying#creating-an-service)

### [Trabajando con SSL](/docs/es/ssl)

- [A través de Sisk.Cadente.CoreEngine](/docs/es/ssl#through-the-siskcadentecoreengine)
- [A través de IIS en Windows](/docs/es/ssl#through-iis-on-windows)
- [A través de mitmproxy](/docs/es/ssl#through-mitmproxy)
- [A través del paquete Sisk.SslProxy](/docs/es/ssl#through-sisksslproxy-package)

### [Cadente](/docs/es/cadente)

- [Visión general](/docs/es/cadente#overview)
- [Instalación](/docs/es/cadente#installation)
- [Usando con Sisk](/docs/es/cadente#using-with-sisk)
- [Uso independiente](/docs/es/cadente#standalone-usage)

### [Configurando reservas de espacio de nombres en Windows](/docs/es/registering-namespace)

### [Registros de cambios](/docs/es/changelogs)

### [Preguntas frecuentes](/docs/es/faq)

- [¿Sisk es de código abierto?](/docs/es/faq#is-sisk-open-source)
- [¿Se aceptan contribuciones?](/docs/es/faq#are-contributions-accepted)
- [¿Sisk está financiado?](/docs/es/faq#is-sisk-funded)
- [¿Puedo usar Sisk en producción?](/docs/es/faq#can-i-use-sisk-in-production)
- [¿Sisk tiene servicios de autenticación, monitoreo y bases de datos?](/docs/es/faq#does-sisk-have-authentication-monitoring-and-database-services)
- [¿Por qué debería usar Sisk en lugar de <framework>?](/docs/es/faq#why-should-i-use-sisk-instead-of-framework)
- [¿Qué necesito para aprender Sisk?](/docs/es/faq#what-do-i-need-to-learn-sisk)
- [¿Puedo desarrollar aplicaciones comerciales con Sisk?](/docs/es/faq#can-i-develop-commercial-applications-with-sisk)

## Fundamentos

### [Enrutamiento](/docs/es/fundamentals/routing)

- [Coincidencia de rutas](/docs/es/fundamentals/routing#matching-routes)
- [Rutas regex](/docs/es/fundamentals/routing#regex-routes)
- [Prefijado de rutas](/docs/es/fundamentals/routing#prefixing-routes)
- [Rutas sin parámetro de solicitud](/docs/es/fundamentals/routing#routes-without-request-parameter)
- [Rutas de cualquier método](/docs/es/fundamentals/routing#any-method-routes)
- [Rutas de cualquier ruta](/docs/es/fundamentals/routing#any-path-routes)
- [Coincidencia de rutas sin distinción de mayúsculas](/docs/es/fundamentals/routing#ignore-case-route-matching)
- [Manejador de devolución de llamada Not Found (404)](/docs/es/fundamentals/routing#not-found-404-callback-handler)
- [Manejador de devolución de llamada Method not allowed (405)](/docs/es/fundamentals/routing#method-not-allowed-405-callback-handler)
- [Manejador de error interno](/docs/es/fundamentals/routing#internal-error-handler)

### [Manejo de solicitudes](/docs/es/fundamentals/request-handlers)

- [Creando un manejador de solicitud](/docs/es/fundamentals/request-handlers#creating-an-request-handler)
- [Asociando un manejador de solicitud con una única ruta](/docs/es/fundamentals/request-handlers#associating-a-request-handler-with-a-single-route)
- [Asociando un manejador de solicitud con un router](/docs/es/fundamentals/request-handlers#associating-a-request-handler-with-a-router)
- [Asociando un manejador de solicitud con un atributo](/docs/es/fundamentals/request-handlers#associating-a-request-handler-with-an-attribute)
- [Evitando un manejador de solicitud global](/docs/es/fundamentals/request-handlers#bypassing-an-global-request-handler)

### [Solicitudes](/docs/es/fundamentals/requests)

- [Obteniendo el método de la solicitud](/docs/es/fundamentals/requests#getting-the-request-method)
- [Obteniendo componentes de la URL de la solicitud](/docs/es/fundamentals/requests#getting-request-url-components)
- [Obteniendo el cuerpo de la solicitud](/docs/es/fundamentals/requests#getting-the-request-body)
- [Obteniendo el contexto de la solicitud](/docs/es/fundamentals/requests#getting-the-request-context)
- [Obteniendo datos del formulario](/docs/es/fundamentals/requests#getting-form-data)
- [Obteniendo datos de formulario multipart](/docs/es/fundamentals/requests#getting-multipart-form-data)
- [Detectando desconexión del cliente](/docs/es/fundamentals/requests#detecting-client-disconnection)
- [Soporte de eventos enviados por el servidor](/docs/es/fundamentals/requests#server-sent-events-support)
- [Resolviendo IPs y hosts proxy](/docs/es/fundamentals/requests#resolving-proxied-ips-and-hosts)
- [Codificación de encabezados](/docs/es/fundamentals/requests#headers-encoding)

### [Respuestas](/docs/es/fundamentals/responses)

- [Estableciendo un estado HTTP](/docs/es/fundamentals/responses#setting-an-http-status)
- [Cuerpo y tipo de contenido](/docs/es/fundamentals/responses#body-and-content-type)
- [Encabezados de respuesta](/docs/es/fundamentals/responses#response-headers)
- [Enviando cookies](/docs/es/fundamentals/responses#sending-cookies)
- [Respuestas fragmentadas](/docs/es/fundamentals/responses#chunked-responses)
- [Flujo de respuesta](/docs/es/fundamentals/responses#response-stream)
- [Compresión GZip, Deflate y Brotli](/docs/es/fundamentals/responses#gzip-deflate-and-brotli-compression)
- [Compresión automática](/docs/es/fundamentals/responses#automatic-compression)
- [Tipos de respuesta implícitos](/docs/es/fundamentals/responses#implicit-response-types)
- [Nota sobre objetos y arreglos enumerables](/docs/es/fundamentals/responses#note-on-enumerable-objects-and-arrays)

## Características

### [Registro](/docs/es/features/logging)

- [Registros de acceso basados en archivo](/docs/es/features/logging#file-based-access-logs)
- [Registro basado en flujo](/docs/es/features/logging#stream-based-logging)
- [Formato de registro de acceso](/docs/es/features/logging#access-log-formatting)
- [Rotación de registros](/docs/es/features/logging#rotating-logs)
- [Registro de errores](/docs/es/features/logging#error-logging)
- [Otras instancias de registro](/docs/es/features/logging#other-logging-instances)
- [Extendiendo LogStream](/docs/es/features/logging#extending-logstream)

### [Eventos enviados por el servidor](/docs/es/features/server-sent-events)

- [Creando una conexión SSE](/docs/es/features/server-sent-events#creating-an-sse-connection)
- [Añadiendo encabezados](/docs/es/features/server-sent-events#appending-headers)
- [Conexiones Wait-For-Fail](/docs/es/features/server-sent-events#wait-for-fail-connections)
- [Configurar política de ping de conexiones](/docs/es/features/server-sent-events#setup-connections-ping-policy)
- [Consultando conexiones](/docs/es/features/server-sent-events#querying-connections)

### [WebSockets](/docs/es/features/websockets)

- [Aceptando mensajes](/docs/es/features/websockets#accepting-messages)
- [Conexión persistente](/docs/es/features/websockets#persistent-connection)
- [Política de ping](/docs/es/features/websockets#ping-policy)

### [Sintaxis de descarte](/docs/es/features/discard-syntax)

### [Inyección de dependencias](/docs/es/features/instancing)

### [Contenido en streaming](/docs/es/features/content-streaming)

- [Flujo de contenido de solicitud](/docs/es/features/content-streaming#request-content-stream)
- [Flujo de contenido de respuesta](/docs/es/features/content-streaming#response-content-stream)

### [Habilitando CORS (Compartición de Recursos entre Orígenes) en Sisk](/docs/es/features/cors)

- [Mismo origen](/docs/es/features/cors#same-origin)
- [Habilitando CORS](/docs/es/features/cors#enabling-cors)
- [Otras formas de aplicar CORS](/docs/es/features/cors#other-ways-to-apply-cors)
- [Deshabilitando CORS en rutas específicas](/docs/es/features/cors#disabling-cors-on-specific-routes)
- [Reemplazando valores en la respuesta](/docs/es/features/cors#replacing-values-in-the-response)
- [Solicitudes preflight](/docs/es/features/cors#preflight-requests)
- [Deshabilitando CORS globalmente](/docs/es/features/cors#disabling-cors-globally)

### [Servidor de archivos](/docs/es/features/file-server)

- [Sirviendo archivos estáticos](/docs/es/features/file-server#serving-static-files)
- [HttpFileServerHandler](/docs/es/features/file-server#httpfileserverhandler)
- [Listado de directorios](/docs/es/features/file-server#directory-listing)
- [Convertidores de archivos](/docs/es/features/file-server#file-converters)

## Extensiones

### [Protocolo de Contexto de Modelo](/docs/es/extensions/mcp)

- [Comenzando con MCP](/docs/es/extensions/mcp#getting-started-with-mcp)
- [Creando esquemas JSON para funciones](/docs/es/extensions/mcp#creating-json-schemas-for-functions)
- [Manejando llamadas a funciones](/docs/es/extensions/mcp#handling-function-calls)
- [Resultados de funciones](/docs/es/extensions/mcp#function-results)
- [Continuando trabajo](/docs/es/extensions/mcp#continuing-work)

### [Extensión JSON-RPC](/docs/es/extensions/json-rpc)

- [Interfaz de transporte](/docs/es/extensions/json-rpc#transport-interface)
- [Métodos JSON-RPC](/docs/es/extensions/json-rpc#json-rpc-methods)
- [Personalizando el serializador](/docs/es/extensions/json-rpc#customizing-the-serializer)

### [Proxy SSL](/docs/es/extensions/ssl-proxy)

### [Autenticación básica](/docs/es/extensions/basic-auth)

- [Instalación](/docs/es/extensions/basic-auth#installing)
- [Creando tu manejador de autenticación](/docs/es/extensions/basic-auth#creating-your-auth-handler)
- [Observaciones](/docs/es/extensions/basic-auth#remarks)

### [Proveedores de servicios](/docs/es/extensions/service-providers)

- [Leyendo configuraciones de un archivo JSON](/docs/es/extensions/service-providers#reading-configurations-from-a-json-file)
- [Estructura del archivo de configuración](/docs/es/extensions/service-providers#configuration-file-structure)

### [Proveedor de configuración INI](/docs/es/extensions/ini-configuration)

- [Instalación](/docs/es/extensions/ini-configuration#installing)
- [Sabor y sintaxis INI](/docs/es/extensions/ini-configuration#ini-flavor-and-syntax)
- [Parámetros de configuración](/docs/es/extensions/ini-configuration#configuration-parameters)

### [Documentación de API](/docs/es/extensions/api-documentation)

- [Manejadores de tipo](/docs/es/extensions/api-documentation#type-handlers)
- [Exportadores](/docs/es/extensions/api-documentation#exporters)

## Avanzado

### [Configuración manual (avanzada)](/docs/es/advanced/manual-setup)

- [Ruteadores](/docs/es/advanced/manual-setup#routers)
- [Hosts y puertos de escucha](/docs/es/advanced/manual-setup#listening-hosts-and-ports)
- [Configuración del servidor](/docs/es/advanced/manual-setup#server-configuration)

### [Ciclo de vida de la solicitud](/docs/es/advanced/request-lifecycle)

### [Resolutores de reenvío](/docs/es/advanced/forwarding-resolvers)

- [La clase ForwardingResolver](/docs/es/advanced/forwarding-resolvers#the-forwardingresolver-class)

### [Manejadores de servidor HTTP](/docs/es/advanced/http-server-handlers)

### [Múltiples hosts de escucha por servidor](/docs/es/advanced/multi-host-setup)

### [Motores de servidor HTTP](/docs/es/advanced/server-engines)

- [Implementando un motor HTTP para Sisk](/docs/es/advanced/server-engines#implementing-an-http-engine-for-sisk)
- [Eligiendo un bucle de eventos](/docs/es/advanced/server-engines#choosing-an-event-loop)
- [Pruebas](/docs/es/advanced/server-engines#testing)