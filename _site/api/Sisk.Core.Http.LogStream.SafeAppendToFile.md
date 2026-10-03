# LogStream.SafeAppendToFile

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeAppendToFile.html

## SafeAppendToFile(string, string?) {#Sisk_Core_Http_LogStream_SafeAppendToFile_System_String_System_String_}

Safely appends the specified string to the specified file path.

```csharp
public static bool SafeAppendToFile(string filePath, string? text)
```

### Parameters

`filePath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The path to the file where the string will be appended.

`text` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The string to append to the file. Can be [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if the operation was successful, otherwise [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).

### Remarks

Calls to these file helper methods for the same normalized full path are serialized within the current process. Synchronous and asynchronous overloads share the same per-file lock, while calls for different files can run concurrently. Access is not coordinated across processes.

## SafeAppendToFile(string, string?, Encoding) {#Sisk_Core_Http_LogStream_SafeAppendToFile_System_String_System_String_System_Text_Encoding_}

Safely appends the specified string to the specified file path.

```csharp
public static bool SafeAppendToFile(string filePath, string? text, Encoding encoding)
```

### Parameters

`filePath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The path to the file where the string will be appended.

`text` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The string to append to the file. Can be [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

`encoding` [Encoding](https://learn.microsoft.com/dotnet/api/system.text.encoding)

The encoding to use when appending the string.

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if the operation was successful, otherwise [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).

### Remarks

Calls to these file helper methods for the same normalized full path are serialized within the current process. Synchronous and asynchronous overloads share the same per-file lock, while calls for different files can run concurrently. Access is not coordinated across processes.

## SafeAppendToFile(string, string[]) {#Sisk_Core_Http_LogStream_SafeAppendToFile_System_String_System_String___}

Safely appends the specified lines to the specified file path.

```csharp
public static bool SafeAppendToFile(string filePath, string[] lines)
```

### Parameters

`filePath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The path to the file where the lines will be appended.

`lines` [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]

The lines to append to the file.

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if the operation was successful, otherwise [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).

### Remarks

Calls to these file helper methods for the same normalized full path are serialized within the current process. Synchronous and asynchronous overloads share the same per-file lock, while calls for different files can run concurrently. Access is not coordinated across processes.

## SafeAppendToFile(string, string[], Encoding) {#Sisk_Core_Http_LogStream_SafeAppendToFile_System_String_System_String___System_Text_Encoding_}

Safely appends the specified lines to the specified file path.

```csharp
public static bool SafeAppendToFile(string filePath, string[] lines, Encoding encoding)
```

### Parameters

`filePath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The path to the file where the lines will be appended.

`lines` [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]

The lines to append to the file.

`encoding` [Encoding](https://learn.microsoft.com/dotnet/api/system.text.encoding)

The encoding to use when appending the lines.

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if the operation was successful, otherwise [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).

### Remarks

Calls to these file helper methods for the same normalized full path are serialized within the current process. Synchronous and asynchronous overloads share the same per-file lock, while calls for different files can run concurrently. Access is not coordinated across processes.
