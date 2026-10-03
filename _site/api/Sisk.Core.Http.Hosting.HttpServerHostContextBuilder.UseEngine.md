# HttpServerHostContextBuilder.UseEngine

Kind: Method  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.UseEngine.html

## UseEngine(HttpServerEngine) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseEngine_Sisk_Core_Http_Engine_HttpServerEngine_}

Sets the HTTP server engine.

```csharp
public HttpServerHostContextBuilder UseEngine(HttpServerEngine engine)
```

### Parameters

`engine` [HttpServerEngine](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.md)

The [HttpServerEngine](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.md) to use.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

The current [HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md) instance.

## UseEngine&lt;TEngine>() {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseEngine__1}

Sets the HTTP server engine using a default constructor.

```csharp
public HttpServerHostContextBuilder UseEngine<TEngine>() where TEngine : HttpServerEngine, new()
```

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

The current [HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md) instance.

### Type Parameters

`TEngine` 

The type of the HTTP server engine to use, which must inherit from [HttpServerEngine](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.md) and have a parameterless constructor.

## UseEngine&lt;TEngine>(Action&lt;TEngine>) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseEngine__1_System_Action___0__}

Sets the HTTP server engine using a default constructor and applies the specified configuration action.

```csharp
public HttpServerHostContextBuilder UseEngine<TEngine>(Action<TEngine> setup) where TEngine : HttpServerEngine, new()
```

### Parameters

`setup` [Action](https://learn.microsoft.com/dotnet/api/system.action\-1)<TEngine\>

An action that configures the newly created engine instance.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

The current [HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md) instance.

### Type Parameters

`TEngine` 

The type of the HTTP server engine to use, which must inherit from [HttpServerEngine](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.md) and have a parameterless constructor.

## UseEngine&lt;TEngine>(Func&lt;TEngine>) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseEngine__1_System_Func___0__}

Sets the HTTP server engine using a factory method.

```csharp
public HttpServerHostContextBuilder UseEngine<TEngine>(Func<TEngine> create) where TEngine : HttpServerEngine
```

### Parameters

`create` [Func](https://learn.microsoft.com/dotnet/api/system.func\-1)<TEngine\>

A factory method that creates an instance of the engine.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

The current [HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md) instance.

### Type Parameters

`TEngine` 

The type of the HTTP server engine to use, which must inherit from [HttpServerEngine](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.md).
