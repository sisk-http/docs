# Getting started

Welcome to the Sisk documentation!

Finally, what is the Sisk Framework? It is an open-source lightweight library built with .NET, designed to be minimalist, flexible, and abstract. It allows developers to create internet services quickly, with little or no necessary configuration. Sisk makes it possible for your existing application to have a managed HTTP module, complete and disposable or complete.

Sisk's values include code transparency, modularity, performance, and scalability, and can handle various types of applications, such as Restful, JSON-RPC, Web-sockets, and more.

Its main resources include:

| Resource | Description |
| ------- | --------- |
| [Routing](/docs/fundamentals/routing) | A path router that supports prefixes, custom methods, path variables, response conversions, and more. |
| [Request Handlers](/docs/fundamentals/request-handlers) | Also known as *middlewares*, provides an interface to build your own request-handlers that work before or after a request. |
| [Compression](/docs/fundamentals/responses#gzip-deflate-and-brotli-compression) | Compress your responses easily with Sisk. |
| [Web sockets](/docs/features/websockets) | Provides routes that accept complete web-sockets, for reading and writing to the client. |
| [Server-sent events](/docs/features/server-sent-events) | Provides the sending of server events to clients that support the SSE protocol. |
| [Logging](/docs/features/logging) | Simplified logging. Log errors, access, define rotating logs by size, multiple output streams for the same log, and more. |
| [Multi-host](/docs/advanced/multi-host-setup) | Have an HTTP server for multiple ports, and each port with its own router, and each router with its own application. |
| [Server handlers](/docs/advanced/http-server-handlers) | Extend your own implementation of the HTTP server. Customize with extensions, improvements, and new features.

## First steps

Sisk can run in any .NET environment. In this guide, we will teach you how to create a Sisk application using .NET. If you haven't installed it yet, please download the SDK from [here](https://dotnet.microsoft.com/en-us/download/dotnet/7.0).

In this tutorial, we will cover how to create a project structure, receive a request, obtain a URL parameter, and send a response. This guide will focus on building a simple server using C#. You can also use your favorite programming language.

> [!NOTE]
> You may be interested in a quickstart project. Check [this repository](https://github.com/sisk-http/quickstart) for more information.

## Creating a Project

Let's name our project "My Sisk Application." Once you have .NET set up, you can create your project with the following command:

```bash
dotnet new console -n my-sisk-application
```

Next, navigate to your project directory and install Sisk using the .NET utility tool:

```bash
cd my-sisk-application
dotnet add package Sisk.HttpServer
```

You can find additional ways to install Sisk in your project [here](https://www.nuget.org/packages/Sisk.HttpServer/).

Now, let's create an instance of our HTTP server. For this example, we will configure it to listen on port 5000.

## Building the HTTP Server

Sisk allows you to build your application step by step manually, as it routes to the HttpServer object. However, this may not be very convenient for most projects. Therefore, we can use the builder method, which makes it easier to get our app up and running.

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
class Program
{
    static async Task Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseListeningPort("http://localhost:5000/")
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

It's important to understand each vital component of Sisk. Later in this document, you will learn more about how Sisk works.

## Manual (advanced) setup

You can learn how each Sisk mechanism works in [this section](/docs/advanced/manual-setup) of the documentation, which explains the behavior and relationships between the HttpServer, Router, ListeningPort, and other components.