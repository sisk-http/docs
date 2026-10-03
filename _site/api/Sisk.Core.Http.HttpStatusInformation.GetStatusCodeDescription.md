# HttpStatusInformation.GetStatusCodeDescription

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpStatusInformation.GetStatusCodeDescription.html

## GetStatusCodeDescription(int) {#Sisk_Core_Http_HttpStatusInformation_GetStatusCodeDescription_System_Int32_}

Gets the description of the specified HTTP status code.

```csharp
public static string GetStatusCodeDescription(int statusCode)
```

### Parameters

`statusCode` [int](https://learn.microsoft.com/dotnet/api/system.int32)

The HTTP status code.

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)

The description of the HTTP status code.

## GetStatusCodeDescription(HttpStatusCode) {#Sisk_Core_Http_HttpStatusInformation_GetStatusCodeDescription_System_Net_HttpStatusCode_}

Gets the description of the specified HTTP status code.

```csharp
public static string GetStatusCodeDescription(HttpStatusCode statusCode)
```

### Parameters

`statusCode` [HttpStatusCode](https://learn.microsoft.com/dotnet/api/system.net.httpstatuscode)

The [HttpStatusCode](https://learn.microsoft.com/dotnet/api/system.net.httpstatuscode) value.

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)

The description of the HTTP status code.
