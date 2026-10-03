# LogStream.WriteLine

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLine.html

## WriteLine() {#Sisk_Core_Http_LogStream_WriteLine}

Writes an line-break at the end of the output.

```csharp
public void WriteLine()
```

## WriteLine(object?) {#Sisk_Core_Http_LogStream_WriteLine_System_Object_}

Writes the text and concats an line-break at the end into the output.

```csharp
public void WriteLine(object? message)
```

### Parameters

`message` [object](https://learn.microsoft.com/dotnet/api/system.object)?

The text that will be written in the output.

## WriteLine(string) {#Sisk_Core_Http_LogStream_WriteLine_System_String_}

Writes the text and concats an line-break at the end into the output.

```csharp
public void WriteLine(string message)
```

### Parameters

`message` [string](https://learn.microsoft.com/dotnet/api/system.string)

The text that will be written in the output.

## WriteLine(string, params ReadOnlySpan&lt;object?>) {#Sisk_Core_Http_LogStream_WriteLine_System_String_System_ReadOnlySpan_System_Object__}

Writes the text format and arguments and concats an line-break at the end into the output.

```csharp
public void WriteLine(string format, params ReadOnlySpan<object?> args)
```

### Parameters

`format` [string](https://learn.microsoft.com/dotnet/api/system.string)

The string format that represents the arguments positions.

`args` [ReadOnlySpan](https://learn.microsoft.com/dotnet/api/system.readonlyspan\-1)<[object](https://learn.microsoft.com/dotnet/api/system.object)?\>

An array of objects that represents the string format slots values.

## WriteLine(string, params IEnumerable&lt;object?>) {#Sisk_Core_Http_LogStream_WriteLine_System_String_System_Collections_Generic_IEnumerable_System_Object__}

Writes the text format and arguments and concats an line-break at the end into the output.

```csharp
public void WriteLine(string format, params IEnumerable<object?> args)
```

### Parameters

`format` [string](https://learn.microsoft.com/dotnet/api/system.string)

The string format that represents the arguments positions.

`args` [IEnumerable](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable\-1)<[object](https://learn.microsoft.com/dotnet/api/system.object)?\>

An array of objects that represents the string format slots values.

## WriteLine(IFormatProvider?, string, params object?[]) {#Sisk_Core_Http_LogStream_WriteLine_System_IFormatProvider_System_String_System_Object___}

Writes the text format and arguments and appends a line-break at the end into the output, using the specified format provider.

```csharp
public void WriteLine(IFormatProvider? formatProvider, string format, params object?[] args)
```

### Parameters

`formatProvider` [IFormatProvider](https://learn.microsoft.com/dotnet/api/system.iformatprovider)?

The format provider to use when formatting the string. If null, the current culture is used.

`format` [string](https://learn.microsoft.com/dotnet/api/system.string)

The string format that represents the arguments positions.

`args` [object](https://learn.microsoft.com/dotnet/api/system.object)?\[\]

An array of objects that represents the string format slots values.
