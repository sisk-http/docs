# DefaultMessagePage

Kind: Class  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.DefaultMessagePage.html

Provides methods for creating informative static pages used by Sisk.

```csharp
public sealed class DefaultMessagePage
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[DefaultMessagePage](https://docs.sisk-framework.org/api/Sisk.Core.Http.DefaultMessagePage.md)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [DefaultMessagePage\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.DefaultMessagePage.-ctor.md#Sisk_Core_Http_DefaultMessagePage__ctor) | Initializes a new instance of the [DefaultMessagePage](https://docs.sisk-framework.org/api/Sisk.Core.Http.DefaultMessagePage.md) class. |

## Properties

| Name | Description |
| --- | --- |
| [FooterNote](https://docs.sisk-framework.org/api/Sisk.Core.Http.DefaultMessagePage.FooterNote.md#Sisk_Core_Http_DefaultMessagePage_FooterNote) | Gets or sets the footer note text used by the page code. |
| [Instance](https://docs.sisk-framework.org/api/Sisk.Core.Http.DefaultMessagePage.Instance.md#Sisk_Core_Http_DefaultMessagePage_Instance) | Gets the singleton instance of the default message page. |
| [Styles](https://docs.sisk-framework.org/api/Sisk.Core.Http.DefaultMessagePage.Styles.md#Sisk_Core_Http_DefaultMessagePage_Styles) | Gets or sets the page CSS string used by the page code. |

## Methods

| Name | Description |
| --- | --- |
| [CreateMessageHtml\(string, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.DefaultMessagePage.CreateMessageHtml.md#Sisk_Core_Http_DefaultMessagePage_CreateMessageHtml_System_String_System_String_) | Creates an static default page with given header and description. |
| [CreateMessageHtml\(in HttpStatusInformation, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.DefaultMessagePage.CreateMessageHtml.md#Sisk_Core_Http_DefaultMessagePage_CreateMessageHtml_Sisk_Core_Http_HttpStatusInformation__System_String_) | Creates an static default page with given status code and description. |
