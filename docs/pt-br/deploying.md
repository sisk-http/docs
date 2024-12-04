# Implantação de aplicações Sisk

O processo de implantação de um aplicativo Sisk consiste em publicar seu projeto em produção. Embora o processo seja relativamente simples, vale ressaltar detalhes que podem ser letais para a segurança e estabilidade da infraestrutura do deployment.

Idealmente, você deve estar pronto para implantar seu aplicativo na nuvem, após realizar todos os testes possíveis para ter seu aplicativo pronto.

## Publicando seu aplicativo

Publicar seu aplicativo ou serviço Sisk consiste em gerar binários prontos e otimizados para produção. Neste exemplo, compilaremos os binários para produção para serem executados em uma máquina que tenha o .NET Runtime instalado na máquina.

Você precisará do .NET SDK instalado em sua máquina para compilar seu aplicativo e do .NET Runtime instalado no servidor de destino para executar seu aplicativo. Você pode aprender como instalar o .NET Runtime em seu servidor Linux [aqui](https://learn.microsoft.com/en-us/dotnet/core/install/linux), [Windows](https://learn.microsoft.com/en-us/dotnet/core/install/windows?tabs=net70) e [Mac OS](https://learn.microsoft.com/en-us/dotnet/core/install/macos).

Na pasta onde seu projeto está localizado, abra um terminal e use o comando .NET publish:

```shell
dotnet publish -r linux-x64 -c Release
```

Isso irá gerar seus binários dentro de `bin/Release/publish/linux-x64`.

> [!NOTE]
> Se seu aplicativo estiver sendo executado usando o pacote Sisk.ServiceProvider, você deve copiar seu `service-config.json` para o servidor host junto com todos os binários gerados por `dotnet publish`.
> Você pode deixar o arquivo pré-configurado, com variáveis de ambiente, portas de escuta e hosts, e configurações adicionais do servidor.

O próximo passo é levar esses arquivos para o servidor onde seu aplicativo será hospedado.

Depois disso, dê permissões de execução para seu arquivo binário. Neste caso, vamos considerar que o nome do nosso projeto é "meu-app":

```shell
cd /home/htdocs
chmod +x meu-app
./meu-app
```

Depois de executar seu aplicativo, verifique se ele produz alguma mensagem de erro. Se não produzir, significa que seu aplicativo está em execução.

Neste ponto, provavelmente não será possível acessar seu aplicativo por rede externa fora do seu servidor, pois regras de acesso como Firewall não foram configuradas. Consideraremos isso nos próximos passos.

Você deve ter o endereço do host virtual onde seu aplicativo está ouvindo. Isso é definido manualmente no aplicativo e depende de como você está instanciando seu serviço Sisk.

Se você **não** estiver usando o pacote Sisk.ServiceProvider, você deve encontrá-lo onde definiu sua instância HttpServer:

```cs
HttpServer server = HttpServer.Emit(5000, out HttpServerConfiguration config, out var host, out var router);
// sisk deve escutar em http://localhost:5000/
```

Associando um ListeningHost manualmente:

```cs
config.ListeningHosts.Add(new ListeningHost("https://localhost:5000/", router));
```

Ou se você estiver usando o pacote Sisk.ServiceProvider, em seu service-config.json:

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

A partir daqui, podemos criar um proxy inverso para escutar seu serviço e tornar o tráfego disponível na rede aberta.

## Proximando seu aplicativo

Proximar seu serviço significa não expor diretamente seu serviço Sisk a uma rede externa. Essa prática é muito comum para implantações de servidor porque:

- Permite associar um certificado SSL ao seu aplicativo;
- Cria regras de acesso antes de acessar o serviço e evita sobrecargas;
- Controle de largura de banda e limites de solicitações;
- Separação de balanceadores de carga para seu aplicativo;
- Previne danos à segurança de infraestruturas com falhas.

Você pode servir seu aplicativo através de um proxy inverso como [Nginx](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-nginx?view=aspnetcore-7.0&tabs=linux-ubuntu#install-nginx) ou [Apache](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-apache?view=aspnetcore-7.0), ou você pode usar um túnel http-over-dns como [Cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-and-setup/tunnel-guide/).

Lembre-se também de resolver corretamente os cabeçalhos de encaminhamento do seu proxy para obter as informações do seu cliente, como endereço IP e host, através de [resolvers de encaminhamento](/docs/advanced/forwarding-resolvers).

O próximo passo após criar seu túnel, configuração do firewall e ter seu aplicativo em execução é criar um serviço para seu aplicativo.

> [!NOTE]
> O uso de certificados SSL diretamente no serviço Sisk em sistemas operacionais não Windows não é possível. Este é um ponto da implementação do HttpListener, que é o módulo central para como o gerenciamento de fila HTTP é feito no Sisk, e essa implementação varia de sistema operacional para sistema operacional. Você pode usar SSL em seu serviço Sisk se [associar um certificado ao host virtual com IIS](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis). Para outros sistemas, o uso de um proxy inverso é altamente recomendado.

## Criando um serviço

Criar um serviço fará com que seu aplicativo esteja sempre disponível, mesmo após reiniciar a instância do seu servidor ou uma falha irrecuperável.

Neste tutorial simples, usaremos o conteúdo do tutorial anterior como um showcase para manter seu serviço sempre ativo.

1. Acesse a pasta onde os arquivos de configuração do serviço estão localizados:

    ```sh
    cd /etc/systemd/system
    ```

2. Crie seu arquivo `meu-app.service` e inclua o conteúdo:

    ```ini
    [Unit]
    Description=<descrição sobre seu aplicativo>

    [Service]
    # defina o usuário que iniciará o serviço
    User=<usuário que iniciará o serviço>

    # o ExecStart é não relativo ao WorkingDirectory.
    # defina-o como o caminho completo para o arquivo executável
    WorkingDirectory=/home/htdocs
    ExecStart=/home/htdocs/meu-app

    # defina o serviço para reiniciar sempre em caso de falha
    Restart=always
    RestartSec=3

    [Install]
    WantedBy=multi-user.target
    ```

3. Reinicie o módulo gerenciador de serviços:

    ```sh
    sudo systemctl daemon-reload
    ```

4. Inicie seu novo serviço criado a partir do nome do arquivo que você definiu e verifique se eles estão em execução:

    ```sh
    sudo systemctl start meu-app
    sudo systemctl status meu-app
    ```

5. Agora, se seu aplicativo estiver em execução ("Active: active"), habilite seu serviço para mantê-lo em execução após uma reinicialização do sistema:

    ```sh
    sudo systemctl enable meu-app
    ```

Agora você está pronto para apresentar seu aplicativo Sisk a todos.