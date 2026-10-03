# RouterModule

Kind: Class  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.html

Indicates that extended class supports router modules, which allows the management of routes,
request handlers and prefixes.

```csharp
public abstract class RouterModule
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[RouterModule](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.md)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.MemberwiseClone\(\)](https://learn.microsoft.com/dotnet/api/system.object.memberwiseclone), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [RouterModule\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.-ctor.md#Sisk_Core_Routing_RouterModule__ctor) |  |

## Properties

| Name | Description |
| --- | --- |
| [Prefix](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.Prefix.md#Sisk_Core_Routing_RouterModule_Prefix) | Gets or sets the router prefix for this class. This property overrides any value defined by [RoutePrefixAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RoutePrefixAttribute.md) set in this class. |
| [RequestHandlers](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.RequestHandlers.md#Sisk_Core_Routing_RouterModule_RequestHandlers) | Gets or sets an list of [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md) this [RouterModule](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.md) runs. |

## Methods

| Name | Description |
| --- | --- |
| [HasPrefix\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.HasPrefix.md#Sisk_Core_Routing_RouterModule_HasPrefix_System_String_) | Specifies a prefix for all routes defined by this module. |
| [HasRequestHandler\(IRequestHandler\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.HasRequestHandler.md#Sisk_Core_Routing_RouterModule_HasRequestHandler_Sisk_Core_Routing_IRequestHandler_) | Registers an [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md) on all routes defined by this module. |
| [OnRouteCreating\(Route\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.OnRouteCreating.md#Sisk_Core_Routing_RouterModule_OnRouteCreating_Sisk_Core_Routing_Route_) | This method is called before a route is defined in the router and after it is created in this class, so its attributes and parameters can be modified. This method must be overloaded in the extending class and must not be called directly. |
| [OnSetup\(Router\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.OnSetup.md#Sisk_Core_Routing_RouterModule_OnSetup_Sisk_Core_Routing_Router_) | Method that is called when an [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) is defining routes from the current [RouterModule](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.md). |
