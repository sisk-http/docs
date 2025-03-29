export const translations = {
    "Português Brasileiro": "pt-br",
    "Русский": "ru",
    "Español": "es",
    "Chinese (Simplified)": "cn",
    "Deutsch": "de",
    "Japanese": "jp"
};

export const exclusionRegex = new RegExp(`[\\\\/](${Object.values(translations).join('|')})[\\\\/]`, 'i');