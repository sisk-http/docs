# UrlBuilder

Kind: Class  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.html

Provides a way to build URLs by adding segments, queries, and other components.

```csharp
public sealed class UrlBuilder
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [UrlBuilder\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.-ctor.md#Sisk_Core_Helpers_UrlBuilder__ctor) | Initializes a new instance of the [UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md) class. |
| [UrlBuilder\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.-ctor.md#Sisk_Core_Helpers_UrlBuilder__ctor_System_String_) | Initializes a new instance of the [UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md) class from a URI string. |

## Properties

| Name | Description |
| --- | --- |
| [Authority](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.Authority.md#Sisk_Core_Helpers_UrlBuilder_Authority) | Gets or sets the authority part of the URL. |
| [Fragment](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.Fragment.md#Sisk_Core_Helpers_UrlBuilder_Fragment) | Gets or sets the fragment part of the URL. |
| [NormalizeSeparators](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.NormalizeSeparators.md#Sisk_Core_Helpers_UrlBuilder_NormalizeSeparators) | Gets or sets a value indicating whether to normalize separators in the URL. |
| [PathSeparator](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.PathSeparator.md#Sisk_Core_Helpers_UrlBuilder_PathSeparator) | Gets or sets the character used as the path separator. |
| [Query](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.Query.md#Sisk_Core_Helpers_UrlBuilder_Query) | Gets the query parameters as an array of key-value pairs. |
| [Scheme](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.Scheme.md#Sisk_Core_Helpers_UrlBuilder_Scheme) | Gets or sets the scheme part of the URL. |
| [Segments](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.Segments.md#Sisk_Core_Helpers_UrlBuilder_Segments) | Gets the URL segments as an array of strings. |
| [Uri](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.Uri.md#Sisk_Core_Helpers_UrlBuilder_Uri) | Gets the constructed URL as a [Uri](https://learn.microsoft.com/dotnet/api/system.uri) object. |
| [Url](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.Url.md#Sisk_Core_Helpers_UrlBuilder_Url) | Gets the constructed URL as a string. |

## Methods

| Name | Description |
| --- | --- |
| [AddQuery\(string, string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.AddQuery.md#Sisk_Core_Helpers_UrlBuilder_AddQuery_System_String_System_String_) | Adds a query parameter to the URL. |
| [AddQuery\(string, params string?\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.AddQuery.md#Sisk_Core_Helpers_UrlBuilder_AddQuery_System_String_System_String___) | Adds a query parameter with multiple values to the URL. |
| [AddQueryIf\(string, string?\[\], bool\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.AddQueryIf.md#Sisk_Core_Helpers_UrlBuilder_AddQueryIf_System_String_System_String___System_Boolean_) | Conditionally adds a query parameter with multiple values to the URL. |
| [AddSegment\(string?\[\], bool\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.AddSegment.md#Sisk_Core_Helpers_UrlBuilder_AddSegment_System_String___System_Boolean_) | Adds one or more segments to the URL path. |
| [AddSegment\(params string?\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.AddSegment.md#Sisk_Core_Helpers_UrlBuilder_AddSegment_System_String___) | Adds one or more segments to the URL path. |
| [AddSegment\(string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.AddSegment.md#Sisk_Core_Helpers_UrlBuilder_AddSegment_System_String_) | Adds a single segment to the URL path. |
| [AddSegmentIf\(string, bool\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.AddSegmentIf.md#Sisk_Core_Helpers_UrlBuilder_AddSegmentIf_System_String_System_Boolean_) | Conditionally adds a segment to the URL path. |
| [ClearQuery\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.ClearQuery.md#Sisk_Core_Helpers_UrlBuilder_ClearQuery) | Clears all query parameters from the URL. |
| [ClearSegments\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.ClearSegments.md#Sisk_Core_Helpers_UrlBuilder_ClearSegments) | Clears all segments from the URL path. |
| [FromCombined\(params string\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.FromCombined.md#Sisk_Core_Helpers_UrlBuilder_FromCombined_System_String___) | Creates a new [UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md) instance from one or more combined URLs and/or paths. |
| [Pop\(int\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.Pop.md#Sisk_Core_Helpers_UrlBuilder_Pop_System_Int32_) | Removes the last segment(s) from the URL path. |
| [RemoveQuery\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.RemoveQuery.md#Sisk_Core_Helpers_UrlBuilder_RemoveQuery_System_String_) | Removes a query parameter from the URL. |
| [SetAuthority\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.SetAuthority.md#Sisk_Core_Helpers_UrlBuilder_SetAuthority_System_String_) | Sets the authority part of the URL. |
| [SetFragment\(string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.SetFragment.md#Sisk_Core_Helpers_UrlBuilder_SetFragment_System_String_) | Sets the fragment part of the URL. |
| [SetPathSeparator\(char\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.SetPathSeparator.md#Sisk_Core_Helpers_UrlBuilder_SetPathSeparator_System_Char_) | Sets the path separator character. |
| [SetQuery\(string, params string?\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.SetQuery.md#Sisk_Core_Helpers_UrlBuilder_SetQuery_System_String_System_String___) | Sets (removes and adds) a query parameter with multiple values in the URL. |
| [SetQuery\(string, string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.SetQuery.md#Sisk_Core_Helpers_UrlBuilder_SetQuery_System_String_System_String_) | Sets (removes and adds) a query parameter with a single value in the URL. |
| [SetQueryIf\(bool, string, string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.SetQueryIf.md#Sisk_Core_Helpers_UrlBuilder_SetQueryIf_System_Boolean_System_String_System_String_) | Conditionally sets (removes and adds) a query parameter with a single value in the URL. |
| [SetQueryIf\(bool, string, params string?\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.SetQueryIf.md#Sisk_Core_Helpers_UrlBuilder_SetQueryIf_System_Boolean_System_String_System_String___) | Conditionally sets (removes and adds) a query parameter with multiple values in the URL. |
| [SetScheme\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.SetScheme.md#Sisk_Core_Helpers_UrlBuilder_SetScheme_System_String_) | Sets the scheme part of the URL. |
| [ToString\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.ToString.md#Sisk_Core_Helpers_UrlBuilder_ToString) |  |
| [TransformSegments\(Func<string, string?\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.TransformSegments.md#Sisk_Core_Helpers_UrlBuilder_TransformSegments_System_Func_System_String_System_String__) | Applies a transformation function to each URL segment. |
