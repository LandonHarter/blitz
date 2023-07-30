'use client'

import { useEffect, useState } from "react";
import DarkModeContext from "@/context/darkmode";

export default function LiveLayoutContent(props: { children: React.ReactNode }) {
    const [darkMode, setDarkMode] = useState('');

    useEffect(() => {
        const theme = localStorage.getItem('theme') || 'dark';
        setDarkMode(theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, []);

    if (darkMode === '') return;

    return (
        <DarkModeContext.Provider value={{
            get: darkMode === 'dark', set: (mode: boolean) => {
                setDarkMode(mode ? 'dark' : 'light');
            }
        }}>
            <div className={darkMode === 'dark' ? 'dark_theme' : ''}>
                {props.children}
            </div>
        </DarkModeContext.Provider>
    );
}