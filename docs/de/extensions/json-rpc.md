# JSON-RPC-Erweiterung

Sisk hat ein experimentelles Modul für eine [JSON-RPC 2.0](https://www.jsonrpc.org/specification)-API, mit der Sie noch einfachere Anwendungen erstellen können. Diese Erweiterung implementiert die JSON-RPC 2.0-Transport-Schnittstelle strikt und bietet Transport über HTTP-GET-, POST-Anfragen und auch Web-Sockets mit Sisk.

Sie können die Erweiterung über Nuget mit dem folgenden Befehl installieren. Beachten Sie, dass Sie in experimentellen/Beta-Versionen die Option zum Suchen nach Vorabversionen in Visual Studio aktivieren müssen.

```bash
dotnet add package Sisk.JsonRpc
```

## Transport-Schnittstelle

JSON-RPC ist ein Zustandsloses, asynchrones Remote-Verfahren-Ausführungsprotokoll (RDP), das JSON für einseitige Datenkommunikation verwendet. Eine JSON-RPC-Anfrage wird normalerweise durch eine ID identifiziert, und eine Antwort wird durch die gleiche ID geliefert, die in der Anfrage gesendet wurde. Nicht alle Anfragen erfordern eine Antwort, die als "Benachrichtigungen" bezeichnet werden.

Die [JSON-RPC 2.0-Spezifikation](https://www.jsonrpc.org/specification) erklärt im Detail, wie der Transport funktioniert. Dieser Transport ist unabhängig davon, wo er verwendet wird. Sisk implementiert dieses Protokoll über HTTP, indem es die Konformitäten von [JSON-RPC über HTTP](https://www.jsonrpc.org/historical/json-rpc-over-http.html) befolgt, die teilweise GET-Anfragen unterstützt, aber vollständig POST-Anfragen unterstützt. Web-Sockets werden auch unterstützt, wodurch asynchrone Nachrichtenkommunikation ermöglicht wird.

Eine JSON-RPC-Anfrage sieht ähnlich aus wie:

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

## JSON-RPC-Methoden

Das folgende Beispiel zeigt, wie Sie eine JSON-RPC-API mit Sisk erstellen können. Eine mathematische Operationenklasse führt die Remote-Operationen aus und liefert die serialisierte Antwort an den Client.

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
using var app = HttpServer.CreateBuilder(port: 5555)
    .UseJsonRPC((sender, args) =>
    {
        // fügt alle Methoden mit dem Attribut WebMethod zum JSON-RPC-Handler hinzu
        args.Handler.Methods.AddMethodsFromType(new MathOperations());
        
        // ordnet die Route /service zum JSON-RPC-Handler für POST- und GET-Anfragen zu
        args.Router.MapPost("/service", args.Handler.Transport.HttpPost);
        args.Router.MapGet("/service", args.Handler.Transport.HttpGet);
        
        // erstellt einen WebSocket-Handler für GET /ws
        args.Router.MapGet("/ws", request =>
        {
            var ws = request.GetWebSocket();
            ws.OnReceive += args.Handler.Transport.WebSocket;

            ws.WaitForClose(timeout: TimeSpan.FromSeconds(30));
            return ws.Close();
        });
    })
    .Build();

await app.StartAsync();
```

<div class="script-header">
    <span>
        MathOperations.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
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

Das obige Beispiel ordnet die Methoden `Sum` und `Sqrt` dem JSON-RPC-Handler zu und macht diese Methoden über `GET /service`, `POST /service` und `GET /ws` verfügbar. Methodennamen sind nicht case-sensitiv.

Methodeparameter werden automatisch in ihre spezifischen Typen deserialisiert. Die Verwendung von Anfragen mit benannten Parametern wird auch unterstützt. Die JSON-Serialisierung wird von der [LightJson](https://github.com/CypherPotato/LightJson)-Bibliothek durchgeführt. Wenn ein Typ nicht korrekt deserialisiert wird, können Sie einen spezifischen [JSON-Konverter](https://github.com/CypherPotato/LightJson?tab=readme-ov-file#json-converters) für diesen Typ erstellen und ihn mit Ihren [JsonSerializerOptions](?) verknüpfen.

Sie können auch das `$.params`-Objekt direkt aus der JSON-RPC-Anfrage in Ihrer Methode abrufen.

<div class="script-header">
    <span>
        MathOperations.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[WebMethod]
public float Sum(JsonArray|JsonObject @params)
{
    ...
}
```

Damit dies geschieht, muss `@params` der **einzige** Parameter in Ihrer Methode sein, mit genau dem Namen `params` (in C# ist das `@` erforderlich, um diesen Parameter-Namen zu entkommen).

Die Deserialisierung von Parametern erfolgt sowohl für benannte Objekte als auch für positionale Arrays. Zum Beispiel kann die folgende Methode durch beide Anfragen aufgerufen werden:

```csharp
[WebMethod]
public float AddUserToStore(string apiKey, User user, UserStore store)
{
    ...
}
```

Für ein Array muss die Reihenfolge der Parameter befolgt werden.

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

## Anpassen des Serialisierungsprogramms

Sie können den JSON-Serialisierer in der [JsonRpcHandler.JsonSerializerOptions](/api/Sisk.JsonRPC.JsonRpcHandler.JsonSerializerOptions)-Eigenschaft anpassen. In dieser Eigenschaft können Sie die Verwendung von [JSON5](https://json5.org/) für die Deserialisierung von Nachrichten aktivieren. Obwohl dies nicht konform mit JSON-RPC 2.0 ist, ist JSON5 eine Erweiterung von JSON, die ein menschenlesbareres und lesbareres Schreiben ermöglicht.

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
using var host = HttpServer.CreateBuilder ( 5556 )
    .UseJsonRPC ( ( o, e ) => {

        // verwendet einen gereinigten Namen-Vergleicher. Dieser Vergleicher vergleicht nur Buchstaben
        // und Ziffern in einem Namen und ignoriert andere Symbole. Zum Beispiel:
        // foo_bar10 == FooBar10
        e.Handler.JsonSerializerOptions.PropertyNameComparer = new JsonSanitizedComparer ();

        // aktiviert JSON5 für den JSON-Interpreter. Selbst wenn dies aktiviert ist, ist Plain-JSON immer noch erlaubt
        e.Handler.JsonSerializerOptions.SerializationFlags = LightJson.Serialization.JsonSerializationFlags.Json5;

        // ordnet die POST /service-Route zum JSON-RPC-Handler zu
        e.Router.MapPost ( "/service", e.Handler.Transport.HttpPost );
    } )
    .Build ();

host.Start ();
```