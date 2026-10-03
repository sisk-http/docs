# GZipContent constructor

Kind: Constructor  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.GZipContent.-ctor.html

## GZipContent(HttpContent) {#Sisk_Core_Http_GZipContent__ctor_System_Net_Http_HttpContent_}

Initializes a new instance of compressing stream with the specified inner HTTP content.

```csharp
public GZipContent(HttpContent innerContent)
```

### Parameters

`innerContent` [HttpContent](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent)

The inner HTTP content.

## GZipContent(byte[]) {#Sisk_Core_Http_GZipContent__ctor_System_Byte___}

Initializes a new instance of compressing stream with the specified byte array content.

```csharp
public GZipContent(byte[] byteArrayContent)
```

### Parameters

`byteArrayContent` [byte](https://learn.microsoft.com/dotnet/api/system.byte)\[\]

The byte array content.

## GZipContent(Stream) {#Sisk_Core_Http_GZipContent__ctor_System_IO_Stream_}

Initializes a new instance of compressing stream with the specified stream content.

```csharp
public GZipContent(Stream baseContent)
```

### Parameters

`baseContent` [Stream](https://learn.microsoft.com/dotnet/api/system.io.stream)

The stream content.
