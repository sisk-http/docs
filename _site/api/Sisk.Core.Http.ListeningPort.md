# ListeningPort

Kind: Struct  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.html

Provides a structure to contain a listener port for an [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md) instance.

```csharp
public readonly struct ListeningPort : IEquatable<ListeningPort>, IParsable<ListeningPort>
```

#### Implements

[IEquatable<ListeningPort\>](https://learn.microsoft.com/dotnet/api/system.iequatable\-1), 
[IParsable<ListeningPort\>](https://learn.microsoft.com/dotnet/api/system.iparsable\-1)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Examples

    A listener port represents an access point on the HTTP server.
    It consists of an indicator that it should use a secure connection (HTTPS), its hostname and port.

    It must start with https:// or http://, and must terminate with an /.

    It is represented by the syntax:

```csharp
[http|https]://[hostname]:[port]/
```

    Examples:

```csharp
http://localhost:80/
https://subdomain.domain.net:443/
http://182.32.112.223:5251/
```

## Constructors

| Name | Description |
| --- | --- |
| [ListeningPort\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.-ctor.md#Sisk_Core_Http_ListeningPort__ctor) | Creates an new [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md) instance with default parameters. |
| [ListeningPort\(ushort\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.-ctor.md#Sisk_Core_Http_ListeningPort__ctor_System_UInt16_) | Creates an new [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md) instance with the specified port at the loopback host. |
| [ListeningPort\(ushort, bool\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.-ctor.md#Sisk_Core_Http_ListeningPort__ctor_System_UInt16_System_Boolean_) | Creates an new [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md) instance with the specified port and secure context at the loopback host. |
| [ListeningPort\(bool, string, ushort\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.-ctor.md#Sisk_Core_Http_ListeningPort__ctor_System_Boolean_System_String_System_UInt16_) | Creates an new [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md) instance with the specified port, secure context and hostname. |
| [ListeningPort\(bool, string, ushort, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.-ctor.md#Sisk_Core_Http_ListeningPort__ctor_System_Boolean_System_String_System_UInt16_System_String_) | Creates an new [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md) instance with the specified port, secure context, hostname and path. |
| [ListeningPort\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.-ctor.md#Sisk_Core_Http_ListeningPort__ctor_System_String_) | Creates an new [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md) instance with the specified URI. |

## Properties

| Name | Description |
| --- | --- |
| [Hostname](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.Hostname.md#Sisk_Core_Http_ListeningPort_Hostname) | Gets the DNS hostname pattern where this listening port will refer. |
| [IsPathRoot](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.IsPathRoot.md#Sisk_Core_Http_ListeningPort_IsPathRoot) | Gets an boolean indicating if this listening port has an non-rooted path. |
| [Path](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.Path.md#Sisk_Core_Http_ListeningPort_Path) | Gets where this listening port prefix is listening to. |
| [Port](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.Port.md#Sisk_Core_Http_ListeningPort_Port) | Gets the port where this listening port will refer. |
| [Secure](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.Secure.md#Sisk_Core_Http_ListeningPort_Secure) | Gets whether the server should listen to this port securely (SSL). |

## Methods

| Name | Description |
| --- | --- |
| [Equals\(object?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.Equals.md#Sisk_Core_Http_ListeningPort_Equals_System_Object_) | Determines if another object is equals to this class instance. |
| [Equals\(ListeningPort\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.Equals.md#Sisk_Core_Http_ListeningPort_Equals_Sisk_Core_Http_ListeningPort_) | Determines if this [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md) is equals to another [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md). |
| [GetHashCode\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.GetHashCode.md#Sisk_Core_Http_ListeningPort_GetHashCode) | Gets the hash code for this listening port. |
| [GetRandomPort\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.GetRandomPort.md#Sisk_Core_Http_ListeningPort_GetRandomPort) | Gets an [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md) object with an random insecure port at the default loopback address. |
| [Parse\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.Parse.md#Sisk_Core_Http_ListeningPort_Parse_System_String_) | Parses a string into a [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md). |
| [Parse\(string, IFormatProvider?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.Parse.md#Sisk_Core_Http_ListeningPort_Parse_System_String_System_IFormatProvider_) | Parses a string into a [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md). |
| [ResolveListeningIPAddress\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.ResolveListeningIPAddress.md#Sisk_Core_Http_ListeningPort_ResolveListeningIPAddress) | Resolves the listening IP address from the hostname. |
| [ToString\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.ToString.md#Sisk_Core_Http_ListeningPort_ToString) | Gets an string representation of this [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md). |
| [ToString\(bool\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.ToString.md#Sisk_Core_Http_ListeningPort_ToString_System_Boolean_) | Gets an string representation of this [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md). |
| [TryParse\(string?, IFormatProvider?, out ListeningPort\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.TryParse.md#Sisk_Core_Http_ListeningPort_TryParse_System_String_System_IFormatProvider_Sisk_Core_Http_ListeningPort__) | Tries to parse a string into a [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md). |

## Operators

| Name | Description |
| --- | --- |
| [operator ==\(ListeningPort, ListeningPort\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.op_Equality.md#Sisk_Core_Http_ListeningPort_op_Equality_Sisk_Core_Http_ListeningPort_Sisk_Core_Http_ListeningPort_) |  |
| [operator \!=\(ListeningPort, ListeningPort\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.op_Inequality.md#Sisk_Core_Http_ListeningPort_op_Inequality_Sisk_Core_Http_ListeningPort_Sisk_Core_Http_ListeningPort_) |  |
