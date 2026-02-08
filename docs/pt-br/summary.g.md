# Resumo da Documentação

## Bem-vindo

### [Começando](/docs/pt-br/getting-started)

- [Primeiros passos](/docs/pt-br/getting-started#first-steps)
- [Criando um Projeto](/docs/pt-br/getting-started#creating-a-project)
- [Construindo o Servidor HTTP](/docs/pt-br/getting-started#building-the-http-server)
- [Configuração manual (avançada)](/docs/pt-br/getting-started#manual-advanced-setup)

### [Instalação](/docs/pt-br/installing)

### [Suporte a Native AOT](/docs/pt-br/native-aot)

- [Recursos não suportados](/docs/pt-br/native-aot#not-supported-features)

### [Implantando sua Aplicação Sisk](/docs/pt-br/deploying)

- [Publicando sua aplicação](/docs/pt-br/deploying#publishing-your-app)
- [Proxy da sua aplicação](/docs/pt-br/deploying#proxying-your-application)
- [Criando um serviço](/docs/pt-br/deploying#creating-an-service)

### [Trabalhando com SSL](/docs/pt-br/ssl)

- [Através do Sisk.Cadente.CoreEngine](/docs/pt-br/ssl#through-the-siskcadentecoreengine)
- [Através do IIS no Windows](/docs/pt-br/ssl#through-iis-on-windows)
- [Através do mitmproxy](/docs/pt-br/ssl#through-mitmproxy)
- [Através do pacote Sisk.SslProxy](/docs/pt-br/ssl#through-sisksslproxy-package)

### [Cadente](/docs/pt-br/cadente)

- [Visão geral](/docs/pt-br/cadente#overview)
- [Instalação](/docs/pt-br/cadente#installation)
- [Usando com Sisk](/docs/pt-br/cadente#using-with-sisk)
- [Uso Autônomo](/docs/pt-br/cadente#standalone-usage)

### [Configurando reservas de namespace no Windows](/docs/pt-br/registering-namespace)

### [Logs de Alterações](/docs/pt-br/changelogs)

### [Perguntas Frequentes](/docs/pt-br/faq)

- [O Sisk é open-source?](/docs/pt-br/faq#is-sisk-open-source)
- [Contribuições são aceitas?](/docs/pt-br/faq#are-contributions-accepted)
- [O Sisk é financiado?](/docs/pt-br/faq#is-sisk-funded)
- [Posso usar o Sisk em produção?](/docs/pt-br/faq#can-i-use-sisk-in-production)
- [O Sisk tem serviços de autenticação, monitoramento e banco de dados?](/docs/pt-br/faq#does-sisk-have-authentication-monitoring-and-database-services)
- [Por que devo usar o Sisk ao invés de <framework>?](/docs/pt-br/faq#why-should-i-use-sisk-instead-of-framework)
- [O que preciso para aprender Sisk?](/docs/pt-br/faq#what-do-i-need-to-learn-sisk)
- [Posso desenvolver aplicações comerciais com Sisk?](/docs/pt-br/faq#can-i-develop-commercial-applications-with-sisk)

## Fundamentos

### [Roteamento](/docs/pt-br/fundamentals/routing)

- [Correspondência de rotas](/docs/pt-br/fundamentals/routing#matching-routes)
- [Rotas Regex](/docs/pt-br/fundamentals/routing#regex-routes)
- [Prefixo de rotas](/docs/pt-br/fundamentals/routing#prefixing-routes)
- [Rotas sem parâmetro de requisição](/docs/pt-br/fundamentals/routing#routes-without-request-parameter)
- [Rotas de qualquer método](/docs/pt-br/fundamentals/routing#any-method-routes)
- [Rotas de qualquer caminho](/docs/pt-br/fundamentals/routing#any-path-routes)
- [Correspondência de rotas ignorando maiúsculas/minúsculas](/docs/pt-br/fundamentals/routing#ignore-case-route-matching)
- [Manipulador de callback Not Found (404)](/docs/pt-br/fundamentals/routing#not-found-404-callback-handler)
- [Manipulador de callback Method not allowed (405)](/docs/pt-br/fundamentals/routing#method-not-allowed-405-callback-handler)
- [Manipulador de erro interno](/docs/pt-br/fundamentals/routing#internal-error-handler)

### [Manipulação de requisições](/docs/pt-br/fundamentals/request-handlers)

- [Criando um manipulador de requisição](/docs/pt-br/fundamentals/request-handlers#creating-an-request-handler)
- [Associando um manipulador de requisição a uma única rota](/docs/pt-br/fundamentals/request-handlers#associating-a-request-handler-with-a-single-route)
- [Associando um manipulador de requisição a um roteador](/docs/pt-br/fundamentals/request-handlers#associating-a-request-handler-with-a-router)
- [Associando um manipulador de requisição a um atributo](/docs/pt-br/fundamentals/request-handlers#associating-a-request-handler-with-an-attribute)
- [Ignorando um manipulador de requisição global](/docs/pt-br/fundamentals/request-handlers#bypassing-an-global-request-handler)

### [Requisições](/docs/pt-br/fundamentals/requests)

- [Obtendo o método da requisição](/docs/pt-br/fundamentals/requests#getting-the-request-method)
- [Obtendo componentes da URL da requisição](/docs/pt-br/fundamentals/requests#getting-request-url-components)
- [Obtendo o corpo da requisição](/docs/pt-br/fundamentals/requests#getting-the-request-body)
- [Obtendo o contexto da requisição](/docs/pt-br/fundamentals/requests#getting-the-request-context)
- [Obtendo dados de formulário](/docs/pt-br/fundamentals/requests#getting-form-data)
- [Obtendo dados de formulário multipart](/docs/pt-br/fundamentals/requests#getting-multipart-form-data)
- [Detectando desconexão do cliente](/docs/pt-br/fundamentals/requests#detecting-client-disconnection)
- [Suporte a Server-sent events](/docs/pt-br/fundamentals/requests#server-sent-events-support)
- [Resolvendo IPs e hosts proxy](/docs/pt-br/fundamentals/requests#resolving-proxied-ips-and-hosts)
- [Codificação de cabeçalhos](/docs/pt-br/fundamentals/requests#headers-encoding)

### [Respostas](/docs/pt-br/fundamentals/responses)

- [Definindo um status HTTP](/docs/pt-br/fundamentals/responses#setting-an-http-status)
- [Corpo e content-type](/docs/pt-br/fundamentals/responses#body-and-content-type)
- [Cabeçalhos de resposta](/docs/pt-br/fundamentals/responses#response-headers)
- [Enviando cookies](/docs/pt-br/fundamentals/responses#sending-cookies)
- [Respostas em chunk](/docs/pt-br/fundamentals/responses#chunked-responses)
- [Stream de resposta](/docs/pt-br/fundamentals/responses#response-stream)
- [Compressão GZip, Deflate e Brotli](/docs/pt-br/fundamentals/responses#gzip-deflate-and-brotli-compression)
- [Compressão automática](/docs/pt-br/fundamentals/responses#automatic-compression)
- [Tipos de resposta implícitos](/docs/pt-br/fundamentals/responses#implicit-response-types)
- [Nota sobre objetos enumeráveis e arrays](/docs/pt-br/fundamentals/responses#note-on-enumerable-objects-and-arrays)

## Recursos

### [Logging](/docs/pt-br/features/logging)

- [Logs de acesso baseados em arquivo](/docs/pt-br/features/logging#file-based-access-logs)
- [Logging baseado em stream](/docs/pt-br/features/logging#stream-based-logging)
- [Formatação de logs de acesso](/docs/pt-br/features/logging#access-log-formatting)
- [Rotação de logs](/docs/pt-br/features/logging#rotating-logs)
- [Logging de erros](/docs/pt-br/features/logging#error-logging)
- [Outras instâncias de logging](/docs/pt-br/features/logging#other-logging-instances)
- [Estendendo LogStream](/docs/pt-br/features/logging#extending-logstream)

### [Server Sent Events](/docs/pt-br/features/server-sent-events)

- [Criando uma conexão SSE](/docs/pt-br/features/server-sent-events#creating-an-sse-connection)
- [Anexando cabeçalhos](/docs/pt-br/features/server-sent-events#appending-headers)
- [Conexões Wait-For-Fail](/docs/pt-br/features/server-sent-events#wait-for-fail-connections)
- [Configurar política de ping das conexões](/docs/pt-br/features/server-sent-events#setup-connections-ping-policy)
- [Consultando conexões](/docs/pt-br/features/server-sent-events#querying-connections)

### [Web Sockets](/docs/pt-br/features/websockets)

- [Aceitando mensagens](/docs/pt-br/features/websockets#accepting-messages)
- [Conexão persistente](/docs/pt-br/features/websockets#persistent-connection)
- [Política de Ping](/docs/pt-br/features/websockets#ping-policy)

### [Sintaxe discard](/docs/pt-br/features/discard-syntax)

### [Injeção de dependência](/docs/pt-br/features/instancing)

### [Streaming de Conteúdo](/docs/pt-br/features/content-streaming)

- [Stream de conteúdo da requisição](/docs/pt-br/features/content-streaming#request-content-stream)
- [Stream de conteúdo da resposta](/docs/pt-br/features/content-streaming#response-content-stream)

### [Habilitando CORS (Cross-Origin Resource Sharing) no Sisk](/docs/pt-br/features/cors)

- [Mesma Origem](/docs/pt-br/features/cors#same-origin)
- [Habilitando CORS](/docs/pt-br/features/cors#enabling-cors)
- [Outras formas de aplicar CORS](/docs/pt-br/features/cors#other-ways-to-apply-cors)
- [Desabilitando CORS em rotas específicas](/docs/pt-br/features/cors#disabling-cors-on-specific-routes)
- [Substituindo valores na resposta](/docs/pt-br/features/cors#replacing-values-in-the-response)
- [Requisições Preflight](/docs/pt-br/features/cors#preflight-requests)
- [Desabilitando CORS globalmente](/docs/pt-br/features/cors#disabling-cors-globally)

### [Servidor de Arquivos](/docs/pt-br/features/file-server)

- [Servindo arquivos estáticos](/docs/pt-br/features/file-server#serving-static-files)
- [HttpFileServerHandler](/docs/pt-br/features/file-server#httpfileserverhandler)
- [Listagem de diretórios](/docs/pt-br/features/file-server#directory-listing)
- [Conversores de arquivos](/docs/pt-br/features/file-server#file-converters)

## Extensões

### [Protocolo de Contexto de Modelo](/docs/pt-br/extensions/mcp)

- [Começando com MCP](/docs/pt-br/extensions/mcp#getting-started-with-mcp)
- [Criando Schemas JSON para Funções](/docs/pt-br/extensions/mcp#creating-json-schemas-for-functions)
- [Manipulando chamadas de função](/docs/pt-br/extensions/mcp#handling-function-calls)
- [Resultados de Função](/docs/pt-br/extensions/mcp#function-results)
- [Continuando o trabalho](/docs/pt-br/extensions/mcp#continuing-work)

### [Extensão JSON-RPC](/docs/pt-br/extensions/json-rpc)

- [Interface de Transporte](/docs/pt-br/extensions/json-rpc#transport-interface)
- [Métodos JSON-RPC](/docs/pt-br/extensions/json-rpc#json-rpc-methods)
- [Personalizando o serializador](/docs/pt-br/extensions/json-rpc#customizing-the-serializer)

### [Proxy SSL](/docs/pt-br/extensions/ssl-proxy)

### [Autenticação Básica](/docs/pt-br/extensions/basic-auth)

- [Instalação](/docs/pt-br/extensions/basic-auth#installing)
- [Criando seu manipulador de autenticação](/docs/pt-br/extensions/basic-auth#creating-your-auth-handler)
- [Observações](/docs/pt-br/extensions/basic-auth#remarks)

### [Provedores de Serviço](/docs/pt-br/extensions/service-providers)

- [Lendo configurações de um arquivo JSON](/docs/pt-br/extensions/service-providers#reading-configurations-from-a-json-file)
- [Estrutura do arquivo de configuração](/docs/pt-br/extensions/service-providers#configuration-file-structure)

### [Provedor de configuração INI](/docs/pt-br/extensions/ini-configuration)

- [Instalação](/docs/pt-br/extensions/ini-configuration#installing)
- [Sabor e sintaxe INI](/docs/pt-br/extensions/ini-configuration#ini-flavor-and-syntax)
- [Parâmetros de configuração](/docs/pt-br/extensions/ini-configuration#configuration-parameters)

### [Documentação da API](/docs/pt-br/extensions/api-documentation)

- [Manipuladores de Tipo](/docs/pt-br/extensions/api-documentation#type-handlers)
- [Exportadores](/docs/pt-br/extensions/api-documentation#exporters)

## Avançado

### [Configuração manual (avançada)](/docs/pt-br/advanced/manual-setup)

- [Roteadores](/docs/pt-br/advanced/manual-setup#routers)
- [Hosts e Portas de escuta](/docs/pt-br/advanced/manual-setup#listening-hosts-and-ports)
- [Configuração do Servidor](/docs/pt-br/advanced/manual-setup#server-configuration)

### [Ciclo de vida da requisição](/docs/pt-br/advanced/request-lifecycle)

### [Resolvedores de encaminhamento](/docs/pt-br/advanced/forwarding-resolvers)

- [A classe ForwardingResolver](/docs/pt-br/advanced/forwarding-resolvers#the-forwardingresolver-class)

### [Manipuladores de servidor HTTP](/docs/pt-br/advanced/http-server-handlers)

### [Múltiplos hosts de escuta por servidor](/docs/pt-br/advanced/multi-host-setup)

### [Engines de Servidor HTTP](/docs/pt-br/advanced/server-engines)

- [Implementando um Engine HTTP para Sisk](/docs/pt-br/advanced/server-engines#implementing-an-http-engine-for-sisk)
- [Escolhendo um Event Loop](/docs/pt-br/advanced/server-engines#choosing-an-event-loop)
- [Testes](/docs/pt-br/advanced/server-engines#testing)