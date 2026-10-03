# LogOutput

Kind: Enum  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.LogOutput.html

Determines the way the server can write log messages. This enumerator is for giving permissions for certain contexts
to be able or not to write to the server logs, such as [AccessLogsStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.AccessLogsStream.md) and [ErrorsLogsStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ErrorsLogsStream.md).

```csharp
[Flags]
public enum LogOutput
```

## Fields

| Name | Description |
| --- | --- |
| `AccessLog = 2` | Determines that the context or the route can write log messages only to the access logs through [AccessLogsStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.AccessLogsStream.md). |
| `Both = 6` | Determines that the context or the route can write log messages to both error and access logs. |
| `ErrorLog = 4` | Determines that the context or the route can write error messages only to the error logs through [ErrorsLogsStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ErrorsLogsStream.md). |
| `None = 0` | Determines that the context or the route cannot write any log messages. |
