'use client'

import { useEffect, useState } from "react";
import Header from "@components/header/header";
import SignInContext from "./context/signincontext";
import UserContext from "./context/usercontext";
import useCurrentUser from "./hooks/useCurrentUser";
import DarkModeContext from "./context/darkmode";

export default function RootLayoutContent(props: { children: React.ReactNode }) {
    const [signInPopup, setSignInPopup] = useState(false);
    const { currentUser, signedIn, userLoading, updateUserData } = useCurrentUser();
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
        <SignInContext.Provider value={{ get: signInPopup, set: setSignInPopup }}>
            <UserContext.Provider value={{ currentUser: currentUser, signedIn: signedIn, userLoading: userLoading, updateUserData: updateUserData }}>
                <DarkModeContext.Provider value={{
                    get: darkMode === 'dark', set: (mode: boolean) => {
                        setDarkMode(mode ? 'dark' : 'light');
                    }
                }}>
                    <div className={darkMode ? 'dark_theme' : ''}>
                        <Header />
                        {props.children}
                    </div>
                </DarkModeContext.Provider>
            </UserContext.Provider>
        </SignInContext.Provider>
    );
}