# RenderableText constructor

Kind: Constructor  
Namespace: `TinyComponents`  
Assembly: `TinyComponents.dll`  
Source: https://docs.sisk-framework.org/api/TinyComponents.RenderableText.-ctor.html

## RenderableText(object?) {#TinyComponents_RenderableText__ctor_System_Object_}

Creates an new instance of [RenderableText](https://docs.sisk-framework.org/api/TinyComponents.RenderableText.md) with the specified text
contents from the object, encoding it as an HTML entity.

```csharp
public RenderableText(object? textContents)
```

### Parameters

`textContents` [object](https://learn.microsoft.com/dotnet/api/system.object)?

The object which will be encoded.

## RenderableText(object?, bool) {#TinyComponents_RenderableText__ctor_System_Object_System_Boolean_}

Creates an new instance of [RenderableText](https://docs.sisk-framework.org/api/TinyComponents.RenderableText.md) with the specified text
contents from the object.

```csharp
public RenderableText(object? textContents, bool escape)
```

### Parameters

`textContents` [object](https://learn.microsoft.com/dotnet/api/system.object)?

The object which will be encoded.

`escape` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

Determines if the text contents should be HTML encoded or not.
