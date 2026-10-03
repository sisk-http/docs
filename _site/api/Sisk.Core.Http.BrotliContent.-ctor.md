# BrotliContent constructor

Kind: Constructor  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.BrotliContent.-ctor.html

## BrotliContent(HttpContent) {#Sisk_Core_Http_BrotliContent__ctor_System_Net_Http_HttpContent_}

Initializes a new instance of compressing stream with the specified inner HTTP content.

```csharp
public BrotliContent(HttpContent innerContent)
```

### Parameters

`innerContent` [HttpContent](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent)

The inner HTTP content.

## BrotliContent(byte[]) {#Sisk_Core_Http_BrotliContent__ctor_System_Byte___}

Initializes a new instance of compressing stream with the specified byte array content.

```csharp
public BrotliContent(byte[] byteArrayContent)
```

### Parameters

`byteArrayContent` [byte](https://learn.microsoft.com/dotnet/api/system.byte)\[\]

The byte array content.

## BrotliContent(Stream) {#Sisk_Core_Http_BrotliContent__ctor_System_IO_Stream_}

Initializes a new instance of compressing stream with the specified stream content.

```csharp
public BrotliContent(Stream baseContent)
```

### Parameters

`baseContent` [Stream](https://learn.microsoft.com/dotnet/api/system.io.stream)

The stream content.
