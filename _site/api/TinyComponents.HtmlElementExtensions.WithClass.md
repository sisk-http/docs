# HtmlElementExtensions.WithClass<THtmlElement>

Kind: Method  
Namespace: `TinyComponents`  
Assembly: `TinyComponents.dll`  
Source: https://docs.sisk-framework.org/api/TinyComponents.HtmlElementExtensions.WithClass.html

## WithClass&lt;THtmlElement>(THtmlElement, params string[]) {#TinyComponents_HtmlElementExtensions_WithClass__1___0_System_String___}

Specifies the HTML element class list of this [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md).

```csharp
public static THtmlElement WithClass<THtmlElement>(this THtmlElement node, params string[] classNames) where THtmlElement : HtmlElement
```

### Parameters

`node` THtmlElement

The current [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md).

`classNames` [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]

One or more classes to add to this [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md).

### Returns

 THtmlElement

The self [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md) object for fluent chaining.

### Type Parameters

`THtmlElement` 

The object type which implements [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md).
