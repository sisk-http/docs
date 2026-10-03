---
title: "Configuring namespace reservations on Windows"
linkTitle: "Windows Setup"
weight: 70
aliases:
  - "/docs/registering-namespace.html"
---

> [!NOTE]
> This configuration is optional and only required when you want Sisk to listen on hosts other than "localhost" on Windows using the HttpListener engine.

Sisk works with the HttpListener network interface, which binds a virtual host to the system to listen for requests.

On Windows, this binding is a bit restrictive, only allowing localhost to be bound as a valid host. When attempting to listen to another host, an access denied error is thrown on the server. This tutorial explains how to grant authorization to listen on any host you want on the system.

```bat {title="Namespace Setup.bat"}
@echo off

:: insert prefix here, without spaces or quotes
SET PREFIX=

SET DOMAIN=%ComputerName%\%USERNAME%
netsh http add urlacl url=%PREFIX% user=%DOMAIN%

pause
```

Where in `PREFIX`, is the prefix ("Listening Host->Port") that your server will listen to. It must be formatted with the URL scheme, host, port and a slash at the end, example:

```bat {title="Namespace Setup.bat"}
SET PREFIX=http://my-application.example.test/
```

So that you can be listened in your application through:

```csharp {title="Program.cs"}
class Program
{
    static async Task Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseListeningPort("http://my-application.example.test/")
            .Build();

        app.Router.MapGet("/", request =>
        {
            return new HttpResponse()
            {
                Status = 200,
                Content = new StringContent("Hello, world!")
            };
        });

        await app.StartAsync();
    }
}
```
