# LogStream.WriteLineAsync

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLineAsync.html

## WriteLineAsync() {#Sisk_Core_Http_LogStream_WriteLineAsync}

Writes an line-break at the end of the output.

```csharp
public Task WriteLineAsync()
```

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)

## WriteLineAsync(object?) {#Sisk_Core_Http_LogStream_WriteLineAsync_System_Object_}

Writes the text and concats an line-break at the end into the output.

```csharp
public Task WriteLineAsync(object? message)
```

### Parameters

`message` [object](https://learn.microsoft.com/dotnet/api/system.object)?

The text that will be written in the output.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)

## WriteLineAsync(string) {#Sisk_Core_Http_LogStream_WriteLineAsync_System_String_}

Writes the text and concats an line-break at the end into the output.

```csharp
public Task WriteLineAsync(string message)
```

### Parameters

`message` [string](https://learn.microsoft.com/dotnet/api/system.string)

The text that will be written in the output.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)

## WriteLineAsync(string, params IEnumerable&lt;object?>) {#Sisk_Core_Http_LogStream_WriteLineAsync_System_String_System_Collections_Generic_IEnumerable_System_Object__}

Writes the text format and arguments and concats an line-break at the end into the output.

```csharp
public Task WriteLineAsync(string format, params IEnumerable<object?> args)
```

### Parameters

`format` [string](https://learn.microsoft.com/dotnet/api/system.string)

The string format that represents the arguments positions.

`args` [IEnumerable](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable\-1)<[object](https://learn.microsoft.com/dotnet/api/system.object)?\>

An array of objects that represents the string format slots values.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)

## WriteLineAsync(IFormatProvider?, string, params object?[]) {#Sisk_Core_Http_LogStream_WriteLineAsync_System_IFormatProvider_System_String_System_Object___}

Writes the text format and arguments and appends a line-break at the end into the output, using the specified format provider.

```csharp
public Task WriteLineAsync(IFormatProvider? formatProvider, string format, params object?[] args)
```

### Parameters

`formatProvider` [IFormatProvider](https://learn.microsoft.com/dotnet/api/system.iformatprovider)?

The format provider to use when formatting the string. If null, the current culture is used.

`format` [string](https://learn.microsoft.com/dotnet/api/system.string)

The string format that represents the arguments positions.

`args` [object](https://learn.microsoft.com/dotnet/api/system.object)?\[\]

An array of objects that represents the string format slots values.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)
