# Sisk.Core.Routing

Kind: Namespace  
Namespace: `Sisk.Core.Routing`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.html

### Classes

| Name | Description |
| --- | --- |
| [AsyncRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.AsyncRequestHandler.md) | Represents a class that implements [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md) and its execution method is asynchronous. |
| [RegexRoute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RegexRoute.md) | Represents an [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) which it's path is interpreted as an regular expression. |
| [RegexRouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RegexRouteAttribute.md) | Represents a mapping to an route, which it's path is defined by an regular expression. This attribute is an shorthand from [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md). |
| [RequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RequestHandler.md) | Represents an abstract class which implements [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md). |
| [RequestHandlerAttribute<T\>](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RequestHandlerAttribute-1.md) | Specifies that the method or class, when used on this attribute, will instantiate the type and call the [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md) with given parameters. |
| [RequestHandlerAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RequestHandlerAttribute.md) | Specifies that the method or class, when used on this attribute, will instantiate the type and call the [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md) with given parameters. |
| [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) | Represents an HTTP route to be matched by an [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md). |
| [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md) | Represents an class that, when applied to a method, will be recognized by a router as a route. |
| [RouteDeleteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteDeleteAttribute.md) | Represents a mapping to an HTTP DELETE route. This attribute is an shorthand from [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md). |
| [RouteGetAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteGetAttribute.md) | Represents a mapping to an HTTP GET route. This attribute is an shorthand from [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md). |
| [RouteMatch](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMatch.md) | Represents the result of a route matching operation. |
| [RouteMetadataAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMetadataAttribute.md) | Represents metadata associated with a route. This attribute can be applied to classes or methods to add key-value pairs to the [Bag](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Bag.md) dictionary. |
| [RoutePatchAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RoutePatchAttribute.md) | Represents a mapping to an HTTP PATCH route. This attribute is an shorthand from [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md). |
| [RoutePostAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RoutePostAttribute.md) | Represents a mapping to an HTTP POST route. This attribute is an shorthand from [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md). |
| [RoutePrefixAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RoutePrefixAttribute.md) | Represents an attribute that, when applied to an class containing routes, all child routes will start with the specified prefix. |
| [RoutePutAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RoutePutAttribute.md) | Represents a mapping to an HTTP PUT route. This attribute is an shorthand from [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md). |
| [RouteQueryAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteQueryAttribute.md) | Represents a mapping to an HTTP QUERY route. This attribute is an shorthand from [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md). |
| [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) | Represents a collection of [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) and main executor of actions in the [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md). |
| [RouterModule](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.md) | Indicates that extended class supports router modules, which allows the management of routes, request handlers and prefixes. |
| [ValueResult<T\>](https://docs.sisk-framework.org/api/Sisk.Core.Routing.ValueResult-1.md) | Represents a mutable type for boxing objects by value or reference in a response from a router. |

### Interfaces

| Name | Description |
| --- | --- |
| [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md) | Represents an interface that is executed before a request. |

### Enums

| Name | Description |
| --- | --- |
| [LogOutput](https://docs.sisk-framework.org/api/Sisk.Core.Routing.LogOutput.md) | Determines the way the server can write log messages. This enumerator is for giving permissions for certain contexts to be able or not to write to the server logs, such as [AccessLogsStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.AccessLogsStream.md) and [ErrorsLogsStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ErrorsLogsStream.md). |
| [RequestHandlerExecutionMode](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RequestHandlerExecutionMode.md) | Defines when the [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md) should be executed. |
| [RouteMethod](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md) | Represents an HTTP method to be matched in an [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md). |

### Delegates

| Name | Description |
| --- | --- |
| [ExceptionErrorCallback](https://docs.sisk-framework.org/api/Sisk.Core.Routing.ExceptionErrorCallback.md) | Represents the function that is called after the route action threw an exception. |
| [ParameterlessRouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.ParameterlessRouteAction.md) | Represents the function that is called after the route is matched with the request. |
| [RouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAction.md) | Represents the function that is called after the route is matched with the request. |
| [RouterActionHandlerCallback<T\>](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterActionHandlerCallback-1.md) | Represents the function that receives an object of the `T` and returns an [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) response from the informed object. |
| [RoutingErrorCallback](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RoutingErrorCallback.md) | Represents the function that is called when an request reaches an error on the router. |
