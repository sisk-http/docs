# DefaultMessagePage.Instance

Kind: Property  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.DefaultMessagePage.Instance.html

## Instance {#Sisk_Core_Http_DefaultMessagePage_Instance}

Gets the singleton instance of the default message page.

```csharp
public static DefaultMessagePage Instance { get; }
```

### Property Value

[DefaultMessagePage](https://docs.sisk-framework.org/api/Sisk.Core.Http.DefaultMessagePage.md)

### Remarks

Use this property to access a shared, pre-configured instance of [DefaultMessagePage](https://docs.sisk-framework.org/api/Sisk.Core.Http.DefaultMessagePage.md). This instance is thread-safe and intended for scenarios where a standard message
            page is required without customization.
