# HttpResponseExtensions.WithHeaders<THttpResponse>

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithHeaders.html

## WithHeaders&lt;THttpResponse>(THttpResponse, IDictionary&lt;string, string?>) {#Sisk_Core_Http_HttpResponseExtensions_WithHeaders__1___0_System_Collections_Generic_IDictionary_System_String_System_String__}

Adds multiple headers to the HTTP response from a dictionary.

```csharp
public static THttpResponse WithHeaders<THttpResponse>(this THttpResponse response, IDictionary<string, string?> headers) where THttpResponse : notnull, HttpResponse
```

### Parameters

`response` THttpResponse

`headers` [IDictionary](https://learn.microsoft.com/dotnet/api/system.collections.generic.idictionary\-2)<[string](https://learn.microsoft.com/dotnet/api/system.string), [string](https://learn.microsoft.com/dotnet/api/system.string)?\>

A dictionary of header names and their values.

### Returns

 THttpResponse

The modified HTTP response.

### Type Parameters

`THttpResponse` 

## WithHeaders&lt;THttpResponse>(THttpResponse, StringKeyStoreCollection) {#Sisk_Core_Http_HttpResponseExtensions_WithHeaders__1___0_Sisk_Core_Entity_StringKeyStoreCollection_}

Adds multiple headers to the HTTP response from a [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md).

```csharp
public static THttpResponse WithHeaders<THttpResponse>(this THttpResponse response, StringKeyStoreCollection headers) where THttpResponse : notnull, HttpResponse
```

### Parameters

`response` THttpResponse

`headers` [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md)

A [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) of header names and their values.

### Returns

 THttpResponse

The modified HTTP response.

### Type Parameters

`THttpResponse`
