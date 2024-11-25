# Getting Started with Sisk

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