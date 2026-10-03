# XmlNodeExtensions.WithAttribute<TXmlNode>

Kind: Method  
Namespace: `TinyComponents`  
Assembly: `TinyComponents.dll`  
Source: https://docs.sisk-framework.org/api/TinyComponents.XmlNodeExtensions.WithAttribute.html

## WithAttribute&lt;TXmlNode>(TXmlNode, string) {#TinyComponents_XmlNodeExtensions_WithAttribute__1___0_System_String_}

Specifies an attribute for this [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md).

```csharp
public static TXmlNode WithAttribute<TXmlNode>(this TXmlNode node, string value) where TXmlNode : INode
```

### Parameters

`node` TXmlNode

The current [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md).

`value` [string](https://learn.microsoft.com/dotnet/api/system.string)

The attribute name and value.

### Returns

 TXmlNode

The self [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md) object for fluent chaining.

### Type Parameters

`TXmlNode` 

The object type which implements [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md).

## WithAttribute&lt;TXmlNode>(TXmlNode, string, object?) {#TinyComponents_XmlNodeExtensions_WithAttribute__1___0_System_String_System_Object_}

Specifies an attribute for this [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md).

```csharp
public static TXmlNode WithAttribute<TXmlNode>(this TXmlNode node, string name, object? value) where TXmlNode : INode
```

### Parameters

`node` TXmlNode

The current [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md).

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

The attribute name.

`value` [object](https://learn.microsoft.com/dotnet/api/system.object)?

The attribute value.

### Returns

 TXmlNode

The self [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md) object for fluent chaining.

### Type Parameters

`TXmlNode` 

The object type which implements [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md).
