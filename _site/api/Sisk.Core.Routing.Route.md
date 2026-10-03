# Route

Kind: Class  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.html

Represents an HTTP route to be matched by an [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md).

```csharp
public class Route
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md)

#### Derived

[RegexRoute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RegexRoute.md)

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
| [Route\(RouteMethod, string, Delegate?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.-ctor.md#Sisk_Core_Routing_Route__ctor_Sisk_Core_Routing_RouteMethod_System_String_System_Delegate_) | Creates an new [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) instance with given parameters. |
| [Route\(RouteMethod, string, string?, Delegate?, IRequestHandler\[\]?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.-ctor.md#Sisk_Core_Routing_Route__ctor_Sisk_Core_Routing_RouteMethod_System_String_System_String_System_Delegate_Sisk_Core_Routing_IRequestHandler___) | Creates an new [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) instance with given parameters. |
| [Route\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.-ctor.md#Sisk_Core_Routing_Route__ctor) | Creates an new [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) instance with no parameters. |

## Fields

| Name | Description |
| --- | --- |
| [AnyPath](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.AnyPath.md#Sisk_Core_Routing_Route_AnyPath) | Represents an route path which captures any URL path. |

## Properties

| Name | Description |
| --- | --- |
| [Action](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Action.md#Sisk_Core_Routing_Route_Action) | Gets or sets the function that is called after the route is matched with the request. |
| [AllowRewrites](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.AllowRewrites.md#Sisk_Core_Routing_Route_AllowRewrites) | Gets whether the router can rewrite this route path, such as prepending the router prefix or redirecting requests to the trailing-slash path. |
| [Bag](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Bag.md#Sisk_Core_Routing_Route_Bag) | Gets or sets an [TypedValueDictionary](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.md) for this route, which can hold contextual variables for this [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) object. |
| [BypassGlobalRequestHandlers](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.BypassGlobalRequestHandlers.md#Sisk_Core_Routing_Route_BypassGlobalRequestHandlers) | Gets or sets the global request handlers instances that will not run on this route. |
| [IsAsync](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.IsAsync.md#Sisk_Core_Routing_Route_IsAsync) | Gets an boolean indicating if this [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) action return is an asynchronous [Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task). |
| [LogMode](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.LogMode.md#Sisk_Core_Routing_Route_LogMode) | Gets or sets how this route can write messages to log files on the server. |
| [Method](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Method.md#Sisk_Core_Routing_Route_Method) | Gets or sets the matching HTTP method. |
| [Name](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Name.md#Sisk_Core_Routing_Route_Name) | Gets or sets the route name. |
| [Path](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Path.md#Sisk_Core_Routing_Route_Path) | Gets or sets the path expression that will be interpreted by the router and validated by the requests. |
| [RequestHandlers](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.RequestHandlers.md#Sisk_Core_Routing_Route_RequestHandlers) | Gets or sets the request handlers instances to run before the route action. |
| [UseCors](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.UseCors.md#Sisk_Core_Routing_Route_UseCors) | Gets or sets whether this route should send Cross-Origin Resource Sharing headers in the response. |
| [UseRegex](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.UseRegex.md#Sisk_Core_Routing_Route_UseRegex) | Gets if this route is interpreted as an regular expression. This property is kept for compatibility and is only [`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) for [RegexRoute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RegexRoute.md) instances. |

## Methods

| Name | Description |
| --- | --- |
| [Any\(string, Delegate?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Any.md#Sisk_Core_Routing_Route_Any_System_String_System_Delegate_) | Creates a route that responds to any HTTP request method. |
| [Any\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Any.md#Sisk_Core_Routing_Route_Any_System_String_Sisk_Core_Routing_RouteAction_) | Creates a route that responds to any HTTP request method. |
| [Delete\(string, Delegate?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Delete.md#Sisk_Core_Routing_Route_Delete_System_String_System_Delegate_) | Creates a route that responds to HTTP DELETE requests. |
| [Delete\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Delete.md#Sisk_Core_Routing_Route_Delete_System_String_Sisk_Core_Routing_RouteAction_) | Creates a route that responds to HTTP DELETE requests. |
| [Get\(string, Delegate?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Get.md#Sisk_Core_Routing_Route_Get_System_String_System_Delegate_) | Creates a route that responds to HTTP GET requests. |
| [Get\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Get.md#Sisk_Core_Routing_Route_Get_System_String_Sisk_Core_Routing_RouteAction_) | Creates a route that responds to HTTP GET requests. |
| [Head\(string, Delegate?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Head.md#Sisk_Core_Routing_Route_Head_System_String_System_Delegate_) | Creates a route that responds to HTTP HEAD requests. |
| [Head\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Head.md#Sisk_Core_Routing_Route_Head_System_String_Sisk_Core_Routing_RouteAction_) | Creates a route that responds to HTTP HEAD requests. |
| [Match\(string, Router\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Match.md#Sisk_Core_Routing_Route_Match_System_String_Sisk_Core_Routing_Router_) | Tests if the specified request path matches this route path. The HTTP method is validated by the [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) after the path matches. |
| [OnPathModified\(string, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.OnPathModified.md#Sisk_Core_Routing_Route_OnPathModified_System_String_System_String_) | Called after the [Path](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Path.md) property is changed. |
| [Options\(string, Delegate?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Options.md#Sisk_Core_Routing_Route_Options_System_String_System_Delegate_) | Creates a route that responds to HTTP OPTIONS requests. |
| [Options\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Options.md#Sisk_Core_Routing_Route_Options_System_String_Sisk_Core_Routing_RouteAction_) | Creates a route that responds to HTTP OPTIONS requests. |
| [Patch\(string, Delegate?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Patch.md#Sisk_Core_Routing_Route_Patch_System_String_System_Delegate_) | Creates a route that responds to HTTP PATCH requests. |
| [Patch\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Patch.md#Sisk_Core_Routing_Route_Patch_System_String_Sisk_Core_Routing_RouteAction_) | Creates a route that responds to HTTP PATCH requests. |
| [Post\(string, Delegate?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Post.md#Sisk_Core_Routing_Route_Post_System_String_System_Delegate_) | Creates a route that responds to HTTP POST requests. |
| [Post\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Post.md#Sisk_Core_Routing_Route_Post_System_String_Sisk_Core_Routing_RouteAction_) | Creates a route that responds to HTTP POST requests. |
| [Put\(string, Delegate?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Put.md#Sisk_Core_Routing_Route_Put_System_String_System_Delegate_) | Creates a route that responds to HTTP PUT requests. |
| [Put\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Put.md#Sisk_Core_Routing_Route_Put_System_String_Sisk_Core_Routing_RouteAction_) | Creates a route that responds to HTTP PUT requests. |
| [Query\(string, Delegate?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Query.md#Sisk_Core_Routing_Route_Query_System_String_System_Delegate_) | Creates a route that responds to HTTP QUERY requests. |
| [Query\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Query.md#Sisk_Core_Routing_Route_Query_System_String_Sisk_Core_Routing_RouteAction_) | Creates a route that responds to HTTP QUERY requests. |
| [ToString\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.ToString.md#Sisk_Core_Routing_Route_ToString) | Gets an string notation for this [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) object. |
