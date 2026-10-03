# RegexRoute

Kind: Class  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.RegexRoute.html

Represents an [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) which it's path is interpreted as an regular expression.

```csharp
public sealed class RegexRoute : Route
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) ← 
[RegexRoute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RegexRoute.md)

#### Inherited Members

[Route.AnyPath](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.AnyPath.md#Sisk_Core_Routing_Route_AnyPath), 
[Route.Match\(string, Router\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Match.md#Sisk_Core_Routing_Route_Match_System_String_Sisk_Core_Routing_Router_), 
[Route.ToString\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.ToString.md#Sisk_Core_Routing_Route_ToString), 
[Route.Get\(string, Delegate?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Get.md#Sisk_Core_Routing_Route_Get_System_String_System_Delegate_), 
[Route.Get\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Get.md#Sisk_Core_Routing_Route_Get_System_String_Sisk_Core_Routing_RouteAction_), 
[Route.Post\(string, Delegate?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Post.md#Sisk_Core_Routing_Route_Post_System_String_System_Delegate_), 
[Route.Post\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Post.md#Sisk_Core_Routing_Route_Post_System_String_Sisk_Core_Routing_RouteAction_), 
[Route.Put\(string, Delegate?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Put.md#Sisk_Core_Routing_Route_Put_System_String_System_Delegate_), 
[Route.Put\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Put.md#Sisk_Core_Routing_Route_Put_System_String_Sisk_Core_Routing_RouteAction_), 
[Route.Patch\(string, Delegate?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Patch.md#Sisk_Core_Routing_Route_Patch_System_String_System_Delegate_), 
[Route.Patch\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Patch.md#Sisk_Core_Routing_Route_Patch_System_String_Sisk_Core_Routing_RouteAction_), 
[Route.Head\(string, Delegate?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Head.md#Sisk_Core_Routing_Route_Head_System_String_System_Delegate_), 
[Route.Head\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Head.md#Sisk_Core_Routing_Route_Head_System_String_Sisk_Core_Routing_RouteAction_), 
[Route.Any\(string, Delegate?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Any.md#Sisk_Core_Routing_Route_Any_System_String_System_Delegate_), 
[Route.Any\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Any.md#Sisk_Core_Routing_Route_Any_System_String_Sisk_Core_Routing_RouteAction_), 
[Route.Delete\(string, Delegate?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Delete.md#Sisk_Core_Routing_Route_Delete_System_String_System_Delegate_), 
[Route.Delete\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Delete.md#Sisk_Core_Routing_Route_Delete_System_String_Sisk_Core_Routing_RouteAction_), 
[Route.Options\(string, Delegate?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Options.md#Sisk_Core_Routing_Route_Options_System_String_System_Delegate_), 
[Route.Options\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Options.md#Sisk_Core_Routing_Route_Options_System_String_Sisk_Core_Routing_RouteAction_), 
[Route.Query\(string, Delegate?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Query.md#Sisk_Core_Routing_Route_Query_System_String_System_Delegate_), 
[Route.Query\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Query.md#Sisk_Core_Routing_Route_Query_System_String_Sisk_Core_Routing_RouteAction_), 
[Route.Bag](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Bag.md#Sisk_Core_Routing_Route_Bag), 
[Route.IsAsync](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.IsAsync.md#Sisk_Core_Routing_Route_IsAsync), 
[Route.LogMode](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.LogMode.md#Sisk_Core_Routing_Route_LogMode), 
[Route.UseRegex](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.UseRegex.md#Sisk_Core_Routing_Route_UseRegex), 
[Route.UseCors](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.UseCors.md#Sisk_Core_Routing_Route_UseCors), 
[Route.Method](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Method.md#Sisk_Core_Routing_Route_Method), 
[Route.Path](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Path.md#Sisk_Core_Routing_Route_Path), 
[Route.Name](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Name.md#Sisk_Core_Routing_Route_Name), 
[Route.AllowRewrites](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.AllowRewrites.md#Sisk_Core_Routing_Route_AllowRewrites), 
[Route.Action](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Action.md#Sisk_Core_Routing_Route_Action), 
[Route.RequestHandlers](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.RequestHandlers.md#Sisk_Core_Routing_Route_RequestHandlers), 
[Route.BypassGlobalRequestHandlers](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.BypassGlobalRequestHandlers.md#Sisk_Core_Routing_Route_BypassGlobalRequestHandlers), 
[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [RegexRoute\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RegexRoute.-ctor.md#Sisk_Core_Routing_RegexRoute__ctor) | Initializes a new instance of the [RegexRoute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RegexRoute.md) class with no parameters. |
| [RegexRoute\(RouteMethod, string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RegexRoute.-ctor.md#Sisk_Core_Routing_RegexRoute__ctor_Sisk_Core_Routing_RouteMethod_System_String_Sisk_Core_Routing_RouteAction_) | Initializes a new instance of the [RegexRoute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RegexRoute.md) class. |
| [RegexRoute\(RouteMethod, string, string?, RouteAction, IRequestHandler\[\]?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RegexRoute.-ctor.md#Sisk_Core_Routing_RegexRoute__ctor_Sisk_Core_Routing_RouteMethod_System_String_System_String_Sisk_Core_Routing_RouteAction_Sisk_Core_Routing_IRequestHandler___) | Initializes a new instance of the [RegexRoute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RegexRoute.md) class. |

## Properties

| Name | Description |
| --- | --- |
| [AllowRewrites](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RegexRoute.AllowRewrites.md#Sisk_Core_Routing_RegexRoute_AllowRewrites) | Gets whether the router can rewrite this route path, such as prepending the router prefix or redirecting requests to the trailing-slash path. |

## Methods

| Name | Description |
| --- | --- |
| [Match\(string, Router\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RegexRoute.Match.md#Sisk_Core_Routing_RegexRoute_Match_System_String_Sisk_Core_Routing_Router_) | Tests if the specified request path matches this route path. The HTTP method is validated by the [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) after the path matches. |
| [OnPathModified\(string, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RegexRoute.OnPathModified.md#Sisk_Core_Routing_RegexRoute_OnPathModified_System_String_System_String_) | Called after the [Path](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Path.md) property is changed. |
