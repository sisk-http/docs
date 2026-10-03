---
title: "Http-Server-Handler"
linkTitle: "HTTP-Server-Handler"
weight: 40
aliases:
  - "/docs/de/advanced/http-server-handlers.html"
sourceHash: "5276d37696621afa"
---

In Sisk Version 0.16 haben wir die Klasse `HttpServerHandler` eingeführt, die das übergeordnete Verhalten von Sisk erweitern und zusätzliche Ereignis‑Handler bereitstellen soll, wie das Verarbeiten von Http‑Anfragen, Routern, Kontextbeuteln und mehr.

Die Klasse bündelt Ereignisse, die während der Lebensdauer des gesamten HTTP‑Servers und auch einer einzelnen Anfrage auftreten. Das Http‑Protokoll besitzt keine Sitzungen, sodass es nicht möglich ist, Informationen von einer Anfrage zur nächsten zu erhalten. Sisk bietet derzeit eine Möglichkeit, Sitzungen, Kontexte, Datenbankverbindungen und andere nützliche Provider zu implementieren, um Ihre Arbeit zu erleichtern.

Bitte beachten Sie [diese Seite](/api/Sisk.Core.Http.Handlers.HttpServerHandler), um zu lesen, wann jedes Ereignis ausgelöst wird und welchen Zweck es hat. Sie können auch den [Lebenszyklus einer HTTP‑Anfrage](/docs/advanced/request-lifecycle) einsehen, um zu verstehen, was bei einer Anfrage passiert und wo Ereignisse ausgelöst werden. Der HTTP‑Server erlaubt die gleichzeitige Verwendung mehrerer Handler. Jeder Ereignisaufruf ist synchron, das heißt, er blockiert den aktuellen Thread für jede Anfrage oder jeden Kontext, bis alle mit dieser Funktion verbundenen Handler ausgeführt und abgeschlossen sind.

Im Gegensatz zu RequestHandlers können sie nicht auf bestimmte Routen‑Gruppen oder einzelne Routen angewendet werden. Stattdessen gelten sie für den gesamten HTTP‑Server. Sie können Bedingungen innerhalb Ihres Http‑Server‑Handlers festlegen. Darüber hinaus wird für jede Sisk‑Anwendung ein Singleton jedes `HttpServerHandler` definiert, sodass pro `HttpServerHandler` nur eine Instanz existiert.

Ein praktisches Beispiel für die Verwendung von `HttpServerHandler` ist das automatische Freigeben einer Datenbankverbindung am Ende einer Anfrage.

```cs
// DatabaseConnectionHandler.cs

public class DatabaseConnectionHandler : HttpServerHandler
{
    protected override void OnHttpRequestClose(HttpServerExecutionResult result)
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
    public static DbContext GetDbContext(this HttpRequest request)
    {
        return request.Bag.GetOrAdd(() => new DbContext());
    }
}
```

Mit dem obigen Code ermöglicht die Erweiterung `GetDbContext` das Erstellen eines Verbindungs‑Contexts direkt aus dem `HttpRequest`‑Objekt. Eine nicht freigegebene Verbindung kann beim Betrieb mit der Datenbank Probleme verursachen, daher wird sie in `OnHttpRequestClose` beendet.

Sie können einen Handler auf einem Http‑Server in Ihrem Builder oder direkt mit [HttpServer.RegisterHandler](/api/Sisk.Core.Http.HttpServer.RegisterHandler) registrieren.

```cs
// Program.cs

class Program
{
    static void Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseHandler<DatabaseConnectionHandler>()
            .Build();

        app.Router.MapInstance(new UserController());
        app.Start();
    }
}
```

Damit kann die Klasse `UsersController` den Datenbank‑Context wie folgt nutzen:

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

        int userId = request.RouteParameters["id"].GetInteger();
        var user = db.Users.FirstOrDefault(u => u.Id == userId);

        return JsonOk(user);
    }

    [RoutePost]
    public async Task<HttpResponse> Create(HttpRequest request)
    {
        var db = request.GetDbContext();
        var user = await request.GetJsonContentAsync<User>();

        ArgumentNullException.ThrowIfNull(user);

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return JsonMessage("User added.");
    }
}
```

Der obige Code verwendet Methoden wie `JsonOk` und `JsonMessage`, die in `ApiController` eingebaut sind und von einem `RouterController` erben:

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

Entwickler können mit dieser Klasse Sitzungen, Kontexte und Datenbankverbindungen implementieren. Der bereitgestellte Code zeigt ein praktisches Beispiel mit dem `DatabaseConnectionHandler`, das die Freigabe der Datenbankverbindung am Ende jeder Anfrage automatisiert.

Die Integration ist unkompliziert, da die Handler während der Server‑Einrichtung registriert werden. Die Klasse `HttpServerHandler` bietet ein leistungsstarkes Werkzeugset zum Ressourcen‑Management und zur Erweiterung des Sisk‑Verhaltens in HTTP‑Anwendungen.
