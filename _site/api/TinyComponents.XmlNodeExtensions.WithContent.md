# XmlNodeExtensions.WithContent<TXmlNode>

Kind: Method  
Namespace: `TinyComponents`  
Assembly: `TinyComponents.dll`  
Source: https://docs.sisk-framework.org/api/TinyComponents.XmlNodeExtensions.WithContent.html

## WithContent&lt;TXmlNode>(TXmlNode, Action&lt;TXmlNode>) {#TinyComponents_XmlNodeExtensions_WithContent__1___0_System_Action___0__}

Specifies children contents for this [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md).

```csharp
public static TXmlNode WithContent<TXmlNode>(this TXmlNode node, Action<TXmlNode> selector) where TXmlNode : INode
```

### Parameters

`node` TXmlNode

The current [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md).

`selector` [Action](https://learn.microsoft.com/dotnet/api/system.action\-1)<TXmlNode\>

The action which will be executed in the self [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md).

### Returns

 TXmlNode

The self [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md) object for fluent chaining.

### Type Parameters

`TXmlNode` 

The object type which implements [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md).

## WithContent&lt;TXmlNode>(TXmlNode, object?) {#TinyComponents_XmlNodeExtensions_WithContent__1___0_System_Object_}

Specifies children contents for this [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md).

```csharp
public static TXmlNode WithContent<TXmlNode>(this TXmlNode node, object? contents) where TXmlNode : INode
```

### Parameters

`node` TXmlNode

The current [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md).

`contents` [object](https://learn.microsoft.com/dotnet/api/system.object)?

The children object.

### Returns

 TXmlNode

The self [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md) object for fluent chaining.

### Type Parameters

`TXmlNode` 

The object type which implements [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md).

## WithContent&lt;TXmlNode>(TXmlNode, string?) {#TinyComponents_XmlNodeExtensions_WithContent__1___0_System_String_}

Specifies children contents for this [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md).

```csharp
public static TXmlNode WithContent<TXmlNode>(this TXmlNode node, string? contents) where TXmlNode : INode
```

### Parameters

`node` TXmlNode

The current [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md).

`contents` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The children object.

### Returns

 TXmlNode

The self [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md) object for fluent chaining.

### Type Parameters

`TXmlNode` 

The object type which implements [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md).
