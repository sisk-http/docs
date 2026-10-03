# HttpServerHostContext.Start

Kind: Method  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.Start.html

## Start(bool, bool) {#Sisk_Core_Http_Hosting_HttpServerHostContext_Start_System_Boolean_System_Boolean_}

Starts the HTTP server.

```csharp
public void Start(bool verbose = true, bool preventHault = true)
```

### Parameters

`verbose` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

Optional. Specifies if the application should write the listening prefix welcome message.

`preventHault` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

Optional. Specifies if the application should pause the main application loop.
