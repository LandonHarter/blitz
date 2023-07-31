'use client'

import { useEffect, useState } from "react";
import Header from "@components/header/header";
import SignInContext from "./context/signincontext";
import UserContext from "./context/usercontext";
import useCurrentUser from "./hooks/useCurrentUser";
import DarkModeContext from "./context/darkmode";
import MobileContext from "./context/mobile";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function RootLayoutContent(props: { children: React.ReactNode }) {
    const [signInPopup, setSignInPopup] = useState(false);
    const { currentUser, signedIn, userLoading, updateUserData } = useCurrentUser();
    const [darkMode, setDarkMode] = useState('');
    const [width, setWidth] = useState(0);

    const pathname = usePathname();

    useEffect(() => {
        setDarkMode(localStorage.getItem('theme') || 'dark');

        window.onresize = () => {
            setWidth(window.innerWidth);
        }
        setWidth(window.innerWidth);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', darkMode);
        localStorage.setItem('theme', darkMode);
    }, [darkMode]);

    if (darkMode === '') return;

    return (
        <SignInContext.Provider value={{ get: signInPopup, set: setSignInPopup }}>
            <UserContext.Provider value={{ currentUser: currentUser, signedIn: signedIn, userLoading: userLoading, updateUserData: updateUserData }}>
                <MobileContext.Provider value={width < 1250}>
                    <DarkModeContext.Provider value={{
                        get: darkMode === 'dark', set: (mode: boolean) => {
                            setDarkMode(mode ? 'dark' : 'light');
                        }
                    }}>
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={pathname}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{}}
                                transition={{ duration: 0.75 }}
                                className={darkMode ? 'dark_theme' : ''}>
                                <Header />
                                {props.children}
                            </motion.div>
                        </AnimatePresence>
                    </DarkModeContext.Provider>
                </MobileContext.Provider>
            </UserContext.Provider>
        </SignInContext.Provider>
    );
}