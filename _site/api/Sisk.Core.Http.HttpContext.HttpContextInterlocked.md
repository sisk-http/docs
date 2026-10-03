# HttpContext.HttpContextInterlocked

Kind: Class  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.HttpContextInterlocked.html

Provides atomic operations for numeric values stored by name in an [RequestBag](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.RequestBag.md).

```csharp
public sealed class HttpContext.HttpContextInterlocked
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpContext.HttpContextInterlocked](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.HttpContextInterlocked.md)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Remarks

Values created by this type are stored as [Double](https://learn.microsoft.com/dotnet/api/system.double). Operations are atomic with respect to
other operations performed by this instance, but not with respect to direct access to the context bag.

## Methods

| Name | Description |
| --- | --- |
| [Add\(string, int\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.HttpContextInterlocked.Add.md#Sisk_Core_Http_HttpContext_HttpContextInterlocked_Add_System_String_System_Int32_) | Atomically adds an integer to the value associated with the specified name. |
| [Add\(string, double\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.HttpContextInterlocked.Add.md#Sisk_Core_Http_HttpContext_HttpContextInterlocked_Add_System_String_System_Double_) | Atomically adds a number to the value associated with the specified name. |
| [Add\(string, int\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.HttpContextInterlocked.Add.md#Sisk_Core_Http_HttpContext_HttpContextInterlocked_Add_System_String_System_Int32_) | Atomically adds an integer to the value associated with the specified name. |
| [Add\(string, double\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.HttpContextInterlocked.Add.md#Sisk_Core_Http_HttpContext_HttpContextInterlocked_Add_System_String_System_Double_) | Atomically adds a number to the value associated with the specified name. |
| [CompareExchange\(string, long, long, long\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.HttpContextInterlocked.CompareExchange.md#Sisk_Core_Http_HttpContext_HttpContextInterlocked_CompareExchange_System_String_System_Int64_System_Int64_System_Int64_) | Atomically compares the value associated with the specified name and replaces it when equal. |
| [CompareExchange\(string, double, double, double\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.HttpContextInterlocked.CompareExchange.md#Sisk_Core_Http_HttpContext_HttpContextInterlocked_CompareExchange_System_String_System_Double_System_Double_System_Double_) | Atomically compares the value associated with the specified name and replaces it when equal. |
| [CompareExchange\(string, long, long, long\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.HttpContextInterlocked.CompareExchange.md#Sisk_Core_Http_HttpContext_HttpContextInterlocked_CompareExchange_System_String_System_Int64_System_Int64_System_Int64_) | Atomically compares the value associated with the specified name and replaces it when equal. |
| [CompareExchange\(string, double, double, double\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.HttpContextInterlocked.CompareExchange.md#Sisk_Core_Http_HttpContext_HttpContextInterlocked_CompareExchange_System_String_System_Double_System_Double_System_Double_) | Atomically compares the value associated with the specified name and replaces it when equal. |
| [Exchange\(string, long\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.HttpContextInterlocked.Exchange.md#Sisk_Core_Http_HttpContext_HttpContextInterlocked_Exchange_System_String_System_Int64_) | Atomically replaces the value associated with the specified name. |
| [Exchange\(string, double\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.HttpContextInterlocked.Exchange.md#Sisk_Core_Http_HttpContext_HttpContextInterlocked_Exchange_System_String_System_Double_) | Atomically replaces the value associated with the specified name. |
| [Exchange\(string, long\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.HttpContextInterlocked.Exchange.md#Sisk_Core_Http_HttpContext_HttpContextInterlocked_Exchange_System_String_System_Int64_) | Atomically replaces the value associated with the specified name. |
| [Exchange\(string, double\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.HttpContextInterlocked.Exchange.md#Sisk_Core_Http_HttpContext_HttpContextInterlocked_Exchange_System_String_System_Double_) | Atomically replaces the value associated with the specified name. |
| [Inspect\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.HttpContextInterlocked.Inspect.md#Sisk_Core_Http_HttpContext_HttpContextInterlocked_Inspect_System_String_) | Atomically reads the value associated with the specified name. |
| [Inspect\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.HttpContextInterlocked.Inspect.md#Sisk_Core_Http_HttpContext_HttpContextInterlocked_Inspect_System_String_) | Atomically reads the value associated with the specified name. |
