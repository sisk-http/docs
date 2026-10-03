# CadenteHttpServerEngine constructor

Kind: Constructor  
Namespace: `Sisk.Cadente.CoreEngine`  
Assembly: `Sisk.Cadente.CoreEngine.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngine.-ctor.html

## CadenteHttpServerEngine() {#Sisk_Cadente_CoreEngine_CadenteHttpServerEngine__ctor}

Initializes a new instance of the [CadenteHttpServerEngine](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngine.md) class.

```csharp
public CadenteHttpServerEngine()
```

## CadenteHttpServerEngine(Action&lt;HttpHost>) {#Sisk_Cadente_CoreEngine_CadenteHttpServerEngine__ctor_System_Action_Sisk_Cadente_HttpHost__}

Initializes a new instance of the [CadenteHttpServerEngine](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngine.md) class
with a specified action to set up each HTTP host.

```csharp
public CadenteHttpServerEngine(Action<HttpHost> hostSetupAction)
```

### Parameters

`hostSetupAction` [Action](https://learn.microsoft.com/dotnet/api/system.action\-1)<HttpHost\>

An action that is executed for each [HttpHost](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.md) to configure it.
