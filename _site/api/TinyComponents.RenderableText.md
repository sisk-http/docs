# RenderableText

Kind: Class  
Namespace: `TinyComponents`  
Assembly: `TinyComponents.dll`  
Source: https://docs.sisk-framework.org/api/TinyComponents.RenderableText.html

Represents an simple renderable text.

```csharp
public sealed class RenderableText
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[RenderableText](https://docs.sisk-framework.org/api/TinyComponents.RenderableText.md)

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
| [RenderableText\(object?\)](https://docs.sisk-framework.org/api/TinyComponents.RenderableText.-ctor.md#TinyComponents_RenderableText__ctor_System_Object_) | Creates an new instance of [RenderableText](https://docs.sisk-framework.org/api/TinyComponents.RenderableText.md) with the specified text contents from the object, encoding it as an HTML entity. |
| [RenderableText\(object?, bool\)](https://docs.sisk-framework.org/api/TinyComponents.RenderableText.-ctor.md#TinyComponents_RenderableText__ctor_System_Object_System_Boolean_) | Creates an new instance of [RenderableText](https://docs.sisk-framework.org/api/TinyComponents.RenderableText.md) with the specified text contents from the object. |

## Properties

| Name | Description |
| --- | --- |
| [Contents](https://docs.sisk-framework.org/api/TinyComponents.RenderableText.Contents.md#TinyComponents_RenderableText_Contents) | Gets or sets the contents which this text will render. |
| [Escape](https://docs.sisk-framework.org/api/TinyComponents.RenderableText.Escape.md#TinyComponents_RenderableText_Escape) | Gets or sets whether this text should be XML/HTML encoded or not. |

## Methods

| Name | Description |
| --- | --- |
| [Raw\(object?\)](https://docs.sisk-framework.org/api/TinyComponents.RenderableText.Raw.md#TinyComponents_RenderableText_Raw_System_Object_) | Creates an new instance of [RenderableText](https://docs.sisk-framework.org/api/TinyComponents.RenderableText.md) with the provided raw, unencoded text. |
| [SafeRenderSubject\(object?\)](https://docs.sisk-framework.org/api/TinyComponents.RenderableText.SafeRenderSubject.md#TinyComponents_RenderableText_SafeRenderSubject_System_Object_) | Renders the specified object into an safe HTML content. |
| [ToString\(\)](https://docs.sisk-framework.org/api/TinyComponents.RenderableText.ToString.md#TinyComponents_RenderableText_ToString) | Renders this [RenderableText](https://docs.sisk-framework.org/api/TinyComponents.RenderableText.md) into an string. |
