# HttpServerHostContext.StartAsync

Kind: Method  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.StartAsync.html

## StartAsync(bool, bool) {#Sisk_Core_Http_Hosting_HttpServerHostContext_StartAsync_System_Boolean_System_Boolean_}

Asynchronously starts the HTTP server.

```csharp
public Task StartAsync(bool verbose = true, bool preventHault = true)
```

### Parameters

`verbose` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

Optional. Specifies if the application should write the listening prefix welcome message.

`preventHault` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

Optional. Specifies if the application should pause the main application loop.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)
