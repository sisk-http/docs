# Basic Auth

Das Basic Auth-Paket fügt einen Request-Handler hinzu, der das Basic-Authentication-Schema in Ihrer Sisk-Anwendung mit sehr wenig Konfiguration und Aufwand verarbeiten kann. Basic HTTP Authentication ist eine minimalistische Eingabemaske zur Authentifizierung von Anfragen mittels Benutzer-ID und Passwort, wobei die Sitzung ausschließlich vom Client gesteuert wird und keine Authentifizierungs- oder Zugriffstoken vorhanden sind.

![Basic Auth](/assets/img/basic-auth.svg)

Lesen Sie mehr über das Basic Authentication-Schema in der [MDN-Spezifikation](https://developer.mozilla.org/pt-BR/docs/de/Web/HTTP/Authentication).

## Installing

Um loszulegen, installieren Sie das Sisk.BasicAuth-Paket in Ihrem Projekt:

```bash
> dotnet add package Sisk.BasicAuth
```

Weitere Installationsmöglichkeiten finden Sie im [Nuget-Repository](https://www.nuget.org/packages/Sisk.BasicAuth/0.15.0).

## Creating your auth handler

Sie können das Authentifizierungsschema für ein ganzes Modul oder für einzelne Routen steuern. Dazu schreiben wir zunächst unseren ersten Basic Authentication-Handler.

Im folgenden Beispiel wird eine Verbindung zur Datenbank hergestellt, geprüft, ob der Benutzer existiert und ob das Passwort gültig ist, und anschließend der Benutzer im Kontext-Behälter gespeichert.

```cs
public class UserAuthHandler : BasicAuthenticateRequestHandler
{
    public UserAuthHandler() : base()
    {
        Realm = "Um diese Seite zu betreten, geben Sie bitte Ihre Zugangsdaten ein.";
    }

    public override HttpResponse? OnValidating(BasicAuthenticationCredentials credentials, HttpContext context)
    {
        DbContext db = new DbContext();

        // In diesem Fall verwenden wir die E‑Mail als Benutzer‑ID-Feld, daher suchen wir nach einem Benutzer anhand seiner E‑Mail.
        User? user = db.Users.FirstOrDefault(u => u.Email == credentials.UserId);
        if (user == null)
        {
            return base.CreateUnauthorizedResponse("Entschuldigung! Kein Benutzer mit dieser E‑Mail gefunden.");
        }

        // Prüft, ob das Passwort der Credentials für diesen Benutzer gültig ist.
        if (!user.ValidatePassword(credentials.Password))
        {
            return base.CreateUnauthorizedResponse("Ungültige Zugangsdaten.");
        }

        // Fügt den angemeldeten Benutzer dem HTTP‑Kontext hinzu
        // und setzt die Ausführung fort
        context.Bag.Add("loggedUser", user);
        return null;
    }
}
```

Verknüpfen Sie diesen Request-Handler einfach mit Ihrer Route oder Klasse.

```cs
public class UsersController
{
    [RouteGet("/")]
    [RequestHandler(typeof(UserAuthHandler))]
    public string Index(HttpRequest request)
    {
        User loggedUser = request.Bag.Get<User>();
        return $"Hello, {loggedUser.Name}!";
    }
}
```

Oder mithilfe der Klasse [RouterModule](/api/Sisk.Core.Routing.RouterModule):

```cs
public class UsersController : RouterModule
{
    public ClientModule()
    {
        // Alle Routen in dieser Klasse werden von
        // UserAuthHandler verarbeitet.
        base.HasRequestHandler(new UserAuthHandler());
    }
    
    [RouteGet("/")]
    public string Index(HttpRequest request)
    {
        User loggedUser = request.Bag.Get<User>();
        return $"Hello, {loggedUser.Name}!";
    }
}
```

## Remarks

Die Hauptverantwortung der Basic Authentication liegt beim Client. Speicherung, Cache‑Kontrolle und Verschlüsselung werden ausschließlich lokal auf dem Client gehandhabt. Der Server erhält lediglich die Credentials und prüft, ob der Zugriff erlaubt ist oder nicht.

Beachten Sie, dass diese Methode nicht die sicherste ist, da sie eine erhebliche Verantwortung auf den Client legt, was die Nachverfolgung und Aufrechterhaltung der Sicherheit der Credentials erschwert. Zudem ist es entscheidend, dass Passwörter in einem sicheren Verbindungs‑Kontext (SSL) übertragen werden, da sie keine inhärente Verschlüsselung besitzen. Eine kurze Abfangung in den Headern einer Anfrage kann die Zugangsdaten Ihres Benutzers preisgeben.

Setzen Sie auf robustere Authentifizierungslösungen für Produktionsanwendungen und vermeiden Sie die Verwendung zu vieler fertiger Komponenten, da diese möglicherweise nicht den Anforderungen Ihres Projekts entsprechen und es Sicherheitsrisiken aussetzen können.