# MultipartObject.ReadContentAsString

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.ReadContentAsString.html

## ReadContentAsString(Encoding) {#Sisk_Core_Entity_MultipartObject_ReadContentAsString_System_Text_Encoding_}

Reads the content bytes with the given encoder.

```csharp
public string ReadContentAsString(Encoding encoder)
```

### Parameters

`encoder` [Encoding](https://learn.microsoft.com/dotnet/api/system.text.encoding)

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)

## ReadContentAsString() {#Sisk_Core_Entity_MultipartObject_ReadContentAsString}

Reads the content bytes using the HTTP request content-encoding.

```csharp
public string ReadContentAsString()
```

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)
