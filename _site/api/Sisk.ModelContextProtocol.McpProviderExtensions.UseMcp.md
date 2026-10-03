# McpProviderExtensions.UseMcp

Kind: Method  
Namespace: `Sisk.ModelContextProtocol`  
Assembly: `Sisk.ModelContextProtocol.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProviderExtensions.UseMcp.html

## UseMcp(HttpServerHostContextBuilder, McpProvider) {#Sisk_ModelContextProtocol_McpProviderExtensions_UseMcp_Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_Sisk_ModelContextProtocol_McpProvider_}

Configures the HTTP server host builder to use a specific MCP provider.

```csharp
public static HttpServerHostContextBuilder UseMcp(this HttpServerHostContextBuilder builder, McpProvider provider)
```

### Parameters

`builder` HttpServerHostContextBuilder

The HTTP server host builder to configure.

`provider` [McpProvider](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProvider.md)

The MCP provider to use.

### Returns

 HttpServerHostContextBuilder

The configured HTTP server host builder.

### Exceptions

[ArgumentNullException](https://learn.microsoft.com/dotnet/api/system.argumentnullexception)

Thrown if the provider is null.

## UseMcp(HttpServerHostContextBuilder, Action&lt;McpProvider>) {#Sisk_ModelContextProtocol_McpProviderExtensions_UseMcp_Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_System_Action_Sisk_ModelContextProtocol_McpProvider__}

Configures the HTTP server host builder to use an MCP provider built with the provided action.

```csharp
public static HttpServerHostContextBuilder UseMcp(this HttpServerHostContextBuilder builder, Action<McpProvider> providerBuilder)
```

### Parameters

`builder` HttpServerHostContextBuilder

The HTTP server host builder to configure.

`providerBuilder` [Action](https://learn.microsoft.com/dotnet/api/system.action\-1)<[McpProvider](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProvider.md)\>

An action to configure the MCP provider.

### Returns

 HttpServerHostContextBuilder

The configured HTTP server host builder.
