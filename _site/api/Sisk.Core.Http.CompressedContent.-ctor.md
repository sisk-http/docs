# CompressedContent constructor

Kind: Constructor  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.CompressedContent.-ctor.html

## CompressedContent(HttpContent) {#Sisk_Core_Http_CompressedContent__ctor_System_Net_Http_HttpContent_}

Initializes a new instance of compressing stream with the specified inner HTTP content.

```csharp
public CompressedContent(HttpContent innerContent)
```

### Parameters

`innerContent` [HttpContent](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent)

The inner HTTP content.

## CompressedContent(byte[]) {#Sisk_Core_Http_CompressedContent__ctor_System_Byte___}

Initializes a new instance of compressing stream with the specified byte array content.

```csharp
public CompressedContent(byte[] byteArrayContent)
```

### Parameters

`byteArrayContent` [byte](https://learn.microsoft.com/dotnet/api/system.byte)\[\]

The byte array content.

## CompressedContent(Stream) {#Sisk_Core_Http_CompressedContent__ctor_System_IO_Stream_}

Initializes a new instance of compressing stream with the specified stream content.

```csharp
public CompressedContent(Stream baseContent)
```

### Parameters

`baseContent` [Stream](https://learn.microsoft.com/dotnet/api/system.io.stream)

The stream content.
