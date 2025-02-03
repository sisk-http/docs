# Implantando seu Aplicativo Sisk

O processo de implantar um aplicativo Sisk consiste em publicar seu projeto em produção. Embora o processo seja relativamente simples, é importante notar detalhes que podem ser letais para a segurança e estabilidade da infraestrutura de implantação.

Idealmente, você deve estar pronto para implantar seu aplicativo na nuvem, após realizar todos os testes possíveis para ter seu aplicativo pronto.

## Publicando seu app

Publicar seu aplicativo ou serviço Sisk é gerar binários prontos e otimizados para produção. Neste exemplo, vamos compilar os binários para produção para executar em uma máquina que tenha o .NET Runtime instalado.

Você precisará ter o .NET SDK instalado em sua máquina para compilar seu aplicativo e o .NET Runtime instalado no servidor de destino para executar seu aplicativo. Você pode aprender como instalar o .NET Runtime em seu servidor Linux [aqui](https://learn.microsoft.com/en-us/dotnet/core/install/linux), [Windows](https://learn.microsoft.com/en-us/dotnet/core/install/windows?tabs=net70) e [Mac OS](https://learn.microsoft.com/en-us/dotnet/core/install/macos).

No diretório onde seu projeto está localizado, abra um terminal e use o comando de publicação do .NET:

```shell
$ dotnet publish -r linux-x64 -c Release
```

Isso gerará seus binários dentro de `bin/Release/publish/linux-x64`.

> [!NOTE]
> Se seu aplicativo estiver executando usando o pacote Sisk.ServiceProvider, você deve copiar seu `service-config.json` para o servidor de hospedagem junto com todos os binários gerados pelo `dotnet publish`.
> Você pode deixar o arquivo pré-configurado, com variáveis de ambiente, portas e hosts de escuta e configurações adicionais do servidor.

A próxima etapa é levar esses arquivos para o servidor onde seu aplicativo será hospedado.

Depois disso, dê permissões de execução para o seu arquivo binário. Neste caso, vamos considerar que o nome do nosso projeto é "my-app":

```shell
$ cd /home/htdocs
$ chmod +x my-app
$ ./my-app
```

Depois de executar seu aplicativo, verifique se ele produz alguma mensagem de erro. Se não produzir, é porque seu aplicativo está executando.

Neste ponto, provavelmente não será possível acessar seu aplicativo pela rede externa fora do seu servidor, pois as regras de acesso, como Firewall, não foram configuradas. Vamos considerar isso nas próximas etapas.

Você deve ter o endereço do host virtual onde seu aplicativo está escutando. Isso é definido manualmente no aplicativo e depende de como você está instanciando seu serviço Sisk.

Se você **não** estiver usando o pacote Sisk.ServiceProvider, você deve encontrar o endereço onde definiu sua instância de HttpServer:

```cs
HttpServer server = HttpServer.Emit(5000, out HttpServerConfiguration config, out var host, out var router);
// sisk deve escutar em http://localhost:5000/
```

Associando um ListeningHost manualmente:

```cs
config.ListeningHosts.Add(new ListeningHost("https://localhost:5000/", router));
```

Ou se você estiver usando o pacote Sisk.ServiceProvider, em seu `service-config.json`:

```json
{
  "Server": { },
  "ListeningHost": {
    "Ports": [
      "http://localhost:5000/"
    ]
  }
}
```

A partir disso, podemos criar um proxy reverso para escutar seu serviço e tornar o tráfego disponível sobre a rede aberta.

## Proxyando seu aplicativo

Proxyar seu serviço significa não expor diretamente seu serviço Sisk à rede externa. Essa prática é muito comum para implantações de servidor porque:

- Permite associar um certificado SSL ao seu aplicativo;
- Cria regras de acesso antes de acessar o serviço e evitar sobrecargas;
- Controla a largura de banda e os limites de solicitação;
- Separa os balanceadores de carga para o seu aplicativo;
- Previne danos de segurança à infraestrutura de falha.

Você pode servir seu aplicativo por meio de um proxy reverso como [Nginx](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-nginx?view=aspnetcore-7.0&tabs=linux-ubuntu#install-nginx) ou [Apache](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-apache?view=aspnetcore-7.0), ou você pode usar um túnel http-over-dns como [Cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-and-setup/tunnel-guide/).

Além disso, lembre-se de resolver corretamente os cabeçalhos de encaminhamento do proxy para obter as informações do cliente, como endereço IP e host, por meio de [resolutores de encaminhamento](/docs/advanced/forwarding-resolvers).

A próxima etapa após criar seu túnel, configurar o firewall e ter seu aplicativo em execução é criar um serviço para o seu aplicativo.

> [!NOTE]
> Usar certificados SSL diretamente no serviço Sisk em sistemas não-Windows não é possível. Isso é um ponto da implementação do HttpListener, que é o módulo central para como a gestão da fila HTTP é feita no Sisk, e essa implementação varia de sistema operacional para sistema operacional. Você pode usar SSL no seu serviço Sisk se [associar um certificado ao host virtual com o IIS](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis). Para outros sistemas, usar um proxy reverso é altamente recomendado.

## Criando um serviço

Criar um serviço fará com que seu aplicativo esteja sempre disponível, mesmo após reiniciar a instância do servidor ou uma falha não recuperável.

Neste tutorial simples, vamos usar o conteúdo do tutorial anterior como um exemplo para manter seu serviço sempre ativo.

1. Acesse o diretório onde os arquivos de configuração do serviço estão localizados:

    ```sh
    cd /etc/systemd/system
    ```

2. Crie seu arquivo `my-app.service` e inclua o conteúdo:
    
    <div class="script-header">
        <span>
            my-app.service
        </span>
        <span>
            INI
        </span>
    </div>
    
    ```ini
    [Unit]
    Description=<descrição sobre seu app>

    [Service]
    # defina o usuário que lançará o serviço
    User=<usuário que lançará o serviço>

    # o caminho do ExecStart não é relativo ao WorkingDirectory.
    # defina-o como o caminho completo para o arquivo executável
    WorkingDirectory=/home/htdocs
    ExecStart=/home/htdocs/my-app

    # defina o serviço para sempre reiniciar em caso de falha
    Restart=always
    RestartSec=3

    [Install]
    WantedBy=multi-user.target
    ```

3. Reinicie o módulo de gerenciamento de serviços:

    ```sh
    $ sudo systemctl daemon-reload
    ```

4. Inicie seu novo serviço criado a partir do nome do arquivo que você definiu e verifique se ele está em execução:

    ```sh
    $ sudo systemctl start my-app
    $ sudo systemctl status my-app
    ```

5. Agora, se seu aplicativo estiver em execução ("Active: active"), habilite seu serviço para continuar em execução após uma reinicialização do sistema:
    
    ```sh
    $ sudo systemctl enable my-app
    ```

Agora você está pronto para apresentar seu aplicativo Sisk a todos.