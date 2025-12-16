# 本机 AOT 支持

[.NET Native AOT](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/) 允许发布本机 .NET 应用程序，这些应用程序是自给自足的，不需要在目标主机上安装 .NET 运行时。此外，Native AOT 提供诸如：

- 应用程序大小大大减小
- 初始化速度大大提高
- 内存消耗降低

Sisk Framework 本质上允许几乎所有功能使用 Native AOT，而无需对源代码进行改造以适应 Native AOT。

## 不支持的功能

然而，Sisk Framework 使用了反射，尽管很少，为某些功能提供支持。下面提到的功能可能在本机代码执行期间部分可用或完全不可用：

- [自动扫描路由器模块](/api/Sisk.Core.Routing.Router.AutoScanModules)：此资源扫描执行程序集中的嵌入类型，并注册符合 [路由器模块](/docs/cn/fundamentals/routing) 的类型。此资源需要可以在程序集修剪期间排除的类型。

Sisk 中的所有其他功能都与 AOT 兼容。通常会找到一个或多个方法，这些方法会产生 AOT 警告，但相同的方法（如果未在此处提及）具有重载，指示传递类型、参数或类型信息，以帮助 AOT 编译器编译对象。