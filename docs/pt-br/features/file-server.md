# Servidor de Arquivos

Sisk fornece o namespace `Sisk.Http.FileSystem`, que contém ferramentas para servir arquivos estáticos, listagem de diretórios e conversão de arquivos. Essa funcionalidade permite servir arquivos de um diretório local, com suporte a solicitações de intervalo (transmissão de áudio/vídeo) e processamento personalizado de arquivos.

## Servindo arquivos estáticos

A maneira mais fácil de servir arquivos estáticos é usando `HttpFileServer.CreateServingRoute`. Esse método cria uma rota que mapeia um prefixo de URL para um diretório no disco.

```cs
using Sisk.Core.Http;
using Sisk.Core.Http.FileSystem;

// mapeia a raiz do servidor para o diretório atual
mainRouter.SetRoute(HttpFileServer.CreateServingRoute("/", Directory.GetCurrentDirectory()));

// mapeia /assets para a pasta "public/assets"
mainRouter.SetRoute(HttpFileServer.CreateServingRoute("/assets", Path.Combine(Directory.GetCurrentDirectory(), "public", "assets")));
```

Quando uma solicitação corresponde ao prefixo da rota, o `HttpFileServerHandler` procurará por um arquivo no diretório especificado. Se encontrado, ele servirá o arquivo; caso contrário, retornará uma resposta 404 (ou 403 se o acesso for negado).

## HttpFileServerHandler

Para ter mais controle sobre como os arquivos são servidos, você pode instanciar e configurar `HttpFileServerHandler` manualmente.

```cs
var fileHandler = new HttpFileServerHandler("/var/www/html");

// habilita a listagem de diretórios (desabilitada por padrão)
fileHandler.AllowDirectoryListing = true;

// define um prefixo de rota personalizado (isso será removido do caminho da solicitação)
fileHandler.RoutePrefix = "/public";

// registra a ação do manipulador
mainRouter.SetRoute(RouteMethod.Get, "/public/.*", fileHandler.HandleRequest);
```

### Configuração

| Propriedade | Descrição |
|---|---|
| `RootDirectoryPath` | O caminho absoluto ou relativo para o diretório raiz a partir do qual os arquivos são servidos. |
| `RoutePrefix` | O prefixo de rota que será removido do caminho da solicitação ao resolver arquivos. Padrão é `/`. |
| `AllowDirectoryListing` | Se definido como `true`, habilita a listagem de diretórios quando um diretório é solicitado e nenhum arquivo de índice é encontrado. Padrão é `false`. |
| `FileConverters` | Uma lista de `HttpFileServerFileConverter` usada para transformar arquivos antes de serví-los. |

## Listagem de Diretórios

Quando `AllowDirectoryListing` está habilitado e o usuário solicita um caminho de diretório, Sisk gerará uma página HTML listando o conteúdo desse diretório.

A listagem de diretórios inclui:
- Navegação para o diretório pai (`..`).
- Lista de subdiretórios.
- Lista de arquivos com tamanho e data de última modificação.

## Conversores de Arquivos

Conversores de arquivos permitem que você intercepte tipos de arquivos específicos e os trate de forma diferente. Por exemplo, você pode querer transcodificar uma imagem, compactar um arquivo em tempo real ou servir um arquivo usando conteúdo parcial (solicitações de intervalo).

Sisk inclui dois conversores incorporados para transmissão de mídia:
- `HttpFileAudioConverter`: Trata `.mp3`, `.ogg`, `.wav`, `.flac`, `.ogv`.
- `HttpFileVideoConverter`: Trata `.webm`, `.avi`, `.mkv`, `.mpg`, `.mpeg`, `.wmv`, `.mov`, `.mp4`.

Esses conversores habilitam o suporte a **Solicitações de Intervalo HTTP**, permitindo que os clientes procurem por arquivos de áudio e vídeo.

### Criando um conversor personalizado

Para criar um conversor de arquivo personalizado, herde de `HttpFileServerFileConverter` e implemente `CanConvert` e `Convert`.

```cs
using Sisk.Core.Http;
using Sisk.Core.Http.FileSystem;

public class MyTextConverter : HttpFileServerFileConverter
{
    public override bool CanConvert(FileInfo file)
    {
        // aplica apenas a arquivos .txt
        return file.Extension.Equals(".txt", StringComparison.OrdinalIgnoreCase);
    }

    public override HttpResponse Convert(FileInfo file, HttpRequest request)
    {
        string content = File.ReadAllText(file.FullName);
        
        // converte todo o conteúdo de texto para maiúsculas
        return new HttpResponse(200)
        {
            Content = new StringContent(content.ToUpper())
        };
    }
}
```

Em seguida, adicione-o ao seu manipulador:

```cs
var handler = new HttpFileServerHandler("./files");
handler.FileConverters.Add(new MyTextConverter());
```