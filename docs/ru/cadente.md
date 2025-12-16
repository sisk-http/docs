# Cadente

Cadente является экспериментальной управляемой реализацией слушателя HTTP/1.1 для Sisk. Он служит заменой стандартному `System.Net.HttpListener`, предлагая большую гибкость и контроль, особенно на платформах, не являющихся Windows.

## Обзор

По умолчанию Sisk использует `HttpListener` (из `System.Net`) в качестве основного движка HTTP-сервера. Хотя `HttpListener` стабилен и производителен на Windows (где он использует драйвер HTTP.sys ядра), его реализация на Linux и macOS является управляемой и исторически имела ограничения, такие как отсутствие родной поддержки SSL (требующей обратного прокси, например, Nginx или Sisk.SslProxy) и различающиеся характеристики производительности.

Cadente призван решить эти проблемы, предоставляя полностью управляемый HTTP/1.1-сервер, написанный на C#. Его основные цели:

- **Родная поддержка SSL:** Работает на всех платформах без необходимости внешних прокси или сложной конфигурации.
- **Кроссплатформенная согласованность:** Идентичное поведение на Windows, Linux и macOS.
- **Производительность:** Разработан как высокопроизводительная альтернатива управляемому `HttpListener`.
- **Независимость:** Отделен от `System.Net.HttpListener`, изолируя Sisk от потенциальных будущих устареваний или отсутствия поддержки этого компонента в .NET.

> [!WARNING]
> **Экспериментальный статус**
> 
> Cadente в настоящее время находится на экспериментальной стадии (Бета). Он еще не рекомендуется для критических производственных сред. API и поведение могут измениться.

## Установка

Cadente доступен как отдельный пакет. Чтобы использовать его с Sisk, вам нужен пакет `Sisk.Cadente.CoreEngine`.

```bash
dotnet add package Sisk.Cadente.CoreEngine --prerelease
```

## Использование с Sisk

Чтобы использовать Cadente в качестве движка HTTP для вашего приложения Sisk, вам нужно настроить `HttpServer` на использование `CadenteHttpServerEngine` вместо стандартного движка.

`CadenteHttpServerEngine` адаптирует `HttpHost` Cadente к абстракции `HttpServerEngine`, необходимой для Sisk.

```csharp
using Sisk.Core.Http;
using Sisk.Cadente.CoreEngine;

using var host = HttpServer.CreateBuilder()
    .UseEngine<CadenteHttpServerEngine>()
    .UseSsl(certificate: CertificateHelper.CreateTrustedDevelopmentCertificate("localhost"))
    .Build();

await host.StartAsync();
```

### Расширенная конфигурация

Вы можете настроить базовый экземпляр `HttpHost`, передав действие настройки в конструктор `CadenteHttpServerEngine`. Это полезно для настройки таймаутов или других низкоуровневых настроек.

```csharp
using var engine = new CadenteHttpServerEngine(host =>
{
    // Настройка таймаутов чтения/записи клиента
    host.TimeoutManager.ClientReadTimeout = TimeSpan.FromSeconds(30);
    host.TimeoutManager.ClientWriteTimeout = TimeSpan.FromSeconds(30);
});
```

## Самостоятельное использование

Хотя в основном предназначен для Sisk, Cadente можно использовать как самостоятельный HTTP-сервер (аналогично `HttpListener`).

```csharp
using Sisk.Cadente;

var host = new HttpHost(15000)
{
    Handler = new MyHostHandler()
};

host.Start();
Thread.Sleep(-1);

class MyHostHandler : HttpHostHandler
{
    public override async Task OnContextCreatedAsync(HttpHost host, HttpHostContext context)
    {
        context.Response.StatusCode = 200;
        using var writer = new StreamWriter(context.Response.GetResponseStream());
        await writer.WriteLineAsync("Привет, мир!");
    }
}
```