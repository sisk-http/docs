# Базовая Аутентификация

Пакет Basic Auth добавляет обработчик запросов, способный обрабатывать базовую схему аутентификации в вашем приложении Sisk с минимальной конфигурацией и усилиями.
Базовая аутентификация HTTP - это минимальная форма аутентификации запросов по идентификатору пользователя и паролю, где сессия контролируется исключительно клиентом, и нет аутентификационных или доступных токенов.

<img src="https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Authentication/httpauth.png">

Читайте больше о схеме базовой аутентификации в [спецификации MDN](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Authentication).

## Установка

Чтобы начать, установите пакет Sisk.BasicAuth в вашем проекте:

    > dotnet add package Sisk.BasicAuth

Вы можете просмотреть больше способов установки его в вашем проекте в [репозитории Nuget](https://www.nuget.org/packages/Sisk.BasicAuth/0.15.0).

## Создание обработчика аутентификации

Вы можете контролировать схему аутентификации для всего модуля или для отдельных маршрутов. Для этого давайте сначала напишем наш первый базовый обработчик аутентификации.

В примере ниже устанавливается соединение с базой данных, проверяется, существует ли пользователь и является ли пароль действительным, и после этого хранит пользователя в контексте.

```cs
public class UserAuthHandler : BasicAuthenticateRequestHandler
{
    public UserAuthHandler() : base()
    {
        Realm = "Чтобы войти на эту страницу, пожалуйста, введите ваши учетные данные.";
    }

    public override HttpResponse? OnValidating(BasicAuthenticationCredentials credentials, HttpContext context)
    {
        DbContext db = new DbContext();

        // в этом случае мы используем электронную почту в качестве идентификатора пользователя, поэтому мы
        // ищем пользователя по его электронной почте.
        User? user = db.Users.FirstOrDefault(u => u.Email == credentials.UserId);
        if (user == null)
        {
            return base.CreateUnauthorizedResponse("Извините! Пользователь с таким электронным адресом не найден.");
        }

        // проверяет, что пароль учетных данных действителен для этого пользователя.
        if (!user.ValidatePassword(credentials.Password))
        {
            return base.CreateUnauthorizedResponse("Недействительные учетные данные.");
        }

        // добавляет вошедшего пользователя в контекст HTTP
        // и продолжает выполнение
        context.Bag.Add("loggedUser", user);
        return null;
    }
}
```

Итак, просто ассоциируйте этот обработчик запросов с нашим маршрутом или классом.

```cs
public class UsersController
{
    [RouteGet("/")]
    [RequestHandler(typeof(UserAuthHandler))]
    public string Index(HttpRequest request)
    {
        User loggedUser = (User)request.Context.RequestBag["loggedUser"];
        return "Привет, " + loggedUser.Name + "!";
    }
}
```

Или используя класс [RouterModule](/api/Sisk.Core.Routing.RouterModule):

```cs
public class UsersController : RouterModule
{
    public ClientModule()
    {
        // теперь все маршруты внутри этого класса будут обрабатываться
        // UserAuthHandler.
        base.HasRequestHandler(new UserAuthHandler());
    }

    [RouteGet("/")]
    public string Index(HttpRequest request)
    {
        User loggedUser = (User)request.Context.RequestBag["loggedUser"];
        return "Привет, " + loggedUser.Name + "!";
    }
}
```

## Примечания

Основная ответственность базовой аутентификации лежит на клиентской стороне. Хранение, кэширование и шифрование обрабатываются локально на клиенте. Сервер получает только учетные данные и проверяет, разрешен ли доступ или нет.

Обратите внимание, что этот метод не является одним из самых безопасных, поскольку он возлагает значительную ответственность на клиента, что может быть трудно отслеживать и поддерживать безопасность его учетных данных. Кроме того, важно передавать пароли в безопасном контексте соединения (SSL), поскольку они не имеют встроенного шифрования. Короткий перехват в заголовках запроса может раскрыть учетные данные доступа вашего пользователя.

Выбирайте более надежные решения аутентификации для приложений в производстве и избегайте использования слишком многих готовых компонентов, поскольку они могут не адаптироваться к потребностям вашего проекта и в конечном итоге подвергать его риску безопасности.