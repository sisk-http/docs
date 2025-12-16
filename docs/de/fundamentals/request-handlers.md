# Anfragebehandlung

Anfragebehandler, auch bekannt als "Middleware", sind Funktionen, die vor oder nach der Ausführung einer Anfrage auf dem Router ausgeführt werden. Sie können pro Route oder pro Router definiert werden.

Es gibt zwei Arten von Anfragebehandlern:

- **BeforeResponse**: definiert, dass der Anfragebehandler vor dem Aufruf der Router-Aktion ausgeführt wird.
- **AfterResponse**: definiert, dass der Anfragebehandler nach dem Aufruf der Router-Aktion ausgeführt wird. Das Senden einer HTTP-Antwort in diesem Kontext überschreibt die Router-Aktionsantwort.

Beide Anfragebehandler können die tatsächliche Router-Rückruf-Funktion überschreiben. Außerdem können Anfragebehandler nützlich sein, um eine Anfrage zu validieren, wie z.B. Authentifizierung, Inhalt oder andere Informationen, wie z.B. das Speichern von Informationen, Protokollen oder anderen Schritten, die vor oder nach einer Antwort durchgeführt werden können.

![](/assets/img/requesthandlers1.png)

Auf diese Weise kann ein Anfragebehandler die gesamte Ausführung unterbrechen und eine Antwort zurückgeben, bevor der Zyklus beendet ist, und alles andere im Prozess verwerfen.

Beispiel: Nehmen wir an, dass ein Benutzer-Authentifizierungsanfragebehandler den Benutzer nicht authentifiziert. Er wird den Anfragelebenszyklus nicht fortsetzen und hängen bleiben. Wenn dies im Anfragebehandler an Position zwei passiert, werden die dritte und folgenden nicht ausgewertet.

![](/assets/img/requesthandlers2.png)

## Erstellen eines Anfragebehandlers

Um einen Anfragebehandler zu erstellen, können wir eine Klasse erstellen, die die [IRequestHandler](/api/Sisk.Core.Routing.IRequestHandler)-Schnittstelle erbt, in diesem Format:

<div class="script-header">
    <span>
        Middleware/AuthenticateUserRequestHandler.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
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
            // Rückgabe eines HttpResponse-Objekts bedeutet, dass diese Antwort die benachbarten Antworten überschreibt.
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}
```

Im obigen Beispiel haben wir angegeben, dass, wenn der `Authorization`-Header in der Anfrage vorhanden ist, er fortgesetzt werden soll und der nächste Anfragebehandler oder die Router-Rückruf-Funktion aufgerufen werden soll, je nachdem, was zuerst kommt. Wenn ein Anfragebehandler nach der Antwort durch seine Eigenschaft [ExecutionMode](/api/Sisk.Core.Routing.IRequestHandler.ExecutionMode) ausgeführt wird und einen nicht-leeren Wert zurückgibt, überschreibt er die Router-Antwort.

Wenn ein Anfragebehandler `null` zurückgibt, bedeutet dies, dass die Anfrage fortgesetzt werden muss und das nächste Objekt aufgerufen werden muss oder der Zyklus mit der Router-Antwort enden muss.

## Zuordnen eines Anfragebehandlers zu einer einzelnen Route

Sie können einen oder mehrere Anfragebehandler für eine Route definieren.

<div class="script-header">
    <span>
        Router.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
mainRouter.SetRoute(RouteMethod.Get, "/", IndexPage, "", new IRequestHandler[]
{
    new AuthenticateUserRequestHandler(),     // vorheriger Anfragebehandler
    new ValidateJsonContentRequestHandler(),  // vorheriger Anfragebehandler
    //                                        -- Methode IndexPage wird hier ausgeführt
    new WriteToLogRequestHandler()            // nachfolgender Anfragebehandler
});
```

Oder durch Erstellen eines [Route](/api/Sisk.Core.Routing.Route)-Objekts:

<div class="script-header">
    <span>
        Router.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
Route indexRoute = new Route(RouteMethod.Get, "/", "", IndexPage, null);
indexRoute.RequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
mainRouter.SetRoute(indexRoute);
```

## Zuordnen eines Anfragebehandlers zu einem Router

Sie können einen globalen Anfragebehandler definieren, der auf allen Routen eines Routers ausgeführt wird.

<div class="script-header">
    <span>
        Router.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
```

## Zuordnen eines Anfragebehandlers zu einem Attribut

Sie können einen Anfragebehandler auf einem Methoden-Attribut zusammen mit einem Route-Attribut definieren.

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class MyController
{
    [RouteGet("/")]
    [RequestHandler<AuthenticateUserRequestHandler>]
    static HttpResponse Index(HttpRequest request)
    {
        return new HttpResponse() {
            Content = new StringContent("Hallo Welt!")
        };
    }
}
```

Beachten Sie, dass es notwendig ist, den gewünschten Anfragebehandlertyp und nicht eine Objektinstanz zu übergeben. Auf diese Weise wird der Anfragebehandler durch den Router-Parser instanziert. Sie können Argumente im Klassenkonstruktor mit der [ConstructorArguments](/api/Sisk.Core.Routing.RequestHandlerAttribute.ConstructorArguments)-Eigenschaft übergeben.

Beispiel:

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RequestHandler<AuthenticateUserRequestHandler>("arg1", 123, ...)]
public HttpResponse Index(HttpRequest request)
{
    return res = new HttpResponse() {
        Content = new StringContent("Hallo Welt!")
    };
}
```

Sie können auch Ihr eigenes Attribut erstellen, das RequestHandler implementiert:

<div class="script-header">
    <span>
        Middleware/Attributes/AuthenticateAttribute.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class AuthenticateAttribute : RequestHandlerAttribute
{
    public AuthenticateAttribute() : base(typeof(AuthenticateUserRequestHandler), ConstructorArguments = new object?[] { "arg1", 123, ... })
    {
        ;
    }
}
```

Und es wie folgt verwenden:

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[Authenticate]
static HttpResponse Index(HttpRequest request)
{
    return res = new HttpResponse() {
        Content = new StringContent("Hallo Welt!")
    };
}
```

## Umgehen eines globalen Anfragebehandlers

Nachdem Sie einen globalen Anfragebehandler auf einer Route definiert haben, können Sie diesen Anfragebehandler auf bestimmten Routen ignorieren.

<div class="script-header">
    <span>
        Router.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
var myRequestHandler = new AuthenticateUserRequestHandler();
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    myRequestHandler
};

mainRouter.SetRoute(new Route(RouteMethod.Get, "/", "Meine Route", IndexPage, null)
{
    BypassGlobalRequestHandlers = new IRequestHandler[]
    {
        myRequestHandler,                    // ok: dieselbe Instanz wie in den globalen Anfragebehandlern
        new AuthenticateUserRequestHandler() // falsch: wird den globalen Anfragebehandler nicht überspringen
    }
});
```

> [!HINWEIS]
> Wenn Sie einen Anfragebehandler umgehen, müssen Sie dieselbe Referenz verwenden, die Sie zuvor instanziert haben, um ihn zu überspringen. Das Erstellen einer anderen Anfragebehandler-Instanz wird den globalen Anfragebehandler nicht überspringen, da sich die Referenz ändert. Beachten Sie, dass Sie dieselbe Anfragebehandler-Referenz verwenden müssen, die in beiden GlobalRequestHandlers und BypassGlobalRequestHandlers verwendet wird.