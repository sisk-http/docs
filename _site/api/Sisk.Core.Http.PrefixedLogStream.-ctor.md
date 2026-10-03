# PrefixedLogStream constructor

Kind: Constructor  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.PrefixedLogStream.-ctor.html

## PrefixedLogStream(Func&lt;string>) {#Sisk_Core_Http_PrefixedLogStream__ctor_System_Func_System_String__}

Initializes a new instance of the [PrefixedLogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.PrefixedLogStream.md) class with the specified prefix function.

```csharp
public PrefixedLogStream(Func<string> prefixFunction)
```

### Parameters

`prefixFunction` [Func](https://learn.microsoft.com/dotnet/api/system.func\-1)<[string](https://learn.microsoft.com/dotnet/api/system.string)\>

A function that returns the prefix to be added to log messages.

## PrefixedLogStream(Func&lt;string>, TextWriter) {#Sisk_Core_Http_PrefixedLogStream__ctor_System_Func_System_String__System_IO_TextWriter_}

Initializes a new instance of the [PrefixedLogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.PrefixedLogStream.md) class with the specified prefix function and text writer.

```csharp
public PrefixedLogStream(Func<string> prefixFunction, TextWriter tw)
```

### Parameters

`prefixFunction` [Func](https://learn.microsoft.com/dotnet/api/system.func\-1)<[string](https://learn.microsoft.com/dotnet/api/system.string)\>

A function that returns the prefix to be added to log messages.

`tw` [TextWriter](https://learn.microsoft.com/dotnet/api/system.io.textwriter)

The text writer to write log messages to.

## PrefixedLogStream(Func&lt;string>, string) {#Sisk_Core_Http_PrefixedLogStream__ctor_System_Func_System_String__System_String_}

Initializes a new instance of the [PrefixedLogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.PrefixedLogStream.md) class with the specified prefix function and file name.

```csharp
public PrefixedLogStream(Func<string> prefixFunction, string filename)
```

### Parameters

`prefixFunction` [Func](https://learn.microsoft.com/dotnet/api/system.func\-1)<[string](https://learn.microsoft.com/dotnet/api/system.string)\>

A function that returns the prefix to be added to log messages.

`filename` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the file to write log messages to.

## PrefixedLogStream(Func&lt;string>, string?, TextWriter?) {#Sisk_Core_Http_PrefixedLogStream__ctor_System_Func_System_String__System_String_System_IO_TextWriter_}

Initializes a new instance of the [PrefixedLogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.PrefixedLogStream.md) class with the specified prefix function, file name, and text writer.

```csharp
public PrefixedLogStream(Func<string> prefixFunction, string? filename, TextWriter? tw)
```

### Parameters

`prefixFunction` [Func](https://learn.microsoft.com/dotnet/api/system.func\-1)<[string](https://learn.microsoft.com/dotnet/api/system.string)\>

A function that returns the prefix to be added to log messages.

`filename` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The name of the file to write log messages to, or `null` to write to the text writer.

`tw` [TextWriter](https://learn.microsoft.com/dotnet/api/system.io.textwriter)?

The text writer to write log messages to, or `null` to write to the file.
