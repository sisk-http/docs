# HttpServerHostContextBuilderExceptionMode

Kind: Enum  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilderExceptionMode.html

Represents how the builder event error message should be displayed.

```csharp
public enum HttpServerHostContextBuilderExceptionMode
```

## Fields

| Name | Description |
| --- | --- |
| `Detailed = 2` | Detailed messages, including detailed exception trace and information, should be displayed. |
| `Normal = 1` | Normal messages, including their exception type and message, should be displayed. |
| `Silent = 0` | No message should be displayed. |
| `Throw = 3` | No message should be displayed and exceptions should be thrown instead being caughts. |
