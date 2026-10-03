# XmlNode

Kind: Class  
Namespace: `TinyComponents`  
Assembly: `TinyComponents.dll`  
Source: https://docs.sisk-framework.org/api/TinyComponents.XmlNode.html

Represents an renderable XML node.

```csharp
public class XmlNode : INode
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[XmlNode](https://docs.sisk-framework.org/api/TinyComponents.XmlNode.md)

#### Implements

[INode](https://docs.sisk-framework.org/api/TinyComponents.INode.md)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.MemberwiseClone\(\)](https://learn.microsoft.com/dotnet/api/system.object.memberwiseclone), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

#### Extension Methods

[XmlNodeExtensions.SelfClosed<XmlNode\>\(XmlNode\)](https://docs.sisk-framework.org/api/TinyComponents.XmlNodeExtensions.SelfClosed.md#TinyComponents_XmlNodeExtensions_SelfClosed__1___0_), 
[XmlNodeExtensions.WithAttribute<XmlNode\>\(XmlNode, string\)](https://docs.sisk-framework.org/api/TinyComponents.XmlNodeExtensions.WithAttribute.md#TinyComponents_XmlNodeExtensions_WithAttribute__1___0_System_String_), 
[XmlNodeExtensions.WithAttribute<XmlNode\>\(XmlNode, string, object?\)](https://docs.sisk-framework.org/api/TinyComponents.XmlNodeExtensions.WithAttribute.md#TinyComponents_XmlNodeExtensions_WithAttribute__1___0_System_String_System_Object_), 
[XmlNodeExtensions.WithAttributes<XmlNode\>\(XmlNode, object?\)](https://docs.sisk-framework.org/api/TinyComponents.XmlNodeExtensions.WithAttributes.md#TinyComponents_XmlNodeExtensions_WithAttributes__1___0_System_Object_), 
[XmlNodeExtensions.WithContent<XmlNode\>\(XmlNode, Action<XmlNode\>\)](https://docs.sisk-framework.org/api/TinyComponents.XmlNodeExtensions.WithContent.md#TinyComponents_XmlNodeExtensions_WithContent__1___0_System_Action___0__), 
[XmlNodeExtensions.WithContent<XmlNode\>\(XmlNode, object?\)](https://docs.sisk-framework.org/api/TinyComponents.XmlNodeExtensions.WithContent.md#TinyComponents_XmlNodeExtensions_WithContent__1___0_System_Object_), 
[XmlNodeExtensions.WithContent<XmlNode\>\(XmlNode, string?\)](https://docs.sisk-framework.org/api/TinyComponents.XmlNodeExtensions.WithContent.md#TinyComponents_XmlNodeExtensions_WithContent__1___0_System_String_)

## Constructors

| Name | Description |
| --- | --- |
| [XmlNode\(string\)](https://docs.sisk-framework.org/api/TinyComponents.XmlNode.-ctor.md#TinyComponents_XmlNode__ctor_System_String_) | Initializes a new instance of the [XmlNode](https://docs.sisk-framework.org/api/TinyComponents.XmlNode.md) class with the specified tag name. |
| [XmlNode\(string, object?\)](https://docs.sisk-framework.org/api/TinyComponents.XmlNode.-ctor.md#TinyComponents_XmlNode__ctor_System_String_System_Object_) | Initializes a new instance of the [XmlNode](https://docs.sisk-framework.org/api/TinyComponents.XmlNode.md) class with the specified tag name and content. |
| [XmlNode\(string, string\)](https://docs.sisk-framework.org/api/TinyComponents.XmlNode.-ctor.md#TinyComponents_XmlNode__ctor_System_String_System_String_) | Initializes a new instance of the [XmlNode](https://docs.sisk-framework.org/api/TinyComponents.XmlNode.md) class with the specified tag name and content. |
| [XmlNode\(string, Action<XmlNode\>\)](https://docs.sisk-framework.org/api/TinyComponents.XmlNode.-ctor.md#TinyComponents_XmlNode__ctor_System_String_System_Action_TinyComponents_XmlNode__) | Initializes a new instance of the [XmlNode](https://docs.sisk-framework.org/api/TinyComponents.XmlNode.md) class with the specified tag name. |

## Properties

| Name | Description |
| --- | --- |
| [Attributes](https://docs.sisk-framework.org/api/TinyComponents.XmlNode.Attributes.md#TinyComponents_XmlNode_Attributes) | Gets or sets the collection of attributes for this node. |
| [Children](https://docs.sisk-framework.org/api/TinyComponents.XmlNode.Children.md#TinyComponents_XmlNode_Children) | Gets or sets the collection of child elements within this node. |
| [SelfClosing](https://docs.sisk-framework.org/api/TinyComponents.XmlNode.SelfClosing.md#TinyComponents_XmlNode_SelfClosing) | Gets or sets a value indicating whether this XML node is self-closing. |
| [TagName](https://docs.sisk-framework.org/api/TinyComponents.XmlNode.TagName.md#TinyComponents_XmlNode_TagName) | Gets or sets the tag name of the XML node. |

## Methods

| Name | Description |
| --- | --- |
| [ToString\(\)](https://docs.sisk-framework.org/api/TinyComponents.XmlNode.ToString.md#TinyComponents_XmlNode_ToString) | Renders this [XmlNode](https://docs.sisk-framework.org/api/TinyComponents.XmlNode.md) into it's XML string representation. |

## Operators

| Name | Description |
| --- | --- |
| [operator \+\(XmlNode, XmlNode?\)](https://docs.sisk-framework.org/api/TinyComponents.XmlNode.op_Addition.md#TinyComponents_XmlNode_op_Addition_TinyComponents_XmlNode_TinyComponents_XmlNode_) |  |
| [operator \+\(XmlNode, object?\)](https://docs.sisk-framework.org/api/TinyComponents.XmlNode.op_Addition.md#TinyComponents_XmlNode_op_Addition_TinyComponents_XmlNode_System_Object_) |  |
| [operator \+\(XmlNode, string?\)](https://docs.sisk-framework.org/api/TinyComponents.XmlNode.op_Addition.md#TinyComponents_XmlNode_op_Addition_TinyComponents_XmlNode_System_String_) |  |
