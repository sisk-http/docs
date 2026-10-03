# HtmlElement.Fragment

Kind: Method  
Namespace: `TinyComponents`  
Assembly: `TinyComponents.dll`  
Source: https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.Fragment.html

## Fragment(params object?[]) {#TinyComponents_HtmlElement_Fragment_System_Object___}

Creates an fragment [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md) with specified children.

```csharp
public static HtmlElement Fragment(params object?[] children)
```

### Parameters

`children` [object](https://learn.microsoft.com/dotnet/api/system.object)?\[\]

An array of objects to put as children of the creating fragment.

### Returns

[HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md)

## Fragment(Action&lt;HtmlElement>) {#TinyComponents_HtmlElement_Fragment_System_Action_TinyComponents_HtmlElement__}

Creates an fragment [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md) with specified self-action.

```csharp
public static HtmlElement Fragment(Action<HtmlElement> action)
```

### Parameters

`action` [Action](https://learn.microsoft.com/dotnet/api/system.action\-1)<[HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md)\>

An action that defines content for the creating HTML element.

### Returns

[HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md)
