# Native AOT Support

[.NET Native AOT](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/) allows the publication of native .NET applications that are self-sufficient and do not require the .NET runtime installed on the target host. Additionally, Native AOT provides benefits such as:

- Much smaller applications
- Significantly faster initialization
- Lower memory consumption

Sisk Framework, by its explicit nature, allows the use of Native AOT for almost all it's features without requiring rework on the source code to adapt it to Native AOT.

## Not supported features

However, Sisk does use reflection, albeit minimal, for some features. The features mentioned below may be partially available or entirely unavailable during native code execution:

- [Auto-scanning of modules](/api/Sisk.Core.Routing.Router.AutoScanModules) of the router: this resource scans the types embedded in the executing Assembly and registers the types that are [router modules](/docs/fundamentals/routing). This resource requires types that can be excluded during assembly trimming.

All other features are compatible with AOT in Sisk. It is common to find one or another method that gives an AOT warning, but the same, if not mentioned here, has an overload that indicates the passing of a type, parameter, or type information that assists the AOT compiler in compiling the object.