# HttpHost constructor

Kind: Constructor  
Namespace: `Sisk.Cadente`  
Assembly: `Sisk.Cadente.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.-ctor.html

## HttpHost(IPEndPoint) {#Sisk_Cadente_HttpHost__ctor_System_Net_IPEndPoint_}

Initializes a new instance of the [HttpHost](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.md) class using the specified [IPEndPoint](https://learn.microsoft.com/dotnet/api/system.net.ipendpoint).

```csharp
public HttpHost(IPEndPoint endpoint)
```

### Parameters

`endpoint` [IPEndPoint](https://learn.microsoft.com/dotnet/api/system.net.ipendpoint)

The [IPEndPoint](https://learn.microsoft.com/dotnet/api/system.net.ipendpoint) to listen on.

## HttpHost(int) {#Sisk_Cadente_HttpHost__ctor_System_Int32_}

Initializes a new instance of the [HttpHost](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.md) class using the specified port on the loopback address.

```csharp
public HttpHost(int port)
```

### Parameters

`port` [int](https://learn.microsoft.com/dotnet/api/system.int32)

The port number to listen on.
