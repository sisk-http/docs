# Сервер файлов

Sisk предоставляет namespace `Sisk.Http.FileSystem`, который содержит инструменты для обслуживания статических файлов, списка директорий и преобразования файлов. Эта функция позволяет вам обслуживать файлы из локальной директории, с поддержкой запросов диапазона (аудио/видео потоковое вещание) и настраиваемой обработки файлов.

## Обслуживание статических файлов

Самый простой способ обслуживать статические файлы - использовать `HttpFileServer.CreateServingRoute`. Этот метод создает маршрут, который сопоставляет префикс URL с директорией на диске.

```cs
using Sisk.Core.Http;
using Sisk.Core.Http.FileSystem;

// сопоставляет корень сервера с текущей директорией
mainRouter.SetRoute(HttpFileServer.CreateServingRoute("/", Directory.GetCurrentDirectory()));

// сопоставляет /assets с папкой "public/assets"
mainRouter.SetRoute(HttpFileServer.CreateServingRoute("/assets", Path.Combine(Directory.GetCurrentDirectory(), "public", "assets")));
```

Когда запрос соответствует префиксу маршрута, `HttpFileServerHandler` будет искать файл в указанной директории. Если найден, он будет обслуживать файл; в противном случае, он вернет ответ 404 (или 403, если доступ запрещен).

## HttpFileServerHandler

Для более детального контроля над тем, как обслуживаются файлы, вы можете создать и настроить `HttpFileServerHandler` вручную.

```cs
var fileHandler = new HttpFileServerHandler("/var/www/html");

// включает список директорий (отключен по умолчанию)
fileHandler.AllowDirectoryListing = true;

// устанавливает пользовательский префикс маршрута (он будет обрезан из пути запроса)
fileHandler.RoutePrefix = "/public";

// регистрирует действие обработчика
mainRouter.SetRoute(RouteMethod.Get, "/public/.*", fileHandler.HandleRequest);
```

### Настройка

| Property | Описание |
|---|---|
| `RootDirectoryPath` | Абсолютный или относительный путь к корневой директории, из которой обслуживаются файлы. |
| `RoutePrefix` | Префикс маршрута, который будет обрезан из пути запроса при разрешении файлов. По умолчанию - `/`. |
| `AllowDirectoryListing` | Если установлено в `true`, включает список директорий, когда запрошена директория и не найден индексный файл. По умолчанию - `false`. |
| `FileConverters` | Список `HttpFileServerFileConverter`, используемых для преобразования файлов перед их обслуживанием. |

## Список директорий

Когда `AllowDirectoryListing` включен, и пользователь запрашивает путь директории, Sisk сгенерирует HTML-страницу, перечисляющую содержимое этой директории.

Список директорий включает:
- Навигацию к родительской директории (`..`).
- Список поддиректорий.
- Список файлов с размером и датой последнего изменения.

## Преобразователи файлов

Преобразователи файлов позволяют вам перехватывать определенные типы файлов и обрабатывать их по-разному. Например, вы можете захотеть перекодировать изображение, сжать файл на лету или обслужить файл, используя частичное содержимое (Запросы диапазона).

Sisk включает два встроенных преобразователя для потокового вещания мультимедиа:
- `HttpFileAudioConverter`: Обрабатывает `.mp3`, `.ogg`, `.wav`, `.flac`, `.ogv`.
- `HttpFileVideoConverter`: Обрабатывает `.webm`, `.avi`, `.mkv`, `.mpg`, `.mpeg`, `.wmv`, `.mov`, `.mp4`.

Эти преобразователи включают поддержку **HTTP-запросов диапазона**, позволяя клиентам искать через аудио- и видеофайлы.

### Создание пользовательского преобразователя

Чтобы создать пользовательский преобразователь файлов, унаследуйте от `HttpFileServerFileConverter` и реализуйте `CanConvert` и `Convert`.

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
        
        // преобразовать все текстовое содержимое в верхний регистр
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