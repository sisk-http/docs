# HttpRequest.GetJsonContentAsync<T>

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetJsonContentAsync.html

## GetJsonContentAsync&lt;T>(JsonTypeInfo&lt;T>, CancellationToken) {#Sisk_Core_Http_HttpRequest_GetJsonContentAsync__1_System_Text_Json_Serialization_Metadata_JsonTypeInfo___0__System_Threading_CancellationToken_}

Asynchronously deserializes the request body into an object of type `T` using the provided [JsonTypeInfo](https://learn.microsoft.com/dotnet/api/system.text.json.serialization.metadata.jsontypeinfo).

```csharp
public ValueTask<T?> GetJsonContentAsync<T>(JsonTypeInfo<T> typeInfo, CancellationToken cancellation = default)
```

### Parameters

`typeInfo` [JsonTypeInfo](https://learn.microsoft.com/dotnet/api/system.text.json.serialization.metadata.jsontypeinfo\-1)<T\>

The [JsonTypeInfo](https://learn.microsoft.com/dotnet/api/system.text.json.serialization.metadata.jsontypeinfo) to use for deserialization.

`cancellation` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

A [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken) to cancel the asynchronous operation.

### Returns

[ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask\-1)<T?\>

A [ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask) that represents the asynchronous deserialization operation.

### Type Parameters

`T` 

The type of the object to deserialize into.

## GetJsonContentAsync&lt;T>(JsonSerializerOptions?, CancellationToken) {#Sisk_Core_Http_HttpRequest_GetJsonContentAsync__1_System_Text_Json_JsonSerializerOptions_System_Threading_CancellationToken_}

Asynchronously deserializes the request body into an object of type `T` using the provided [JsonSerializerOptions](https://learn.microsoft.com/dotnet/api/system.text.json.jsonserializeroptions).

```csharp
[RequiresDynamicCode("JSON deserialization without a type info may require types that cannot be statically analyzed.")]
[RequiresUnreferencedCode("JSON deserialization without a type info may require types that cannot be statically analyzed.")]
public ValueTask<T?> GetJsonContentAsync<T>(JsonSerializerOptions? jsonOptions, CancellationToken cancellation = default)
```

### Parameters

`jsonOptions` [JsonSerializerOptions](https://learn.microsoft.com/dotnet/api/system.text.json.jsonserializeroptions)?

The [JsonSerializerOptions](https://learn.microsoft.com/dotnet/api/system.text.json.jsonserializeroptions) to use for deserialization.

`cancellation` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

A [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken) to cancel the asynchronous operation.

### Returns

[ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask\-1)<T?\>

A [ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask) that represents the asynchronous deserialization operation.

### Type Parameters

`T` 

The type of the object to deserialize into.

## GetJsonContentAsync&lt;T>(CancellationToken) {#Sisk_Core_Http_HttpRequest_GetJsonContentAsync__1_System_Threading_CancellationToken_}

Asynchronously deserializes the request body into an object of type `T` using the default [JsonSerializerOptions](https://learn.microsoft.com/dotnet/api/system.text.json.jsonserializeroptions).

```csharp
[RequiresDynamicCode("JSON deserialization without a type info may require types that cannot be statically analyzed.")]
[RequiresUnreferencedCode("JSON deserialization without a type info may require types that cannot be statically analyzed.")]
public ValueTask<T?> GetJsonContentAsync<T>(CancellationToken cancellation = default)
```

### Parameters

`cancellation` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

A [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken) to cancel the asynchronous operation.

### Returns

[ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask\-1)<T?\>

A [ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask) that represents the asynchronous deserialization operation.

### Type Parameters

`T` 

The type of the object to deserialize into.
