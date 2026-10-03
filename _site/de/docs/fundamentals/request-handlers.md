# Anfrageverarbeitung

Source: https://docs.sisk-framework.org/de/docs/fundamentals/request-handlers.html

Request-Handler, auch als „Middlewares“ bezeichnet, sind Funktionen, die vor oder nach der Ausführung einer Anfrage im Router laufen. Sie können pro Route oder pro Router definiert werden.

Es gibt zwei Arten von Request-Handlern:

- **BeforeResponse**: definiert, dass der Request-Handler vor dem Aufruf der Router-Aktion ausgeführt wird.
- **AfterResponse**: definiert, dass der Request-Handler nach dem Aufruf der Router-Aktion ausgeführt wird. Das Senden einer HTTP-Antwort in diesem Kontext überschreibt die Antwort der Router-Aktion.

Beide Request-Handler können die eigentliche Rückgabe der Router-Callback-Funktion überschreiben. Übrigens können Request-Handler nützlich sein, um eine Anfrage zu validieren, z. B. Authentifizierung, Inhalt oder andere Informationen, wie das Speichern von Daten, Protokolle oder weitere Schritte, die vor oder nach einer Antwort durchgeführt werden können.

![](https://docs.sisk-framework.org/assets/img/requesthandlers1.png)

Auf diese Weise kann ein Request-Handler die gesamte Ausführung unterbrechen und eine Antwort zurückgeben, bevor der Zyklus abgeschlossen ist, wobei alles andere im Prozess verworfen wird.

Beispiel: Angenommen, ein Request-Handler zur Benutzer-Authentifizierung authentifiziert den Benutzer nicht. Er verhindert, dass der Anfrage-Lebenszyklus fortgesetzt wird, und lässt ihn hängen. Wenn dies im Request-Handler an Position zwei geschieht, werden der dritte und alle folgenden nicht mehr ausgewertet.

![](https://docs.sisk-framework.org/assets/img/requesthandlers2.png)

## Erstellen eines Request-Handlers

Um einen Request-Handler zu erstellen, können wir eine Klasse erzeugen, die das [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md)-Interface erbt, in folgendem Format:

```cs {title="Middleware/AuthenticateUserRequestHandler.cs"}
public class AuthenticateUserRequestHandler : IRequestHandler
{
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;

    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization != null)
        {
            // Rückgabe von null bedeutet, dass der Anfragezyklus fortgesetzt werden kann
            return null;
        }
        else
        {
            // Rückgabe eines HttpResponse-Objekts bedeutet, dass diese Antwort benachbarte Antworten überschreibt.
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}
```

Im obigen Beispiel haben wir angegeben, dass wenn der `Authorization`-Header in der Anfrage vorhanden ist, die Verarbeitung fortgesetzt werden soll und der nächste Request-Handler oder der Router-Callback aufgerufen wird, je nachdem, was als Nächstes kommt. Wird ein Request-Handler nach der Antwort ausgeführt, indem seine Eigenschaft [ExecutionMode](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.ExecutionMode.md) auf AfterResponse gesetzt ist und ein Nicht-Null-Wert zurückgegeben wird, überschreibt er die Antwort des Routers.

Immer wenn ein Request-Handler `null` zurückgibt, bedeutet das, dass die Anfrage fortgesetzt werden muss und das nächste Objekt aufgerufen wird bzw. der Zyklus mit der Antwort des Routers endet.

Wenn Sie von der integrierten Klasse [RequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RequestHandler.md) erben, können Sie `Next()` zurückgeben, um diese Absicht explizit zu machen:

```cs
public class AuthenticateUserRequestHandler : RequestHandler
{
    public override HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization is not null)
            return Next();

        return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
    }
}
```

Für Handler, die I/O benötigen, erben Sie von [AsyncRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.AsyncRequestHandler.md):

```cs
public class LoadUserRequestHandler : AsyncRequestHandler
{
    public override async Task<HttpResponse?> ExecuteAsync(HttpRequest request, HttpContext context)
    {
        var user = await UserRepository.FindAsync(request.Headers.Authorization, request.DisconnectToken);
        if (user is null)
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);

        request.Bag.Set(user);
        return Next();
    }
}
```

Kleine Inline-Handler können ebenfalls mit `RequestHandler.Create` oder `AsyncRequestHandler.Create` erstellt werden:

```cs
var requireJson = RequestHandler.Create((request, context) =>
{
    if (request.Headers.ContentType?.Contains("application/json") == true)
        return null;

    return new HttpResponse(System.Net.HttpStatusCode.UnsupportedMediaType);
});
```

## Zuordnen eines Request-Handlers zu einer einzelnen Route

Sie können einen oder mehrere Request-Handler für eine Route definieren.

```cs {title="Router.cs"}
mainRouter.Map(RouteMethod.Get, "/", IndexPage, new IRequestHandler[]
{
    new AuthenticateUserRequestHandler(),     // before request handler
    new ValidateJsonContentRequestHandler(),  // before request handler
    //                                        -- method IndexPage will be executed here
    new WriteToLogRequestHandler()            // after request handler
});
```

Oder ein [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md)-Objekt erstellen:

```cs {title="Router.cs"}
Route indexRoute = Route.Get("/", IndexPage);
indexRoute.RequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
mainRouter.Map(indexRoute);
```

## Zuordnen eines Request-Handlers zu einem Router

Sie können einen globalen Request-Handler definieren, der auf allen Routen eines Routers ausgeführt wird.

```cs {title="Router.cs"}
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
```

## Zuordnen eines Request-Handlers zu einem Attribut

Sie können einen Request-Handler als Method-Attribut zusammen mit einem Route-Attribut definieren.

```cs {title="Controller/MyController.cs"}
public class MyController
{
    [RouteGet("/")]
    [RequestHandler<AuthenticateUserRequestHandler>]
    static HttpResponse Index(HttpRequest request)
    {
        return new HttpResponse() {
            Content = new StringContent("Hello world!")
        };
    }
}
```

Beachten Sie, dass der gewünschte Request-Handler-Typ und nicht eine Objektinstanz übergeben werden muss. Auf diese Weise wird der Request-Handler vom Router-Parser instanziiert. Sie können Argumente im Klassenkonstruktor über die Eigenschaft [ConstructorArguments](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RequestHandlerAttribute.ConstructorArguments.md) übergeben.

Beispiel:

```cs {title="Controller/MyController.cs"}
[RequestHandler<AuthenticateUserRequestHandler>("arg1", 123, ...)]
public HttpResponse Index(HttpRequest request)
{
    return res = new HttpResponse() {
        Content = new StringContent("Hello world!")
    };
}
```

Sie können auch Ihr eigenes Attribut erstellen, das RequestHandler implementiert:

```cs {title="Middleware/Attributes/AuthenticateAttribute.cs"}
public class AuthenticateAttribute : RequestHandlerAttribute
{
    public AuthenticateAttribute() : base(typeof(AuthenticateUserRequestHandler), ConstructorArguments = new object?[] { "arg1", 123, ... })
    {
        ;
    }
}
```

Und verwenden Sie es wie folgt:

```cs {title="Controller/MyController.cs"}
[Authenticate]
static HttpResponse Index(HttpRequest request)
{
    return res = new HttpResponse() {
        Content = new StringContent("Hello world!")
    };
}
```

## Umgehen eines globalen Request-Handlers

Nachdem Sie einen globalen Request-Handler für eine Route definiert haben, können Sie diesen Request-Handler für bestimmte Routen ignorieren.

```cs {title="Router.cs"}
var myRequestHandler = new AuthenticateUserRequestHandler();
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    myRequestHandler
};

Route publicRoute = Route.Get("/", IndexPage);
publicRoute.Name = "My route";
publicRoute.BypassGlobalRequestHandlers = new IRequestHandler[]
{
    myRequestHandler,                    // ok: the same instance of what is in the global request handlers
    new AuthenticateUserRequestHandler() // wrong: will not skip the global request handler
};

mainRouter.Map(publicRoute);
```

> [!NOTE]
> Wenn Sie einen Request-Handler umgehen, müssen Sie dieselbe Referenz verwenden, die Sie zuvor instanziiert haben, um ihn zu überspringen. Das Erstellen einer anderen Request-Handler-Instanz wird den globalen Request-Handler nicht überspringen, da sich die Referenz ändert. Denken Sie daran, dieselbe Request-Handler-Referenz zu verwenden, die sowohl in GlobalRequestHandlers als auch in BypassGlobalRequestHandlers verwendet wird.
