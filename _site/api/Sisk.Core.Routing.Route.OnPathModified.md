# Route.OnPathModified

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.OnPathModified.html

## OnPathModified(string, string) {#Sisk_Core_Routing_Route_OnPathModified_System_String_System_String_}

Called after the [Path](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Path.md) property is changed.

```csharp
protected virtual void OnPathModified(string oldPath, string newPath)
```

### Parameters

`oldPath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The previous route path.

`newPath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The new route path.
