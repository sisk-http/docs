# HtmlElement

Kind: Class  
Namespace: `TinyComponents`  
Assembly: `TinyComponents.dll`  
Source: https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.html

Represents an HTML element for rendering

```csharp
public class HtmlElement : INode
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md)

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

[XmlNodeExtensions.SelfClosed<HtmlElement\>\(HtmlElement\)](https://docs.sisk-framework.org/api/TinyComponents.XmlNodeExtensions.SelfClosed.md#TinyComponents_XmlNodeExtensions_SelfClosed__1___0_), 
[XmlNodeExtensions.WithAttribute<HtmlElement\>\(HtmlElement, string\)](https://docs.sisk-framework.org/api/TinyComponents.XmlNodeExtensions.WithAttribute.md#TinyComponents_XmlNodeExtensions_WithAttribute__1___0_System_String_), 
[XmlNodeExtensions.WithAttribute<HtmlElement\>\(HtmlElement, string, object?\)](https://docs.sisk-framework.org/api/TinyComponents.XmlNodeExtensions.WithAttribute.md#TinyComponents_XmlNodeExtensions_WithAttribute__1___0_System_String_System_Object_), 
[XmlNodeExtensions.WithAttributes<HtmlElement\>\(HtmlElement, object?\)](https://docs.sisk-framework.org/api/TinyComponents.XmlNodeExtensions.WithAttributes.md#TinyComponents_XmlNodeExtensions_WithAttributes__1___0_System_Object_), 
[HtmlElementExtensions.WithClass<HtmlElement\>\(HtmlElement, params string\[\]\)](https://docs.sisk-framework.org/api/TinyComponents.HtmlElementExtensions.WithClass.md#TinyComponents_HtmlElementExtensions_WithClass__1___0_System_String___), 
[XmlNodeExtensions.WithContent<HtmlElement\>\(HtmlElement, Action<HtmlElement\>\)](https://docs.sisk-framework.org/api/TinyComponents.XmlNodeExtensions.WithContent.md#TinyComponents_XmlNodeExtensions_WithContent__1___0_System_Action___0__), 
[XmlNodeExtensions.WithContent<HtmlElement\>\(HtmlElement, object?\)](https://docs.sisk-framework.org/api/TinyComponents.XmlNodeExtensions.WithContent.md#TinyComponents_XmlNodeExtensions_WithContent__1___0_System_Object_), 
[XmlNodeExtensions.WithContent<HtmlElement\>\(HtmlElement, string?\)](https://docs.sisk-framework.org/api/TinyComponents.XmlNodeExtensions.WithContent.md#TinyComponents_XmlNodeExtensions_WithContent__1___0_System_String_), 
[HtmlElementExtensions.WithId<HtmlElement\>\(HtmlElement, string\)](https://docs.sisk-framework.org/api/TinyComponents.HtmlElementExtensions.WithId.md#TinyComponents_HtmlElementExtensions_WithId__1___0_System_String_), 
[HtmlElementExtensions.WithName<HtmlElement\>\(HtmlElement, string\)](https://docs.sisk-framework.org/api/TinyComponents.HtmlElementExtensions.WithName.md#TinyComponents_HtmlElementExtensions_WithName__1___0_System_String_), 
[HtmlElementExtensions.WithStyle<HtmlElement\>\(HtmlElement, object\)](https://docs.sisk-framework.org/api/TinyComponents.HtmlElementExtensions.WithStyle.md#TinyComponents_HtmlElementExtensions_WithStyle__1___0_System_Object_)

## Constructors

| Name | Description |
| --- | --- |
| [HtmlElement\(\)](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.-ctor.md#TinyComponents_HtmlElement__ctor) | Initializes a new instance of the [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md) class with no container HTML element. |
| [HtmlElement\(string\)](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.-ctor.md#TinyComponents_HtmlElement__ctor_System_String_) | Initializes a new instance of the [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md) class with the specified tag name. |
| [HtmlElement\(string, object?\)](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.-ctor.md#TinyComponents_HtmlElement__ctor_System_String_System_Object_) | Initializes a new instance of the [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md) class with the specified tag name and content. |
| [HtmlElement\(string, string?\)](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.-ctor.md#TinyComponents_HtmlElement__ctor_System_String_System_String_) | Initializes a new instance of the [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md) class with the specified tag name and content. |
| [HtmlElement\(string, Action<HtmlElement\>\)](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.-ctor.md#TinyComponents_HtmlElement__ctor_System_String_System_Action_TinyComponents_HtmlElement__) | Initializes a new instance of the [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md) class with the specified tag name. |

## Properties

| Name | Description |
| --- | --- |
| [Attributes](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.Attributes.md#TinyComponents_HtmlElement_Attributes) | Gets or sets the collection of HTML attributes for the element. |
| [Children](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.Children.md#TinyComponents_HtmlElement_Children) | Gets or sets the collection of child elements within this element. |
| [ClassList](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.ClassList.md#TinyComponents_HtmlElement_ClassList) | Gets or sets the list of CSS classes for the HTML element. Initializes with an empty list. Use this to apply CSS class names to the element. |
| [Id](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.Id.md#TinyComponents_HtmlElement_Id) | Gets or sets the ID attribute of the HTML element. Used to uniquely identify the element within the page. |
| [Name](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.Name.md#TinyComponents_HtmlElement_Name) | Gets or sets the name attribute of the HTML element. The name is used to reference elements in JavaScript, or to reference form data after a form is submitted. |
| [SelfClosing](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.SelfClosing.md#TinyComponents_HtmlElement_SelfClosing) | Gets or sets a value indicating whether the element is self-closing. |
| [Style](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.Style.md#TinyComponents_HtmlElement_Style) | Gets or sets the CSS style object used to render the style attribute. |
| [TabIndex](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.TabIndex.md#TinyComponents_HtmlElement_TabIndex) | Gets or sets the tab index of the HTML element. |
| [TagName](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.TagName.md#TinyComponents_HtmlElement_TagName) | Gets or sets the tag name of the HTML element (e.g., "div", "span"). |
| [TooltipTitle](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.TooltipTitle.md#TinyComponents_HtmlElement_TooltipTitle) | Gets or sets the tooltip text to display for the HTML element. |

## Methods

| Name | Description |
| --- | --- |
| [Create\(string\)](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.Create.md#TinyComponents_HtmlElement_Create_System_String_) | Creates an [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md) from the specified emmet template. |
| [Create\(string, object?, object?, object?\[\]?, bool\)](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.Create.md#TinyComponents_HtmlElement_Create_System_String_System_Object_System_Object_System_Object___System_Boolean_) | Creates an [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md) from the specified emmet template and adds the specified style, attributes, and children. |
| [Create\(string, Action<HtmlElement\>\)](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.Create.md#TinyComponents_HtmlElement_Create_System_String_System_Action_TinyComponents_HtmlElement__) | Creates an [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md) from the specified emmet template and configures it using the specified action. |
| [Format\(FormattableString\)](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.Format.md#TinyComponents_HtmlElement_Format_System_FormattableString_) | Formats the specified HTML string format, escaping the string interpolation pieces. |
| [Fragment\(params object?\[\]\)](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.Fragment.md#TinyComponents_HtmlElement_Fragment_System_Object___) | Creates an fragment [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md) with specified children. |
| [Fragment\(Action<HtmlElement\>\)](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.Fragment.md#TinyComponents_HtmlElement_Fragment_System_Action_TinyComponents_HtmlElement__) | Creates an fragment [HtmlElement](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.md) with specified self-action. |
| [GetAttributes\(\)](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.GetAttributes.md#TinyComponents_HtmlElement_GetAttributes) | Represents the protected method which gets the attributes to be rendered. |
| [ToString\(\)](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.ToString.md#TinyComponents_HtmlElement_ToString) | Renders the HTML element into a string with optional pretty formatting. |

## Operators

| Name | Description |
| --- | --- |
| [operator \+\(HtmlElement, object?\)](https://docs.sisk-framework.org/api/TinyComponents.HtmlElement.op_Addition.md#TinyComponents_HtmlElement_op_Addition_TinyComponents_HtmlElement_System_Object_) |  |
