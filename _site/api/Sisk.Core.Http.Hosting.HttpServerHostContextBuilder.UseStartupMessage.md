# HttpServerHostContextBuilder.UseStartupMessage

Kind: Method  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.UseStartupMessage.html

## UseStartupMessage(string) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseStartupMessage_System_String_}

Add an optional message to the [HttpServerHostContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.md) output verbose.

```csharp
public HttpServerHostContextBuilder UseStartupMessage(string startupMessage)
```

### Parameters

`startupMessage` [string](https://learn.microsoft.com/dotnet/api/system.string)

The startup message.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

## UseStartupMessage(Func&lt;string>) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseStartupMessage_System_Func_System_String__}

Adds a function that returns an optional initialization message to the [HttpServerHostContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.md) output verbose.

```csharp
public HttpServerHostContextBuilder UseStartupMessage(Func<string> startupMessage)
```

### Parameters

`startupMessage` [Func](https://learn.microsoft.com/dotnet/api/system.func\-1)<[string](https://learn.microsoft.com/dotnet/api/system.string)\>

The startup message function.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)
