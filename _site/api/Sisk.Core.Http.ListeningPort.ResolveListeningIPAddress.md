# ListeningPort.ResolveListeningIPAddress

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.ResolveListeningIPAddress.html

## ResolveListeningIPAddress() {#Sisk_Core_Http_ListeningPort_ResolveListeningIPAddress}

Resolves the listening IP address from the hostname.

```csharp
public IPAddress ResolveListeningIPAddress()
```

### Returns

[IPAddress](https://learn.microsoft.com/dotnet/api/system.net.ipaddress)

The resolved [IPAddress](https://learn.microsoft.com/dotnet/api/system.net.ipaddress).

### Exceptions

[SocketException](https://learn.microsoft.com/dotnet/api/system.net.sockets.socketexception)

Thrown when DNS resolution fails.
