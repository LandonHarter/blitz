export const getLanguageName = (abbr: string) => {
    switch (abbr) {
        case 'js': return 'JavaScript';
        case 'ts': return 'TypeScript';
        case 'html': return 'HTML';
        case 'css': return 'CSS';
        case 'scss': return 'SCSS';
        case 'json': return 'JSON';
        case 'md': return 'Markdown';
        case 'xml': return 'XML';
        case 'yaml': return 'YAML';
        case 'yml': return 'YAML';
        case 'py': return 'Python';
        case 'java': return 'Java';
        case 'c': return 'C';
        case 'cpp': return 'C++';
        case 'cs': return 'C#';
        case 'php': return 'PHP';
        case 'rb': return 'Ruby';
        case 'go': return 'Go';
        case 'rs': return 'Rust';
        case 'swift': return 'Swift';
        case 'kt': return 'Kotlin';
        case 'vb': return 'Visual Basic';
        case 'lua': return 'Lua';
        case 'pl': return 'Perl';
        case 'sql': return 'SQL';
        case 'r': return 'R';
        case 'scala': return 'Scala';
        case 'sh': return 'Shell';
        case 'ps1': return 'PowerShell';
        case 'psm1': return 'PowerShell';
        case 'psd1': return 'PowerShell';
        case 'ps1xml': return 'PowerShell';
        case 'psrc': return 'PowerShell';
        case 'swift': return 'Swift';
    }

    return abbr;
};

export const getLanguageIcon = (language: string) => {
    return `https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/${language.toLowerCase()}.svg`
};
