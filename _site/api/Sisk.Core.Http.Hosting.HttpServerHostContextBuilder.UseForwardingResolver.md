# HttpServerHostContextBuilder.UseForwardingResolver

Kind: Method  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.UseForwardingResolver.html

## UseForwardingResolver(ForwardingResolver) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseForwardingResolver_Sisk_Core_Http_ForwardingResolver_}

This method is a shortcut for setting [ForwardingResolver](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ForwardingResolver.md).

```csharp
public HttpServerHostContextBuilder UseForwardingResolver(ForwardingResolver resolver)
```

### Parameters

`resolver` [ForwardingResolver](https://docs.sisk-framework.org/api/Sisk.Core.Http.ForwardingResolver.md)

The [ForwardingResolver](https://docs.sisk-framework.org/api/Sisk.Core.Http.ForwardingResolver.md) object.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

## UseForwardingResolver&lt;TForwardingResolver>() {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseForwardingResolver__1}

This method is a shortcut for setting [ForwardingResolver](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ForwardingResolver.md).

```csharp
public HttpServerHostContextBuilder UseForwardingResolver<TForwardingResolver>() where TForwardingResolver : ForwardingResolver, new()
```

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

### Type Parameters

`TForwardingResolver` 

The type which implements [ForwardingResolver](https://docs.sisk-framework.org/api/Sisk.Core.Http.ForwardingResolver.md).
