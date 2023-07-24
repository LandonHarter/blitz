import { auth } from '@/backend/firebase/init';
import { User, getUserData } from '@/backend/firebase/user';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function useCurrentUser() {
    const [currentUser, setCurrentUser] = useState<User>({
        name: "User",
        email: "",
        pfp: "/images/avatar.webp",
        uid: "",
        empty: true,
        sets: [],
    });
    const [signedIn, setSignedIn] = useState<boolean>(false);
    const [userLoading, setUserLoading] = useState<boolean>(true);
    const [user, loading, error] = useAuthState(auth);

    const updateUserData = async () => {
        if (user) {
            const userData = await getUserData(user.uid);
            if (!userData) {
                setSignedIn(false);
                setUserLoading(false);
                return;
            }
            setCurrentUser(userData);
            setSignedIn(true);
            setUserLoading(false);
        }
        else {
            setCurrentUser({
                name: "",
                email: "",
                pfp: "/images/avatar.webp",
                uid: "",
                empty: true,
                sets: [],
            });
            setSignedIn(false);
        }
    };

    useEffect(() => {
        (async () => {
            if (user) {
                const userData = await getUserData(user.uid);
                if (!userData) {
                    setSignedIn(false);
                    setUserLoading(false);
                    return;
                }
                setCurrentUser(userData);
                setSignedIn(true);
                setUserLoading(false);
            }
            else {
                setCurrentUser({
                    name: "",
                    email: "",
                    pfp: "/images/avatar.webp",
                    uid: "",
                    empty: true,
                    sets: [],
                });
                setSignedIn(false);
            }

            if (error) {
                setUserLoading(false);
            }
        })();

        onAuthStateChanged(auth, async (user) => {
            if (!user) setUserLoading(false);
        });
    }, [user, error]);


    return { currentUser: currentUser, signedIn: signedIn, userLoading: userLoading, updateUserData: updateUserData };
}
