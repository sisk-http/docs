# HtmlDocumentationExporter.CreateEndpointBadge

Kind: Method  
Namespace: `Sisk.Documenting.Html`  
Assembly: `Sisk.Documenting.Html.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Documenting.Html.HtmlDocumentationExporter.CreateEndpointBadge.html

## CreateEndpointBadge(RouteMethod, string?) {#Sisk_Documenting_Html_HtmlDocumentationExporter_CreateEndpointBadge_Sisk_Core_Routing_RouteMethod_System_String_}

Creates an HTML badge element for an API endpoint.

```csharp
protected virtual HtmlElement? CreateEndpointBadge(RouteMethod method, string? path)
```

### Parameters

`method` RouteMethod

The HTTP method of the endpoint (e.g. GET, POST, PUT, etc.).

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The path of the endpoint, or null for no path display.

### Returns

 HtmlElement?

The HTML element representing the endpoint badge, or null if no badge is applicable.
