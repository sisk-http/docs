.NET 7 引入了 [Native AOT](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/)，这是一种 .NET 编译模式，允许您在任何受支持的平台上导出已就绪的二进制文件，而无需在目标机器上安装 .NET 运行时。

使用 Native AOT，您的代码将被编译为本地代码，并且已经包含了执行所需的一切。Sisk 自 0.9.1 版本开始就一直在尝试此功能，它通过定义应用程序动态路由的功能来改进对 Native AOT 的支持，而不会影响编译过程并发出警告消息。

Sisk 使用反射来获取将从类型和对象定义的方法。此外，Sisk 还使用反射来初始化诸如 `RequestHandlerAttribute` 等属性，这些属性是从类型初始化的。为了正常工作，AOT 编译使用修剪，其中应该指定动态类型将在最终程序集中使用哪些。

考虑以下示例，这是一个调用 RequestHandler 的路由。

```cs
[Route(RouteMethod.Get, "/", LogMode = LogOutput.None)]
[RequestHandler(typeof(MyRequestHandler)) ]
static HttpResponse IndexPage(HttpRequest request)
{
    HttpResponse htmlResponse = new HttpResponse();
    htmlResponse.Content = new StringContent("Hello, world!", System.Text.Encoding.UTF8, "text/plain");
    return htmlResponse;
}
```

此 RequestHandler 在运行时动态调用，并且此调用必须被分割，并且此分割必须是显式的。

为了更好地理解编译器将从 `MyRequestHandler` 中考虑哪些内容应该保留在最终编译中：

- 公共属性；
- 公共和私有字段；
- 公共和私有构造函数；
- 公共和私有方法；

编译器将删除您在 RequestHandler 中未提及的所有内容。

请记住，您在应用程序中使用的所有其他组件、类和程序包都应与 AOT 修剪兼容，否则您的代码将无法按预期工作。顺便说一句，如果想要构建性能至关重要的项目，Sisk 不会让您失望。

您可以在官方 [Microsoft 文档](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/) 中阅读有关 Native AOT 及其工作方式的更多信息。



