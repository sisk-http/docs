# 原生 AOT 支持

在 .NET 7 中，[原生 AOT](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/) 被引入，这是一种 .NET 编译模式，允许您在任何支持的平台上导出准备好的二进制文件，而无需在目标机器上安装 .NET 运行时。

使用原生 AOT，您的代码被编译为本机代码，并且已经包含了执行所需的一切。Sisk 从 0.9.1 版本开始尝试使用此功能，并通过提供定义动态路由的功能而不影响编译的警告消息来改进对原生 AOT 的支持。

Sisk 使用反射来获取将从类型和对象定义的方法。此外，Sisk 使用反射来获取诸如 `RequestHandlerAttribute` 之类的属性，这些属性从类型初始化。为了正常工作，AOT 编译使用修剪，其中动态类型应指定将在最终程序集中使用什么。

考虑以下示例，它是一个调用 RequestHandler 的路由。

```cs
[Route(RouteMethod.Get, "/", LogMode = LogOutput.None)]
[RequestHandler(typeof(MyRequestHandler))]
static HttpResponse IndexPage(HttpRequest request)
{
    HttpResponse htmlResponse = new HttpResponse();
    htmlResponse.Content = new StringContent("Hello, world!", System.Text.Encoding.UTF8, "text/plain");
    return htmlResponse;
}
```

此 RequestHandler 在运行时动态调用，并且此调用必须被分段，并且此分段必须被显式地。

为了更好地理解编译器将从 `MyRequestHandler` 中保留什么内容以便在最终编译中使用：

- 公共属性；
- 公共和私有字段；
- 公共和私有构造函数；
- 公共和私有方法_;

您在 RequestHandler 中的任何内容如果不在上述列表中，都将被编译器删除。

请记住，您在应用程序中使用的所有其他组件、类和包都应与 AOT 修剪兼容，否则您的代码将无法按预期运行。另外，Sisk 将不会让您如果想要构建一个性能优先的东西。

您可以在官方的 [Microsoft 文档](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/) 中阅读更多关于原生 AOT 和其工作原理的信息。