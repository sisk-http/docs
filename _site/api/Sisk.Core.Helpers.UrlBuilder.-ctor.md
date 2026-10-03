# UrlBuilder constructor

Kind: Constructor  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.-ctor.html

## UrlBuilder() {#Sisk_Core_Helpers_UrlBuilder__ctor}

Initializes a new instance of the [UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md) class.

```csharp
public UrlBuilder()
```

## UrlBuilder(string) {#Sisk_Core_Helpers_UrlBuilder__ctor_System_String_}

Initializes a new instance of the [UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md) class from a URI string.

```csharp
public UrlBuilder(string uri)
```

### Parameters

`uri` [string](https://learn.microsoft.com/dotnet/api/system.string)

The URI string to parse.

### Exceptions

[ArgumentException](https://learn.microsoft.com/dotnet/api/system.argumentexception)

Thrown if the provided string is not a valid absolute URI.
