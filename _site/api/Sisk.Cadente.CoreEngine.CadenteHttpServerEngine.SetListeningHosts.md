# CadenteHttpServerEngine.SetListeningHosts

Kind: Method  
Namespace: `Sisk.Cadente.CoreEngine`  
Assembly: `Sisk.Cadente.CoreEngine.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngine.SetListeningHosts.html

## SetListeningHosts(IEnumerable&lt;ListeningHost>) {#Sisk_Cadente_CoreEngine_CadenteHttpServerEngine_SetListeningHosts_System_Collections_Generic_IEnumerable_Sisk_Core_Http_ListeningHost__}

Sets the listening hosts for the server.

```csharp
public override void SetListeningHosts(IEnumerable<ListeningHost> hosts)
```

### Parameters

`hosts` [IEnumerable](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable\-1)<ListeningHost\>

The collection of [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md) instances that the server should listen on.
