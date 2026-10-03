# XmlNode constructor

Kind: Constructor  
Namespace: `TinyComponents`  
Assembly: `TinyComponents.dll`  
Source: https://docs.sisk-framework.org/api/TinyComponents.XmlNode.-ctor.html

## XmlNode(string) {#TinyComponents_XmlNode__ctor_System_String_}

Initializes a new instance of the [XmlNode](https://docs.sisk-framework.org/api/TinyComponents.XmlNode.md) class with the specified tag name.

```csharp
public XmlNode(string tagName)
```

### Parameters

`tagName` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the tag to be used for the XML element. The tag name will be converted to lowercase.

## XmlNode(string, object?) {#TinyComponents_XmlNode__ctor_System_String_System_Object_}

Initializes a new instance of the [XmlNode](https://docs.sisk-framework.org/api/TinyComponents.XmlNode.md) class with the specified tag name and content.

```csharp
public XmlNode(string tagName, object? content)
```

### Parameters

`tagName` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the tag to be used for the XML element. The tag name will be converted to lowercase.

`content` [object](https://learn.microsoft.com/dotnet/api/system.object)?

Optional parameter that defines content for the creating XML tag.

## XmlNode(string, string) {#TinyComponents_XmlNode__ctor_System_String_System_String_}

Initializes a new instance of the [XmlNode](https://docs.sisk-framework.org/api/TinyComponents.XmlNode.md) class with the specified tag name and content.

```csharp
public XmlNode(string tagName, string content)
```

### Parameters

`tagName` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the tag to be used for the XML element. The tag name will be converted to lowercase.

`content` [string](https://learn.microsoft.com/dotnet/api/system.string)

Optional parameter that defines content for the creating XML tag.

## XmlNode(string, Action&lt;XmlNode>) {#TinyComponents_XmlNode__ctor_System_String_System_Action_TinyComponents_XmlNode__}

Initializes a new instance of the [XmlNode](https://docs.sisk-framework.org/api/TinyComponents.XmlNode.md) class with the specified tag name.

```csharp
public XmlNode(string tagName, Action<XmlNode> content)
```

### Parameters

`tagName` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the tag to be used for the XML element. The tag name will be converted to lowercase.

`content` [Action](https://learn.microsoft.com/dotnet/api/system.action\-1)<[XmlNode](https://docs.sisk-framework.org/api/TinyComponents.XmlNode.md)\>

Optional parameter that defines content for the creating XML tag.
