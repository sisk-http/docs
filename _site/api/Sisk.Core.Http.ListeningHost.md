# ListeningHost

Kind: Class  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.html

Provides a type to contain the fields needed by an HTTP server virtual host.

```csharp
public sealed class ListeningHost : IEquatable<ListeningHost>
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md)

#### Implements

[IEquatable<ListeningHost\>](https://learn.microsoft.com/dotnet/api/system.iequatable\-1)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [ListeningHost\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.-ctor.md#Sisk_Core_Http_ListeningHost__ctor) | Creates an new empty [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md) instance. |
| [ListeningHost\(params ListeningPort\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.-ctor.md#Sisk_Core_Http_ListeningHost__ctor_Sisk_Core_Http_ListeningPort___) | Creates an new [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md) instance with given array of [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md). |
| [ListeningHost\(string, Router\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.-ctor.md#Sisk_Core_Http_ListeningHost__ctor_System_String_Sisk_Core_Routing_Router_) | Creates an new [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md) instance with given URL. |

## Properties

| Name | Description |
| --- | --- |
| [CanListen](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.CanListen.md#Sisk_Core_Http_ListeningHost_CanListen) | Gets whether this [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md) can be listened by it's host [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md). |
| [CrossOriginResourceSharingPolicy](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.CrossOriginResourceSharingPolicy.md#Sisk_Core_Http_ListeningHost_CrossOriginResourceSharingPolicy) | Gets or sets the CORS sharing policy object. |
| [Label](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.Label.md#Sisk_Core_Http_ListeningHost_Label) | Gets or sets a label for this Listening Host. |
| [Ports](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.Ports.md#Sisk_Core_Http_ListeningHost_Ports) | Gets or sets the list of [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md) that this host will listen on. |
| [Router](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.Router.md#Sisk_Core_Http_ListeningHost_Router) | Gets or sets the [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) for this [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md) instance. |
| [SslOptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.SslOptions.md#Sisk_Core_Http_ListeningHost_SslOptions) | Gets or sets the SSL options for this [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md). |

## Methods

| Name | Description |
| --- | --- |
| [Equals\(object?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.Equals.md#Sisk_Core_Http_ListeningHost_Equals_System_Object_) | Determines if another object is equals to this class instance. |
| [Equals\(ListeningHost?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.Equals.md#Sisk_Core_Http_ListeningHost_Equals_Sisk_Core_Http_ListeningHost_) |  |
| [GetHashCode\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.GetHashCode.md#Sisk_Core_Http_ListeningHost_GetHashCode) | Gets the hash code for this listening host. |
