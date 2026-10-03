# HtmlContent constructor

Kind: Constructor  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HtmlContent.-ctor.html

## HtmlContent(string, Encoding) {#Sisk_Core_Http_HtmlContent__ctor_System_String_System_Text_Encoding_}

Creates an new [HtmlContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.HtmlContent.md) class with given HTML content and encoding.

```csharp
public HtmlContent(string content, Encoding encoding)
```

### Parameters

`content` [string](https://learn.microsoft.com/dotnet/api/system.string)

The HTML content string.

`encoding` [Encoding](https://learn.microsoft.com/dotnet/api/system.text.encoding)

The encoding which will encode the HTML contents.

## HtmlContent(string) {#Sisk_Core_Http_HtmlContent__ctor_System_String_}

Creates an new [HtmlContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.HtmlContent.md) class with given HTML content, using the environment default encoding.

```csharp
public HtmlContent(string content)
```

### Parameters

`content` [string](https://learn.microsoft.com/dotnet/api/system.string)

The HTML content string.

## HtmlContent(ReadOnlySpan&lt;byte>, Encoding) {#Sisk_Core_Http_HtmlContent__ctor_System_ReadOnlySpan_System_Byte__System_Text_Encoding_}

Creates a new [HtmlContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.HtmlContent.md) class with given HTML content as a byte span and encoding.

```csharp
public HtmlContent(ReadOnlySpan<byte> contents, Encoding encoding)
```

### Parameters

`contents` [ReadOnlySpan](https://learn.microsoft.com/dotnet/api/system.readonlyspan\-1)<[byte](https://learn.microsoft.com/dotnet/api/system.byte)\>

The HTML content as a byte span.

`encoding` [Encoding](https://learn.microsoft.com/dotnet/api/system.text.encoding)

The encoding which will decode the HTML contents.

## HtmlContent(ReadOnlySpan&lt;byte>) {#Sisk_Core_Http_HtmlContent__ctor_System_ReadOnlySpan_System_Byte__}

Creates a new [HtmlContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.HtmlContent.md) class with given HTML content as a UTF-8 encoded byte span.

```csharp
public HtmlContent(ReadOnlySpan<byte> utf8Contents)
```

### Parameters

`utf8Contents` [ReadOnlySpan](https://learn.microsoft.com/dotnet/api/system.readonlyspan\-1)<[byte](https://learn.microsoft.com/dotnet/api/system.byte)\>

The HTML content as a UTF-8 encoded byte span.
