# HttpWebSocketConnectionCollection

Kind: Class  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocketConnectionCollection.html

Provides a managed object to manage [HttpWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.md) connections.

```csharp
public sealed class HttpWebSocketConnectionCollection : IReadOnlyCollection<HttpWebSocket>, IEnumerable<HttpWebSocket>, IEnumerable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpWebSocketConnectionCollection](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocketConnectionCollection.md)

#### Implements

[IReadOnlyCollection<HttpWebSocket\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.ireadonlycollection\-1), 
[IEnumerable<HttpWebSocket\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable\-1), 
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
| [ActiveConnections](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocketConnectionCollection.ActiveConnections.md#Sisk_Core_Http_Streams_HttpWebSocketConnectionCollection_ActiveConnections) | Gets an number indicating the amount of active web socket connections. |
| [Count](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocketConnectionCollection.Count.md#Sisk_Core_Http_Streams_HttpWebSocketConnectionCollection_Count) |  |

## Methods

| Name | Description |
| --- | --- |
| [All\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocketConnectionCollection.All.md#Sisk_Core_Http_Streams_HttpWebSocketConnectionCollection_All) | Gets all actives [HttpWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.md) instances. |
| [DropAll\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocketConnectionCollection.DropAll.md#Sisk_Core_Http_Streams_HttpWebSocketConnectionCollection_DropAll) | Closes all registered and active [HttpWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.md) in this collections. |
| [Find\(Func<string, bool\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocketConnectionCollection.Find.md#Sisk_Core_Http_Streams_HttpWebSocketConnectionCollection_Find_System_Func_System_String_System_Boolean__) | Gets all actives [HttpWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.md) instances that matches their identifier predicate. |
| [GetByIdentifier\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocketConnectionCollection.GetByIdentifier.md#Sisk_Core_Http_Streams_HttpWebSocketConnectionCollection_GetByIdentifier_System_String_) | Gets the Web Sockect connection for the specified identifier. |
| [GetEnumerator\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocketConnectionCollection.GetEnumerator.md#Sisk_Core_Http_Streams_HttpWebSocketConnectionCollection_GetEnumerator) |  |
| [OnWebSocketRegister](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocketConnectionCollection.OnWebSocketRegister.md#Sisk_Core_Http_Streams_HttpWebSocketConnectionCollection_OnWebSocketRegister) | Represents an event that is fired when an [HttpWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.md) is registered in this collection. |
| [OnWebSocketUnregister](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocketConnectionCollection.OnWebSocketUnregister.md#Sisk_Core_Http_Streams_HttpWebSocketConnectionCollection_OnWebSocketUnregister) | Represents an event that is fired when an [HttpWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.md) is closed and removed from this collection. |
