# Router.MapInstance

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapInstance.html

## MapInstance(object) {#Sisk_Core_Routing_Router_MapInstance_System_Object_}

Maps route methods from an object instance.

```csharp
[RequiresUnreferencedCode("This method requires access to unreferenced code, which may break AOT compilation and trimming. Use the SetObject(Type, Object) or SetObject<TObject>(TObject) overloads instead.")]
public void MapInstance(object instance)
```

### Parameters

`instance` [object](https://learn.microsoft.com/dotnet/api/system.object)

The instance whose route methods will be mapped.

## MapInstance&lt;TInstance>() {#Sisk_Core_Routing_Router_MapInstance__1}

Maps route methods from a new instance of `TInstance`.

```csharp
public void MapInstance<TInstance>() where TInstance : notnull, new()
```

### Type Parameters

`TInstance` 

The type whose route methods will be mapped.
