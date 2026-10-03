# InitializationParameterCollection.GetValueOption

Kind: Enum  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.InitializationParameterCollection.GetValueOption.html

Represents the option used in the method [GetValueOrThrow](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.InitializationParameterCollection.GetValueOrThrow.md).

```csharp
public enum InitializationParameterCollection.GetValueOption
```

## Fields

| Name | Description |
| --- | --- |
| `NotNull = 0` | The method should throw if the value is not present in the collection, but allow empty values. |
| `NotNullOrEmpty = 1` | The method should throw if the value is not present in the collection or has an empty value. |
| `NotNullOrWhiteSpace = 2` | The method should throw if the value is not present in the collection, has an empty value or consists of whitespaces (spaces, tabs, etc.). |
