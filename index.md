# Welcome!

Welcome to the Sisk Framework. The project was initially created to explore the capabilities of using the native .NET HttpListener and gradually evolved into a more commercially oriented project as I started applying it to personal and even commercial projects.

### What is Sisk?

Sisk is a web development framework that is lightweight, agnostic, easy, simple, and robust. Its core idea is to create a service that runs on the internet and follows the pattern you define. Moreover, Sisk is a framework that adapts to how you want it to work, not the other way around.

Due to its explicit nature, its behavior is predictable. The main differentiator from ASP.NET is that Sisk can be up and running in very few lines of code, avoiding unnecessary configurations, and requiring the minimum setup to get your server working. Additionally, it does not demand any additional .NET SDK packages to develop, as the base package of .NET 6 is sufficient to start your development with Sisk.

Sisk's philosophy should be restricted to simplicity and provide all the basic tools that the web makes possible for building cloud applications, but not specific or proprietary technologies from other companies. However, the Sisk environment must allow for implementations of these technologies, whether proprietary or not, to be used, worked on and supported within the framework. Furthermore, the term "framework" refers to the concentration of methods, tools and libraries that make Sisk a complete web development ecosystem. Contributions must follow this philosophy, and mainly, maintain a readable, maintainable code that anyone with basic understanding can read, maintain and compile the code.

Sisk has an strict policy of transparency in it's code. All technologies used to build Sisk **must** be open source, traceable, maintainable and compilable, so that anyone can edit, view and create their own Sisk.

### What is Sisk for?

You can create Restful applications, gRPC, Websockets, file servers, GraphQL, Entity Framework, and more - basically whatever you want. Sisk is an extremely modular and sustainable framework. Furthermore, its current development is intense, and there's much more to be added to Sisk, but the focus is to keep it a simple, easy-to-maintain, and enjoyable framework for developers to start projects of any size.

Sisk was also been tested in low-performance environments, like machines with less than 1GB of RAM, handling over 20.000 requests per second. The code, from arrival on the server to the response, is extremely concise, with very few steps before reaching the client.

One of the pillars of developing with Sisk is compatibility with any machine that supports .NET, including those that do not require Native AOT. Some additional implementations are also provided to the Sisk ecosystem, such as porting projects to other machines with configuration files, a view-engine based on LISP, among others, served with packages beyond the Sisk core package. By design, Sisk is built to work with routers, but don't worry, you are not obligated to use them. Sisk will provide you with all the necessary infrastructure to create a secure application that doesn't obfuscate your code.

There's no need for excessive ceremony, fluff, or spending hours on boring documentation. Sisk is simple and elegant in its syntax, facilitating the development of fast and complex systems.

### But why not just use ASP.NET?

ASP.NET is an great and well-established web framework, and many features present in Sisk were inspired by it. However, Sisk focuses on simpler and more performant development, eliminating the need for installing additional components in your system, project, editor, etc. Sisk was designed to be straightforward and robust, enabling the creation of anything you desire.

Moreover, its development model allows you to choose how you want your development to be. You handle requests in a simple, efficient, explicit, and fast manner. Knowledge and understanding of HTTP are required if you want to do everything manually, and even then, Sisk can greatly simplify things with all the functions it provides in its core package.

Getting started with Sisk is easy. Those who already have experience with web development typically learn Sisk in one or two days. The Sisk documentation can help a lot with this. This is not just a specification, but a complete manual, with examples and support.

You can get started with Sisk here.

Let's [get started with Sisk](/docs/getting-started).