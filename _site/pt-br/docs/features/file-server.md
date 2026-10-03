# Servidor de Arquivos

Source: https://docs.sisk-framework.org/pt-br/docs/features/file-server.html

Sisk fornece o namespace `Sisk.Http.FileSystem`, que contém ferramentas para servir arquivos estáticos, listagem de diretórios e conversão de arquivos. Esse recurso permite servir arquivos de um diretório local, com suporte a solicitações de intervalo (streaming de áudio/vídeo) e processamento personalizado de arquivos.

## Servindo arquivos estáticos

A maneira mais fácil de servir arquivos estáticos é [Router.MapFileSystem](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapFileSystem.md). Esse método mapeia um prefixo de URL para um diretório no disco.

```cs
using Sisk.Core.Http;
using Sisk.Core.Http.FileSystem;

// maps the root of the server to the current directory
mainRouter.MapFileSystem("/", Directory.GetCurrentDirectory());

// maps /assets to the "public/assets" folder
mainRouter.MapFileSystem(
    "/assets",
    Path.Combine(Directory.GetCurrentDirectory(), "public", "assets"));
```

Quando uma requisição corresponde ao prefixo da rota, o `HttpFileServerHandler` procurará um arquivo no diretório especificado. Se encontrado, ele servirá o arquivo; caso contrário, retornará uma resposta 404 (ou 403 se o acesso for negado).

`HttpFileServer.CreateServingRoute` ainda está disponível quando você precisa criar um objeto `Route` explicitamente, mas `MapFileSystem` é a opção mais direta para o código da aplicação.

## HttpFileServerHandler

Para ter mais controle sobre como os arquivos são servidos, você pode instanciar e configurar o `HttpFileServerHandler` manualmente.

```cs
var fileHandler = new HttpFileServerHandler("/var/www/html");

// enable directory listing (disabled by default)
fileHandler.AllowDirectoryListing = true;

// set a custom route prefix (this will be trimmed from the request path)
fileHandler.RoutePrefix = "/public";

// register the handler under /public
mainRouter.MapFileSystem("/public", fileHandler);
```

### Configuração

| Propriedade | Descrição |
|---|---|
| `RootDirectoryPath` | O caminho absoluto ou relativo para o diretório raiz a partir do qual os arquivos são servidos. |
| `RoutePrefix` | O prefixo da rota que será removido do caminho da requisição ao resolver arquivos. O padrão é `/`. |
| `AllowDirectoryListing` | Se definido como `true`, habilita a listagem de diretórios quando um diretório é solicitado e nenhum arquivo índice é encontrado. O padrão é `false`. |
| `FileConverters` | Uma lista de `HttpFileServerFileConverter` usada para transformar arquivos antes de servi-los. |

## Listagem de Diretório

Quando `AllowDirectoryListing` está habilitado e o usuário solicita um caminho de diretório, o Sisk gerará uma página HTML listando o conteúdo desse diretório.

A listagem de diretório inclui:
- Navegação para o diretório pai (`..`).
- Lista de subdiretórios.
- Lista de arquivos com tamanho e data da última modificação.

## Conversores de Arquivo

Conversores de arquivo permitem interceptar tipos específicos de arquivos e tratá-los de forma diferente. Por exemplo, você pode querer transcodificar uma imagem, comprimir um arquivo em tempo real ou servir um arquivo usando conteúdo parcial (solicitações de intervalo).

O Sisk inclui dois conversores embutidos para streaming de mídia:
- `HttpFileAudioConverter`: Lida com `.mp3`, `.ogg`, `.wav`, `.flac`, `.ogv`.
- `HttpFileVideoConverter`: Lida com `.webm`, `.avi`, `.mkv`, `.mpg`, `.mpeg`, `.wmv`, `.mov`, `.mp4`.

Esses conversores habilitam o suporte a **solicitações de intervalo HTTP**, permitindo que os clientes avancem em arquivos de áudio e vídeo.

### Criando um conversor personalizado

Para criar um conversor de arquivo personalizado, herde de `HttpFileServerFileConverter` e implemente `CanConvert` e `Convert`.

```cs
using Sisk.Core.Http;
using Sisk.Core.Http.FileSystem;

public class MyTextConverter : HttpFileServerFileConverter
{
    public override bool CanConvert(FileInfo file)
    {
        // apply only to .txt files
        return file.Extension.Equals(".txt", StringComparison.OrdinalIgnoreCase);
    }

    public override HttpResponse Convert(FileInfo file, HttpRequest request)
    {
        string content = File.ReadAllText(file.FullName);
        
        // uppercase all text content
        return new HttpResponse(200)
        {
            Content = new StringContent(content.ToUpper())
        };
    }
}
```

Então, adicione-o ao seu manipulador:

```cs
var handler = new HttpFileServerHandler("./files");
handler.FileConverters.Add(new MyTextConverter());
```
