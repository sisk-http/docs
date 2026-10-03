# DeflateContent constructor

Kind: Constructor  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.DeflateContent.-ctor.html

## DeflateContent(HttpContent) {#Sisk_Core_Http_DeflateContent__ctor_System_Net_Http_HttpContent_}

Initializes a new instance of compressing stream with the specified inner HTTP content.

```csharp
public DeflateContent(HttpContent innerContent)
```

### Parameters

`innerContent` [HttpContent](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent)

The inner HTTP content.

## DeflateContent(byte[]) {#Sisk_Core_Http_DeflateContent__ctor_System_Byte___}

Initializes a new instance of compressing stream with the specified byte array content.

```csharp
public DeflateContent(byte[] byteArrayContent)
```

### Parameters

`byteArrayContent` [byte](https://learn.microsoft.com/dotnet/api/system.byte)\[\]

The byte array content.

## DeflateContent(Stream) {#Sisk_Core_Http_DeflateContent__ctor_System_IO_Stream_}

Initializes a new instance of compressing stream with the specified stream content.

```csharp
public DeflateContent(Stream baseContent)
```

### Parameters

`baseContent` [Stream](https://learn.microsoft.com/dotnet/api/system.io.stream)

The stream content.
