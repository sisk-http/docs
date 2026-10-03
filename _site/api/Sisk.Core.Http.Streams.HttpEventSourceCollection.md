# HttpEventSourceCollection

Kind: Class  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.html

Provides a managed object to manage [HttpRequestEventSource](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.md) connections.

```csharp
public sealed class HttpEventSourceCollection : IReadOnlyCollection<HttpRequestEventSource>, IEnumerable<HttpRequestEventSource>, IEnumerable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpEventSourceCollection](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.md)

#### Implements

[IReadOnlyCollection<HttpRequestEventSource\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.ireadonlycollection\-1), 
[IEnumerable<HttpRequestEventSource\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable\-1), 
[IEnumerable](https://learn.microsoft.com/dotnet/api/system.collections.ienumerable)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Properties

| Name | Description |
| --- | --- |
| [ActiveConnections](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.ActiveConnections.md#Sisk_Core_Http_Streams_HttpEventSourceCollection_ActiveConnections) | Gets an number indicating the amount of active event source connections. |
| [Count](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.Count.md#Sisk_Core_Http_Streams_HttpEventSourceCollection_Count) |  |

## Methods

| Name | Description |
| --- | --- |
| [All\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.All.md#Sisk_Core_Http_Streams_HttpEventSourceCollection_All) | Gets all actives [HttpRequestEventSource](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.md) instances. |
| [DropAll\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.DropAll.md#Sisk_Core_Http_Streams_HttpEventSourceCollection_DropAll) | Closes and disposes all registered and active [HttpRequestEventSource](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.md) in this collections. |
| [Find\(Func<string, bool\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.Find.md#Sisk_Core_Http_Streams_HttpEventSourceCollection_Find_System_Func_System_String_System_Boolean__) | Gets all actives [HttpRequestEventSource](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.md) instances that matches their identifier predicate. |
| [GetByIdentifier\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.GetByIdentifier.md#Sisk_Core_Http_Streams_HttpEventSourceCollection_GetByIdentifier_System_String_) | Gets the event source connection for the specified identifier. |
| [GetEnumerator\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.GetEnumerator.md#Sisk_Core_Http_Streams_HttpEventSourceCollection_GetEnumerator) |  |
| [OnEventSourceRegistered](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.OnEventSourceRegistered.md#Sisk_Core_Http_Streams_HttpEventSourceCollection_OnEventSourceRegistered) | Represents an event that is fired when an [HttpRequestEventSource](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.md) is registered in this collection. |
| [OnEventSourceUnregistration](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.OnEventSourceUnregistration.md#Sisk_Core_Http_Streams_HttpEventSourceCollection_OnEventSourceUnregistration) | Represents an event that is fired when an [HttpRequestEventSource](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.md) is closed and removed from this collection. |
