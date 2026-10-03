# HttpHostContext.HttpResponse

Kind: Class  
Namespace: `Sisk.Cadente`  
Assembly: `Sisk.Cadente.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.HttpResponse.html

Represents an HTTP response.

```csharp
public sealed class HttpHostContext.HttpResponse
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpHostContext.HttpResponse](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.HttpResponse.md)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Properties

| Name | Description |
| --- | --- |
| [Headers](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.HttpResponse.Headers.md#Sisk_Cadente_HttpHostContext_HttpResponse_Headers) | Gets or sets the list of headers associated with the response. |
| [Headers](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.HttpResponse.Headers.md#Sisk_Cadente_HttpHostContext_HttpResponse_Headers) | Gets or sets the list of headers associated with the response. |
| [StatusCode](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.HttpResponse.StatusCode.md#Sisk_Cadente_HttpHostContext_HttpResponse_StatusCode) | Gets or sets the HTTP status code of the response. |
| [StatusCode](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.HttpResponse.StatusCode.md#Sisk_Cadente_HttpHostContext_HttpResponse_StatusCode) | Gets or sets the HTTP status code of the response. |
| [StatusDescription](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.HttpResponse.StatusDescription.md#Sisk_Cadente_HttpHostContext_HttpResponse_StatusDescription) | Gets or sets the status description of the response. |
| [StatusDescription](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.HttpResponse.StatusDescription.md#Sisk_Cadente_HttpHostContext_HttpResponse_StatusDescription) | Gets or sets the status description of the response. |

## Methods

| Name | Description |
| --- | --- |
| [GetResponseStreamAsync\(bool\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.HttpResponse.GetResponseStreamAsync.md#Sisk_Cadente_HttpHostContext_HttpResponse_GetResponseStreamAsync_System_Boolean_) | Asynchronously gets the content stream for the response. |
| [GetResponseStreamAsync\(bool\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.HttpResponse.GetResponseStreamAsync.md#Sisk_Cadente_HttpHostContext_HttpResponse_GetResponseStreamAsync_System_Boolean_) | Asynchronously gets the content stream for the response. |
| [WriteInlineContent\(ReadOnlySpan<byte\>\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.HttpResponse.WriteInlineContent.md#Sisk_Cadente_HttpHostContext_HttpResponse_WriteInlineContent_System_ReadOnlySpan_System_Byte__) | Writes response headers and a known fixed-size body in a single operation. |
| [WriteInlineContent\(ReadOnlySpan<byte\>\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.HttpResponse.WriteInlineContent.md#Sisk_Cadente_HttpHostContext_HttpResponse_WriteInlineContent_System_ReadOnlySpan_System_Byte__) | Writes response headers and a known fixed-size body in a single operation. |
| [WriteInlineContentAsync\(ReadOnlyMemory<byte\>, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.HttpResponse.WriteInlineContentAsync.md#Sisk_Cadente_HttpHostContext_HttpResponse_WriteInlineContentAsync_System_ReadOnlyMemory_System_Byte__System_Threading_CancellationToken_) | Asynchronously writes response headers and a known fixed-size body in a single operation. |
| [WriteInlineContentAsync\(ReadOnlyMemory<byte\>, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.HttpResponse.WriteInlineContentAsync.md#Sisk_Cadente_HttpHostContext_HttpResponse_WriteInlineContentAsync_System_ReadOnlyMemory_System_Byte__System_Threading_CancellationToken_) | Asynchronously writes response headers and a known fixed-size body in a single operation. |
