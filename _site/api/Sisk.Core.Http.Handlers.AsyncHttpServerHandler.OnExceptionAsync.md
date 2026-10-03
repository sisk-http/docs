# AsyncHttpServerHandler.OnExceptionAsync

Kind: Method  
Namespace: `Sisk.Core.Http.Handlers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.AsyncHttpServerHandler.OnExceptionAsync.html

## OnExceptionAsync(Exception) {#Sisk_Core_Http_Handlers_AsyncHttpServerHandler_OnExceptionAsync_System_Exception_}

Method that is called when an exception is caught in the HTTP server. This method is called
regardless of whether [ThrowExceptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions.md) is enabled or not.

```csharp
protected virtual Task OnExceptionAsync(Exception exception)
```

### Parameters

`exception` [Exception](https://learn.microsoft.com/dotnet/api/system.exception)

The exception object.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)
