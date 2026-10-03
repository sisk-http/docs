# HttpHeader constructor

Kind: Constructor  
Namespace: `Sisk.Cadente`  
Assembly: `Sisk.Cadente.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.-ctor.html

## HttpHeader(in ReadOnlyMemory&lt;byte>, in ReadOnlyMemory&lt;byte>) {#Sisk_Cadente_HttpHeader__ctor_System_ReadOnlyMemory_System_Byte___System_ReadOnlyMemory_System_Byte___}

Initializes a new instance of the [HttpHeader](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.md) struct with the specified name and value as byte arrays.

```csharp
public HttpHeader(in ReadOnlyMemory<byte> nameBytes, in ReadOnlyMemory<byte> valueBytes)
```

### Parameters

`nameBytes` [ReadOnlyMemory](https://learn.microsoft.com/dotnet/api/system.readonlymemory\-1)<[byte](https://learn.microsoft.com/dotnet/api/system.byte)\>

The byte array representing the name of the header.

`valueBytes` [ReadOnlyMemory](https://learn.microsoft.com/dotnet/api/system.readonlymemory\-1)<[byte](https://learn.microsoft.com/dotnet/api/system.byte)\>

The byte array representing the value of the header.

## HttpHeader(string, string) {#Sisk_Cadente_HttpHeader__ctor_System_String_System_String_}

Initializes a new instance of the [HttpHeader](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.md) struct with the specified name and value as strings.

```csharp
public HttpHeader(string name, string value)
```

### Parameters

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the header.

`value` [string](https://learn.microsoft.com/dotnet/api/system.string)

The value of the header.
