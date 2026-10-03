# HtmlElementExtensions.WithStyle<THtmlElement>

Kind: Method  
Namespace: `TinyComponents`  
Assembly: `TinyComponents.dll`  
Source: https://docs.sisk-framework.org/api/TinyComponents.HtmlElementExtensions.WithStyle.html

## WithStyle&lt;THtmlElement>(THtmlElement, object) {#TinyComponents_HtmlElementExtensions_WithStyle__1___0_System_Object_}

Adds css styles through the style attribute on this [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md).

```csharp
public static THtmlElement WithStyle<THtmlElement>(this THtmlElement node, object styleObject) where THtmlElement : HtmlElement
```

### Parameters

`node` THtmlElement

The current [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md).

`styleObject` [object](https://learn.microsoft.com/dotnet/api/system.object)

The object which contains CSS properties and values to style the component.

### Returns

 THtmlElement

The self [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md) object for fluent chaining.

### Type Parameters

`THtmlElement` 

The object type which implements [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md).
