# HttpServerHostContextBuilder.UseCors

Kind: Method  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.UseCors.html

## UseCors(Action&lt;CrossOriginResourceSharingHeaders>) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseCors_System_Action_Sisk_Core_Entity_CrossOriginResourceSharingHeaders__}

Calls an action that has an [CrossOriginResourceSharingHeaders](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.md) instance from the main listening host as an argument.

```csharp
public HttpServerHostContextBuilder UseCors(Action<CrossOriginResourceSharingHeaders> handler)
```

### Parameters

`handler` [Action](https://learn.microsoft.com/dotnet/api/system.action\-1)<[CrossOriginResourceSharingHeaders](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.md)\>

An action where the first argument is the main [CrossOriginResourceSharingHeaders](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.md) object.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

## UseCors(CrossOriginResourceSharingHeaders) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseCors_Sisk_Core_Entity_CrossOriginResourceSharingHeaders_}

Sets an [CrossOriginResourceSharingHeaders](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.md) instance in the current listening host.

```csharp
public HttpServerHostContextBuilder UseCors(CrossOriginResourceSharingHeaders cors)
```

### Parameters

`cors` [CrossOriginResourceSharingHeaders](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.md)

The [CrossOriginResourceSharingHeaders](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.md) to the current host builder.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)
