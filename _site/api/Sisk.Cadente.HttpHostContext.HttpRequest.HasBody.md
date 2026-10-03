# HttpRequest.HasBody

Kind: Property  
Namespace: `Sisk.Cadente`  
Assembly: `Sisk.Cadente.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.HttpRequest.HasBody.html

## HasBody {#Sisk_Cadente_HttpHostContext_HttpRequest_HasBody}

Gets a value indicating whether the request <b>may</b> have a message body.

```csharp
public bool HasBody { get; }
```

### Property Value

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

### Remarks

This property returns `true` if the content length is greater than zero or if the request uses chunked transfer encoding,
indicating that a body <b>may</b> be present. However, for chunked encoding, the actual content could still be empty even when this property returns true.
Use this property to determine whether it is necessary to attempt reading or processing the request body, but do not assume that a body is always present.

## HasBody {#Sisk_Cadente_HttpHostContext_HttpRequest_HasBody}

Gets a value indicating whether the request <b>may</b> have a message body.

```csharp
public bool HasBody { get; }
```

### Property Value

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

### Remarks

This property returns `true` if the content length is greater than zero or if the request uses chunked transfer encoding,
indicating that a body <b>may</b> be present. However, for chunked encoding, the actual content could still be empty even when this property returns true.
Use this property to determine whether it is necessary to attempt reading or processing the request body, but do not assume that a body is always present.
