'use client'

import { useEffect, useState } from "react";
import DarkModeContext from "@/context/darkmode";

export default function HostLayoutContent(props: { children: React.ReactNode }) {
    const [darkMode, setDarkMode] = useState('');

    useEffect(() => {
        setDarkMode(localStorage.getItem('theme') || 'light');
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', darkMode);
        localStorage.setItem('theme', darkMode);
    }, [darkMode]);

    if (darkMode === '') return;

    return (
        <DarkModeContext.Provider value={{
            get: darkMode === 'dark', set: (mode: boolean) => {
                setDarkMode(mode ? 'dark' : 'light');
            }
        }}>
            <div className={darkMode ? 'dark_theme' : ''}>
                {props.children}
            </div>
        </DarkModeContext.Provider>
    );
}