# HttpRequest.SendTo

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.SendTo.html

## SendTo(RouteAction) {#Sisk_Core_Http_HttpRequest_SendTo_Sisk_Core_Routing_RouteAction_}

Calls another handler for this request, preserving the current call-stack frame, and then returns the response from
it. This method manages to prevent possible stack overflows.

```csharp
public object SendTo(RouteAction otherCallback)
```

### Parameters

`otherCallback` [RouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAction.md)

Defines the [RouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAction.md) method which will handle this request.

### Returns

[object](https://learn.microsoft.com/dotnet/api/system.object)
