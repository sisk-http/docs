# HtmlElement constructor

Kind: Constructor  
Namespace: `TinyComponents`  
Assembly: `TinyComponents.dll`  
Source: https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.-ctor.html

## HtmlElement() {#TinyComponents_HtmlElement__ctor}

Initializes a new instance of the [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md) class with no container HTML element.

```csharp
public HtmlElement()
```

## HtmlElement(string) {#TinyComponents_HtmlElement__ctor_System_String_}

Initializes a new instance of the [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md) class with the specified tag name.

```csharp
public HtmlElement(string tagName)
```

### Parameters

`tagName` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the tag to be used for the HTML element. The tag name will be converted to lowercase.

## HtmlElement(string, object?) {#TinyComponents_HtmlElement__ctor_System_String_System_Object_}

Initializes a new instance of the [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md) class with the specified tag name and content.

```csharp
public HtmlElement(string tagName, object? content)
```

### Parameters

`tagName` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the tag to be used for the HTML element. The tag name will be converted to lowercase.

`content` [object](https://learn.microsoft.com/dotnet/api/system.object)?

Optional parameter that defines content for the creating HTML tag.

## HtmlElement(string, string?) {#TinyComponents_HtmlElement__ctor_System_String_System_String_}

Initializes a new instance of the [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md) class with the specified tag name and content.

```csharp
public HtmlElement(string tagName, string? content)
```

### Parameters

`tagName` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the tag to be used for the HTML element. The tag name will be converted to lowercase.

`content` [string](https://learn.microsoft.com/dotnet/api/system.string)?

Optional parameter that defines content for the creating HTML tag.

## HtmlElement(string, Action&lt;HtmlElement>) {#TinyComponents_HtmlElement__ctor_System_String_System_Action_TinyComponents_HtmlElement__}

Initializes a new instance of the [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md) class with the specified tag name.

```csharp
public HtmlElement(string tagName, Action<HtmlElement> content)
```

### Parameters

`tagName` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the tag to be used for the HTML element. The tag name will be converted to lowercase.

`content` [Action](https://learn.microsoft.com/dotnet/api/system.action\-1)<[HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md)\>

Optional parameter that defines content for the creating HTML tag.
