# Antworten

Antworten stellen Objekte dar, die HTTP-Antworten auf HTTP-Anfragen sind. Sie werden vom Server an den Client gesendet, um die Anfrage nach einer Ressource, Seite, Dokument, Datei oder einem anderen Objekt anzuzeigen.

Eine HTTP-Antwort besteht aus Status, Headern und Inhalt.

In diesem Dokument erfahren Sie, wie Sie HTTP-Antworten mit Sisk entwerfen.

## Festlegen eines HTTP-Status

Die Liste der HTTP-Statuscodes ist seit HTTP/1.0 gleich und Sisk unterstützt alle davon.

```cs
HttpResponse res = new HttpResponse();
res.Status = System.Net.HttpStatusCode.Accepted; //202
```

Oder mit Fluent-Syntax:

```cs
new HttpResponse()
 .WithStatus(200) // oder
 .WithStatus(HttpStatusCode.Ok) // oder
 .WithStatus(HttpStatusInformation.Ok);
```

Sie können die vollständige Liste der verfügbaren HttpStatusCode [hier](https://learn.microsoft.com/de-de/dotnet/api/system.net.httpstatuscode) sehen. Sie können auch Ihren eigenen Statuscode mithilfe der [HttpStatusInformation](/api/Sisk.Core.Http.HttpStatusInformation)-Struktur bereitstellen.

## Body und Content-Type

Sisk unterstützt .NET-Inhalte Objekte, um den Body in Antworten zu senden. Sie können die [StringContent](https://learn.microsoft.com/de-de/dotnet/api/system.net.http.stringcontent)-Klasse verwenden, um beispielsweise eine JSON-Antwort zu senden:

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

Der Server versucht immer, die `Content-Length` aus dem zu definieren, was Sie im Inhalt definiert haben, wenn Sie es nicht explizit in einem Header definiert haben. Wenn der Server den Content-Length-Header nicht implizit aus dem Antwortinhalt abrufen kann, wird die Antwort mit Chunked-Encoding gesendet.

Sie können die Antwort auch streamen, indem Sie einen [StreamContent](https://learn.microsoft.com/de-de/dotnet/api/system.net.http.streamcontent) senden oder die Methode [GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream) verwenden.

## Antwort-Header

Sie können Header hinzufügen, bearbeiten oder entfernen, die Sie in der Antwort senden. Das folgende Beispiel zeigt, wie Sie eine Umleitungsantwort an den Client senden.

```cs
HttpResponse res = new HttpResponse();
res.Status = HttpStatusCode.Moved;
res.Headers.Add(HttpKnownHeaderNames.Location, "/login");
```

Oder mit Fluent-Syntax:

```cs
new HttpResponse(301)
 .WithHeader("Location", "/login");
```

Wenn Sie die [Add](/api/Sisk.Core.Entity.HttpHeaderCollection.Add)-Methode von HttpHeaderCollection verwenden, fügen Sie einen Header zur Anfrage hinzu, ohne die bereits gesendeten zu ändern. Die [Set](/api/Sisk.Core.Entity.HttpHeaderCollection.Set)-Methode ersetzt die Header mit demselben Namen durch den angegebenen Wert. Der Index von HttpHeaderCollection ruft intern die Set-Methode auf, um die Header zu ersetzen.

## Senden von Cookies

Sisk verfügt über Methoden, die die Definition von Cookies auf dem Client erleichtern. Cookies, die mit dieser Methode gesetzt werden, sind bereits URL-kodiert und entsprechen dem RFC-6265-Standard.

```cs
HttpResponse res = new HttpResponse();
res.SetCookie("cookie-name", "cookie-value");
```

Oder mit Fluent-Syntax:

```cs
new HttpResponse(301)
 .WithCookie("cookie-name", "cookie-value", expiresAt: DateTime.Now.Add(TimeSpan.FromDays(7)));
```

Es gibt andere [vollständigere Versionen](/api/Sisk.Core.Http.CookieHelper.SetCookie) derselben Methode.

## Chunked-Antworten

Sie können die Übertragungskodierung auf chunked setzen, um große Antworten zu senden.

```cs
HttpResponse res = new HttpResponse();
res.SendChunked = true;
```

Bei Verwendung von Chunked- Encoding wird der Content-Length-Header automatisch weggelassen.

## Antwortstrom

Antwortströme sind eine verwaltete Möglichkeit, die es Ihnen ermöglicht, Antworten auf eine segmentierte Weise zu senden. Es handelt sich um eine Ebene tiefer als die Verwendung von HttpResponse-Objekten, da sie erfordern, dass Sie die Header und Inhalte manuell senden und dann die Verbindung schließen.

Dieses Beispiel öffnet einen schreibgeschützten Strom für die Datei, kopiert den Strom in den Antwortausgabestrom und lädt die gesamte Datei nicht in den Speicher. Dies kann nützlich sein, um mittelgroße oder große Dateien zu bedienen.

```cs
// erhält den Antwortausgabestrom
using var fileStream = File.OpenRead("my-big-file.zip");
var responseStream = request.GetResponseStream();

// setzt die Antwortkodierung auf chunked-encoding
// auch sollten Sie den Content-Length-Header nicht senden, wenn Sie chunked-encoding verwenden
responseStream.SendChunked = true;
responseStream.SetStatus(200);
responseStream.SetHeader(HttpKnownHeaderNames.ContentType, contentType);

// kopiert den Dateistream in den Antwortausgabestrom
fileStream.CopyTo(responseStream.ResponseStream);

// schließt den Strom
return responseStream.Close();
```

## GZip-, Deflate- und Brotli-Komprimierung

Sie können Antworten mit komprimierten Inhalten in Sisk senden, indem Sie HTTP-Inhalte komprimieren. Zuerst kapseln Sie Ihr [HttpContent](https://learn.microsoft.com/de-de/dotnet/api/system.net.http.httpcontent)-Objekt in eines der untenstehenden Kompressoren, um die komprimierte Antwort an den Client zu senden.

```cs
router.MapGet("/hello.html", request => {
 string myHtml = "...";
    
 return new HttpResponse () {
 Content = new GZipContent(new HtmlContent(myHtml)),
 // oder Content = new BrotliContent(new HtmlContent(myHtml)),
 // oder Content = new DeflateContent(new HtmlContent(myHtml)),
 };
});
```

Sie können diese komprimierten Inhalte auch mit Strömen verwenden.

```cs
router.MapGet("/archive.zip", request => {
    
 // verwenden Sie hier nicht "using". Der HttpServer verwirft Ihren Inhalt
 // nachdem er die Antwort gesendet hat.
 var archive = File.OpenRead("/path/to/big-file.zip");
    
 return new HttpResponse () {
 Content = new GZipContent(archive)
 }
});
```

Die Content-Encoding-Header werden automatisch gesetzt, wenn diese Inhalte verwendet werden.

## Automatische Komprimierung

Es ist möglich, HTTP-Antworten mit der [EnableAutomaticResponseCompression](/api/Sisk.Core.Http.HttpServerConfiguration.EnableAutomaticResponseCompression)-Eigenschaft automatisch zu komprimieren. Diese Eigenschaft kapselt den Antwortinhalt vom Router automatisch in einen komprimierbaren Inhalt, der von der Anfrage akzeptiert wird, vorausgesetzt, die Antwort wird nicht von einem [CompressedContent](/api/Sisk.Core.Http.CompressedContent) geerbt.

Nur ein komprimierbarer Inhalt wird für eine Anfrage ausgewählt, die gemäß der Accept-Encoding-Header, die der Reihe nach folgt:

- [BrotliContent](/api/Sisk.Core.Http.BrotliContent) (br)
- [GZipContent](/api/Sisk.Core.Http.GZipContent) (gzip)
- [DeflateContent](/api/Sisk.Core.Http.DeflateContent) (deflate)

Wenn die Anfrage angibt, dass sie eine dieser Komprimierungsmethoden akzeptiert, wird die Antwort automatisch komprimiert.

## Implizite Antworttypen

Sie können andere Rückgabetypen als HttpResponse verwenden, aber es ist notwendig, den Router zu konfigurieren, wie er jeden Objekttyp behandelt.

Das Konzept besteht darin, immer einen Referenztyp zurückzugeben und ihn in ein gültiges HttpResponse-Objekt umzuwandeln. Routen, die HttpResponse zurückgeben, unterliegen keiner Umwandlung.

Wertetypen (Strukturen) können nicht als Rückgabetyp verwendet werden, da sie nicht mit dem [RouterCallback](/api/Sisk.Core.Routing.RouterCallback) kompatibel sind. Daher müssen sie in ein ValueResult gekapselt werden, um in Handhabern verwendet werden zu können.

Betrachten Sie das folgende Beispiel eines Router-Moduls, das nicht HttpResponse im Rückgabetyp verwendet:

```cs
[RoutePrefix("/users")]
public class UsersController : RouterModule
{
 public List<User> Users = new List<User>();

 [RouteGet]
 public IEnumerable<User> Index(HttpRequest request)
 {
 return Users.ToArray();
 }

 [RouteGet("<id>")]
 public User View(HttpRequest request)
 {
 int id = request.RouteParameters["id"].GetInteger();
 User dUser = Users.First(u => u.Id == id);

 return dUser;
 }

 [RoutePost]
 public ValueResult<bool> Create(HttpRequest request)
 {
 User fromBody = JsonSerializer.Deserialize<User>(request.Body)!;
 Users.Add(fromBody);
        
 return true;
 }
}
```

Damit muss nun im Router definiert werden, wie er mit jedem Objekttyp umgeht. Objekte sind immer das erste Argument des Handlers und der Ausgabetyp muss ein gültiges HttpResponse sein. Außerdem sollten die Ausgabeobjekte einer Route niemals null sein.

Für ValueResult-Typen ist es nicht notwendig, anzugeben, dass das Eingabeobjekt ein ValueResult ist und nur T, da ValueResult ein Objekt ist, das von seiner ursprünglichen Komponente reflektiert wird.

Die Zuordnung von Typen vergleicht nicht, was registriert wurde, mit dem Typ des Objekts, das vom Router-Callback zurückgegeben wird. Stattdessen prüft es, ob der Typ des Router-Ergebnisses dem registrierten Typ zuweisbar ist.

Das Registrieren eines Handlers vom Typ Object wird auf alle zuvor nicht validierten Typen zurückgeführt. Die Einfügereihenfolge der Wert-Handler spielt auch eine Rolle, daher sollten Sie zuerst bestimmte Wert-Handler registrieren, um die Reihenfolge sicherzustellen.

```cs
Router r = new Router();
r.SetObject(new UsersController());

r.RegisterValueHandler<ApiResult>(apiResult =>
{
 return new HttpResponse() {
 Status = apiResult.Success ? HttpStatusCode.OK : HttpStatusCode.BadRequest,
 Content = apiResult.GetHttpContent(),
 Headers = apiResult.GetHeaders()
 };
});
r.RegisterValueHandler<bool>(bvalue =>
{
 return new HttpResponse() {
 Status = bvalue ? HttpStatusCode.OK : HttpStatusCode.BadRequest
 };
});
r.RegisterValueHandler<IEnumerable<object>>(enumerableValue =>
{
 return new HttpResponse(string.Join("\n", enumerableValue));
});

// das Registrieren eines Wert-Handlers vom Typ Object muss das letzte sein
// Wert-Handler, der als Fallback verwendet wird
r.RegisterValueHandler<object>(fallback =>
{
 return new HttpResponse() {
 Status = HttpStatusCode.OK,
 Content = JsonContent.Create(fallback)
 };
});
```

## Hinweis zu enumerable Objekten und Arrays

Implizite Antwortobjekte, die [IEnumerable](https://learn.microsoft.com/de-de/dotnet/api/system.collections.ienumerable?view=net-8.0) implementieren, werden durch die `ToArray()`-Methode in den Speicher gelesen, bevor sie durch einen definierten Wert-Handler umgewandelt werden. Damit dies geschieht, wird das `IEnumerable`-Objekt in ein Array von Objekten umgewandelt, und der Antwortkonverter empfängt immer ein `Object[]` anstelle des ursprünglichen Typs.

Betrachten Sie das folgende Szenario:

```csharp
using var host = HttpServer.CreateBuilder(12300)
 .UseRouter(r =>
 {
 r.RegisterValueHandler<IEnumerable<string>>(stringEnumerable =>
 {
 return new HttpResponse("String-Array:\n" + string.Join("\n", stringEnumerable));
 });
 r.RegisterValueHandler<IEnumerable<object>>(stringEnumerable =>
 {
 return new HttpResponse("Objekt-Array:\n" + string.Join("\n", stringEnumerable));
 });
 r.MapGet("/", request =>
 {
 return (IEnumerable<string>)["hello", "world"];
 });
 })
 .Build();
```

Im obigen Beispiel wird der `IEnumerable<string>`-Konverter **nie aufgerufen**, da das Eingabeobjekt immer ein `Object[]` ist und nicht in ein `IEnumerable<string>` umgewandelt werden kann. Der Konverter unten, der ein `IEnumerable<object>` empfängt, empfängt jedoch seine Eingabe, da sein Wert kompatibel ist.

Wenn Sie den Typ des Objekts, das enumeriert wird, tatsächlich verarbeiten müssen, müssen Sie die Reflexion verwenden, um den Typ des SammlungsElements zu erhalten. Alle enumerable Objekte (Listen, Arrays und Sammlungen) werden durch den HTTP-Antwortkonverter in ein Array von Objekten umgewandelt.

Werte, die [IAsyncEnumerable](https://learn.microsoft.com/de-de/dotnet/api/system.collections.generic.iasyncenumerable-1?view=net-8.0) implementieren, werden automatisch vom Server behandelt, wenn die [ConvertIAsyncEnumerableIntoEnumerable](/api/Sisk.Core.Http.HttpServerConfiguration.ConvertIAsyncEnumerableIntoEnumerable)-Eigenschaft aktiviert ist, ähnlich wie bei `IEnumerable`. Eine asynchrone Enumeration wird in einen blockierenden Enumerator umgewandelt und dann in ein synchrones Array von Objekten umgewandelt.