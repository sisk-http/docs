# Basic Auth

Das Basic-Auth-Paket fügt einen Anfrage-Handler hinzu, der in der Lage ist, das Basic-Authentifizierungsschema in Ihrer Sisk-Anwendung mit sehr wenig Konfiguration und Aufwand zu handhaben.
Basic-HTTP-Authentifizierung ist eine minimale Eingabeform der Authentifizierung von Anfragen durch eine Benutzer-ID und ein Passwort, wobei die Sitzung ausschließlich vom Client gesteuert wird und es keine Authentifizierungs- oder Zugriffstoken gibt.

![Basic Auth](/assets/img/basic-auth.svg)

Erfahren Sie mehr über das Basic-Authentifizierungsschema in der [MDN-Spezifikation](https://developer.mozilla.org/pt-BR/docs/de/Web/HTTP/Authentication).

## Installation

Um loszulegen, installieren Sie das Sisk.BasicAuth-Paket in Ihrem Projekt:

    > dotnet add package Sisk.BasicAuth

Sie können mehrere Möglichkeiten zur Installation in Ihrem Projekt im [Nuget-Repository](https://www.nuget.org/packages/Sisk.BasicAuth/0.15.0) anzeigen.

## Erstellen Ihres Auth-Handlers

Sie können das Authentifizierungsschema für ein ganzes Modul oder für einzelne Routen steuern. Dazu schreiben wir zunächst unseren ersten Basic-Authentifizierungs-Handler.

Im folgenden Beispiel wird eine Verbindung zur Datenbank hergestellt, es wird überprüft, ob der Benutzer existiert und ob das Passwort gültig ist, und anschließend wird der Benutzer im Kontextbeutel gespeichert.

```cs
public class UserAuthHandler : BasicAuthenticateRequestHandler
{
    public UserAuthHandler() : base()
    {
        Realm = "Um diese Seite zu betreten, geben Sie bitte Ihre Anmeldeinformationen ein.";
    }

    public override HttpResponse? OnValidating(BasicAuthenticationCredentials credentials, HttpContext context)
    {
        DbContext db = new DbContext();

        // In diesem Fall verwenden wir die E-Mail-Adresse als Benutzer-ID-Feld, also suchen wir nach einem Benutzer mit seiner E-Mail-Adresse.
        User? user = db.Users.FirstOrDefault(u => u.Email == credentials.UserId);
        if (user == null)
        {
            return base.CreateUnauthorizedResponse("Entschuldigung! Kein Benutzer mit dieser E-Mail-Adresse gefunden.");
        }

        // Überprüft, ob das Passwort für diesen Benutzer gültig ist.
        if (!user.ValidatePassword(credentials.Password))
        {
            return base.CreateUnauthorizedResponse("Ungültige Anmeldeinformationen.");
        }

        // Fügt den angemeldeten Benutzer zum HTTP-Kontext hinzu
        // und setzt die Ausführung fort
        context.Bag.Add("loggedUser", user);
        return null;
    }
}
```

Assoziieren Sie also diesen Anfrage-Handler mit unserer Route oder Klasse.

```cs
public class UsersController
{
    [RouteGet("/")]
    [RequestHandler(typeof(UserAuthHandler))]
    public string Index(HttpRequest request)
    {
        User loggedUser = request.Bag.Get<User>();
        return $"Hallo, {loggedUser.Name}!";
    }
}
```

Oder mit der [RouterModule](/api/Sisk.Core.Routing.RouterModule)-Klasse:

```cs
public class UsersController : RouterModule
{
    public ClientModule()
    {
        // Alle Routen in dieser Klasse werden von
        // UserAuthHandler gehandhabt.
        base.HasRequestHandler(new UserAuthHandler());
    }
    
    [RouteGet("/")]
    public string Index(HttpRequest request)
    {
        User loggedUser = request.Bag.Get<User>();
        return $"Hallo, {loggedUser.Name}!";
    }
}
```

## Hinweise

Die primäre Verantwortung für die Basic-Authentifizierung liegt auf der Client-Seite. Speicherung, Cache-Steuerung und Verschlüsselung werden alle lokal auf dem Client gehandhabt. Der Server erhält nur die Anmeldeinformationen und überprüft, ob der Zugriff erlaubt ist oder nicht.

Beachten Sie, dass diese Methode nicht eine der sichersten ist, da sie eine erhebliche Verantwortung auf den Client legt, der schwierig zu verfolgen und die Sicherheit seiner Anmeldeinformationen zu gewährleisten ist. Darüber hinaus ist es wichtig, dass Passwörter in einem sicheren Verbindungskontext (SSL) übertragen werden, da sie keine inhärente Verschlüsselung haben. Eine kurze Abfangung der Header einer Anfrage kann die Zugriffsanmeldeinformationen Ihres Benutzers offenlegen.

Wählen Sie für Produktionsanwendungen robustere Authentifizierungslösungen und vermeiden Sie die Verwendung von zu vielen vorgefertigten Komponenten, da diese möglicherweise nicht an die Bedürfnisse Ihres Projekts angepasst sind und es letztendlich Sicherheitsrisiken aussetzen.