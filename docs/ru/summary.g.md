# Сводка документации

## Добро пожаловать

### [Начало работы](/docs/ru/getting-started)

- [Первые шаги](/docs/ru/getting-started#first-steps)
- [Создание проекта](/docs/ru/getting-started#creating-a-project)
- [Сборка HTTP-сервера](/docs/ru/getting-started#building-the-http-server)
- [Ручная (расширенная) настройка](/docs/ru/getting-started#manual-advanced-setup)

### [Установка](/docs/ru/installing)

### [Поддержка Native AOT](/docs/ru/native-aot)

- [Неподдерживаемые функции](/docs/ru/native-aot#not-supported-features)

### [Развёртывание вашего приложения Sisk](/docs/ru/deploying)

- [Публикация вашего приложения](/docs/ru/deploying#publishing-your-app)
- [Проксирование вашего приложения](/docs/ru/deploying#proxying-your-application)
- [Создание сервиса](/docs/ru/deploying#creating-an-service)

### [Работа с SSL](/docs/ru/ssl)

- [Через Sisk.Cadente.CoreEngine](/docs/ru/ssl#through-the-siskcadentecoreengine)
- [Через IIS на Windows](/docs/ru/ssl#through-iis-on-windows)
- [Через mitmproxy](/docs/ru/ssl#through-mitmproxy)
- [Через пакет Sisk.SslProxy](/docs/ru/ssl#through-sisksslproxy-package)

### [Cadente](/docs/ru/cadente)

- [Обзор](/docs/ru/cadente#overview)
- [Установка](/docs/ru/cadente#installation)
- [Использование с Sisk](/docs/ru/cadente#using-with-sisk)
- [Автономное использование](/docs/ru/cadente#standalone-usage)

### [Настройка резервирования пространств имён в Windows](/docs/ru/registering-namespace)

### [Журналы изменений](/docs/ru/changelogs)

### [Часто задаваемые вопросы](/docs/ru/faq)

- [Является ли Sisk открытым исходным кодом?](/docs/ru/faq#is-sisk-open-source)
- [Принимаются ли вклады?](/docs/ru/faq#are-contributions-accepted)
- [Финансируется ли Sisk?](/docs/ru/faq#is-sisk-funded)
- [Можно ли использовать Sisk в продакшене?](/docs/ru/faq#can-i-use-sisk-in-production)
- [Есть ли у Sisk аутентификация, мониторинг и сервисы баз данных?](/docs/ru/faq#does-sisk-have-authentication-monitoring-and-database-services)
- [Почему я должен использовать Sisk вместо <framework>?](/docs/ru/faq#why-should-i-use-sisk-instead-of-framework)
- [Что мне нужно, чтобы изучить Sisk?](/docs/ru/faq#what-do-i-need-to-learn-sisk)
- [Могу ли я разрабатывать коммерческие приложения с Sisk?](/docs/ru/faq#can-i-develop-commercial-applications-with-sisk)

## Основы

### [Маршрутизация](/docs/ru/fundamentals/routing)

- [Сопоставление маршрутов](/docs/ru/fundamentals/routing#matching-routes)
- [Маршруты с регулярными выражениями](/docs/ru/fundamentals/routing#regex-routes)
- [Префиксные маршруты](/docs/ru/fundamentals/routing#prefixing-routes)
- [Маршруты без параметра запроса](/docs/ru/fundamentals/routing#routes-without-request-parameter)
- [Маршруты любого метода](/docs/ru/fundamentals/routing#any-method-routes)
- [Маршруты любого пути](/docs/ru/fundamentals/routing#any-path-routes)
- [Игнорировать регистр при сопоставлении маршрутов](/docs/ru/fundamentals/routing#ignore-case-route-matching)
- [Обработчик обратного вызова Not Found (404)](/docs/ru/fundamentals/routing#not-found-404-callback-handler)
- [Обработчик обратного вызова Method not allowed (405)](/docs/ru/fundamentals/routing#method-not-allowed-405-callback-handler)
- [Обработчик внутренних ошибок](/docs/ru/fundamentals/routing#internal-error-handler)

### [Обработка запросов](/docs/ru/fundamentals/request-handlers)

- [Создание обработчика запросов](/docs/ru/fundamentals/request-handlers#creating-an-request-handler)
- [Связывание обработчика запросов с отдельным маршрутом](/docs/ru/fundamentals/request-handlers#associating-a-request-handler-with-a-single-route)
- [Связывание обработчика запросов с роутером](/docs/ru/fundamentals/request-handlers#associating-a-request-handler-with-a-router)
- [Связывание обработчика запросов с атрибутом](/docs/ru/fundamentals/request-handlers#associating-a-request-handler-with-an-attribute)
- [Обход глобального обработчика запросов](/docs/ru/fundamentals/request-handlers#bypassing-an-global-request-handler)

### [Запросы](/docs/ru/fundamentals/requests)

- [Получение метода запроса](/docs/ru/fundamentals/requests#getting-the-request-method)
- [Получение компонентов URL запроса](/docs/ru/fundamentals/requests#getting-request-url-components)
- [Получение тела запроса](/docs/ru/fundamentals/requests#getting-the-request-body)
- [Получение контекста запроса](/docs/ru/fundamentals/requests#getting-the-request-context)
- [Получение данных формы](/docs/ru/fundamentals/requests#getting-form-data)
- [Получение multipart-данных формы](/docs/ru/fundamentals/requests#getting-multipart-form-data)
- [Обнаружение отключения клиента](/docs/ru/fundamentals/requests#detecting-client-disconnection)
- [Поддержка Server-sent events](/docs/ru/fundamentals/requests#server-sent-events-support)
- [Разрешение проксированных IP и хостов](/docs/ru/fundamentals/requests#resolving-proxied-ips-and-hosts)
- [Кодировка заголовков](/docs/ru/fundamentals/requests#headers-encoding)

### [Ответы](/docs/ru/fundamentals/responses)

- [Установка HTTP-статуса](/docs/ru/fundamentals/responses#setting-an-http-status)
- [Тело и тип содержимого](/docs/ru/fundamentals/responses#body-and-content-type)
- [Заголовки ответа](/docs/ru/fundamentals/responses#response-headers)
- [Отправка куки](/docs/ru/fundamentals/responses#sending-cookies)
- [Chunked-ответы](/docs/ru/fundamentals/responses#chunked-responses)
- [Поток ответа](/docs/ru/fundamentals/responses#response-stream)
- [Сжатие GZip, Deflate и Brotli](/docs/ru/fundamentals/responses#gzip-deflate-and-brotli-compression)
- [Автоматическое сжатие](/docs/ru/fundamentals/responses#automatic-compression)
- [Неявные типы ответов](/docs/ru/fundamentals/responses#implicit-response-types)
- [Примечание об перечисляемых объектах и массивах](/docs/ru/fundamentals/responses#note-on-enumerable-objects-and-arrays)

## Возможности

### [Логирование](/docs/ru/features/logging)

- [Файловые журналы доступа](/docs/ru/features/logging#file-based-access-logs)
- [Логирование на основе потоков](/docs/ru/features/logging#stream-based-logging)
- [Форматирование журнала доступа](/docs/ru/features/logging#access-log-formatting)
- [Ротация журналов](/docs/ru/features/logging#rotating-logs)
- [Логирование ошибок](/docs/ru/features/logging#error-logging)
- [Другие экземпляры логирования](/docs/ru/features/logging#other-logging-instances)
- [Расширение LogStream](/docs/ru/features/logging#extending-logstream)

### [События, отправляемые сервером](/docs/ru/features/server-sent-events)

- [Создание SSE‑соединения](/docs/ru/features/server-sent-events#creating-an-sse-connection)
- [Добавление заголовков](/docs/ru/features/server-sent-events#appending-headers)
- [Соединения Wait-For-Fail](/docs/ru/features/server-sent-events#wait-for-fail-connections)
- [Настройка политики ping для соединений](/docs/ru/features/server-sent-events#setup-connections-ping-policy)
- [Запрос соединений](/docs/ru/features/server-sent-events#querying-connections)

### [Веб‑сокеты](/docs/ru/features/websockets)

- [Приём сообщений](/docs/ru/features/websockets#accepting-messages)
- [Постоянное соединение](/docs/ru/features/websockets#persistent-connection)
- [Политика ping](/docs/ru/features/websockets#ping-policy)

### [Синтаксис discard](/docs/ru/features/discard-syntax)

### [Внедрение зависимостей](/docs/ru/features/instancing)

### [Потоковое содержимое](/docs/ru/features/content-streaming)

- [Поток содержимого запроса](/docs/ru/features/content-streaming#request-content-stream)
- [Поток содержимого ответа](/docs/ru/features/content-streaming#response-content-stream)

### [Включение CORS (Cross-Origin Resource Sharing) в Sisk](/docs/ru/features/cors)

- [Тот же источник](/docs/ru/features/cors#same-origin)
- [Включение CORS](/docs/ru/features/cors#enabling-cors)
- [Другие способы применения CORS](/docs/ru/features/cors#other-ways-to-apply-cors)
- [Отключение CORS на конкретных маршрутах](/docs/ru/features/cors#disabling-cors-on-specific-routes)
- [Замена значений в ответе](/docs/ru/features/cors#replacing-values-in-the-response)
- [Preflight‑запросы](/docs/ru/features/cors#preflight-requests)
- [Глобальное отключение CORS](/docs/ru/features/cors#disabling-cors-globally)

### [Файловый сервер](/docs/ru/features/file-server)

- [Обслуживание статических файлов](/docs/ru/features/file-server#serving-static-files)
- [HttpFileServerHandler](/docs/ru/features/file-server#httpfileserverhandler)
- [Список каталогов](/docs/ru/features/file-server#directory-listing)
- [Конвертеры файлов](/docs/ru/features/file-server#file-converters)

## Расширения

### [Model Context Protocol](/docs/ru/extensions/mcp)

- [Начало работы с MCP](/docs/ru/extensions/mcp#getting-started-with-mcp)
- [Создание JSON‑схем для функций](/docs/ru/extensions/mcp#creating-json-schemas-for-functions)
- [Обработка вызовов функций](/docs/ru/extensions/mcp#handling-function-calls)
- [Результаты функций](/docs/ru/extensions/mcp#function-results)
- [Продолжение работы](/docs/ru/extensions/mcp#continuing-work)

### [JSON-RPC Extension](/docs/ru/extensions/json-rpc)

- [Транспортный интерфейс](/docs/ru/extensions/json-rpc#transport-interface)
- [Методы JSON-RPC](/docs/ru/extensions/json-rpc#json-rpc-methods)
- [Настройка сериализатора](/docs/ru/extensions/json-rpc#customizing-the-serializer)

### [SSL Proxy](/docs/ru/extensions/ssl-proxy)

### [Basic Auth](/docs/ru/extensions/basic-auth)

- [Установка](/docs/ru/extensions/basic-auth#installing)
- [Создание вашего обработчика аутентификации](/docs/ru/extensions/basic-auth#creating-your-auth-handler)
- [Замечания](/docs/ru/extensions/basic-auth#remarks)

### [Поставщики сервисов](/docs/ru/extensions/service-providers)

- [Чтение конфигураций из JSON‑файла](/docs/ru/extensions/service-providers#reading-configurations-from-a-json-file)
- [Структура конфигурационного файла](/docs/ru/extensions/service-providers#configuration-file-structure)

### [Поставщик конфигураций INI](/docs/ru/extensions/ini-configuration)

- [Установка](/docs/ru/extensions/ini-configuration#installing)
- [Вариант и синтаксис INI](/docs/ru/extensions/ini-configuration#ini-flavor-and-syntax)
- [Параметры конфигурации](/docs/ru/extensions/ini-configuration#configuration-parameters)

### [Документация API](/docs/ru/extensions/api-documentation)

- [Обработчики типов](/docs/ru/extensions/api-documentation#type-handlers)
- [Экспортеры](/docs/ru/extensions/api-documentation#exporters)

## Продвинутый уровень

### [Ручная (расширенная) настройка](/docs/ru/advanced/manual-setup)

- [Роутеры](/docs/ru/advanced/manual-setup#routers)
- [Хосты и порты прослушивания](/docs/ru/advanced/manual-setup#listening-hosts-and-ports)
- [Конфигурация сервера](/docs/ru/advanced/manual-setup#server-configuration)

### [Жизненный цикл запроса](/docs/ru/advanced/request-lifecycle)

### [Перенаправляющие резолверы](/docs/ru/advanced/forwarding-resolvers)

- [Класс ForwardingResolver](/docs/ru/advanced/forwarding-resolvers#the-forwardingresolver-class)

### [Обработчики HTTP‑сервера](/docs/ru/advanced/http-server-handlers)

### [Несколько хостов прослушивания на сервере](/docs/ru/advanced/multi-host-setup)

### [Движки HTTP‑сервера](/docs/ru/advanced/server-engines)

- [Реализация HTTP‑движка для Sisk](/docs/ru/advanced/server-engines#implementing-an-http-engine-for-sisk)
- [Выбор цикла событий](/docs/ru/advanced/server-engines#choosing-an-event-loop)
- [Тестирование](/docs/ru/advanced/server-engines#testing)