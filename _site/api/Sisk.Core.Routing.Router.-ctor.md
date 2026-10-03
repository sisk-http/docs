# Router constructor

Kind: Constructor  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.-ctor.html

## Router() {#Sisk_Core_Routing_Router__ctor}

Creates an new [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) instance with default values.

```csharp
public Router()
```

## Router(params IEnumerable&lt;Route>) {#Sisk_Core_Routing_Router__ctor_System_Collections_Generic_IEnumerable_Sisk_Core_Routing_Route__}

Creates an new [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) instance with given route collection.

```csharp
public Router(params IEnumerable<Route> routes)
```

### Parameters

`routes` [IEnumerable](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable\-1)<[Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md)\>

The route collection to import in this router.
