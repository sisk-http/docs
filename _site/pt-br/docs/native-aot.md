# Suporte Nativo AOT

Source: https://docs.sisk-framework.org/pt-br/docs/native-aot.html

[.NET Native AOT](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/) permite a publicação de aplicativos .NET nativos que são autossuficientes e não requerem o tempo de execução do .NET instalado no host de destino. Além disso, o Native AOT fornece benefícios como:

- Aplicativos muito menores
- Inicialização significativamente mais rápida
- Consumo de memória mais baixo

O Sisk Framework, por sua natureza explícita, permite o uso de Native AOT para quase todos os seus recursos sem exigir rework no código-fonte para adaptá-lo ao Native AOT.

## Recursos não suportados

No entanto, o Sisk usa reflexão, embora mínima, para alguns recursos. Os recursos mencionados abaixo podem estar parcialmente disponíveis ou completamente indisponíveis durante a execução de código nativo:

- [Auto-escaneamento de módulos](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.AutoScanModules.md) do roteador: este recurso escaneia os tipos incorporados na Assembly em execução e registra os tipos que são [módulos do roteador](https://docs.sisk-framework.org/pt-br/docs/fundamentals/routing.md). Este recurso requer tipos que possam ser excluídos durante a redução da Assembly.

Todos os outros recursos são compatíveis com o AOT no Sisk. É comum encontrar um ou outro método que dá um aviso de AOT, mas o mesmo, se não for mencionado aqui, tem uma sobrecarga que indica a passagem de um tipo, parâmetro ou informação de tipo que ajuda o compilador AOT a compilar o objeto.
