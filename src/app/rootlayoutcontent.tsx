'use client'

import { useState } from "react";
import Header from "@components/header/header";
import SignInContext from "./context/signincontext";
import UserContext from "./context/usercontext";
import useCurrentUser from "./hooks/useCurrentUser";

export default function RootLayoutContent(props: { children: React.ReactNode }) {
    const [signInPopup, setSignInPopup] = useState(false);
    const { currentUser, signedIn, userLoading } = useCurrentUser();

    return(
        <html lang="en">
            <body>
                <SignInContext.Provider value={{ get: signInPopup, set:setSignInPopup }}>
                <UserContext.Provider value={{ currentUser: currentUser, signedIn: signedIn, userLoading: userLoading }}>
                    <Header />
                    {props.children}
                </UserContext.Provider>
                </SignInContext.Provider>
            </body>
        </html>
    );
}