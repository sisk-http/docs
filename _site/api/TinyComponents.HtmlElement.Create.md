# HtmlElement.Create

Kind: Method  
Namespace: `TinyComponents`  
Assembly: `TinyComponents.dll`  
Source: https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.Create.html

## Create(string) {#TinyComponents_HtmlElement_Create_System_String_}

Creates an [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md) from the specified emmet template.

```csharp
public static HtmlElement Create(string emmetString)
```

### Parameters

`emmetString` [string](https://learn.microsoft.com/dotnet/api/system.string)

### Returns

[HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md)

## Create(string, object?, object?, object?[]?, bool) {#TinyComponents_HtmlElement_Create_System_String_System_Object_System_Object_System_Object___System_Boolean_}

Creates an [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md) from the specified emmet template and adds the specified style, attributes, and children.

```csharp
public static HtmlElement Create(string emmetString, object? style = null, object? attributes = null, object?[]? children = null, bool selfClosing = false)
```

### Parameters

`emmetString` [string](https://learn.microsoft.com/dotnet/api/system.string)

The emmet template string.

`style` [object](https://learn.microsoft.com/dotnet/api/system.object)?

An object containing style properties to apply to the element. Can be null.

`attributes` [object](https://learn.microsoft.com/dotnet/api/system.object)?

An object containing attribute names and values to apply to the element. Can be null.

`children` [object](https://learn.microsoft.com/dotnet/api/system.object)?\[\]?

An array of objects to put as children of the creating element. Can be null.

`selfClosing` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

An boolean indicating if the creating element should be self-closed or not.

### Returns

[HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md)

A new [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md) based on the emmet template with the specified style, attributes, and children.

## Create(string, Action&lt;HtmlElement>) {#TinyComponents_HtmlElement_Create_System_String_System_Action_TinyComponents_HtmlElement__}

Creates an [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md) from the specified emmet template and configures it using the specified action.

```csharp
public static HtmlElement Create(string emmetString, Action<HtmlElement> self)
```

### Parameters

`emmetString` [string](https://learn.microsoft.com/dotnet/api/system.string)

The emmet template string.

`self` [Action](https://learn.microsoft.com/dotnet/api/system.action\-1)<[HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md)\>

An action to configure the created [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md).

### Returns

[HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md)

A new [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md) based on the emmet template and configured using the specified action.
