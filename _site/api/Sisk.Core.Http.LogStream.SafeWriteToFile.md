# LogStream.SafeWriteToFile

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeWriteToFile.html

## SafeWriteToFile(string, string?) {#Sisk_Core_Http_LogStream_SafeWriteToFile_System_String_System_String_}

Safely writes the specified string to the specified file path.

```csharp
public static bool SafeWriteToFile(string filePath, string? contents)
```

### Parameters

`filePath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The path to the file where the string will be written.

`contents` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The string to write to the file. Can be [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if the operation was successful, otherwise [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).

### Remarks

Calls to these file helper methods for the same normalized full path are serialized within the current process. Synchronous and asynchronous overloads share the same per-file lock, while calls for different files can run concurrently. Access is not coordinated across processes.

## SafeWriteToFile(string, string?, Encoding) {#Sisk_Core_Http_LogStream_SafeWriteToFile_System_String_System_String_System_Text_Encoding_}

Safely writes the specified string to the specified file path.

```csharp
public static bool SafeWriteToFile(string filePath, string? contents, Encoding encoding)
```

### Parameters

`filePath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The path to the file where the string will be written.

`contents` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The string to write to the file. Can be [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

`encoding` [Encoding](https://learn.microsoft.com/dotnet/api/system.text.encoding)

The encoding to use when writing the string. Defaults to [Default](https://learn.microsoft.com/dotnet/api/system.text.encoding.default).

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if the operation was successful, otherwise [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).

### Remarks

Calls to these file helper methods for the same normalized full path are serialized within the current process. Synchronous and asynchronous overloads share the same per-file lock, while calls for different files can run concurrently. Access is not coordinated across processes.

## SafeWriteToFile(string, string[]) {#Sisk_Core_Http_LogStream_SafeWriteToFile_System_String_System_String___}

Safely writes the specified lines to the specified file path.

```csharp
public static bool SafeWriteToFile(string filePath, string[] lines)
```

### Parameters

`filePath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The path to the file where the lines will be written.

`lines` [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]

The lines to write to the file.

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if the operation was successful, otherwise [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).

### Remarks

Calls to these file helper methods for the same normalized full path are serialized within the current process. Synchronous and asynchronous overloads share the same per-file lock, while calls for different files can run concurrently. Access is not coordinated across processes.

## SafeWriteToFile(string, string[], Encoding) {#Sisk_Core_Http_LogStream_SafeWriteToFile_System_String_System_String___System_Text_Encoding_}

Safely writes the specified lines to the specified file path.

```csharp
public static bool SafeWriteToFile(string filePath, string[] lines, Encoding encoding)
```

### Parameters

`filePath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The path to the file where the lines will be written.

`lines` [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]

The lines to write to the file.

`encoding` [Encoding](https://learn.microsoft.com/dotnet/api/system.text.encoding)

The encoding to use when writing the lines.

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if the operation was successful, otherwise [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).

### Remarks

Calls to these file helper methods for the same normalized full path are serialized within the current process. Synchronous and asynchronous overloads share the same per-file lock, while calls for different files can run concurrently. Access is not coordinated across processes.
