# RouteMatch

Kind: Class  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMatch.html

Represents the result of a route matching operation.

```csharp
public sealed class RouteMatch
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[RouteMatch](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMatch.md)

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
| [RouteMatch\(bool, NameValueCollection?\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMatch.-ctor.md#Sisk_Core_Routing_RouteMatch__ctor_System_Boolean_System_Collections_Specialized_NameValueCollection_) | Initializes a new instance of the [RouteMatch](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMatch.md) class. |

## Fields

| Name | Description |
| --- | --- |
| [NotMatched](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMatch.NotMatched.md#Sisk_Core_Routing_RouteMatch_NotMatched) | Gets an shared [RouteMatch](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMatch.md) instance which represents an unsuccessful match. |

## Properties

| Name | Description |
| --- | --- |
| [Parameters](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMatch.Parameters.md#Sisk_Core_Routing_RouteMatch_Parameters) | Gets a collection of parameters extracted from the route, or [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null) if the route matching operation was not successful. |
| [Success](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMatch.Success.md#Sisk_Core_Routing_RouteMatch_Success) | Gets a value indicating whether the route matching operation was successful. |

## Methods

| Name | Description |
| --- | --- |
| [ToString\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMatch.ToString.md#Sisk_Core_Routing_RouteMatch_ToString) |  |
