# RequestHandlerExecutionMode

Kind: Enum  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.RequestHandlerExecutionMode.html

Defines when the [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md) should be executed.

```csharp
[Flags]
public enum RequestHandlerExecutionMode
```

## Fields

| Name | Description |
| --- | --- |
| `AfterResponse = 4` | Indicates that the request handler should be executed after the route action. |
| `BeforeResponse = 2` | Indicates that the request handler should be executed before the route action. |
| `Both = 6` | Indicates that the request handler should be executed before and after the route action. |
