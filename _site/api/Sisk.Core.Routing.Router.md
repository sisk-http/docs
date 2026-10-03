# Router

Kind: Class  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.html

Represents a collection of [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) and main executor of actions in the [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md).

```csharp
public sealed class Router : IReadOnlyCollection<Route>, IEnumerable<Route>, IEnumerable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md)

#### Implements

[IReadOnlyCollection<Route\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.ireadonlycollection\-1), 
[IEnumerable<Route\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable\-1), 
[IEnumerable](https://learn.microsoft.com/dotnet/api/system.collections.ienumerable)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [Router\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.-ctor.md#Sisk_Core_Routing_Router__ctor) | Creates an new [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) instance with default values. |
| [Router\(params IEnumerable<Route\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.-ctor.md#Sisk_Core_Routing_Router__ctor_System_Collections_Generic_IEnumerable_Sisk_Core_Routing_Route__) | Creates an new [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) instance with given route collection. |

## Properties

| Name | Description |
| --- | --- |
| [CallbackErrorHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.CallbackErrorHandler.md#Sisk_Core_Routing_Router_CallbackErrorHandler) | Gets or sets the Router action exception handler. The response handler for this property will send an HTTP response to the client when an exception is caught during execution. This property is only called when [ThrowExceptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions.md) is disabled. |
| [CheckForRouteCollisions](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.CheckForRouteCollisions.md#Sisk_Core_Routing_Router_CheckForRouteCollisions) | Gets or sets whether this [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) should check for possible routing collisions before starting the HTTP server. |
| [Count](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.Count.md#Sisk_Core_Routing_Router_Count) |  |
| [GlobalRequestHandlers](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.GlobalRequestHandlers.md#Sisk_Core_Routing_Router_GlobalRequestHandlers) | Gets or sets the global requests handlers that will be executed in all matched routes. |
| [IsReadOnly](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.IsReadOnly.md#Sisk_Core_Routing_Router_IsReadOnly) | Gets an boolean indicating where this [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) is read-only or not. |
| [MatchRoutesIgnoreCase](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MatchRoutesIgnoreCase.md#Sisk_Core_Routing_Router_MatchRoutesIgnoreCase) | Gets or sets whether this [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) will match routes ignoring case. |
| [MethodNotAllowedErrorHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MethodNotAllowedErrorHandler.md#Sisk_Core_Routing_Router_MethodNotAllowedErrorHandler) | Gets or sets the Router "405 Method Not Allowed" handler. |
| [NotFoundErrorHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.NotFoundErrorHandler.md#Sisk_Core_Routing_Router_NotFoundErrorHandler) | Gets or sets the Router "404 Not Found" handler. |
| [Prefix](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.Prefix.md#Sisk_Core_Routing_Router_Prefix) | Gets or sets the prefix which will be applied to all next defining routes in this router. |

## Methods

| Name | Description |
| --- | --- |
| [AutoScanModules\(Type, Assembly\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.AutoScanModules.md#Sisk_Core_Routing_Router_AutoScanModules_System_Type_System_Reflection_Assembly_) | Scans for all types that implements the specified module type and associates an instance of each type to the router. |
| [AutoScanModules<TModule\>\(Assembly\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.AutoScanModules.md#Sisk_Core_Routing_Router_AutoScanModules__1_System_Reflection_Assembly_) | Scans for all types that implements `TModule` and associates an instance of each type to the router. Note that, `TModule` must be an [RouterModule](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.md) type and an accessible constructor for each type must be present. |
| [AutoScanModules<TModule\>\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.AutoScanModules.md#Sisk_Core_Routing_Router_AutoScanModules__1) | Scans for all types that implements `TModule` and associates an instance of each type to the router. Note that, `TModule` must be an [RouterModule](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.md) type and an accessible constructor for each type must be present. |
| [Combine\(params string\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.Combine.md#Sisk_Core_Routing_Router_Combine_System_String___) | Combines an array of string parts into a single path. |
| [GetDefinedRoutes\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.GetDefinedRoutes.md#Sisk_Core_Routing_Router_GetDefinedRoutes) | Gets all routes defined on this router instance. |
| [GetEnumerator\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.GetEnumerator.md#Sisk_Core_Routing_Router_GetEnumerator) |  |
| [GetRouteFromName\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.GetRouteFromName.md#Sisk_Core_Routing_Router_GetRouteFromName_System_String_) | Gets an defined [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) by their name property. |
| [GetRouteFromPath\(RouteMethod, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.GetRouteFromPath.md#Sisk_Core_Routing_Router_GetRouteFromPath_Sisk_Core_Routing_RouteMethod_System_String_) | Gets the first matched [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) by their HTTP method and path. |
| [GetRouteFromPath\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.GetRouteFromPath.md#Sisk_Core_Routing_Router_GetRouteFromPath_System_String_) | Gets the first matched [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) by their URL path. |
| [GetRouteMethod\(HttpMethod, RouteMethod\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.GetRouteMethod.md#Sisk_Core_Routing_Router_GetRouteMethod_System_Net_Http_HttpMethod_Sisk_Core_Routing_RouteMethod_) | Gets the corresponding [RouteMethod](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md) for a given [HttpMethod](https://learn.microsoft.com/dotnet/api/system.net.http.httpmethod), with a fallback option. |
| [GetRouteMethod\(string, RouteMethod\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.GetRouteMethod.md#Sisk_Core_Routing_Router_GetRouteMethod_System_String_Sisk_Core_Routing_RouteMethod_) | Gets the corresponding [RouteMethod](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md) for a given HTTP method string, with a fallback option. |
| [IsDefined\(RouteMethod, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.IsDefined.md#Sisk_Core_Routing_Router_IsDefined_Sisk_Core_Routing_RouteMethod_System_String_) | Gets an boolean indicating if there are any route that matches the specified method and route path. |
| [IsRouteExpressionsOverlap\(in ReadOnlySpan<char\>, in ReadOnlySpan<char\>, StringComparison\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.IsRouteExpressionsOverlap.md#Sisk_Core_Routing_Router_IsRouteExpressionsOverlap_System_ReadOnlySpan_System_Char___System_ReadOnlySpan_System_Char___System_StringComparison_) | Determines whether two route expressions overlap. |
| [IsRouteExpressionsOverlap\(string, string, StringComparison\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.IsRouteExpressionsOverlap.md#Sisk_Core_Routing_Router_IsRouteExpressionsOverlap_System_String_System_String_System_StringComparison_) | Determines whether two route expressions overlap. |
| [Map\(Route\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.Map.md#Sisk_Core_Routing_Router_Map_Sisk_Core_Routing_Route_) | Maps a route into this router. |
| [Map\(IEnumerable<Route\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.Map.md#Sisk_Core_Routing_Router_Map_System_Collections_Generic_IEnumerable_Sisk_Core_Routing_Route__) | Maps a collection of routes into this router. |
| [Map\(RouteMethod, string, Delegate?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.Map.md#Sisk_Core_Routing_Router_Map_Sisk_Core_Routing_RouteMethod_System_String_System_Delegate_) | Maps a route using the specified method, path and action. |
| [Map\(RouteMethod, string, Delegate?, IRequestHandler\[\]?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.Map.md#Sisk_Core_Routing_Router_Map_Sisk_Core_Routing_RouteMethod_System_String_System_Delegate_Sisk_Core_Routing_IRequestHandler___) | Maps a route using the specified method, path, action and request handlers. |
| [MapAny\(string, Delegate\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapAny.md#Sisk_Core_Routing_Router_MapAny_System_String_System_Delegate_) | Maps an route which matches any HTTP method, using the specified path and action function. |
| [MapAny\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapAny.md#Sisk_Core_Routing_Router_MapAny_System_String_Sisk_Core_Routing_RouteAction_) | Maps an route which matches any HTTP method, using the specified path and action function. |
| [MapDelete\(string, Delegate\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapDelete.md#Sisk_Core_Routing_Router_MapDelete_System_String_System_Delegate_) | Maps an DELETE route using the specified path and action function. |
| [MapDelete\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapDelete.md#Sisk_Core_Routing_Router_MapDelete_System_String_Sisk_Core_Routing_RouteAction_) | Maps an DELETE route using the specified path and action function. |
| [MapFileSystem\(string, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapFileSystem.md#Sisk_Core_Routing_Router_MapFileSystem_System_String_System_String_) | Maps a file system route. |
| [MapFileSystem\(string, HttpFileServerHandler, IRequestHandler\[\]?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapFileSystem.md#Sisk_Core_Routing_Router_MapFileSystem_System_String_Sisk_Core_Http_FileSystem_HttpFileServerHandler_Sisk_Core_Routing_IRequestHandler___) | Maps a file system route using a custom handler. |
| [MapGet\(string, Delegate\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapGet.md#Sisk_Core_Routing_Router_MapGet_System_String_System_Delegate_) | Maps an GET route using the specified path and action function. |
| [MapGet\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapGet.md#Sisk_Core_Routing_Router_MapGet_System_String_Sisk_Core_Routing_RouteAction_) | Maps an GET route using the specified path and action function. |
| [MapHead\(string, Delegate\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapHead.md#Sisk_Core_Routing_Router_MapHead_System_String_System_Delegate_) | Maps an HEAD route using the specified path and action function. |
| [MapHead\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapHead.md#Sisk_Core_Routing_Router_MapHead_System_String_Sisk_Core_Routing_RouteAction_) | Maps an HEAD route using the specified path and action function. |
| [MapInstance\(object\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapInstance.md#Sisk_Core_Routing_Router_MapInstance_System_Object_) | Maps route methods from an object instance. |
| [MapInstance<TInstance\>\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapInstance.md#Sisk_Core_Routing_Router_MapInstance__1) | Maps route methods from a new instance of `TInstance`. |
| [MapOptions\(string, Delegate\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapOptions.md#Sisk_Core_Routing_Router_MapOptions_System_String_System_Delegate_) | Maps an OPTIONS route using the specified path and action function. |
| [MapOptions\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapOptions.md#Sisk_Core_Routing_Router_MapOptions_System_String_Sisk_Core_Routing_RouteAction_) | Maps an OPTIONS route using the specified path and action function. |
| [MapPatch\(string, Delegate\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapPatch.md#Sisk_Core_Routing_Router_MapPatch_System_String_System_Delegate_) | Maps an PATCH route using the specified path and action function. |
| [MapPatch\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapPatch.md#Sisk_Core_Routing_Router_MapPatch_System_String_Sisk_Core_Routing_RouteAction_) | Maps an PATCH route using the specified path and action function. |
| [MapPost\(string, Delegate\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapPost.md#Sisk_Core_Routing_Router_MapPost_System_String_System_Delegate_) | Maps an POST route using the specified path and action function. |
| [MapPost\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapPost.md#Sisk_Core_Routing_Router_MapPost_System_String_Sisk_Core_Routing_RouteAction_) | Maps an POST route using the specified path and action function. |
| [MapPut\(string, Delegate\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapPut.md#Sisk_Core_Routing_Router_MapPut_System_String_System_Delegate_) | Maps an PUT route using the specified path and action function. |
| [MapPut\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapPut.md#Sisk_Core_Routing_Router_MapPut_System_String_Sisk_Core_Routing_RouteAction_) | Maps an PUT route using the specified path and action function. |
| [MapQuery\(string, Delegate\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapQuery.md#Sisk_Core_Routing_Router_MapQuery_System_String_System_Delegate_) | Maps an QUERY route using the specified path and action function. |
| [MapQuery\(string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapQuery.md#Sisk_Core_Routing_Router_MapQuery_System_String_Sisk_Core_Routing_RouteAction_) | Maps an QUERY route using the specified path and action function. |
| [MapType<T\>\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapType.md#Sisk_Core_Routing_Router_MapType__1) | Maps static route methods from `T`. |
| [MapType\(Type\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapType.md#Sisk_Core_Routing_Router_MapType_System_Type_) | Maps static route methods from a type. |
| [MatchRouteExpression\(in ReadOnlySpan<char\>, in ReadOnlySpan<char\>, StringComparison\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MatchRouteExpression.md#Sisk_Core_Routing_Router_MatchRouteExpression_System_ReadOnlySpan_System_Char___System_ReadOnlySpan_System_Char___System_StringComparison_) | Attempts to match the specified route expression against the given path. |
| [MatchRouteExpression\(string, string, StringComparison\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MatchRouteExpression.md#Sisk_Core_Routing_Router_MatchRouteExpression_System_String_System_String_System_StringComparison_) | Attempts to match the specified route expression against the given path. |
| [RegisterValueHandler<T\>\(RouterActionHandlerCallback<T\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.RegisterValueHandler.md#Sisk_Core_Routing_Router_RegisterValueHandler__1_Sisk_Core_Routing_RouterActionHandlerCallback___0__) | Register an type handling association to converting it to an [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) object. |
| [ResolveActionResult\(object?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.ResolveActionResult.md#Sisk_Core_Routing_Router_ResolveActionResult_System_Object_) | Resolves the specified object into an valid [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) using the defined value handlers or throws an exception if not possible. |
| [Rewrite\(string, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.Rewrite.md#Sisk_Core_Routing_Router_Rewrite_System_String_System_String_) | Maps a rewrite route, which redirects all requests that match the given path to another path, keeping the body and headers of the original request. |
| [SetObject\(object\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.SetObject.md#Sisk_Core_Routing_Router_SetObject_System_Object_) | Searches for all instance and static methods that are marked with an attribute of type [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md) in the specified object and creates routes for these methods. |
| [SetObject\(Type\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.SetObject.md#Sisk_Core_Routing_Router_SetObject_System_Type_) | Searches for all instance and static methods that are marked with an attribute of type [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md) in the specified object and creates routes for these methods. |
| [SetObject\(Type, object\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.SetObject.md#Sisk_Core_Routing_Router_SetObject_System_Type_System_Object_) | Searches for all instance and static methods that are marked with an attribute of type [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md) in the specified object and creates routes for these methods. |
| [SetObject<TObject\>\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.SetObject.md#Sisk_Core_Routing_Router_SetObject__1) | Searches for all instance and static methods that are marked with an attribute of type [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md) in the specified object and creates routes for these methods. |
| [SetObject<TObject\>\(TObject\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.SetObject.md#Sisk_Core_Routing_Router_SetObject__1___0_) | Searches for all instance and static methods that are marked with an attribute of type [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md) in the specified object and creates routes for these methods. |
| [SetRoute\(RouteMethod, string, RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.SetRoute.md#Sisk_Core_Routing_Router_SetRoute_Sisk_Core_Routing_RouteMethod_System_String_Sisk_Core_Routing_RouteAction_) | Defines an route with their method, path and action function. |
| [SetRoute\(RouteMethod, string, Delegate\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.SetRoute.md#Sisk_Core_Routing_Router_SetRoute_Sisk_Core_Routing_RouteMethod_System_String_System_Delegate_) | Defines an route with their method, path and action function. |
| [SetRoute\(RouteMethod, string, Delegate, string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.SetRoute.md#Sisk_Core_Routing_Router_SetRoute_Sisk_Core_Routing_RouteMethod_System_String_System_Delegate_System_String_) | Defines an route with their method, path, action function and name. |
| [SetRoute\(RouteMethod, string, Delegate, string?, IRequestHandler\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.SetRoute.md#Sisk_Core_Routing_Router_SetRoute_Sisk_Core_Routing_RouteMethod_System_String_System_Delegate_System_String_Sisk_Core_Routing_IRequestHandler___) | Defines an route with their method, path, action function, name and request handlers. |
| [SetRoute\(Route\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.SetRoute.md#Sisk_Core_Routing_Router_SetRoute_Sisk_Core_Routing_Route_) | Defines an route in this Router instance. |
| [SetRoutes\(params IEnumerable<Route\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.SetRoutes.md#Sisk_Core_Routing_Router_SetRoutes_System_Collections_Generic_IEnumerable_Sisk_Core_Routing_Route__) | Defines the specified collection of routes. |
| [TryResolveActionResult\(object?, out HttpResponse?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.TryResolveActionResult.md#Sisk_Core_Routing_Router_TryResolveActionResult_System_Object_Sisk_Core_Http_HttpResponse__) | Tries to resolve the specified object into an valid [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) using the defined value handlers. |
