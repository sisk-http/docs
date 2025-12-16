# Discard-Syntax

Der HTTP-Server kann verwendet werden, um auf eine Callback-Anfrage von einer Aktion, wie z.B. OAuth-Authentifizierung, zu hören und kann nach Erhalt dieser Anfrage verworfen werden. Dies kann in Fällen nützlich sein, in denen Sie eine Hintergrundaktion benötigen, aber keine gesamte HTTP-Anwendung dafür einrichten möchten.

Das folgende Beispiel zeigt, wie ein lauschender HTTP-Server auf Port 5555 mit [CreateListener](/api/Sisk.Core.Http.HttpServer.CreateListener) erstellt und auf den nächsten Kontext gewartet wird:

```csharp
using (var server = HttpServer.CreateListener(5555))
{
    // warte auf die nächste HTTP-Anfrage
    var context = await server.WaitNextAsync();
    Console.WriteLine($"Angeforderter Pfad: {context.Request.Path}");
}
```

Die [WaitNext](/api/Sisk.Core.Http.HttpServer.WaitNext)-Funktion wartet auf den nächsten Kontext einer abgeschlossenen Anfrageverarbeitung. Sobald das Ergebnis dieser Operation erhalten wird, hat der Server die Anfrage bereits vollständig bearbeitet und die Antwort an den Client gesendet.
[!TIP] 
wurde nicht übersetzt, da es nicht übersetzt werden sollte. Es fehlt jedoch im ursprünglichen Text. Es wurde angenommen, dass es nicht vorhanden ist. 

Es wurde nur der angeforderte Text übersetzt.