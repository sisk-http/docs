# LogStreamEntry.Equals

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.Equals.html

## Equals(object?) {#Sisk_Core_Http_LogStreamEntry_Equals_System_Object_}

Determines whether this log entry is equal to the specified object.

```csharp
public override bool Equals(object? obj)
```

### Parameters

`obj` [object](https://learn.microsoft.com/dotnet/api/system.object)?

The object to compare with this log entry.

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if the specified object is a [LogStreamEntry](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.md) and has the same hash code; otherwise, [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).

## Equals(LogStreamEntry) {#Sisk_Core_Http_LogStreamEntry_Equals_Sisk_Core_Http_LogStreamEntry_}

Determines whether this log entry is equal to another log entry.

```csharp
public bool Equals(LogStreamEntry other)
```

### Parameters

`other` [LogStreamEntry](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.md)

The log entry to compare with this log entry.

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if the two log entries have the same hash code; otherwise, [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).
