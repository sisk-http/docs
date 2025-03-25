# Http-Server-Handler

In Sisk-Version 0.16 haben wir die `HttpServerHandler`-Klasse eingeführt, die darauf abzielt, das Gesamtverhalten von Sisk zu erweitern und zusätzliche Ereignishandler für Sisk bereitzustellen, wie z. B. das Handling von Http-Anfragen, Routern, Kontextbeuteln und mehr.

Die Klasse konzentriert sich auf Ereignisse, die während der Lebensdauer des gesamten HTTP-Servers und auch einer Anfrage auftreten. Das Http-Protokoll hat keine Sitzungen, und daher ist es nicht möglich, Informationen von einer Anfrage zur nächsten zu erhalten. Sisk bietet derzeit eine Möglichkeit, Sitzungen, Kontexte, Datenbankverbindungen und andere nützliche Anbieter zu implementieren, um Ihre Arbeit zu unterstützen.

Bitte besuchen Sie [diese Seite](/api/Sisk.Core.Http.Handlers.HttpServerHandler), um zu lesen, wo jedes Ereignis ausgelöst wird und welchen Zweck es hat. Sie können auch den [Lebenszyklus einer HTTP-Anfrage](/v1/advanced/request-lifecycle) anzeigen, um zu verstehen, was mit einer Anfrage passiert und wo Ereignisse ausgelöst werden. Der HTTP-Server ermöglicht es Ihnen, mehrere Handler gleichzeitig zu verwenden. Jeder Ereignisanruf ist synchron, d. h. er blockiert den aktuellen Thread für jede Anfrage oder jeden Kontext, bis alle zugehörigen Handler ausgeführt und abgeschlossen sind.

Im Gegensatz zu RequestHandlern können sie nicht auf bestimmte Routengruppen oder spezifische Routen angewendet werden. Stattdessen werden sie auf den gesamten HTTP-Server angewendet. Sie können Bedingungen innerhalb Ihres Http-Server-Handlers anwenden. Darüber hinaus werden Singleton-Instanzen jedes HttpServerHandlers für jede Sisk-Anwendung definiert, so dass nur eine Instanz pro `HttpServerHandler` definiert ist.

Ein praktisches Beispiel für die Verwendung von HttpServerHandler ist die automatische Entsorgung einer Datenbankverbindung am Ende der Anfrage.

```cs
// DatabaseConnectionHandler.cs

public class DatabaseConnectionHandler : HttpServerHandler
{
    public override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        var requestBag = result.Request.Context.RequestBag;

        // prüft, ob die Anfrage einen DbContext definiert hat
        // in ihrem Kontextbeutel
        if (requestBag.IsSet<DbContext>())
        {
            var db = requestBag.Get<DbContext>();
            db.Dispose();
        }
    }
}

public static class DatabaseConnectionHandlerExtensions
{
    // ermöglicht es dem Benutzer, einen DbContext aus einer Http-Anfrage zu erstellen
    // und ihn in seinem Kontextbeutel zu speichern
    public static DbContext GetDbContext(this HttpRequest request)
    {
        var db = new DbContext();
        return request.SetContextBag<DbContext>(db);
    }
}
```

Mit dem obigen Code ermöglicht die `GetDbContext`-Erweiterung die Erstellung eines Verbindungskontexts direkt aus dem HttpRequest-Objekt. Eine nicht entsorgte Verbindung kann Probleme beim Ausführen mit der Datenbank verursachen, daher wird sie in `OnHttpRequestClose` beendet.

Sie können einen Handler auf einem Http-Server in Ihrem Builder oder direkt mit [HttpServer.RegisterHandler](/api/Sisk.Core.Http.HttpServer.RegisterHandler) registrieren.

```cs
// Program.cs

class Program
{
    static void Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseHandler<DatabaseConnectionHandler>()
            .Build();

        app.Router.SetObject(new UserController());
        app.Start();
    }
}
```

Mit diesem Code kann die `UsersController`-Klasse den Datenbankkontext wie folgt verwenden:

```cs
// UserController.cs

[RoutePrefix("/users")]
public class UserController : ApiController
{
    [RouteGet()]
    public async Task<HttpResponse> List(HttpRequest request)
    {
        var db = request.GetDbContext();
        var users = db.Users.ToArray();

        return JsonOk(users);
    }

    [RouteGet("<id>")]
    public async Task<HttpResponse> View(HttpRequest request)
    {
        var db = request.GetDbContext();

        var userId = request.GetQueryValue<int>("id");
        var user = db.Users.FirstOrDefault(u => u.Id == userId);

        return JsonOk(user);
    }

    [RoutePost]
    public async Task<HttpResponse> Create(HttpRequest request)
    {
        var db = request.GetDbContext();
        var user = JsonSerializer.Deserialize<User>(request.Body);

        ArgumentNullException.ThrowIfNull(user);

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return JsonMessage("Benutzer hinzugefügt.");
    }
}
```

Der obige Code verwendet Methoden wie `JsonOk` und `JsonMessage`, die in `ApiController` integriert sind, die von `RouterController` abgeleitet ist:

```cs
// ApiController.cs

public class ApiController : RouterModule
{
    public HttpResponse JsonOk(object value)
    {
        return new HttpResponse(200)
            .WithContent(JsonContent.Create(value, null, new JsonSerializerOptions()
            {
                PropertyNameCaseInsensitive = true
            }));
    }

    public HttpResponse JsonMessage(string message, int statusCode = 200)
    {
        return new HttpResponse(statusCode)
            .WithContent(JsonContent.Create(new
            {
                Message = message
            }));
    }
}
```

Entwickler können Sitzungen, Kontexte und Datenbankverbindungen mithilfe dieser Klasse implementieren. Der bereitgestellte Code zeigt ein praktisches Beispiel mit dem DatabaseConnectionHandler, der die automatische Entsorgung einer Datenbankverbindung am Ende jeder Anfrage ermöglicht.

Die Integration ist einfach, mit Handlern, die während der Servereinrichtung registriert werden. Die HttpServerHandler-Klasse bietet ein leistungsfähiges Werkzeugset für die Verwaltung von Ressourcen und die Erweiterung des Sisk-Verhaltens in HTTP-Anwendungen.