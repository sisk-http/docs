# RenderableFunction

Kind: Class  
Namespace: `TinyComponents`  
Assembly: `TinyComponents.dll`  
Source: https://docs.sisk-framework.org/api/TinyComponents.RenderableFunction.html

Represents an object which their renderable contents is called by an
function.

```csharp
public sealed class RenderableFunction
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[RenderableFunction](https://docs.sisk-framework.org/api/TinyComponents.RenderableFunction.md)

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
| [RenderableFunction\(Func<object?\>\)](https://docs.sisk-framework.org/api/TinyComponents.RenderableFunction.-ctor.md#TinyComponents_RenderableFunction__ctor_System_Func_System_Object__) | Creates an new [RenderableFunction](https://docs.sisk-framework.org/api/TinyComponents.RenderableFunction.md) class with the specified function. |

## Properties

| Name | Description |
| --- | --- |
| [Callable](https://docs.sisk-framework.org/api/TinyComponents.RenderableFunction.Callable.md#TinyComponents_RenderableFunction_Callable) | Gets or sets the renderable function. |

## Methods

| Name | Description |
| --- | --- |
| [ToString\(\)](https://docs.sisk-framework.org/api/TinyComponents.RenderableFunction.ToString.md#TinyComponents_RenderableFunction_ToString) | Invokes [Callable](https://docs.sisk-framework.org/api/TinyComponents.RenderableFunction.Callable.md) and returns its result as an string. |
