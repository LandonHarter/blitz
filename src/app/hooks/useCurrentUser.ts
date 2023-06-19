import { auth } from '@/backend/firebase/init';
import { User, getUserData } from '@/backend/firebase/user';
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function useCurrentUser() {
    const [currentUser, setCurrentUser] = useState<User>({
        name: "User",
        email: "",
        pfp: "/images/avatar.png",
        uid: "",
        empty: true
    });
    const [signedIn, setSignedIn] = useState<boolean>(false);
    const [userLoading, setUserLoading] = useState<boolean>(true);
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        (async () => {
            if (user) {
                setCurrentUser(await getUserData(user.uid));
                setSignedIn(true);
                setUserLoading(false);
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

            if (error) {
                setUserLoading(false);
            }
        })();
    }, [user, error]);


    return { currentUser: currentUser, signedIn: signedIn, userLoading: userLoading };
}
  