# Router.SetObject

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.SetObject.html

## SetObject(object) {#Sisk_Core_Routing_Router_SetObject_System_Object_}

Searches for all instance and static methods that are marked with an attribute of
type [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md) in the specified object and creates routes
for these methods.

```csharp
[RequiresUnreferencedCode("This method requires access to unreferenced code, which may break AOT compilation and trimming. Use the SetObject(Type, Object) or SetObject<TObject>(TObject) overloads instead.")]
public void SetObject(object attrClassInstance)
```

### Parameters

`attrClassInstance` [object](https://learn.microsoft.com/dotnet/api/system.object)

The instance of the class where the methods are. The routing methods must be marked with any [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md).

### Exceptions

[Exception](https://learn.microsoft.com/dotnet/api/system.exception)

An exception is thrown when a method has an erroneous signature.

## SetObject(Type) {#Sisk_Core_Routing_Router_SetObject_System_Type_}

Searches for all instance and static methods that are marked with an attribute of
type [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md) in the specified object and creates routes
for these methods.

```csharp
public void SetObject(Type attrClassType)
```

### Parameters

`attrClassType` [Type](https://learn.microsoft.com/dotnet/api/system.type)

The type of the class where the methods are. The routing methods must be marked with any [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md).

## SetObject(Type, object) {#Sisk_Core_Routing_Router_SetObject_System_Type_System_Object_}

Searches for all instance and static methods that are marked with an attribute of
type [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md) in the specified object and creates routes
for these methods.

```csharp
public void SetObject(Type attrClassType, object instance)
```

### Parameters

`attrClassType` [Type](https://learn.microsoft.com/dotnet/api/system.type)

The type of the class where the methods are. The routing methods must be marked with any [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md).

`instance` [object](https://learn.microsoft.com/dotnet/api/system.object)

The instance of the object where the route methods are.

## SetObject&lt;TObject>() {#Sisk_Core_Routing_Router_SetObject__1}

Searches for all instance and static methods that are marked with an attribute of
type [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md) in the specified object and creates routes
for these methods.

```csharp
public void SetObject<TObject>()
```

### Type Parameters

`TObject` 

The type of the class where the methods are. The routing methods must be marked with any [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md).

### Exceptions

[Exception](https://learn.microsoft.com/dotnet/api/system.exception)

An exception is thrown when a method has an erroneous signature.

## SetObject&lt;TObject>(TObject) {#Sisk_Core_Routing_Router_SetObject__1___0_}

Searches for all instance and static methods that are marked with an attribute of
type [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md) in the specified object and creates routes
for these methods.

```csharp
public void SetObject<TObject>(TObject instance) where TObject : notnull
```

### Parameters

`instance` TObject

The instance of `TObject` to invoke the instance methods on.

### Type Parameters

`TObject` 

The type of the class where the methods are. The routing methods must be marked with any [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md).

### Exceptions

[Exception](https://learn.microsoft.com/dotnet/api/system.exception)

An exception is thrown when a method has an erroneous signature.
