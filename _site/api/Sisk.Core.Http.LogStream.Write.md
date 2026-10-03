# LogStream.Write

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.Write.html

## Write(string) {#Sisk_Core_Http_LogStream_Write_System_String_}

Writes a message to the log stream.

```csharp
public void Write(string message)
```

### Parameters

`message` [string](https://learn.microsoft.com/dotnet/api/system.string)

The message to write.

## Write(Exception) {#Sisk_Core_Http_LogStream_Write_System_Exception_}

Writes an exception to the log stream.

```csharp
public void Write(Exception exception)
```

### Parameters

`exception` [Exception](https://learn.microsoft.com/dotnet/api/system.exception)

The exception to write.

## Write(LogStreamEntry) {#Sisk_Core_Http_LogStream_Write_Sisk_Core_Http_LogStreamEntry_}

Writes a log entry to the log stream.

```csharp
public void Write(LogStreamEntry entry)
```

### Parameters

`entry` [LogStreamEntry](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.md)

The log entry to write.
