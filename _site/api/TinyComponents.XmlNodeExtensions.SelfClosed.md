# XmlNodeExtensions.SelfClosed<TXmlNode>

Kind: Method  
Namespace: `TinyComponents`  
Assembly: `TinyComponents.dll`  
Source: https://docs.sisk-framework.org/api/TinyComponents.XmlNodeExtensions.SelfClosed.html

## SelfClosed&lt;TXmlNode>(TXmlNode) {#TinyComponents_XmlNodeExtensions_SelfClosed__1___0_}

Specifies that this [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md) will be self-closed.

```csharp
public static TXmlNode SelfClosed<TXmlNode>(this TXmlNode node) where TXmlNode : INode
```

### Parameters

`node` TXmlNode

The current [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md).

### Returns

 TXmlNode

The self [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md) object for fluent chaining.

### Type Parameters

`TXmlNode` 

The object type which implements [INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md).
