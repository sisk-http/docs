# INI configuration provider

Sisk has a method for obtaining startup configurations other than JSON. In fact, any pipeline that implements [IConfigurationReader](/api/Sisk.Core.Http.Hosting.IConfigurationReader) can be used with [PortableConfigurationBuilder.WithConfigurationPipeline](/api/Sisk.Core.Http.Hosting.PortableConfigurationBuilder), reading the server configuration from any file type.

The [Sisk.IniConfiguration](https://www.nuget.org/packages/Sisk.IniConfiguration/) package provides a stream-based INI file reader that does not throw exceptions for common syntax errors and has a simple configuration syntax. This package can be used outside the Sisk framework, offering flexibility for projects that require an efficient INI document reader.

## Installing

To install the package, you can start with:

```bash
$ dotnet add package Sisk.IniConfiguration
```

and use it in your code as shown in the example below:

```cs
class Program
{
    static HttpServerHostContext Host = null!;

    static void Main(string[] args)
    {
        Host = HttpServer.CreateBuilder()
            .UsePortableConfiguration(config =>
            {
                config.WithConfigFile("app.ini", createIfDontExists: true);

                // adds the IniConfigurationPipeline to the configuration reader
                config.WithConfigurationPipeline<IniConfigurationPipeline>();
            })
            .UseRouter(r =>
            {
                r.MapGet("/", SayHello);
            })
            .Build();

        Host.Start();
    }

    static HttpResponse SayHello(HttpRequest request)
    {
        string? name = Host.Parameters["name"] ?? "world";
        return new HttpResponse($"Hello, {name}!");
    }
}
```

The code above will look for an app.ini file in the process's current directory (CurrentDirectory). The INI file looks like this:

```ini
[Server]
# Multiple listen addresses are supported
Listen = http://localhost:5552/
Listen = http://localhost:5553/
ThrowExceptions = false
AccessLogsStream = console

[Cors]
AllowMethods = GET, POST
AllowHeaders = Content-Type, Authorization
AllowOrigin = *

[Parameters]
Name = "Kanye West"
```

## INI flavor and syntax

Current implementation flavor:

- Properties and section names are **case-insensitive**.
- Properties names and values are **trimmed**.
- Values can be quoted with single or double quotes. Quotes can have line-breaks inside them.
- Comments are supported with `#` and `;`. Also, **trailing comments are allowed**.
- Properties can have multiple values.

Using the following ini code as example:

```ini
One = 1
Value = this is an value
Another value = "this value
    has an line break on it"

; the code below has some colors
[some section]
Color = Red
Color = Blue
Color = Yellow ; do not use yellow
```

Parse it with:

```csharp
// parse the ini text from the string
IniDocument doc = IniDocument.FromString(iniText);

// get one value
string? one = doc.Global.GetOne("one");
string? anotherValue = doc.Global.GetOne("another value");

// get multiple values
string[]? colors = doc.GetSection("some section")?.GetMany("color");
```

## Configuration parameters

| Section and name | Allow multiple values | Description |
| ---------------- | --------------------- | ----------- |
| `Server.Listen` | Yes | The server listening addresses/ports. |
| `Server.Encoding` | No | The server default encoding. |
| `Server.MaximumContentLength` | No | The server max content-length size in bytes. |
| `Server.IncludeRequestIdHeader` | No | Specifies if the HTTP server should send the X-Request-Id header. |
| `Server.ThrowExceptions` | No |  Specifies if unhandled exceptions should be thrown.  |
| `Server.AccessLogsStream` | No |  Specifies the access log output stream. |
| `Server.ErrorsLogsStream` | No |  Specifies the error log output stream. |
| `Cors.AllowMethods` | No |  Specifies the CORS Allow-Methods header value. |
| `Cors.AllowHeaders` | No |  Specifies the CORS Allow-Headers header value. |
| `Cors.AllowOrigins` | No |  Specifies multiples Allow-Origin headers, separated by commas. [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins) for more information. |
| `Cors.AllowOrigin` | No |  Specifies one Allow-Origin header. |
| `Cors.ExposeHeaders` | No |  Specifies the CORS Expose-Headers header value. |
| `Cors.AllowCredentials` | No |  Specifies the CORS Allow-Credentials header value. |
| `Cors.MaxAge` | No |  Specifies the CORS Max-Age header value. |