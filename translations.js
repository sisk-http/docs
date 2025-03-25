export const translations = {
    "Português Brasileiro": "pt-br",
    "Русский": "ru",
    "Español": "es",
    "中文": "cn",
    "Deutsch": "de"
};

export const exclusionRegex = new RegExp(`[\\\\/](${Object.values(translations).join('|')})[\\\\/]`, 'i');