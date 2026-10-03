# RouterActionHandlerCallback<T>

Kind: Delegate  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterActionHandlerCallback-1.html

Represents the function that receives an object of the `T` and returns an [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) response from the informed object.

```csharp
public delegate HttpResponse RouterActionHandlerCallback<T>(T input) where T : notnull
```

#### Parameters

`input` T

The result router object.

#### Returns

[HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md)

#### Type Parameters

`T` 

The input object type. Cannot be nullable.
