---
title: "File Server"
linkTitle: "Файловый сервер"
weight: 80
aliases:
  - "/docs/ru/features/file-server.html"
sourceHash: "ecb5bc7dc9bb5964"
---

Sisk предоставляет пространство имён `Sisk.Http.FileSystem`, которое содержит инструменты для обслуживания статических файлов, отображения содержимого каталогов и конвертации файлов. Эта возможность позволяет обслуживать файлы из локального каталога, поддерживая запросы диапазонов (стриминг аудио/видео) и пользовательскую обработку файлов.

## Serving static files

Самый простой способ обслуживать статические файлы — [Router.MapFileSystem](/api/Sisk.Core.Routing.Router.MapFileSystem). Этот метод сопоставляет префикс URL с каталогом на диске.

```cs
using Sisk.Core.Http;
using Sisk.Core.Http.FileSystem;

// сопоставляет корень сервера с текущим каталогом
mainRouter.MapFileSystem("/", Directory.GetCurrentDirectory());

// сопоставляет /assets с папкой "public/assets"
mainRouter.MapFileSystem(
    "/assets",
    Path.Combine(Directory.GetCurrentDirectory(), "public", "assets"));
```

Когда запрос совпадает с префиксом маршрута, `HttpFileServerHandler` будет искать файл в указанном каталоге. Если файл найден, он будет отдан клиенту; иначе будет возвращён ответ 404 (или 403, если доступ запрещён).

`HttpFileServer.CreateServingRoute` по‑прежнему доступен, когда необходимо явно создать объект `Route`, но `MapFileSystem` является самым прямым вариантом для кода приложения.

## HttpFileServerHandler

Для более тонкого контроля над тем, как обслуживаются файлы, вы можете вручную создать и настроить `HttpFileServerHandler`.

```cs
var fileHandler = new HttpFileServerHandler("/var/www/html");

// включить отображение каталога (по умолчанию отключено)
fileHandler.AllowDirectoryListing = true;

// задать пользовательский префикс маршрута (он будет удалён из пути запроса)
fileHandler.RoutePrefix = "/public";

// зарегистрировать обработчик по пути /public
mainRouter.MapFileSystem("/public", fileHandler);
```

### Configuration

| Property | Description |
|---|---|
| `RootDirectoryPath` | Абсолютный или относительный путь к корневому каталогу, из которого обслуживаются файлы. |
| `RoutePrefix` | Префикс маршрута, который будет удалён из пути запроса при разрешении файлов. По умолчанию `/`. |
| `AllowDirectoryListing` | Если установлено `true`, включается отображение содержимого каталога, когда запрашивается каталог и не найден файл индекса. По умолчанию `false`. |
| `FileConverters` | Список `HttpFileServerFileConverter`, используемых для преобразования файлов перед их отдачей. |

## Directory Listing

Когда `AllowDirectoryListing` включён, и пользователь запрашивает путь к каталогу, Sisk генерирует HTML‑страницу со списком содержимого этого каталога.

Отображение каталога включает:
- Навигацию к родительскому каталогу (`..`).
- Список подкаталогов.
- Список файлов с указанием размера и даты последнего изменения.

## File Converters

Конвертеры файлов позволяют перехватывать определённые типы файлов и обрабатывать их иначе. Например, вы можете перекодировать изображение, сжимать файл «на лету» или отдавать файл частично (запросы Range).

Sisk включает два встроенных конвертера для медиа‑стриминга:
- `HttpFileAudioConverter`: Обрабатывает `.mp3`, `.ogg`, `.wav`, `.flac`, `.ogv`.
- `HttpFileVideoConverter`: Обрабатывает `.webm`, `.avi`, `.mkv`, `.mpg`, `.mpeg`, `.wmv`, `.mov`, `.mp4`.

Эти конвертеры обеспечивают поддержку **HTTP Range Requests**, позволяя клиентам перемещаться по аудио‑ и видеофайлам.

### Creating a custom converter

Чтобы создать собственный конвертер файлов, наследуйте `HttpFileServerFileConverter` и реализуйте `CanConvert` и `Convert`.

```cs
using Sisk.Core.Http;
using Sisk.Core.Http.FileSystem;

public class MyTextConverter : HttpFileServerFileConverter
{
    public override bool CanConvert(FileInfo file)
    {
        // применять только к файлам .txt
        return file.Extension.Equals(".txt", StringComparison.OrdinalIgnoreCase);
    }

    public override HttpResponse Convert(FileInfo file, HttpRequest request)
    {
        string content = File.ReadAllText(file.FullName);
        
        // преобразовать весь текст в верхний регистр
        return new HttpResponse(200)
        {
            Content = new StringContent(content.ToUpper())
        };
    }
}
```

Затем добавьте его в ваш обработчик:

```cs
var handler = new HttpFileServerHandler("./files");
handler.FileConverters.Add(new MyTextConverter());
```
