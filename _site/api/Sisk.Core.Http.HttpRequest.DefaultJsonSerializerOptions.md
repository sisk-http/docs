# HttpRequest.DefaultJsonSerializerOptions

Kind: Property  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.DefaultJsonSerializerOptions.html

## DefaultJsonSerializerOptions {#Sisk_Core_Http_HttpRequest_DefaultJsonSerializerOptions}

Gets or sets the default options used for JSON serialization.

```csharp
public static JsonSerializerOptions? DefaultJsonSerializerOptions { get; set; }
```

### Property Value

[JsonSerializerOptions](https://learn.microsoft.com/dotnet/api/system.text.json.jsonserializeroptions)?

### Remarks

These options are used by default when serializing or deserializing JSON data through [GetJsonContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetJsonContent.md),
unless custom options are provided. See [JsonSerializerOptions](https://learn.microsoft.com/dotnet/api/system.text.json.jsonserializeroptions) 
for more information on available options.
