# Native AOT-Unterstützung

In .NET 7 wurde [Native AOT](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/) eingeführt, ein .NET-Kompiliermodus, der es Ihnen ermöglicht, bereite Binärdateien auf jeder unterstützten Plattform zu exportieren, ohne dass die .NET-Laufzeit auf dem Zielcomputer installiert werden muss.

Mit Native AOT wird Ihr Code für nativen Code kompiliert und enthält bereits alles, was benötigt wird, um ihn auszuführen. Sisk hat seit Version 0.9.1 mit dem Feature experimentiert, das die Unterstützung für Native AOT mit Funktionen zur Definition dynamischer Routen durch die Anwendung verbessert, ohne die Kompilierung mit Warnmeldungen zu beeinträchtigen.

Sisk verwendet Reflexion, um die Methoden zu erhalten, die von Typen und Objekten definiert werden. Darüber hinaus verwendet Sisk Reflexion für Attribute wie `RequestHandlerAttribute`, die von einem Typ initialisiert werden. Um ordnungsgemäß zu funktionieren, verwendet die AOT-Kompilierung Trimmen, bei dem dynamische Typen angegeben werden müssen, was in der endgültigen Assembly verwendet wird.

Betrachten Sie das folgende Beispiel, das eine Route aufruft, die einen RequestHandler verwendet.

```cs
[Route(RouteMethod.Get, "/", LogMode = LogOutput.None)]
[RequestHandler(typeof(MyRequestHandler))]
static HttpResponse IndexPage(HttpRequest request)
{
    HttpResponse htmlResponse = new HttpResponse();
    htmlResponse.Content = new StringContent("Hallo, Welt!", System.Text.Encoding.UTF8, "text/plain");
    return htmlResponse;
}
```

Dieser RequestHandler wird dynamisch während der Laufzeit aufgerufen, und dieser Aufruf muss segmentiert werden, und diese Segmentierung muss explizit sein.

Um besser zu verstehen, was der Compiler von `MyRequestHandler` berücksichtigen wird, sollten folgende Elemente in der endgültigen Kompilierung beibehalten werden:

- Öffentliche Eigenschaften;
- Öffentliche und private Felder;
- Öffentliche und private Konstruktoren;
- Öffentliche und private Methoden;

Alles, was Sie in einem RequestHandler haben, das nicht oben erwähnt wird, wird vom Compiler entfernt.

Denken Sie daran, dass alle anderen Komponenten, Klassen und Pakete, die Sie in Ihrer Anwendung verwenden, mit AOT-Trimmen kompatibel sein sollten, oder Ihr Code wird nicht wie erwartet funktionieren. Sisk wird Sie nicht im Stich lassen, wenn Sie etwas bauen möchten, bei dem die Leistung im Vordergrund steht.

Sie können mehr über Native AOT und wie es funktioniert in der offiziellen [Microsoft-Dokumentation](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/) lesen.