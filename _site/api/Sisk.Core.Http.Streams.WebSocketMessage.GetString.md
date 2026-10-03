# WebSocketMessage.GetString

Kind: Method  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.WebSocketMessage.GetString.html

## GetString(Encoding) {#Sisk_Core_Http_Streams_WebSocketMessage_GetString_System_Text_Encoding_}

Reads the message bytes as string using the specified encoding.

```csharp
public string GetString(Encoding encoding)
```

### Parameters

`encoding` [Encoding](https://learn.microsoft.com/dotnet/api/system.text.encoding)

The encoding which will be used to decode the message.

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)

## GetString() {#Sisk_Core_Http_Streams_WebSocketMessage_GetString}

Reads the message bytes as string using the HTTP request encoding.

```csharp
public string GetString()
```

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)
