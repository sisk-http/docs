# Soporte de AOT Nativo

[.NET Native AOT](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/) permite la publicación de aplicaciones .NET nativas que son autosuficientes y no requieren que el tiempo de ejecución .NET esté instalado en el host de destino. Además, Native AOT proporciona beneficios como:

- Aplicaciones mucho más pequeñas
- Inicialización significativamente más rápida
- Menor consumo de memoria

Sisk Framework, por su naturaleza explícita, permite el uso de Native AOT para casi todas sus características sin requerir rework en el código fuente para adaptarlo a Native AOT.

## Características no compatibles

Sin embargo, Sisk utiliza la reflexión, aunque mínima, para algunas características. Las características mencionadas a continuación pueden estar parcialmente disponibles o completamente no disponibles durante la ejecución de código nativo:

- [Exploración automática de módulos](/api/Sisk.Core.Routing.Router.AutoScanModules) del enrutador: este recurso escanea los tipos incrustados en el ensamblado en ejecución y registra los tipos que son [módulos del enrutador](/docs/es/fundamentals/routing). Este recurso requiere tipos que pueden ser excluidos durante el recorte del ensamblado.

Todas las demás características son compatibles con AOT en Sisk. Es común encontrar uno o otro método que genera una advertencia de AOT, pero el mismo, si no se menciona aquí, tiene una sobrecarga que indica el paso de un tipo, parámetro o información de tipo que ayuda al compilador de AOT a compilar el objeto.