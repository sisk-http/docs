# HtmlDocumentationExporter

Kind: Class  
Namespace: `Sisk.Documenting.Html`  
Assembly: `Sisk.Documenting.Html.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.html

Represents a class for exporting API documentation to HTML format.

```csharp
public class HtmlDocumentationExporter : IApiDocumentationExporter
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HtmlDocumentationExporter](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.md)

#### Implements

IApiDocumentationExporter

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.MemberwiseClone\(\)](https://learn.microsoft.com/dotnet/api/system.object.memberwiseclone), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [HtmlDocumentationExporter\(\)](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.-ctor.md#Sisk_Documenting_Html_HtmlDocumentationExporter__ctor) | Creates an new instance of the [HtmlDocumentationExporter](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.md) class. |

## Properties

| Name | Description |
| --- | --- |
| [Footer](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.Footer.md#Sisk_Documenting_Html_HtmlDocumentationExporter_Footer) | Gets or sets an optional object to append after the generated contents, right at the end of the `&lt;main&gt;` tag of the generated page. |
| [FormatEndpointHeaders](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.FormatEndpointHeaders.md#Sisk_Documenting_Html_HtmlDocumentationExporter_FormatEndpointHeaders) | Gets or sets the format string for endpoint headers. |
| [FormatEndpointParameters](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.FormatEndpointParameters.md#Sisk_Documenting_Html_HtmlDocumentationExporter_FormatEndpointParameters) | Gets or sets the format string for endpoint request parameters. |
| [FormatEndpointPathParameters](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.FormatEndpointPathParameters.md#Sisk_Documenting_Html_HtmlDocumentationExporter_FormatEndpointPathParameters) | Gets or sets the format string for endpoint path parameters. |
| [FormatEndpointRequestExamples](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.FormatEndpointRequestExamples.md#Sisk_Documenting_Html_HtmlDocumentationExporter_FormatEndpointRequestExamples) | Gets or sets the format string for endpoint request examples. |
| [FormatEndpointResponses](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.FormatEndpointResponses.md#Sisk_Documenting_Html_HtmlDocumentationExporter_FormatEndpointResponses) | Gets or sets the format string for endpoint responses. |
| [FormatMainTitleServiceVersion](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.FormatMainTitleServiceVersion.md#Sisk_Documenting_Html_HtmlDocumentationExporter_FormatMainTitleServiceVersion) | Gets or sets the format string for the main title service version. |
| [FormatRequiredText](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.FormatRequiredText.md#Sisk_Documenting_Html_HtmlDocumentationExporter_FormatRequiredText) | Gets or sets the format string for required text. |
| [Head](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.Head.md#Sisk_Documenting_Html_HtmlDocumentationExporter_Head) | Gets or sets an optional object to append inside the `&lt;head&gt;` tag of the generated page. |
| [Header](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.Header.md#Sisk_Documenting_Html_HtmlDocumentationExporter_Header) | Gets or sets an optional object to append after the main title, at the beginning of the `&lt;main&gt;` tag of the generated page. |
| [PageTitle](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.PageTitle.md#Sisk_Documenting_Html_HtmlDocumentationExporter_PageTitle) | Gets or sets the title of the HTML page. |
| [Script](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.Script.md#Sisk_Documenting_Html_HtmlDocumentationExporter_Script) | Gets or sets the JavaScript script to be included in the HTML page. |
| [Style](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.Style.md#Sisk_Documenting_Html_HtmlDocumentationExporter_Style) | Gets or sets the CSS styles of the HTML page. |

## Methods

| Name | Description |
| --- | --- |
| [CreateCodeBlock\(string, string?\)](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.CreateCodeBlock.md#Sisk_Documenting_Html_HtmlDocumentationExporter_CreateCodeBlock_System_String_System_String_) | Creates an HTML code block element from the provided code and language. |
| [CreateEndpointBadge\(RouteMethod, string?\)](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.CreateEndpointBadge.md#Sisk_Documenting_Html_HtmlDocumentationExporter_CreateEndpointBadge_Sisk_Core_Routing_RouteMethod_System_String_) | Creates an HTML badge element for an API endpoint. |
| [CreateParagraphs\(string?\)](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.CreateParagraphs.md#Sisk_Documenting_Html_HtmlDocumentationExporter_CreateParagraphs_System_String_) | Creates one or more HTML paragraph elements from the provided text. |
| [Ellipsis\(string?, int\)](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.Ellipsis.md#Sisk_Documenting_Html_HtmlDocumentationExporter_Ellipsis_System_String_System_Int32_) | Truncates a string to the specified size, appending an ellipsis if necessary. |
| [ExportDocumentationContent\(ApiDocumentation\)](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.ExportDocumentationContent.md#Sisk_Documenting_Html_HtmlDocumentationExporter_ExportDocumentationContent_Sisk_Documenting_ApiDocumentation_) | Exports the API documentation as HTTP content. |
| [ExportHtml\(ApiDocumentation\)](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.ExportHtml.md#Sisk_Documenting_Html_HtmlDocumentationExporter_ExportHtml_Sisk_Documenting_ApiDocumentation_) | Exports the API documentation as an HTML string. |
| [GetRouteMethodHexColor\(RouteMethod\)](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.GetRouteMethodHexColor.md#Sisk_Documenting_Html_HtmlDocumentationExporter_GetRouteMethodHexColor_Sisk_Core_Routing_RouteMethod_) | Gets the hex color code associated with the specified route method. |
| [TransformId\(string\)](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.TransformId.md#Sisk_Documenting_Html_HtmlDocumentationExporter_TransformId_System_String_) | Transforms an unsafe ID into a safe and valid HTML ID. |
| [WriteEndpointDescription\(ApiEndpoint\)](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.WriteEndpointDescription.md#Sisk_Documenting_Html_HtmlDocumentationExporter_WriteEndpointDescription_Sisk_Documenting_ApiEndpoint_) | Writes the description of an API endpoint. |
| [WriteMainTitle\(ApiDocumentation\)](https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.WriteMainTitle.md#Sisk_Documenting_Html_HtmlDocumentationExporter_WriteMainTitle_Sisk_Documenting_ApiDocumentation_) | Writes the main title of the API documentation. |
