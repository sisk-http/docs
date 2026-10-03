# PortableConfigurationBuilder.WithConfigReader

Kind: Method  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.PortableConfigurationBuilder.WithConfigReader.html

## WithConfigReader(IConfigurationReader) {#Sisk_Core_Http_Hosting_PortableConfigurationBuilder_WithConfigReader_Sisk_Core_Http_Hosting_IConfigurationReader_}

Defines an custom [IConfigurationReader](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.IConfigurationReader.md) configuration pipeline to the builder.

```csharp
public PortableConfigurationBuilder WithConfigReader(IConfigurationReader reader)
```

### Parameters

`reader` [IConfigurationReader](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.IConfigurationReader.md)

The [IConfigurationReader](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.IConfigurationReader.md) object.

### Returns

[PortableConfigurationBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.PortableConfigurationBuilder.md)

## WithConfigReader&lt;TReader>() {#Sisk_Core_Http_Hosting_PortableConfigurationBuilder_WithConfigReader__1}

Defines an custom [IConfigurationReader](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.IConfigurationReader.md) configuration pipeline to the builder.

```csharp
public PortableConfigurationBuilder WithConfigReader<TReader>() where TReader : IConfigurationReader, new()
```

### Returns

[PortableConfigurationBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.PortableConfigurationBuilder.md)

### Type Parameters

`TReader` 

The [IConfigurationReader](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.IConfigurationReader.md) type.
