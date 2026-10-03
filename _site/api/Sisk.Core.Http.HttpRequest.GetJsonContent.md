# HttpRequest.GetJsonContent<T>

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetJsonContent.html

## GetJsonContent&lt;T>(JsonTypeInfo&lt;T>) {#Sisk_Core_Http_HttpRequest_GetJsonContent__1_System_Text_Json_Serialization_Metadata_JsonTypeInfo___0__}

Deserializes the request body into an object of type `T` using the provided [JsonTypeInfo](https://learn.microsoft.com/dotnet/api/system.text.json.serialization.metadata.jsontypeinfo).

```csharp
public T? GetJsonContent<T>(JsonTypeInfo<T> typeInfo)
```

### Parameters

`typeInfo` [JsonTypeInfo](https://learn.microsoft.com/dotnet/api/system.text.json.serialization.metadata.jsontypeinfo\-1)<T\>

The [JsonTypeInfo](https://learn.microsoft.com/dotnet/api/system.text.json.serialization.metadata.jsontypeinfo) to use for deserialization.

### Returns

 T?

The deserialized object, or `null` if the request body is empty.

### Type Parameters

`T` 

The type of the object to deserialize into.

## GetJsonContent&lt;T>(JsonSerializerOptions?) {#Sisk_Core_Http_HttpRequest_GetJsonContent__1_System_Text_Json_JsonSerializerOptions_}

Deserializes the request body into an object of type `T` using the provided [JsonSerializerOptions](https://learn.microsoft.com/dotnet/api/system.text.json.jsonserializeroptions).

```csharp
[RequiresDynamicCode("JSON deserialization without a type info may require types that cannot be statically analyzed.")]
[RequiresUnreferencedCode("JSON deserialization without a type info may require types that cannot be statically analyzed.")]
public T? GetJsonContent<T>(JsonSerializerOptions? jsonOptions = null)
```

### Parameters

`jsonOptions` [JsonSerializerOptions](https://learn.microsoft.com/dotnet/api/system.text.json.jsonserializeroptions)?

The [JsonSerializerOptions](https://learn.microsoft.com/dotnet/api/system.text.json.jsonserializeroptions) to use for deserialization.

### Returns

 T?

The deserialized object, or `null` if the request body is empty.

### Type Parameters

`T` 

The type of the object to deserialize into.

## GetJsonContent&lt;T>() {#Sisk_Core_Http_HttpRequest_GetJsonContent__1}

Deserializes the request body into an object of type `T` using the default
[JsonSerializerOptions](https://learn.microsoft.com/dotnet/api/system.text.json.jsonserializeroptions) from [DefaultJsonSerializerOptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.DefaultJsonSerializerOptions.md).

```csharp
[RequiresDynamicCode("JSON deserialization without a type info may require types that cannot be statically analyzed.")]
[RequiresUnreferencedCode("JSON deserialization without a type info may require types that cannot be statically analyzed.")]
public T? GetJsonContent<T>()
```

### Returns

 T?

The deserialized object, or `null` if the request body is empty.

### Type Parameters

`T` 

The type of the object to deserialize into.
