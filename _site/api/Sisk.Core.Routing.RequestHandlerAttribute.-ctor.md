# RequestHandlerAttribute constructor

Kind: Constructor  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.RequestHandlerAttribute.-ctor.html

## RequestHandlerAttribute(Type) {#Sisk_Core_Routing_RequestHandlerAttribute__ctor_System_Type_}

Creates a new instance of this attribute with the informed parameters.

```csharp
public RequestHandlerAttribute(Type handledBy)
```

### Parameters

`handledBy` [Type](https://learn.microsoft.com/dotnet/api/system.type)

The type that implements [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md) which will be instantiated.
