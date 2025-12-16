# Construtor de URL

A classe `UrlBuilder` é uma utilidade para criar e manipular strings de URL de forma fluente. Ela permite que você construa URLs adicionando ou removendo parâmetros de consulta, segmentos e fragmentos.

Esta classe está disponível no namespace `Sisk.Core.Http`.

## Criando um UrlBuilder

Você pode criar um `UrlBuilder` a partir de uma string URL ou de um objeto `Uri`.

```csharp
var builder = new UrlBuilder("http://localhost:5000");
```

## Modificando a URL

Você pode modificar a URL adicionando ou removendo segmentos, parâmetros de consulta e fragmentos.

```csharp
builder.AddSegment("usuarios")
       .AddSegment("123")
       .AddQuery("ativo", "true")
       .SetFragment("perfil");

string url = builder.ToString();
// Saída: http://localhost:5000/usuarios/123?ativo=true#perfil
```

## Métodos

| Método | Descrição |
|---|---|
| `AddSegment(string segment)` | Adiciona um segmento de caminho à URL. |
| `AddQuery(string chave, string valor)` | Adiciona um parâmetro de consulta à URL. |
| `RemoveQuery(string chave)` | Remove um parâmetro de consulta da URL. |
| `SetFragment(string fragmento)` | Define o fragmento da URL (hash). |
| `SetPort(int porta)` | Define a porta da URL. |
| `SetHost(string host)` | Define o host da URL. |
| `SetScheme(string esquema)` | Define o esquema (protocolo) da URL. |
| `Pop()` | Remove o último segmento do caminho da URL. |

## Analisando Strings de Consulta

Você também pode usar `UrlBuilder` para analisar e manipular strings de consulta existentes.

```csharp
var builder = new UrlBuilder("http://example.com?foo=bar&baz=qux");

// Modificar parâmetros de consulta
builder.RemoveQuery("foo")
       .AddQuery("novo", "valor");

Console.WriteLine(builder.ToString());
// Saída: http://example.com/?baz=qux&novo=valor
```