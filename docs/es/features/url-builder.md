# Constructor de URL

La clase `UrlBuilder` es una utilidad para crear y manipular cadenas de URL de manera fluida. Permite construir URLs agregando o eliminando parámetros de consulta, segmentos y fragmentos.

Esta clase está disponible en el espacio de nombres `Sisk.Core.Http`.

## Crear un UrlBuilder

Puedes crear un `UrlBuilder` a partir de una cadena de URL o de un objeto `Uri`.

```csharp
var builder = new UrlBuilder("http://localhost:5000");
```

## Modificar la URL

Puedes modificar la URL agregando o eliminando segmentos, parámetros de consulta y fragmentos.

```csharp
builder.AddSegment("usuarios")
       .AddSegment("123")
       .AddQuery("activo", "true")
       .SetFragment("perfil");

string url = builder.ToString();
// Salida: http://localhost:5000/usuarios/123?activo=true#perfil
```

## Métodos

| Método | Descripción |
|---|---|
| `AddSegment(string segment)` | Agrega un segmento de ruta a la URL. |
| `AddQuery(string key, string value)` | Agrega un parámetro de consulta a la URL. |
| `RemoveQuery(string key)` | Elimina un parámetro de consulta de la URL. |
| `SetFragment(string fragment)` | Establece el fragmento de la URL (hash). |
| `SetPort(int port)` | Establece el puerto de la URL. |
| `SetHost(string host)` | Establece el host de la URL. |
| `SetScheme(string scheme)` | Establece el esquema (protocolo) de la URL. |
| `Pop()` | Elimina el último segmento de la ruta de la URL. |

## Analizar cadenas de consulta

También puedes utilizar `UrlBuilder` para analizar y manipular cadenas de consulta existentes.

```csharp
var builder = new UrlBuilder("http://example.com?foo=bar&baz=qux");

// Modificar parámetros de consulta
builder.RemoveQuery("foo")
       .AddQuery("nuevo", "valor");

Console.WriteLine(builder.ToString());
// Salida: http://example.com/?baz=qux&nuevo=valor
```