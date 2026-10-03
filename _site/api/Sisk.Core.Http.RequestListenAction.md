# RequestListenAction

Kind: Enum  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.RequestListenAction.html

Represents the HTTP server action when receiving an request.

```csharp
public enum RequestListenAction
```

## Fields

| Name | Description |
| --- | --- |
| `Accept = 1` | The server must accept and route the request. |
| `Drop = 2` | The server must reject the request and close the connection with the client. |
