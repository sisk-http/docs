# Working with SSL

Working with SSL for development may be necessary when working in contexts that require security, such as most web development scenarios. Sisk operates on top of HttpListener, which does not support native HTTPS, only HTTP. However, there are workarounds that allow you to work with SSL in Sisk. See them below:

## Through IIS on Windows

- Available on: Windows
- Effort: medium

If you are on Windows, you can use IIS to enable SSL on your HTTP server. For this to work, it is advisable that you follow [this tutorial](/docs/registering-namespace) beforehand if you want your application to be listening on a host other than "localhost."

For this to work, you must install IIS through Windows features. IIS is available for free to Windows and Windows Server users. To configure SSL in your application, have the SSL certificate ready, even if it is self-signed. Next, you can see [how to set up SSL on IIS 7 or higher](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis).

## Through mitmproxy

- Available on: Linux, macOS, Windows
- Effort: easy

**mitmproxy** is an interception proxy tool that allows developers and security testers to inspect, modify, and record HTTP and HTTPS traffic between a client (such as a web browser) and a server. You can use the **mitmdump** utility to start an reverse SSL proxy between your client and your Sisk application.

1. Firstly, install the [mitmprxy](https://mitmproxy.org/) in your machine.
2. Start your Sisk application. For this example, we'll use the 8000 port as the insecure HTTP port.
3. Start the mitmproxy server to listen the secure port at 8001:

```sh
mitmdump --mode reverse:http://localhost:8000/ -p 8001
```

And you're ready to go! You can already your application through `https://localhost:8001/`. Your application does not need to be running for you to start `mitmdump`.

## Through Sisk.SslProxy package

- Available on: Linux, macOS, Windows
- Effort: easy

The Sisk.SslProxy package is a simple way to enable SSL on your Sisk application. However, it is an **extremely experimental** package. It may be unstable to work with this package, but you can be part of the small percentage of people who will contribute to making this package viable and stable. To get started, you can install the Sisk.SslProxy package with:

```sh
dotnet add package Sisk.SslProxy
```

> [!NOTE]
>
> You must enable "Enable pre-release packages" in the Visual Studio Package Manger to install Sisk.SslProxy.

Again, it is an experimental project, so don't even think about putting it into production.

At the moment, Sisk.SslProxy can handle most HTTP/1.1 features, including HTTP Continue, Chunked-Encoding, WebSockets, and SSE. Read more about SslProxy [here](/docs/extensions/ssl-proxy).