# DefaultMessagePage.CreateMessageHtml

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.DefaultMessagePage.CreateMessageHtml.html

## CreateMessageHtml(string, string) {#Sisk_Core_Http_DefaultMessagePage_CreateMessageHtml_System_String_System_String_}

Creates an static default page with given header and description.

```csharp
public string CreateMessageHtml(string firstHeader, string description)
```

### Parameters

`firstHeader` [string](https://learn.microsoft.com/dotnet/api/system.string)

The static page header text.

`description` [string](https://learn.microsoft.com/dotnet/api/system.string)

The static page description text.

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)

## CreateMessageHtml(in HttpStatusInformation, string) {#Sisk_Core_Http_DefaultMessagePage_CreateMessageHtml_Sisk_Core_Http_HttpStatusInformation__System_String_}

Creates an static default page with given status code and description.

```csharp
public HttpResponse CreateMessageHtml(in HttpStatusInformation status, string longDescription)
```

### Parameters

`status` [HttpStatusInformation](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpStatusInformation.md)

The static page status code.

`longDescription` [string](https://learn.microsoft.com/dotnet/api/system.string)

The static page description text.

### Returns

[HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md)
