# HttpResponseStreamManager.Write

Kind: Method  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpResponseStreamManager.Write.html

## Write(ReadOnlySpan&lt;byte>) {#Sisk_Core_Http_Streams_HttpResponseStreamManager_Write_System_ReadOnlySpan_System_Byte__}

Writes an sequence of bytes to the HTTP response stream.

```csharp
public void Write(ReadOnlySpan<byte> buffer)
```

### Parameters

`buffer` [ReadOnlySpan](https://learn.microsoft.com/dotnet/api/system.readonlyspan\-1)<[byte](https://learn.microsoft.com/dotnet/api/system.byte)\>

The read only memory that includes the buffer which will be written to the HTTP response.

## Write(byte[]) {#Sisk_Core_Http_Streams_HttpResponseStreamManager_Write_System_Byte___}

Writes an sequence of bytes to the HTTP response stream.

```csharp
public void Write(byte[] buffer)
```

### Parameters

`buffer` [byte](https://learn.microsoft.com/dotnet/api/system.byte)\[\]

The byte array that includes the buffer which will be written to the HTTP response.

## Write(byte[], int, int) {#Sisk_Core_Http_Streams_HttpResponseStreamManager_Write_System_Byte___System_Int32_System_Int32_}

Writes a range of bytes from a byte array to the HTTP response stream.

```csharp
public void Write(byte[] buffer, int offset, int count)
```

### Parameters

`buffer` [byte](https://learn.microsoft.com/dotnet/api/system.byte)\[\]

The byte array to write data from.

`offset` [int](https://learn.microsoft.com/dotnet/api/system.int32)

The zero-based byte offset in `buffer` at which to begin writing bytes.

`count` [int](https://learn.microsoft.com/dotnet/api/system.int32)

The maximum number of bytes to write.
