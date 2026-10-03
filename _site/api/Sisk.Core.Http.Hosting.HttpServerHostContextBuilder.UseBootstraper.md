# HttpServerHostContextBuilder.UseBootstraper

Kind: Method  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.UseBootstraper.html

## UseBootstraper(Action) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseBootstraper_System_Action_}

Adds an function that will be executed immediately before starting the HTTP server.

```csharp
public HttpServerHostContextBuilder UseBootstraper(Action bootstrapAction)
```

### Parameters

`bootstrapAction` [Action](https://learn.microsoft.com/dotnet/api/system.action)

The action which will be executed before the HTTP server start.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

## UseBootstraper(string, Action) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseBootstraper_System_String_System_Action_}

Adds an function that will be executed immediately before starting the HTTP server.

```csharp
public HttpServerHostContextBuilder UseBootstraper(string name, Action bootstrapAction)
```

### Parameters

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

Defines an custom label for the bootstraping action name.

`bootstrapAction` [Action](https://learn.microsoft.com/dotnet/api/system.action)

The action which will be executed before the HTTP server start.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

## UseBootstraper(Func&lt;Task>) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseBootstraper_System_Func_System_Threading_Tasks_Task__}

Adds an asynchronous function that will be executed immediately before starting the HTTP server.

```csharp
public HttpServerHostContextBuilder UseBootstraper(Func<Task> asyncBootstrapAction)
```

### Parameters

`asyncBootstrapAction` [Func](https://learn.microsoft.com/dotnet/api/system.func\-1)<[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)\>

The asynchronous action which will be executed before the HTTP server start.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

## UseBootstraper(string, Func&lt;Task>) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseBootstraper_System_String_System_Func_System_Threading_Tasks_Task__}

Adds an asynchronous function that will be executed immediately before starting the HTTP server.

```csharp
public HttpServerHostContextBuilder UseBootstraper(string name, Func<Task> asyncBootstrapAction)
```

### Parameters

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

Defines an custom label for the bootstraping action name.

`asyncBootstrapAction` [Func](https://learn.microsoft.com/dotnet/api/system.func\-1)<[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)\>

The asynchronous action which will be executed before the HTTP server start.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

The [HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md) instance.
