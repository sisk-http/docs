# LogStream.SafeWriteToFileAsync

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeWriteToFileAsync.html

## SafeWriteToFileAsync(string, string?, CancellationToken) {#Sisk_Core_Http_LogStream_SafeWriteToFileAsync_System_String_System_String_System_Threading_CancellationToken_}

Safely writes the specified string to the specified file path asynchronously.

```csharp
public static Task<bool> SafeWriteToFileAsync(string filePath, string? contents, CancellationToken cancellation = default)
```

### Parameters

`filePath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The path to the file where the string will be written.

`contents` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The string to write to the file. Can be [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

`cancellation` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

The cancellation token to use for the operation. Defaults to [None](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken.none).

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<[bool](https://learn.microsoft.com/dotnet/api/system.boolean)\>

A task that represents the asynchronous write operation. The task returns [`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if the operation was successful, otherwise [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).

### Remarks

Calls to these file helper methods for the same normalized full path are serialized within the current process. Synchronous and asynchronous overloads share the same per-file lock, while calls for different files can run concurrently. Access is not coordinated across processes.

## SafeWriteToFileAsync(string, string?, Encoding, CancellationToken) {#Sisk_Core_Http_LogStream_SafeWriteToFileAsync_System_String_System_String_System_Text_Encoding_System_Threading_CancellationToken_}

Safely writes the specified string to the specified file path asynchronously.

```csharp
public static Task<bool> SafeWriteToFileAsync(string filePath, string? contents, Encoding encoding, CancellationToken cancellation = default)
```

### Parameters

`filePath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The path to the file where the string will be written.

`contents` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The string to write to the file. Can be [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

`encoding` [Encoding](https://learn.microsoft.com/dotnet/api/system.text.encoding)

The encoding to use when writing the string.

`cancellation` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

The cancellation token to use for the operation. Defaults to [None](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken.none).

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<[bool](https://learn.microsoft.com/dotnet/api/system.boolean)\>

A task that represents the asynchronous write operation. The task returns [`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if the operation was successful, otherwise [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).

### Remarks

Calls to these file helper methods for the same normalized full path are serialized within the current process. Synchronous and asynchronous overloads share the same per-file lock, while calls for different files can run concurrently. Access is not coordinated across processes.

## SafeWriteToFileAsync(string, string[], CancellationToken) {#Sisk_Core_Http_LogStream_SafeWriteToFileAsync_System_String_System_String___System_Threading_CancellationToken_}

Safely writes the specified lines to the specified file path asynchronously.

```csharp
public static Task<bool> SafeWriteToFileAsync(string filePath, string[] lines, CancellationToken cancellation = default)
```

### Parameters

`filePath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The path to the file where the lines will be written.

`lines` [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]

The lines to write to the file.

`cancellation` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

The cancellation token to use for the operation. Defaults to [None](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken.none).

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<[bool](https://learn.microsoft.com/dotnet/api/system.boolean)\>

A task that represents the asynchronous write operation. The task returns [`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if the operation was successful, otherwise [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).

### Remarks

Calls to these file helper methods for the same normalized full path are serialized within the current process. Synchronous and asynchronous overloads share the same per-file lock, while calls for different files can run concurrently. Access is not coordinated across processes.

## SafeWriteToFileAsync(string, string[], Encoding, CancellationToken) {#Sisk_Core_Http_LogStream_SafeWriteToFileAsync_System_String_System_String___System_Text_Encoding_System_Threading_CancellationToken_}

Safely writes the specified lines to the specified file path asynchronously.

```csharp
public static Task<bool> SafeWriteToFileAsync(string filePath, string[] lines, Encoding encoding, CancellationToken cancellation = default)
```

### Parameters

`filePath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The path to the file where the lines will be written.

`lines` [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]

The lines to write to the file.

`encoding` [Encoding](https://learn.microsoft.com/dotnet/api/system.text.encoding)

The encoding to use when writing the lines.

`cancellation` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

The cancellation token to use for the operation. Defaults to [None](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken.none).

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<[bool](https://learn.microsoft.com/dotnet/api/system.boolean)\>

A task that represents the asynchronous write operation. The task returns [`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if the operation was successful, otherwise [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).

### Remarks

Calls to these file helper methods for the same normalized full path are serialized within the current process. Synchronous and asynchronous overloads share the same per-file lock, while calls for different files can run concurrently. Access is not coordinated across processes.
