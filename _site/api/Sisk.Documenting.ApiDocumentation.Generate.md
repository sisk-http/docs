# ApiDocumentation.Generate

Kind: Method  
Namespace: `Sisk.Documenting`  
Assembly: `Sisk.Documenting.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Documenting.ApiDocumentation.Generate.html

## Generate(Router, ApiIdentifier) {#Sisk_Documenting_ApiDocumentation_Generate_Sisk_Core_Routing_Router_Sisk_Documenting_ApiIdentifier_}

Generates an instance of [ApiDocumentation](https://docs.sisk-framework.org/api/Sisk.Documenting.ApiDocumentation.md) by reading documentation from the specified router and identifier.

```csharp
public static ApiDocumentation Generate(Router router, ApiIdentifier identifier)
```

### Parameters

`router` Router

The router used to generate the documentation.

`identifier` [ApiIdentifier](https://docs.sisk-framework.org/api/Sisk.Documenting.ApiIdentifier.md)

The identifier for the API documentation.

### Returns

[ApiDocumentation](https://docs.sisk-framework.org/api/Sisk.Documenting.ApiDocumentation.md)

An instance of [ApiDocumentation](https://docs.sisk-framework.org/api/Sisk.Documenting.ApiDocumentation.md).
