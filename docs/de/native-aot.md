# Native AOT-Unterstützung

[.NET Native AOT](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/) ermöglicht die Veröffentlichung von nativen .NET-Anwendungen, die selbstständig sind und nicht die .NET-Laufzeit auf dem Zielhost benötigen. Zusätzlich bietet Native AOT Vorteile wie:

- Erheblich kleinere Anwendungen
- Wesentlich schnellere Initialisierung
- Geringeren Speicherbedarf

Das Sisk Framework ermöglicht aufgrund seiner expliziten Natur die Verwendung von Native AOT für fast alle seine Funktionen, ohne dass eine Überarbeitung des Quellcodes erforderlich ist, um es an Native AOT anzupassen.

## Nicht unterstützte Funktionen

Allerdings verwendet Sisk Reflexion, wenn auch minimal, für einige Funktionen. Die folgenden Funktionen sind möglicherweise teilweise verfügbar oder während der nativen Codeausführung ganz nicht verfügbar:

- [Automatisches Scannen von Modulen](/api/Sisk.Core.Routing.Router.AutoScanModules) des Routers: Diese Ressource scannet die im ausführenden Assembly eingebetteten Typen und registriert die Typen, die [Router-Module](/docs/de/fundamentals/routing) sind. Diese Ressource benötigt Typen, die während des Assembly-Trimming ausgeschlossen werden können.

Alle anderen Funktionen sind mit AOT in Sisk kompatibel. Es ist üblich, eine oder andere Methode zu finden, die eine AOT-Warnung ausgibt, aber dieselbe, wenn sie hier nicht erwähnt wird, hat eine Überladung, die das Übergeben eines Typs, Parameters oder Typinformationen anzeigt, die dem AOT-Compiler helfen, das Objekt zu kompilieren.