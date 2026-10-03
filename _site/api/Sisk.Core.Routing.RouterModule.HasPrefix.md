# RouterModule.HasPrefix

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.HasPrefix.html

## HasPrefix(string) {#Sisk_Core_Routing_RouterModule_HasPrefix_System_String_}

Specifies a prefix for all routes defined by this module.

```csharp
protected void HasPrefix(string prefix)
```

### Parameters

`prefix` [string](https://learn.microsoft.com/dotnet/api/system.string)

The prefix to be applied to all registered routes of this class.

### Remarks

This method allows for the specification of a common prefix for all routes defined by this module,
which can be useful for organizing and structuring routes in a large application.
