# Documentation Summary

## Welcome

### [Getting started](/docs/getting-started)

- [First steps](/docs/getting-started#first-steps)
- [Creating a Project](/docs/getting-started#creating-a-project)
- [Building the HTTP Server](/docs/getting-started#building-the-http-server)
- [Manual (advanced) setup](/docs/getting-started#manual-advanced-setup)

### [Installing](/docs/installing)

### [Native AOT Support](/docs/native-aot)

- [Not supported features](/docs/native-aot#not-supported-features)

### [Deploying your Sisk Application](/docs/deploying)

- [Publishing your app](/docs/deploying#publishing-your-app)
- [Proxying your application](/docs/deploying#proxying-your-application)
- [Creating an service](/docs/deploying#creating-an-service)

### [Working with SSL](/docs/ssl)

- [Through the Sisk.Cadente.CoreEngine](/docs/ssl#through-the-siskcadentecoreengine)
- [Through IIS on Windows](/docs/ssl#through-iis-on-windows)
- [Through mitmproxy](/docs/ssl#through-mitmproxy)
- [Through Sisk.SslProxy package](/docs/ssl#through-sisksslproxy-package)

### [Cadente](/docs/cadente)

- [Overview](/docs/cadente#overview)
- [Installation](/docs/cadente#installation)
- [Using with Sisk](/docs/cadente#using-with-sisk)
- [Standalone Usage](/docs/cadente#standalone-usage)

### [Configuring namespace reservations on Windows](/docs/registering-namespace)

### [Changelogs](/docs/changelogs)

### [Frequently Asked Questions](/docs/faq)

- [Is Sisk open-source?](/docs/faq#is-sisk-open-source)
- [Are contributions accepted?](/docs/faq#are-contributions-accepted)
- [Is Sisk funded?](/docs/faq#is-sisk-funded)
- [Can I use Sisk in production?](/docs/faq#can-i-use-sisk-in-production)
- [Does Sisk have authentication, monitoring, and database services?](/docs/faq#does-sisk-have-authentication-monitoring-and-database-services)
- [Why should I use Sisk instead of <framework>?](/docs/faq#why-should-i-use-sisk-instead-of-framework)
- [What do I need to learn Sisk?](/docs/faq#what-do-i-need-to-learn-sisk)
- [Can I develop commercial applications with Sisk?](/docs/faq#can-i-develop-commercial-applications-with-sisk)

## Fundamentals

### [Routing](/docs/fundamentals/routing)

- [Matching routes](/docs/fundamentals/routing#matching-routes)
- [Regex routes](/docs/fundamentals/routing#regex-routes)
- [Prefixing routes](/docs/fundamentals/routing#prefixing-routes)
- [Routes without request parameter](/docs/fundamentals/routing#routes-without-request-parameter)
- [Any method routes](/docs/fundamentals/routing#any-method-routes)
- [Any path routes](/docs/fundamentals/routing#any-path-routes)
- [Ignore case route matching](/docs/fundamentals/routing#ignore-case-route-matching)
- [Not Found (404) callback handler](/docs/fundamentals/routing#not-found-404-callback-handler)
- [Method not allowed (405) callback handler](/docs/fundamentals/routing#method-not-allowed-405-callback-handler)
- [Internal error handler](/docs/fundamentals/routing#internal-error-handler)

### [Request handling](/docs/fundamentals/request-handlers)

- [Creating an request handler](/docs/fundamentals/request-handlers#creating-an-request-handler)
- [Associating a request handler with a single route](/docs/fundamentals/request-handlers#associating-a-request-handler-with-a-single-route)
- [Associating a request handler with a router](/docs/fundamentals/request-handlers#associating-a-request-handler-with-a-router)
- [Associating a request handler with an attribute](/docs/fundamentals/request-handlers#associating-a-request-handler-with-an-attribute)
- [Bypassing an global request handler](/docs/fundamentals/request-handlers#bypassing-an-global-request-handler)

### [Requests](/docs/fundamentals/requests)

- [Getting the request method](/docs/fundamentals/requests#getting-the-request-method)
- [Getting request url components](/docs/fundamentals/requests#getting-request-url-components)
- [Getting the request body](/docs/fundamentals/requests#getting-the-request-body)
- [Getting the request context](/docs/fundamentals/requests#getting-the-request-context)
- [Getting form data](/docs/fundamentals/requests#getting-form-data)
- [Getting multipart form data](/docs/fundamentals/requests#getting-multipart-form-data)
- [Detecting client disconnection](/docs/fundamentals/requests#detecting-client-disconnection)
- [Server-sent events support](/docs/fundamentals/requests#server-sent-events-support)
- [Resolving proxied IPs and hosts](/docs/fundamentals/requests#resolving-proxied-ips-and-hosts)
- [Headers encoding](/docs/fundamentals/requests#headers-encoding)

### [Responses](/docs/fundamentals/responses)

- [Setting an HTTP status](/docs/fundamentals/responses#setting-an-http-status)
- [Body and content-type](/docs/fundamentals/responses#body-and-content-type)
- [Response headers](/docs/fundamentals/responses#response-headers)
- [Sending cookies](/docs/fundamentals/responses#sending-cookies)
- [Chunked responses](/docs/fundamentals/responses#chunked-responses)
- [Response stream](/docs/fundamentals/responses#response-stream)
- [GZip, Deflate and Brotli compression](/docs/fundamentals/responses#gzip-deflate-and-brotli-compression)
- [Automatic compression](/docs/fundamentals/responses#automatic-compression)
- [Implicit response types](/docs/fundamentals/responses#implicit-response-types)
- [Note on enumerable objects and arrays](/docs/fundamentals/responses#note-on-enumerable-objects-and-arrays)

## Features

### [Logging](/docs/features/logging)

- [File based access logs](/docs/features/logging#file-based-access-logs)
- [Stream based logging](/docs/features/logging#stream-based-logging)
- [Access log formatting](/docs/features/logging#access-log-formatting)
- [Rotating logs](/docs/features/logging#rotating-logs)
- [Error logging](/docs/features/logging#error-logging)
- [Other logging instances](/docs/features/logging#other-logging-instances)
- [Extending LogStream](/docs/features/logging#extending-logstream)

### [Server Sent Events](/docs/features/server-sent-events)

- [Creating an SSE connection](/docs/features/server-sent-events#creating-an-sse-connection)
- [Appending headers](/docs/features/server-sent-events#appending-headers)
- [Wait-For-Fail connections](/docs/features/server-sent-events#wait-for-fail-connections)
- [Setup connections ping policy](/docs/features/server-sent-events#setup-connections-ping-policy)
- [Querying connections](/docs/features/server-sent-events#querying-connections)

### [Web Sockets](/docs/features/websockets)

- [Accepting messages](/docs/features/websockets#accepting-messages)
- [Persistent connection](/docs/features/websockets#persistent-connection)
- [Ping Policy](/docs/features/websockets#ping-policy)

### [Discard syntax](/docs/features/discard-syntax)

### [Dependency injection](/docs/features/instancing)

### [Streaming Content](/docs/features/content-streaming)

- [Request content stream](/docs/features/content-streaming#request-content-stream)
- [Response content stream](/docs/features/content-streaming#response-content-stream)

### [Enabling CORS (Cross-Origin Resource Sharing) in Sisk](/docs/features/cors)

- [Same Origin](/docs/features/cors#same-origin)
- [Enabling CORS](/docs/features/cors#enabling-cors)
- [Other Ways to Apply CORS](/docs/features/cors#other-ways-to-apply-cors)
- [Disabling CORS on Specific Routes](/docs/features/cors#disabling-cors-on-specific-routes)
- [Replacing Values in the Response](/docs/features/cors#replacing-values-in-the-response)
- [Preflight Requests](/docs/features/cors#preflight-requests)
- [Disabling CORS Globally](/docs/features/cors#disabling-cors-globally)

### [File Server](/docs/features/file-server)

- [Serving static files](/docs/features/file-server#serving-static-files)
- [HttpFileServerHandler](/docs/features/file-server#httpfileserverhandler)
- [Directory Listing](/docs/features/file-server#directory-listing)
- [File Converters](/docs/features/file-server#file-converters)

## Extensions

### [Model Context Protocol](/docs/extensions/mcp)

- [Getting Started with MCP](/docs/extensions/mcp#getting-started-with-mcp)
- [Creating JSON Schemas for Functions](/docs/extensions/mcp#creating-json-schemas-for-functions)
- [Handling Function Calls](/docs/extensions/mcp#handling-function-calls)
- [Function Results](/docs/extensions/mcp#function-results)
- [Continuing Work](/docs/extensions/mcp#continuing-work)

### [JSON-RPC Extension](/docs/extensions/json-rpc)

- [Transport Interface](/docs/extensions/json-rpc#transport-interface)
- [JSON-RPC Methods](/docs/extensions/json-rpc#json-rpc-methods)
- [Customizing the serializer](/docs/extensions/json-rpc#customizing-the-serializer)

### [SSL Proxy](/docs/extensions/ssl-proxy)

### [Basic Auth](/docs/extensions/basic-auth)

- [Installing](/docs/extensions/basic-auth#installing)
- [Creating your auth handler](/docs/extensions/basic-auth#creating-your-auth-handler)
- [Remarks](/docs/extensions/basic-auth#remarks)

### [Service Providers](/docs/extensions/service-providers)

- [Reading configurations from a JSON file](/docs/extensions/service-providers#reading-configurations-from-a-json-file)
- [Configuration file structure](/docs/extensions/service-providers#configuration-file-structure)

### [INI configuration provider](/docs/extensions/ini-configuration)

- [Installing](/docs/extensions/ini-configuration#installing)
- [INI flavor and syntax](/docs/extensions/ini-configuration#ini-flavor-and-syntax)
- [Configuration parameters](/docs/extensions/ini-configuration#configuration-parameters)

### [API Documentation](/docs/extensions/api-documentation)

- [Type Handlers](/docs/extensions/api-documentation#type-handlers)
- [Exporters](/docs/extensions/api-documentation#exporters)

## Advanced

### [Manual (advanced) setup](/docs/advanced/manual-setup)

- [Routers](/docs/advanced/manual-setup#routers)
- [Listening Hosts and Ports](/docs/advanced/manual-setup#listening-hosts-and-ports)
- [Server Configuration](/docs/advanced/manual-setup#server-configuration)

### [Request lifecycle](/docs/advanced/request-lifecycle)

### [Forwarding Resolvers](/docs/advanced/forwarding-resolvers)

- [The ForwardingResolver class](/docs/advanced/forwarding-resolvers#the-forwardingresolver-class)

### [Http server handlers](/docs/advanced/http-server-handlers)

### [Multiple listening hosts per server](/docs/advanced/multi-host-setup)

### [HTTP Server Engines](/docs/advanced/server-engines)

- [Implementing an HTTP Engine for Sisk](/docs/advanced/server-engines#implementing-an-http-engine-for-sisk)
- [Choosing an Event Loop](/docs/advanced/server-engines#choosing-an-event-loop)
- [Testing](/docs/advanced/server-engines#testing)
