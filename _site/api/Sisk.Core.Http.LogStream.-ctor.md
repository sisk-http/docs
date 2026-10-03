# LogStream constructor

Kind: Constructor  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.-ctor.html

## LogStream() {#Sisk_Core_Http_LogStream__ctor}

Creates an new [LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md) instance with no predefined outputs.

```csharp
public LogStream()
```

## LogStream(TextWriter) {#Sisk_Core_Http_LogStream__ctor_System_IO_TextWriter_}

Creates an new [LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md) instance with the given TextWriter object.

```csharp
public LogStream(TextWriter tw)
```

### Parameters

`tw` [TextWriter](https://learn.microsoft.com/dotnet/api/system.io.textwriter)

The [TextWriter](https://learn.microsoft.com/dotnet/api/system.io.textwriter) instance which this instance will write log to.

## LogStream(string) {#Sisk_Core_Http_LogStream__ctor_System_String_}

Creates an new [LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md) instance with the given relative or absolute file path.

```csharp
public LogStream(string filename)
```

### Parameters

`filename` [string](https://learn.microsoft.com/dotnet/api/system.string)

The file path where this instance will write log to.

## LogStream(string?, TextWriter?) {#Sisk_Core_Http_LogStream__ctor_System_String_System_IO_TextWriter_}

Creates an new [LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md) instance which writes text to an file and an [TextWriter](https://learn.microsoft.com/dotnet/api/system.io.textwriter).

```csharp
public LogStream(string? filename, TextWriter? tw)
```

### Parameters

`filename` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The file path where this instance will write log to.

`tw` [TextWriter](https://learn.microsoft.com/dotnet/api/system.io.textwriter)?

The text writer which this instance will write log to.
