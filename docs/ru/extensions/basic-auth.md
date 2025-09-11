# Basic Auth

Пакет Basic Auth добавляет обработчик запросов, способный обрабатывать схему базовой аутентификации в вашем приложении Sisk с минимальной конфигурацией и усилиями.
Базовая HTTP-аутентификация — это минимальная форма входа, где запросы аутентифицируются по идентификатору пользователя и паролю, при этом сессия полностью контролируется клиентом, и не используются токены аутентификации или доступа.

![Basic Auth](/assets/img/basic-auth.svg)

Подробнее о схеме базовой аутентификации можно прочитать в [спецификации MDN](https://developer.mozilla.org/pt-BR/docs/ru/Web/HTTP/Authentication).

## Установка

Чтобы начать, установите пакет Sisk.BasicAuth в ваш проект:

```bash
> dotnet add package Sisk.BasicAuth
```

Более подробные способы установки можно найти в [репозитории NuGet](https://www.nuget.org/packages/Sisk.BasicAuth/0.15.0).

## Создание обработчика аутентификации

Вы можете управлять схемой аутентификации для всего модуля или для отдельных маршрутов. Для этого сначала напишем наш первый обработчик базовой аутентификации.

В приведённом ниже примере устанавливается соединение с базой данных, проверяется наличие пользователя и корректность пароля, после чего пользователь сохраняется в контекстный контейнер.

```cs
public class UserAuthHandler : BasicAuthenticateRequestHandler
{
    public UserAuthHandler() : base()
    {
        Realm = "To enter this page, please, inform your credentials.";
    }

    public override HttpResponse? OnValidating(BasicAuthenticationCredentials credentials, HttpContext context)
    {
        DbContext db = new DbContext();

        // в этом случае мы используем email как поле идентификатора пользователя,
        // поэтому будем искать пользователя по его email.
        User? user = db.Users.FirstOrDefault(u => u.Email == credentials.UserId);
        if (user == null)
        {
            return base.CreateUnauthorizedResponse("Sorry! No user was found by this email.");
        }

        // проверяем, что пароль пользователя корректен.
        if (!user.ValidatePassword(credentials.Password))
        {
            return base.CreateUnauthorizedResponse("Invalid credentials.");
        }

        // добавляем вошедшего пользователя в http‑контекст
        // и продолжаем выполнение
        context.Bag.Add("loggedUser", user);
        return null;
    }
}
```

Затем просто привяжите этот обработчик запросов к вашему маршруту или классу.

```cs
public class UsersController
{
    [RouteGet("/")]
    [RequestHandler(typeof(UserAuthHandler))]
    public string Index(HttpRequest request)
    {
        User loggedUser = request.Bag.Get<User>();
        return $"Hello, {loggedUser.Name}!";
    }
}
```

Или используя класс [RouterModule](/api/Sisk.Core.Routing.RouterModule):

```cs
public class UsersController : RouterModule
{
    public ClientModule()
    {
        // все маршруты внутри этого класса будут обрабатываться
        // UserAuthHandler.
        base.HasRequestHandler(new UserAuthHandler());
    }
    
    [RouteGet("/")]
    public string Index(HttpRequest request)
    {
        User loggedUser = request.Bag.Get<User>();
        return $"Hello, {loggedUser.Name}!";
    }
}
```

## Замечания

Основная ответственность базовой аутентификации лежит на стороне клиента. Хранение, контроль кэша и шифрование обрабатываются локально на клиенте. Сервер лишь получает данные аутентификации и проверяет, разрешён ли доступ.

Обратите внимание, что этот метод не является самым надёжным, поскольку возлагает значительную ответственность на клиент, что затрудняет отслеживание и поддержание безопасности его данных. Кроме того, крайне важно передавать пароли в защищённом соединении (SSL), так как они не имеют встроенного шифрования. Короткое перехватывание заголовков запроса может раскрыть данные доступа вашего пользователя.

Выбирайте более надёжные решения аутентификации для продакшн‑приложений и избегайте чрезмерного использования готовых компонентов, так как они могут не подстроиться под нужды вашего проекта и привести к уязвимостям.