import { auth } from '@/backend/firebase/init';
import { User, getUserData } from '@/backend/firebase/user';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';

export default function useCurrentUser() {
    const [currentUser, setCurrentUser] = useState<User>({
        name: "User",
        email: "",
        pfp: "/images/avatar.png",
        uid: "",
        empty: true
    });
    const [signedIn, setSignedIn] = useState<boolean>(false);

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(await getUserData(user.uid));
                setSignedIn(true);
            }
            else {
                setCurrentUser({
                    name: "",
                    email: "",
                    pfp: "/images/avatar.png",
                    uid: "",
                    empty: true
                });
                setSignedIn(false);
            }
        });
    }, []);


    return { currentUser, signedIn };
}
  