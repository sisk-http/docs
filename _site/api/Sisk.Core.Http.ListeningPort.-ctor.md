# ListeningPort constructor

Kind: Constructor  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.-ctor.html

## ListeningPort() {#Sisk_Core_Http_ListeningPort__ctor}

Creates an new [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md) instance with default parameters.

```csharp
public ListeningPort()
```

## ListeningPort(ushort) {#Sisk_Core_Http_ListeningPort__ctor_System_UInt16_}

Creates an new [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md) instance with the specified port at the loopback host.

```csharp
public ListeningPort(ushort port)
```

### Parameters

`port` [ushort](https://learn.microsoft.com/dotnet/api/system.uint16)

The port the server will listen on. If this port is the default HTTPS port (443), the class will have the property [Secure](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.Secure.md) to true.

## ListeningPort(ushort, bool) {#Sisk_Core_Http_ListeningPort__ctor_System_UInt16_System_Boolean_}

Creates an new [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md) instance with the specified port and secure context at the loopback host.

```csharp
public ListeningPort(ushort port, bool secure)
```

### Parameters

`port` [ushort](https://learn.microsoft.com/dotnet/api/system.uint16)

The port the server will listen on.

`secure` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

Indicates whether the server should listen to this port securely (SSL).

## ListeningPort(bool, string, ushort) {#Sisk_Core_Http_ListeningPort__ctor_System_Boolean_System_String_System_UInt16_}

Creates an new [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md) instance with the specified port, secure context and hostname.

```csharp
public ListeningPort(bool secure, string hostname, ushort port)
```

### Parameters

`secure` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

Indicates whether the server should listen to this port securely (SSL).

`hostname` [string](https://learn.microsoft.com/dotnet/api/system.string)

The hostname DNS pattern the server will listen to.

`port` [ushort](https://learn.microsoft.com/dotnet/api/system.uint16)

The port the server will listen on.

## ListeningPort(bool, string, ushort, string) {#Sisk_Core_Http_ListeningPort__ctor_System_Boolean_System_String_System_UInt16_System_String_}

Creates an new [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md) instance with the specified port, secure context, hostname
and path.

```csharp
public ListeningPort(bool secure, string hostname, ushort port, string path)
```

### Parameters

`secure` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

Indicates whether the server should listen to this port securely (SSL).

`hostname` [string](https://learn.microsoft.com/dotnet/api/system.string)

The hostname DNS pattern the server will listen to.

`port` [ushort](https://learn.microsoft.com/dotnet/api/system.uint16)

The port the server will listen on.

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)

The prefix path.

## ListeningPort(string) {#Sisk_Core_Http_ListeningPort__ctor_System_String_}

Creates an new [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md) instance with the specified URI.

```csharp
public ListeningPort(string uri)
```

### Parameters

`uri` [string](https://learn.microsoft.com/dotnet/api/system.string)

The URI component that will be parsed to the listening port format.
