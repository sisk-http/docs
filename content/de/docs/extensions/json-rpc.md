---
title: "JSON-RPC-Erweiterung"
linkTitle: "JSON-RPC"
weight: 20
aliases:
  - "/docs/de/extensions/json-rpc.html"
sourceHash: "8c2b3c5223e980ce"
---

Sisk verfügt über ein experimentelles Modul für eine [JSON-RPC 2.0](https://www.jsonrpc.org/specification) API, das es Ihnen ermöglicht, noch einfachere Anwendungen zu erstellen. Diese Erweiterung implementiert strikt die JSON-RPC 2.0 Transport‑Schnittstelle und bietet Transport über HTTP‑GET-, POST‑Anfragen sowie Web‑Sockets mit Sisk an.

Sie können die Erweiterung über NuGet mit dem untenstehenden Befehl installieren. Beachten Sie, dass Sie in experimentellen/Beta‑Versionen die Option aktivieren sollten, nach Vorab‑Release‑Paketen in Visual Studio zu suchen.

```bash
dotnet add package Sisk.JsonRpc
```

## Transport‑Schnittstelle

JSON‑RPC ist ein zustandsloses, asynchrones Remote‑Procedure‑Call‑(RPC‑)Protokoll, das JSON für die Datenkommunikation verwendet. Eine JSON‑RPC‑Anfrage wird typischerweise durch eine ID identifiziert, und eine Antwort wird mit derselben ID zurückgeliefert, die in der Anfrage gesendet wurde. Nicht alle Anfragen erfordern eine Antwort; solche werden „Benachrichtigungen“ genannt.

Die [JSON‑RPC‑2.0‑Spezifikation](https://www.jsonrpc.org/specification) erklärt im Detail, wie der Transport funktioniert. Dieser Transport ist unabhängig davon, wo er eingesetzt wird. Sisk implementiert dieses Protokoll über HTTP und folgt den Vorgaben von [JSON‑RPC über HTTP](https://www.jsonrpc.org/historical/json-rpc-over-http.html), die GET‑Anfragen teilweise unterstützen, POST‑Anfragen jedoch vollständig. Web‑Sockets werden ebenfalls unterstützt und ermöglichen asynchrone Nachrichtenkommunikation.

Eine JSON‑RPC‑Anfrage sieht ähnlich aus wie:

```json
{
    "jsonrpc": "2.0",
    "method": "Sum",
    "params": [1, 2, 4],
    "id": 1
}
```

Und eine erfolgreiche Antwort sieht ähnlich aus wie:

```json
{
    "jsonrpc": "2.0",
    "result": 7,
    "id": 1
}
```

## JSON-RPC‑Methoden

Das folgende Beispiel zeigt, wie man mit Sisk eine JSON‑RPC‑API erstellt. Eine Klasse für mathematische Operationen führt die Remote‑Operationen aus und liefert die serialisierte Antwort an den Client.

```csharp {title="Program.cs"}
using var app = HttpServer.CreateBuilder(port: 5555)
    .UseJsonRPC((sender, args) =>
    {
        // fügt alle mit WebMethod markierten Methoden dem JSON‑RPC‑Handler hinzu
        args.Handler.Methods.AddMethodsFromType(new MathOperations());
        
        // mappt die /service‑Route, um JSON‑RPC‑POST‑ und GET‑Anfragen zu bearbeiten
        args.Router.MapPost("/service", args.Handler.Transport.HttpPost);
        args.Router.MapGet("/service", args.Handler.Transport.HttpGet);
        
        // mappt den JSON‑RPC‑WebSocket‑Transport auf GET /ws
        args.Router.MapGet("/ws", args.Handler.Transport.WebSocket);
    })
    .Build();

await app.StartAsync();
```

```csharp {title="MathOperations.cs"}
public class MathOperations
{
    [WebMethod]
    public float Sum(float a, float b)
    {
        return a + b;
    }
    
    [WebMethod]
    public double Sqrt(float a)
    {
        return Math.Sqrt(a);
    }
}
```

Das obige Beispiel mappt die Methoden `Sum` und `Sqrt` zum JSON‑RPC‑Handler, und diese Methoden stehen unter `GET /service`, `POST /service` und `GET /ws` zur Verfügung. Methodennamen sind nicht case‑sensitiv.

Methodenparameter werden automatisch in ihre jeweiligen Typen deserialisiert. Die Verwendung einer Anfrage mit benannten Parametern wird ebenfalls unterstützt. Die JSON‑Serialisierung erfolgt durch die Bibliothek [LightJson](https://github.com/CypherPotato/LightJson). Wenn ein Typ nicht korrekt deserialisiert wird, können Sie einen spezifischen [JSON‑Konverter](https://github.com/CypherPotato/LightJson?tab=readme-ov-file#json-converters) für diesen Typ erstellen und ihn mit [JsonRpcHandler.JsonSerializerOptions](/api/Sisk.JsonRPC.JsonRpcHandler.JsonSerializerOptions) verknüpfen.

Sie können das rohe Objekt `$.params` aus der JSON‑RPC‑Anfrage auch direkt in Ihrer Methode erhalten.

```csharp {title="MathOperations.cs"}
[WebMethod]
public float Sum(JsonArray|JsonObject @params)
{
    ...
}
```

Damit dies funktioniert, muss `@params` der **einzige** Parameter Ihrer Methode sein und exakt den Namen `params` tragen (in C# ist das `@` notwendig, um diesen Parameternamen zu escapen).

Die Deserialisierung von Parametern erfolgt sowohl für benannte Objekte als auch für positionsbasierte Arrays. Zum Beispiel kann die folgende Methode aus der Ferne mit beiden Anfragen aufgerufen werden:

```csharp
[WebMethod]
public float AddUserToStore(string apiKey, User user, UserStore store)
{
    ...
}
```

Bei einem Array muss die Reihenfolge der Parameter eingehalten werden.

```json
{
    "jsonrpc": "2.0",
    "method": "AddUserToStore",
    "params": [
        "1234567890",
        {
            "name": "John Doe",
            "email": "john@example.com"
        },
        {
            "name": "My Store"
        }
    ],
    "id": 1

}
```

## Anpassen des Serialisierers

Sie können den JSON‑Serializer in der Eigenschaft [JsonRpcHandler.JsonSerializerOptions](/api/Sisk.JsonRPC.JsonRpcHandler.JsonSerializerOptions) anpassen. In dieser Eigenschaft können Sie die Verwendung von [JSON5](https://json5.org/) zum Deserialisieren von Nachrichten aktivieren. Obwohl es keine Konformität zu JSON‑RPC 2.0 darstellt, ist JSON5 eine Erweiterung von JSON, die eine menschenlesbarere und klarere Schreibweise ermöglicht.

```csharp {title="Program.cs"}
using var host = HttpServer.CreateBuilder ( 5556 )
    .UseJsonRPC ( ( o, e ) => {

        // verwendet einen bereinigten Namensvergleich. Dieser Vergleich vergleicht nur Buchstaben
        // und Ziffern in einem Namen und verwirft andere Symbole. Beispiel:
        // foo_bar10 == FooBar10
        e.Handler.JsonSerializerOptions.PropertyNameComparer = new JsonSanitizedComparer ();

        // aktiviert JSON5 für den JSON‑Interpreter. Auch wenn dies aktiviert ist, bleibt reines JSON weiterhin erlaubt
        e.Handler.JsonSerializerOptions.SerializationFlags = LightJson.Serialization.JsonSerializationFlags.Json5;

        // mappt die POST‑/service‑Route zum JSON‑RPC‑Handler
        e.Router.MapPost ( "/service", e.Handler.Transport.HttpPost );
    } )
    .Build ();

host.Start ();
```
