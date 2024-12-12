# Service Providers

Service Providers is a way to port your Sisk application to different environments with a portable configuration file. This feature allows you to change the server's port, parameters, and other options without having to modify the application code for each environment. This module depends on the Sisk construction syntax and can be configured through the UsePortableConfiguration method.

A configuration provider is implemented with IConfigurationProvider, which provides a configuration reader and can receive any implementation. By default, Sisk provides a JSON configuration reader, but there is also a package for INI files. You can also create your own configuration provider and register it with:

```csharp
using var app = HttpServer.CreateBuilder()
    .UsePortableConfiguration(config =>
    {
        config.WithConfigReader<MyConfigurationReader>();
    })
    .Build();
```

As mentioned earlier, the default provider is a JSON file. By default, the file name searched for is service-config.json, and it is searched in the current directory of the running process, not the executable directory.

You can choose to change the file name, as well as where Sisk should look for the configuration file, with:

```csharp
using Sisk.Core.Http;
using Sisk.Core.Http.Hosting;

using var app = HttpServer.CreateBuilder()
    .UsePortableConfiguration(config =>
    {
        config.WithConfigFile("config.toml",
            createIfDontExists: true,
            lookupDirectories:
                ConfigurationFileLookupDirectory.CurrentDirectory |
                ConfigurationFileLookupDirectory.AppDirectory);
    })
    .Build();
```

The code above will look for the config.toml file in the current directory of the running process. If not found, it will then search in the directory where the executable is located. If the file does not exist, the createIfDontExists parameter is honored, creating the file, without any content, in the last tested path (based on lookupDirectories), and an error is thrown in the console, preventing the application from initializing.

> [!TIP]
> 
> You can look at the source code of the INI configuration reader and the JSON configuration reader to understand how an IConfigurationProvider is implemented.

## Reading configurations from a JSON file

By default, Sisk provides a configuration provider that reads configurations from a JSON file. This file follows a fixed structure and is composed of the following parameters:

```json
{
    "Server": {
        "DefaultEncoding": "UTF-8",
        "ThrowExceptions": true,
        "IncludeRequestIdHeader": true
    },
    "ListeningHost": {
        "Label": "My sisk application",
        "Ports": [
            "http://localhost:80/",
            "https://localhost:443/",  // Configuration files also support comments
        ],
        "CrossOriginResourceSharingPolicy": {
            "AllowOrigin": "*",
            "AllowOrigins": [ "*" ],   // new on 0.14
            "AllowMethods": [ "*" ],
            "AllowHeaders": [ "*" ],
            "MaxAge": 3600
        },
        "Parameters": {
            "MySqlConnection": "server=localhost;user=root;"
        }
    }
}
```

The parameters created from a configuration file can be accessed in the server constructor:

```csharp
using var app = HttpServer.CreateBuilder()
    .UsePortableConfiguration(config =>
    {
        config.WithParameters(paramCollection =>
        {
            string databaseConnection = paramCollection.GetValueOrThrow("MySqlConnection");
        });
    })
    .Build();
```

Each configuration reader provides a way to read the server initialization parameters. Some properties are indicated to be in the process environment instead of being defined in the configuration file, such as sensitive API data, API keys, etc.

## Configuration file structure

The JSON configuration file is composed of the following properties:

<table>
    <thead>
        <tr>
            <th>Property</th>
            <th>Mandatory</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Server</td>
            <td>Required</td>
            <td>Represents the server itself with its settings.</td>
        </tr>
        <tr>
            <td>Server.AccessLogsStream</td>
            <td>Optional</td>
            <td>Default to <code>console</code>. Specifies the access log output stream. Can be a filename,
                <code>null</code> or <code>console</code>.
            </td>
        </tr>
        <tr>
            <td>Server.ErrorsLogsStream</td>
            <td>Optional</td>
            <td>Default to <code>null</code>. Specifies the error log output stream. Can be a filename,
                <code>null</code> or <code>console</code>.
            </td>
        </tr>
        <tr>
            <td>Server.MaximumContentLength</td>
            <td>Optional</td>
            <tr>
            <td>Server.MaximumContentLength</td>
            <td>Optional</td>
            <td>Default to <code>0</code>. Specifies the maximum content length in bytes. Zero means infinite.</td>
        </tr>
        <tr>
            <td>Server.IncludeRequestIdHeader</td>
            <td>Optional</td>
            <td>Default to <code>false</code>. Specifies if the HTTP server should send the <code>X-Request-Id</code> header.</td>
        </tr>
        <tr>
            <td>Server.ThrowExceptions</td>
            <td>Optional</td>
            <td>Default to <code>true</code>. Specifies if unhandled exceptions should be thrown. Set to <code>false</code> when production and <code>true</code> when debugging.</td>
        </tr>
        <tr>
            <td>ListeningHost</td>
            <td>Required</td>
            <td>Represents the server listening host.</td>
        </tr>
        <tr>
            <td>ListeningHost.Label</td>
            <td>Optional</td>
            <td>Represents the application label.</td>
        </tr>
        <tr>
            <td>ListeningHost.Ports</td>
            <td>Required</td>
            <td>Represents an array of strings, matching the <a href="/api/Sisk.Core.Http.ListeningPort">ListeningPort</a> syntax.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy</td>
            <td>Optional</td>
            <td>Setup the CORS headers for the application.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowCredentials</td>
            <td>Optional</td>
            <td>Defaults to <code>false</code>. Specifies the <code>Allow-Credentials</code> header.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.ExposeHeaders</td>
            <td>Optional</td>
            <td>Defaults to <code>null</code>. This property expects an array of strings. Specifies the <code>Expose-Headers</code> header.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowOrigin</td>
            <td>Optional</td>
            <td>Defaults to <code>null</code>. This property expects an string. Specifies the <code>Allow-Origin</code> header.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowOrigins</td>
            <td>Optional</td>
            <td>Defaults to <code>null</code>. This property expects an array of strings. Specifies multiples <code>Allow-Origin</code> headers. See <a href="/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins">AllowOrigins</a> for more information.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowMethods</td>
            <td>Optional</td>
            <td>Defaults to <code>null</code>. This property expects an array of strings. Specifies the <code>Allow-Methods</code> header.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowHeaders</td>
            <td>Optional</td>
            <td>Defaults to <code>null</code>. This property expects an array of strings. Specifies the <code>Allow-Headers</code> header.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.MaxAge</td>
            <td>Optional</td>
            <td>Defaults to <code>null</code>. This property expects an integer. Specifies the <code>Max-Age</code> header in seconds.</td>
        </tr>
        <tr>
            <td>ListeningHost.Parameters</td>
            <td>Optional</td>
            <td>Specifies the properties provided to the application setup method.</td>
        </tr>
    </tbody>
</table>