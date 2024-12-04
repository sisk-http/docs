# Базовая аутентификация

Пакет Basic Auth добавляет обработчик запросов, способный обрабатывать схему аутентификации по basic в вашем приложении Sisk с минимальной конфигурацией и усилиями.

Базовая аутентификация HTTP - это минимальная форма ввода аутентификации запросов пользователем по идентификатору и паролю, где сеанс контролируется исключительно клиентом, и нет токенов аутентификации или доступа.

<img src="https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Authentication/httpauth.png">

Подробнее о схеме аутентификации Basic см. в [спецификации MDN](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Authentication).

## Установка

Чтобы начать, установите пакет Sisk.BasicAuth в свой проект:

    > dotnet add package Sisk.BasicAuth

Более подробную информацию о том, как установить его в вашем проекте, см. в [хранилище Nuget](https://www.nuget.org/packages/Sisk.BasicAuth/0.15.0).

## Создание обработчика аутентификации

Вы можете управлять схемой аутентификации для всего модуля или для отдельных маршрутов. Для этого сначала напишем наш первый обработчик базовой аутентификации.

В примере ниже устанавливается соединение с базой данных, проверяется существование пользователя и действительность пароля, а затем пользователь сохраняется в контекстном мешке.

```cs
public class UserAuthHandler : BasicAuthenticateRequestHandler
{
    public UserAuthHandler() : base()
    {
        Realm = "Чтобы войти на эту страницу, пожалуйста, укажите свои учетные данные.";
    }

    public override HttpResponse? OnValidating(BasicAuthenticationCredentials credentials, HttpContext context)
    {
        DbContext db = new DbContext();

        // в этом случае мы используем адрес электронной почты в качестве поля идентификатора пользователя, поэтому мы будем искать пользователя по его адресу электронной почты.
        User? user = db.Users.FirstOrDefault(u => u.Email == credentials.UserId);
        if (user == null)
        {
            return base.CreateUnauthorizedResponse("Извините! Пользователь по этому адресу электронной почты не найден.");
        }

        // проверяет, что пароль учетных данных действителен для этого пользователя.
        if (!user.ValidatePassword(credentials.Password))
        {
            return base.CreateUnauthorizedResponse("Неверные учетные данные.");
        }

        // добавляет залогинившегося пользователя в контекст HTTP
        // и продолжает выполнение
        context.Bag.Add("loggedUser", user);
        return null;
    }
}
```

Поэтому просто свяжите этот обработчик запросов с нашим маршрутом или классом.

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

Основная ответственность за базовую аутентификацию выполняется на стороне клиента. Хранение, управление кэшем и шифрование выполняются локально на клиенте. Сервер только получает учетные данные и проверяет, разрешен ли доступ.

Обратите внимание, что этот метод не является одним из самых безопасных, поскольку возлагает значительную ответственность на клиента, которое может быть трудно отслеживать и поддерживать безопасность его учетных данных. Кроме того, крайне важно, чтобы пароли передавались в защищенном контексте соединения (SSL), поскольку у них нет никакого встроенного шифрования. Краткое перехвата заголовков запроса может раскрыть учетные данные доступа вашего пользователя.

Для приложений в production выбирайте более надежные решения для аутентификации и избегайте использования слишком большого количества готовых компонентов, поскольку они могут не адаптироваться к потребностям вашего проекта и привести к возникновению уязвимостей безопасности.