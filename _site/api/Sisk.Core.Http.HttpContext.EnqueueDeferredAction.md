# HttpContext.EnqueueDeferredAction

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.EnqueueDeferredAction.html

## EnqueueDeferredAction(Action) {#Sisk_Core_Http_HttpContext_EnqueueDeferredAction_System_Action_}

Enqueues an action that will be executed after the response is sent to the client.
This action runs within the same context, with access to all current context properties before disposal.

```csharp
public void EnqueueDeferredAction(Action action)
```

### Parameters

`action` [Action](https://learn.microsoft.com/dotnet/api/system.action)

The synchronous action to execute.

## EnqueueDeferredAction(Func&lt;Task>) {#Sisk_Core_Http_HttpContext_EnqueueDeferredAction_System_Func_System_Threading_Tasks_Task__}

Enqueues an asynchronous action that will be executed after the response is sent to the client.
This action runs within the same context, with access to all current context properties before disposal.

```csharp
public void EnqueueDeferredAction(Func<Task> action)
```

### Parameters

`action` [Func](https://learn.microsoft.com/dotnet/api/system.func\-1)<[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)\>

The asynchronous action to execute.

## EnqueueDeferredAction(Func&lt;CancellationToken, Task>, CancellationToken) {#Sisk_Core_Http_HttpContext_EnqueueDeferredAction_System_Func_System_Threading_CancellationToken_System_Threading_Tasks_Task__System_Threading_CancellationToken_}

Enqueues an asynchronous action that will be executed after the response is sent to the client.
This action runs within the same context, with access to all current context properties before disposal.

```csharp
public void EnqueueDeferredAction(Func<CancellationToken, Task> action, CancellationToken cancellation = default)
```

### Parameters

`action` [Func](https://learn.microsoft.com/dotnet/api/system.func\-2)<[CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken), [Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)\>

The asynchronous action to execute.

`cancellation` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

The cancellation token to observe.

## EnqueueDeferredAction(Func&lt;CancellationToken, Task>, TimeSpan) {#Sisk_Core_Http_HttpContext_EnqueueDeferredAction_System_Func_System_Threading_CancellationToken_System_Threading_Tasks_Task__System_TimeSpan_}

Enqueues an asynchronous action that will be executed after the response is sent to the client,
with a timeout after which the action will be cancelled.
This action runs within the same context, with access to all current context properties before disposal.

```csharp
public void EnqueueDeferredAction(Func<CancellationToken, Task> action, TimeSpan timeout = default)
```

### Parameters

`action` [Func](https://learn.microsoft.com/dotnet/api/system.func\-2)<[CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken), [Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)\>

The asynchronous action to execute.

`timeout` [TimeSpan](https://learn.microsoft.com/dotnet/api/system.timespan)

The timeout after which the action will be cancelled.
