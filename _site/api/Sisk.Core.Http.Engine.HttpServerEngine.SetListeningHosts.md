# HttpServerEngine.SetListeningHosts

Kind: Method  
Namespace: `Sisk.Core.Http.Engine`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.SetListeningHosts.html

## SetListeningHosts(IEnumerable&lt;ListeningHost>) {#Sisk_Core_Http_Engine_HttpServerEngine_SetListeningHosts_System_Collections_Generic_IEnumerable_Sisk_Core_Http_ListeningHost__}

Sets the listening hosts for the server.

```csharp
public abstract void SetListeningHosts(IEnumerable<ListeningHost> hosts)
```

### Parameters

`hosts` [IEnumerable](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable\-1)<[ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md)\>

The collection of [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md) instances that the server should listen on.
