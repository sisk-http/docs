# XmlNodeExtensions.WithAttributes<TXmlNode>

Kind: Method  
Namespace: `TinyComponents`  
Assembly: `TinyComponents.dll`  
Source: https://docs.sisk-framework.org/api/TinyComponents.XmlNodeExtensions.WithAttributes.html

## WithAttributes&lt;TXmlNode>(TXmlNode, object?) {#TinyComponents_XmlNodeExtensions_WithAttributes__1___0_System_Object_}

Specifies multiple attributes for this [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md) from an object.

```csharp
public static TXmlNode WithAttributes<TXmlNode>(this TXmlNode node, object? attributesObject) where TXmlNode : INode
```

### Parameters

`node` TXmlNode

The current [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md).

`attributesObject` [object](https://learn.microsoft.com/dotnet/api/system.object)?

The object containing attribute names and values.

### Returns

 TXmlNode

The self [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md) object for fluent chaining.

### Type Parameters

`TXmlNode` 

The object type which implements [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md).
