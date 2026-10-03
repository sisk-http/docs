# ListeningHost constructor

Kind: Constructor  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.-ctor.html

## ListeningHost() {#Sisk_Core_Http_ListeningHost__ctor}

Creates an new empty [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md) instance.

```csharp
public ListeningHost()
```

## ListeningHost(params ListeningPort[]) {#Sisk_Core_Http_ListeningHost__ctor_Sisk_Core_Http_ListeningPort___}

Creates an new [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md) instance with given array of [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md).

```csharp
public ListeningHost(params ListeningPort[] ports)
```

### Parameters

`ports` [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md)\[\]

The array of [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md) to listen in the [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md).

## ListeningHost(string, Router) {#Sisk_Core_Http_ListeningHost__ctor_System_String_Sisk_Core_Routing_Router_}

Creates an new [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md) instance with given URL.

```csharp
public ListeningHost(string uri, Router r)
```

### Parameters

`uri` [string](https://learn.microsoft.com/dotnet/api/system.string)

The well formatted URL with scheme, hostname and port.

`r` [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md)

The router which will handle this listener requests.
