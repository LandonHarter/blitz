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
        case 'react': return 'React';
        case 'vue': return 'Vue';
        case 'angular': return 'Angular';
        case 'svelte': return 'Svelte';
        case 'django': return 'Django';
        case 'flask': return 'Flask';
        case 'express': return 'Express';
        case 'laravel': return 'Laravel';
        case 'spring': return 'Spring';
        case 'rails': return 'Rails';
        case 'symfony': return 'Symfony';
        case 'phoenix': return 'Phoenix';
        case 'gatsby': return 'Gatsby';
        case 'next': return 'Next.js';
        case 'nuxt': return 'Nuxt.js';
        case 'hugo': return 'Hugo';
        case 'jekyll': return 'Jekyll';
        case 'eleventy': return 'Eleventy';
        case 'storybook': return 'Storybook';
    }

    return abbr;
};

export const getLanguageIcon = (abbr: string, language: string) => {
    let icon = language.toLowerCase();
    switch (abbr) {
        case 'sh': icon = 'powershell';
    }

    return `https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/${icon}.svg`
};

export const getLanguageFromName = (library: string) => {
    switch (library) {
        case 'react': return 'tsx';
        case 'vue': return 'vue';
        case 'angular': return 'ts';
        case 'svelte': return 'html';
        case 'django': return 'py';
        case 'flask': return 'py';
        case 'express': return 'ts';
        case 'laravel': return 'php';
        case 'spring': return 'java';
        case 'rails': return 'rb';
        case 'symfony': return 'php';
        case 'phoenix': return 'ex';
        case 'gatsby': return 'ts';
        case 'next': return 'tsx';
        case 'nuxt': return 'ts';
        case 'hugo': return 'go';
        case 'jekyll': return 'rb';
        case 'eleventy': return 'ts';
        case 'storybook': return 'ts';
    }

    return library;
}
