# McpProvider

Kind: Class  
Namespace: `Sisk.ModelContextProtocol`  
Assembly: `Sisk.ModelContextProtocol.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProvider.html

Represents a server that hosts a Model Context Protocol server.

```csharp
public sealed class McpProvider
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[McpProvider](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProvider.md)

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
| [McpProvider\(\)](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProvider.-ctor.md#Sisk_ModelContextProtocol_McpProvider__ctor) | Creates a new instance of the [McpProvider](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProvider.md) class. |
| [McpProvider\(string, string, Version\)](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProvider.-ctor.md#Sisk_ModelContextProtocol_McpProvider__ctor_System_String_System_String_System_Version_) | Creates a new instance of the [McpProvider](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProvider.md) class with the specified server details. |

## Fields

| Name | Description |
| --- | --- |
| [PROTOCOL\_VERSION](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProvider.PROTOCOL_VERSION.md#Sisk_ModelContextProtocol_McpProvider_PROTOCOL_VERSION) | Represents the current supported version of the Model Context Protocol. |

## Properties

| Name | Description |
| --- | --- |
| [ServerName](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProvider.ServerName.md#Sisk_ModelContextProtocol_McpProvider_ServerName) | Gets or sets the internal name of the server. |
| [ServerTitle](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProvider.ServerTitle.md#Sisk_ModelContextProtocol_McpProvider_ServerTitle) | Gets or sets the display name of the server. |
| [ServerVersion](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProvider.ServerVersion.md#Sisk_ModelContextProtocol_McpProvider_ServerVersion) | Gets or sets the version of the MCP server. |
| [Tools](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProvider.Tools.md#Sisk_ModelContextProtocol_McpProvider_Tools) | Gets or sets the list of MCP tools hosted by this server. |

## Methods

| Name | Description |
| --- | --- |
| [HandleRequestAsync\(HttpRequest, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProvider.HandleRequestAsync.md#Sisk_ModelContextProtocol_McpProvider_HandleRequestAsync_Sisk_Core_Http_HttpRequest_System_Threading_CancellationToken_) | Handles an incoming HTTP request for MCP operations asynchronously. |
