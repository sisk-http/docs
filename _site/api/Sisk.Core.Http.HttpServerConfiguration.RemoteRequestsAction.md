# HttpServerConfiguration.RemoteRequestsAction

Kind: Property  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.RemoteRequestsAction.html

## RemoteRequestsAction {#Sisk_Core_Http_HttpServerConfiguration_RemoteRequestsAction}

Gets or sets the server's action when it receives an HTTP request outside the local host.

```csharp
public RequestListenAction RemoteRequestsAction { get; set; }
```

### Property Value

[RequestListenAction](https://docs.sisk-framework.org/api/Sisk.Core.Http.RequestListenAction.md)

### Remarks

It is recommended to use [Drop](https://docs.sisk-framework.org/api/Sisk.Core.Http.RequestListenAction.md) in this property when working
with a reverse proxy or in environments where the service is not directly exposed to the internet.
