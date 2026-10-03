# IniWritingNewLineBehavior

Kind: Enum  
Namespace: `Sisk.IniConfiguration.Core.Serialization`  
Assembly: `Sisk.IniConfiguration.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.Serialization.IniWritingNewLineBehavior.html

Specifies the behavior for writing new lines in an INI file.

```csharp
[Flags]
public enum IniWritingNewLineBehavior
```

## Fields

| Name | Description |
| --- | --- |
| `Escape = 4` | Escapes the new line characters when writing new lines. |
| `Quote = 1` | Quotes the value when writing new lines. |
| `Split = 2` | Splits the value into multiple lines when writing new lines. |
