# IniDocument.FromStream

Kind: Method  
Namespace: `Sisk.IniConfiguration.Core`  
Assembly: `Sisk.IniConfiguration.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.FromStream.html

## FromStream(Stream, Encoding?) {#Sisk_IniConfiguration_Core_IniDocument_FromStream_System_IO_Stream_System_Text_Encoding_}

Creates an new [IniDocument](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.md) document from the specified
stream using the specified encoding.

```csharp
public static IniDocument FromStream(Stream stream, Encoding? encoding = null)
```

### Parameters

`stream` [Stream](https://learn.microsoft.com/dotnet/api/system.io.stream)

The input stream where the INI document is.

`encoding` [Encoding](https://learn.microsoft.com/dotnet/api/system.text.encoding)?

Optional. The encoding used to read the stream. Defaults to UTF-8.

### Returns

[IniDocument](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.md)

## FromStream(TextReader) {#Sisk_IniConfiguration_Core_IniDocument_FromStream_System_IO_TextReader_}

Creates an new [IniDocument](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.md) document from the specified
[TextReader](https://learn.microsoft.com/dotnet/api/system.io.textreader).

```csharp
public static IniDocument FromStream(TextReader reader)
```

### Parameters

`reader` [TextReader](https://learn.microsoft.com/dotnet/api/system.io.textreader)

The [TextReader](https://learn.microsoft.com/dotnet/api/system.io.textreader) instance.

### Returns

[IniDocument](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.md)
